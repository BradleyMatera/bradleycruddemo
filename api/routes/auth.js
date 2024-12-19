const express = require('express');
const router = express.Router();

const AuthenticationController = require('../controllers/authentication_controller');

// Route for signup
router.post('/signup', AuthenticationController.signup);

// Route for login
router.post('/login', AuthenticationController.login);

// Test route to verify API
router.get('/', (req, res) => {
    res.status(200).json({ message: "Auth API is working" });
});

module.exports = router;