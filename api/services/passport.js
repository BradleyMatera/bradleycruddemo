const passport = require('passport'); // Passport library for authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // Extracting JWT from request
const JwtStrategy = require('passport-jwt').Strategy; // JWT Strategy for passport
const LocalStrategy = require('passport-local').Strategy; // Local Strategy for passport

const User = require('../models/user'); // Import the User model
const config = require('../config'); // Import the configuration file

// Options for the Local Strategy
const localOptions = { usernameField: 'email' };

// Define the Local Strategy
const localStrategy = new LocalStrategy(localOptions, function (email, password, done) {
    User.findOne({ email: email }, function (error, user) {
        if (error) {
            return done(error); // Error during lookup
        }
        if (!user) {
            return done(null, false); // User not found
        }

        // Compare passwords
        user.comparePassword(password, function (error, isMatch) {
            if (error) {
                return done(error);
            }
            if (!isMatch) {
                return done(null, false); // Password does not match
            }
            return done(null, user); // Authentication successful
        });
    });
});

// Options for the JWT Strategy
const jwtOptions = {
    secretOrKey: config.secret, // Secret key to decode the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract the token from the 'authorization' header
};

// Define the JWT Strategy
const jwtStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
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

// Register strategies with Passport
passport.use(jwtStrategy);
passport.use(localStrategy);