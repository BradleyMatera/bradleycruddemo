const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

// Importing the animeCharacter router
const animeCharacterRouter = require('./routes/animeCharacters');

// Ensure DATABASE_URL is defined
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL is not defined in .env file');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connection Established'))
  .catch(error => {
    console.error('Database Connection Error:', error);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// API Routes
app.use('/api/v1/animeCharacters', animeCharacterRouter);

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