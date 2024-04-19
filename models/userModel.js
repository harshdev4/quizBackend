// Importing Mongoose library
const mongoose = require('mongoose');

// Loading environment variables from .env file
require('dotenv').config();

// Connecting to MongoDB using the provided URI from environment variables
mongoose.connect(process.env.MONGODB_URI);

// Defining the schema for the User model
const userSchema = new mongoose.Schema({
    // Email of the user is required and should be unique
    email:{
        type: String,
        unique: true,
        required: true
    },
    // Username of the user is required and should be unique
    username:{
        type: String,
        unique: true,
        required: true
    },
    // Password of the user is required and should be unique
    password:{
        type: String,
        required: true
    },
    // All the created Quizzes by the user
    createdQuizzes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    // Account creation date and time
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// Creating the Quiz model based on the defined schema
const User = mongoose.model('User', userSchema);

// Exporting the Quiz model to be used in other parts of the application
module.exports = User;
