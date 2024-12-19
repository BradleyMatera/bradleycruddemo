const express = require('express');
const passport = require('passport');
const passportService = require('../services/passport');
const ProtectedRoute = passport.authenticate('local', { session: false }); // Local strategy for login authentication

const router = express.Router();

const AuthenticationController = require('../controllers/authentication_controller');

// Route for signup
router.post('/signup', AuthenticationController.signup);

// Route for login
router.post('/login', ProtectedRoute, AuthenticationController.login); // Corrected syntax for combining middleware and controller

// Test route to verify API
router.get('/', (req, res) => {
    res.status(200).json({ message: "Auth API is working" });
});

module.exports = router;