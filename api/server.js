const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000; // Port number or local envimronment

// Importing the animeCharacter router ROUTER IMPORTS
const authRouter = require('./routes/auth');
const animeCharacterRouter = require('./routes/animeCharacters');

// Ensure DATABASE_URL is defined ERROR HANDLING FOR MONGODB DATABASE
const DATABASE_URL = process.env.DATABASE_URL; // MongoDB connection string
if (!DATABASE_URL) { // Ensure DATABASE_URL is defined
  console.error('Error: DATABASE_URL is not defined in .env file'); // Log an error message
  process.exit(1);
}

// MongoDB connection
mongoose.connect(DATABASE_URL)
  .then(() => console.log('Database Connection Established'))
  .catch(error => {
    console.error('Database Connection Error:', error);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// API Routes
app.use('/api/v1/animeCharacters', animeCharacterRouter);
app.use('/api/v1/auth', authRouter);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../reactjs/build')));

// Handle client-side routing for React
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../reactjs/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});