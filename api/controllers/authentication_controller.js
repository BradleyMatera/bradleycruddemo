const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');
const bcrypt = require('bcryptjs');

// Generate JWT token for the user
const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode(
        {
            sub: user.id, // Subject of the token, typically the user's ID
            iat: timestamp, // Issued at time
        },
        config.secret // Secret key for encoding the token
    );
};


// User Signup
exports.signup = async (req, res) => {
    const { user_name, email, password } = req.body;

    console.log('[DEBUG] POST request received at /api/v1/auth/signup');
    console.log('[DEBUG] Received Signup Data:', { user_name, email, password });

    if (!user_name || !email || !password) {
        console.error('[ERROR] Missing fields');
        return res.status(400).json({ error: 'All fields are required: user_name, email, and password' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('[ERROR] User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ user_name, email, password });
        await newUser.save();

        console.log('[SUCCESS] User created:', newUser);

        // Generate token
        const token = tokenForUser(newUser);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error('[ERROR] Signup Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Debugging: Log incoming login request data
    console.log('Received Login Data:', { email, password });

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate and return a token
        res.json({
            message: 'Login successful',
            token: tokenForUser(user),
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ error: `Error logging in: ${error.message}` });
    }
};

// Validate JWT Middleware
exports.requireAuth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.decode(token, config.secret);
        req.userId = decoded.sub; // Attach the user's ID to the request for later use
        next();
    } catch (error) {
        console.error('JWT Validation Error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};