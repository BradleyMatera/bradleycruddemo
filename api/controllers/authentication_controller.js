const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode(
        {
            sub: user.id,
            iat: timestamp,
        },
        config.secret
    );
};

// User Signup
exports.signup = async (req, res) => {
    const { user_name, email, password } = req.body;

    if (!email || !password || !user_name) {
        return res.status(400).json({ error: "Please add all the fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({
            user_name,
            email,
            password,
        });

        await newUser.save();
        res.json({
            message: "Saved successfully",
            token: tokenForUser(newUser),
        });
    } catch (error) {
        res.status(500).json({ error: `Error saving user: ${error.message}` });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate password (assumes hashed passwords in the DB)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            token: tokenForUser(user),
        });
    } catch (error) {
        res.status(500).json({ error: `Error logging in: ${error.message}` });
    }
};

// Validate JWT Middleware
exports.requireAuth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const decoded = jwt.decode(token, config.secret);
        req.userId = decoded.sub;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};