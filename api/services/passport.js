const passport = require('passport'); // Passport library for authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // Extracting JWT from request
const JwtStrategy = require('passport-jwt').Strategy;  // JWT Strategy for passport

const User = require('../models/user'); // Import the User model
const config = require('../config'); // Import the configuration file

// Options for the JWT Strategy
const jwtOptions = {
    secretOrKey: config.secret, // Secret key to decode the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract the token from the 'authorization' header
};

// Define the JWT Strategy
const strategy = new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.sub, function (error, user) {
        if (error) {
            return done(error, false); // Error during lookup
        }
        if (user) {
            done(null, user); // User found
        } else {
            done(null, false); // User not found
        }
    });
});

// Register the strategy with Passport
passport.use(strategy);