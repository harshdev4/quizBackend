// Importing necessary modules
const express = require('express'); // Express.js for creating the server
const app = express(); // Creating an instance of Express'
const quizRoutes = require('./routes/quizRoutes'); // Importing the Quiz routes
const authRoutes = require('./routes/authRoutes'); // Importing the Auth routes
const cron = require('node-cron'); // For scheduling tasks
const Quiz = require('./models/quizModel'); // Importing the Quiz model
const errorHandler = require('./utils/errorHandler');
var cookieParser = require('cookie-parser'); // Importing the cookie-parser module for handling cookies
require('dotenv').config(); // Loading environment variables from .env file

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to route all the requests for quizzes
app.use('/quizzes', quizRoutes);

// Middleware to route all the requests for authentication
app.use('/auth', authRoutes);

// Middleware to handle errors
app.use(errorHandler);

// Reading port from environment variables
const port = process.env.PORT || 8000;

// Schedule cron job to update quiz status every minute
cron.schedule('* * * * *', async () => {
    try {
        // Updating quizzes with 'active' status whose endDate is less than or equal to current date
        await Quiz.updateMany({
            status: 'active',
            endDate: { $lte: new Date() }
        }, {
            status: 'finished'
        });

        // Updating quizzes with 'inactive' status whose startDate is less than or equal to current date
        // and endDate is greater than or equal to current date
        await Quiz.updateMany(
            {
                status: 'inactive',
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() }
            },
            {
                status: 'active'
            }
        );

    } catch (err) {
        console.error('Error updating quiz status:', err);
    }
});

// Start the server on the specified port
app.listen(port);
