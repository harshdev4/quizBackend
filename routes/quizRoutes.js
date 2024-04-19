// Importing necessary modules
const express = require('express');// Express.js for creating the server
const quizController = require('../controllers/quizController');  // Importing quiz controller
const { limiter, authenticateUser } = require('../middleware/authMiddleware'); // Importing authMiddlewares
const router = express.Router(); // Creating a router object using Express's Router method


// Route for creating quizzes, handled by the createQuiz function in quizController
router.post('/', authenticateUser, quizController.createQuiz);

// Route for getting active quizzes, handled by the getActiveQuiz function in quizController
router.get('/active', authenticateUser, limiter, quizController.getActiveQuiz);

// Route for getting quiz results by ID, handled by the getQuizResult function in quizController
router.get('/:id/result', authenticateUser, quizController.getQuizResult);

// Route for getting all quizzes, handled by the getAllQuiz function in quizController
router.get('/all', authenticateUser, limiter, quizController.getAllQuiz);

module.exports = router;