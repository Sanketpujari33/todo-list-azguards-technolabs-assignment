const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Register a new user
async function register(req, res) {
    try {
        // Extract user details from request body
        const { username, email, password } = req.body;

        // Check if user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Login user
async function login(req, res) {
    try {
        // Extract login credentials from request body
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const oneDayInSeconds = 86400;

        // Generate a JWT token for the user's session
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: oneDayInSeconds,
        });
        // // Set the token as a cookie
        res.cookie("session-token", token, {
            expire: oneDayInSeconds + Date.now(),
        });

        // Respond with token
        res.status(200).json({ success: true, token: token, user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
// User logout function
async function logout(req, res) {
    try {
        // Clear the session token cookie
        res.clearCookie("session-token");
        // Respond with a success message
        return res
            .status(200)
            .json({ successfully: true, message: "User has logged out successfully" });
    } catch (error) {
        console.log(error);
        // Respond with an error message
        return res.status(500).json({ message: error });
    }
};
module.exports = {
    register,
    login,
    logout
};