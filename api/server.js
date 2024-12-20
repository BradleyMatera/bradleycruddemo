// server.js
const express = require('express');
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Constants
const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Middleware
app.use(cors());
app.use(express.json());

// Debugging Middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} request received at ${req.url}`);
    next();
});

// Ensure DATABASE_URL is defined
if (!DATABASE_URL) {
    console.error('[ERROR] DATABASE_URL is not defined in .env file');
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('[SUCCESS] Database Connection Established');
    })
    .catch(error => {
        console.error('[ERROR] Database Connection Error:', error.message);
        process.exit(1);
    });

// Route Imports
const authRouter = require('./routes/auth');
const animeCharacterRouter = require('./routes/animeCharacters');

// Define Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/animeCharacters', animeCharacterRouter);

// Default Route for Root Path
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Anime Characters API!" });
});

// Serve React Frontend (if applicable)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../reactjs/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../reactjs/build', 'index.html'));
    });
}

// Error Handler for Unhandled Routes
app.use((req, res, next) => {
    const error = new Error(`[ERROR] Route not found: ${req.method} ${req.url}`);
    console.error(error.message);
    res.status(404).json({ error: error.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[SUCCESS] Server running on port ${PORT}`);
});