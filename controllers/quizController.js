// Importing the Quiz model
const Quiz = require('../models/quizModel');  // Importing the Quiz model
const User = require('../models/userModel');  // Importing the User model
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken module for authenticating the user

// Controller function to get active quizzes
exports.getActiveQuiz = async (req, res, next) => {
    try {
        // Finding active quizzes in the database
        const activeQuiz = await Quiz.find({
            status: 'active'
        });
        // If no active quizzes found, return a 404 error
        if (!activeQuiz) {
            return res.status(404).json({ message: 'No active quiz found' });
        }
        // If active quizzes are found, return them in the response
        res.status(200).json({
            status: 'success',
            data: {
                quiz: activeQuiz
            }
        });
    } catch (err) {
        // Forwarding any errors to the error handling middleware
        next(err);
    }
};

// Controller function to create a new quiz
exports.createQuiz = async (req, res) => {
    // Getting token from cookie
    const token = req.cookies.token;

    // decoding the token
    const decoded = jwt.decode(token);

    // Extracting quiz details from the request body
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    try {
        // Fetching the loggedIn user
        const loggedInUser = await User.findOne({username: decoded.username});

        // Creating a new quiz in the database
        const quiz = await Quiz.create({ question, options, rightAnswer, startDate, endDate });

        loggedInUser.createdQuizzes.push(quiz._id);
        quiz.owner = loggedInUser._id;

        await loggedInUser.save()
        await quiz.save()

        // Sending a success response with the created quiz
        res.status(201).json({
            status: 'success',
            data: {
                quiz
            }
        });
    } catch (err) {
        // Sending a failure response with the error message
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Controller function to get quiz result by ID
exports.getQuizResult = async (req, res, next) => {
    try {
        const quizId = req.params.id; // Extracting quiz ID from request parameters
        // Finding the quiz by ID in the database
        const quiz = await Quiz.findById(quizId);
        // If quiz not found, return a 404 error
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculating end time for the quiz
        const endTime = quiz.endDate;
        // Adding five minutes to the end time
        const extraFiveMinutes = new Date(quiz.endDate);
        endTime.setMinutes(extraFiveMinutes.getMinutes() + 5);
        // Getting the current time
        const currentTime = new Date();

        // Checking if current time is past the end time or the extra five minutes
        if (currentTime > endTime || currentTime >= extraFiveMinutes) {
            // If so, return the correct answer index
            const correctAnswerIndex = quiz.rightAnswer;
            res.status(200).json({
                status: 'success',
                data: correctAnswerIndex
            });
        } else {
            // If not, return a 400 error indicating the quiz result is not available yet
            return res.status(400).json({ message: 'Quiz result not available yet' });
        }

    } catch (err) {
        // Forwarding any errors to the error handling middleware
        next(err);
    }
};

// Controller function to get all quizzes
exports.getAllQuiz = async (req, res) => {
    try {
        // Finding all quizzes in the database
        const quizzes = await Quiz.find();
        // Sending a success response with all quizzes
        res.status(200).json(
            {
                status: 'success',
                quizzes
            }
        )
    } catch (err) {
        // Sending a failure response with the error message
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
