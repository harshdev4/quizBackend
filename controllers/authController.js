// Importing the required module
const User = require('../models/userModel');  // Importing the User model
const bcrypt = require('bcrypt'); // Importing the bcrypt module for encypting password
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken module for authenticating the user
// Loading environment variables from .env file
require('dotenv').config();

exports.signup = async (req, res) => {
    // Destructing all the field from body
    const { email, username, password } = req.body;

    // if any of the field send by the user is empty
    if (!(email && username && password)) {
        return res.status(400).json({
            status: 'fail',
            message: "All field are required"
        })
    }

    try {
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(409).json({
                status: 'fail',
                message: "User already existed"
            })
        }
    } catch (error) {
        
    }

    // Generate hash password
    const hash = bcrypt.hashSync(password, 10);
    try {
        const user = await User.create({ email, username, password: hash })

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setting the token in cookie
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });

        // Removing the password for the client side
        user.password = "";

        // Sending the response back to the client side
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: { user }
        });
    } catch (error) {
        // If fail to signup
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!(username && password)) {
        return res.status(400).json({
            status: 'fail',
            message: "Username and password are required"
        });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: "User not found"
            });
        }

        // Check if the provided password matches the stored hashed password
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 'fail',
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setting the token in cookie
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });


        // Removing the password for the client side
        user.password = "";

        // Sending the response back to the client side
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { user }
        });
    } catch (error) {
        // If encounter any error while login
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};