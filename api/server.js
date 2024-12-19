// server.js
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

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
if (!process.env.DATABASE_URL) {
    console.error('[ERROR] DATABASE_URL is not defined in .env file');
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('[SUCCESS] Database Connection Established');
        console.log('[DEBUG] Connected to:', process.env.DATABASE_URL);
    })
    .catch(error => {
        console.error('[ERROR] Database Connection Error:', error.message);
        process.exit(1);
    });

// Route Imports
const authRouter = require('./routes/auth');
const animeCharacterRouter = require('./routes/animeCharacters');

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/animeCharacters', animeCharacterRouter);

// Serve React Static Files
app.use(express.static(path.join(__dirname, '../reactjs/build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../reactjs/build', 'index.html'));
});

// Debugging: Test Route
app.get('/test', (req, res) => {
    console.log('[DEBUG] /test route hit');
    res.status(200).json({ message: 'Test endpoint is working' });
});

// Error Handler for Unhandled Routes
app.use((req, res, next) => {
    const error = new Error(`[ERROR] Route not found: ${req.method} ${req.url}`);
    console.error(error.message);
    res.status(404).json({ error: error.message });
});

// Start Server
app.listen(PORT, () => console.log(`[SUCCESS] Server running on port ${PORT}`));