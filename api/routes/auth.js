const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/authentication_controller');

// Define the POST route for signup
// This was incorrectly nested inside the GET route before, which caused the error
router.post('/signup', AuthenticationController.signup);

// Add a basic GET route for testing
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Auth API is working' });
});

module.exports = router; // Export the router to fix the use() error