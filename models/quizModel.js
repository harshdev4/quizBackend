// Importing Mongoose library
const mongoose = require('mongoose');

// Loading environment variables from .env file
require('dotenv').config();

// Connecting to MongoDB using the provided URI from environment variables
mongoose.connect(process.env.MONGODB_URI);

// Defining the schema for the Quiz model
const quizSchema = new mongoose.Schema({
    // Question for the quiz, required field of type String
    question: {
      type: String,
      required: true 
    },
    // Options for the quiz, required field of type array of strings
    options: {
      type: [String],
      required: true
    },
    // Index of the correct answer in the options array, required field of type Number
    rightAnswer: {
      type: Number,
      required: true
    },
    // Start date for the quiz, required field of type Date
    startDate: {
      type: Date,
      required: true
    },
    // End date for the quiz, required field of type Date
    endDate: {
      type: Date,
      required: true
    },
    // Status of the quiz, enum field with possible values: 'inactive', 'active', 'finished'. Default value is 'inactive'.
    status: {
      type: String,
      enum: ['inactive', 'active', 'finished'],
      default: 'inactive'
    },
    // Owner of this quiz, person who creates this quiz
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
});

// Creating the Quiz model based on the defined schema
const Quiz = mongoose.model('Quiz', quizSchema);

// Exporting the Quiz model to be used in other parts of the application
module.exports = Quiz;
