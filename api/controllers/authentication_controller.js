const User = require('../models/user'); // Importing the User model for database operations
const jwt = require('jwt-simple'); // Library for encoding and decoding JSON Web Tokens (JWT)
const config = require('../config'); // Configuration file containing the secret key
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords

// Generate JWT token for the user
const tokenForUser = (user) => {
    const timestamp = new Date().getTime(); // Current timestamp to include in the token
    return jwt.encode(
        {
            sub: user.id, // Subject of the token, typically the user's ID
            iat: timestamp, // Issued at time: when the token is generated
        },
        config.secret // Secret key used for encoding the token
    );
};

// User Signup
exports.signup = async (req, res) => {
    const { user_name, email, password } = req.body; // Destructuring the incoming request body

    console.log('[DEBUG] POST request received at /api/v1/auth/signup'); // Log that the signup endpoint was hit
    console.log('[DEBUG] Received Signup Data:', { user_name, email, password }); // Log the received data for debugging

    if (!user_name || !email || !password) {
        console.error('[ERROR] Missing fields'); // Log the error for missing fields
        return res.status(400).json({ error: 'All fields are required: user_name, email, and password' }); // Return 400 if required fields are missing
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('[ERROR] User already exists'); // Log that the user already exists
            return res.status(400).json({ error: 'User already exists' }); // Return 400 if the user exists
        }

        // Create a new user with the provided details
        const newUser = new User({ user_name, email, password });
        await newUser.save(); // Save the user to the database

        console.log('[SUCCESS] User created:', newUser); // Log success with the created user details

        // Generate a JWT token for the new user
        const token = tokenForUser(newUser);
        res.status(201).json({ message: 'User created successfully', token }); // Respond with a success message and token
    } catch (error) {
        console.error('[ERROR] Signup Error:', error.message); // Log any errors encountered during signup
        res.status(500).json({ error: error.message }); // Return 500 for server errors
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body; // Destructuring the incoming request body

    console.log('Received Login Data:', { email, password }); // Log the incoming login request data

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' }); // Return 400 if email or password is missing
    }

    try {
        // Find the user in the database by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return 404 if no user is found
        }

        // Validate the provided password against the stored hashed password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' }); // Return 401 if the password is incorrect
        }

        // Generate and return a JWT token for the authenticated user
        res.json({
            message: 'Login successful',
            token: tokenForUser(user),
        });
    } catch (error) {
        console.error('Login Error:', error.message); // Log any errors encountered during login
        res.status(500).json({ error: `Error logging in: ${error.message}` }); // Return 500 for server errors
    }
};

// Validate JWT Middleware
exports.requireAuth = (req, res, next) => {
    const token = req.headers.authorization; // Extract the token from the authorization header

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' }); // Return 401 if no token is provided
    }

    try {
        // Decode the token using the secret key
        const decoded = jwt.decode(token, config.secret);
        req.userId = decoded.sub; // Attach the user's ID to the request object for use in subsequent handlers
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT Validation Error:', error.message); // Log any errors during token decoding
        res.status(401).json({ error: 'Invalid token' }); // Return 401 if the token is invalid
    }
};