// Importing all the required modules
const rateLimit = require('express-rate-limit');  // Importing the express-rate-limit module for limit the user request for API
const jwt = require('jsonwebtoken'); // Importing the jsonwebtoken for authenticating the user
// Loading environment variables from .env file
require('dotenv').config();

// rate limiting middleware
exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});


// authenticate user middleware
exports.authenticateUser = (req, res, next) => {
    // Check for JWT token in cookie
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

