const passport = require('passport'); // Passport library for authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // Extracting JWT from request
const JwtStrategy = require('passport-jwt').Strategy;  // JWT Strategy for passport
const LocalStrategy = require('passport-local'); // Local Strategy for passport

const User = require('../models/user'); // Import the User model
const config = require('../config'); // Import the configuration file

// Options for Local Strategy
const localOptions = { usernameField: 'email' };

// Define the Local Strategy
const localStrategy = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        // Use async/await instead of a callback
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false); // No user found
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false); // Invalid password
        }

        return done(null, user); // User authenticated successfully
    } catch (error) {
        return done(error); // Handle any errors
    }
});

// Options for JWT Strategy
const jwtOptions = {
    secretOrKey: config.secret, // Secret key to decode the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract the token from the 'authorization' header
};

// Define the JWT Strategy
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        // Use async/await instead of a callback
        const user = await User.findById(payload.sub);

        if (user) {
            return done(null, user); // User found
        } else {
            return done(null, false); // User not found
        }
    } catch (error) {
        return done(error, false); // Handle any errors
    }
});

// Register the strategies with Passport
passport.use(jwtStrategy);
passport.use(localStrategy);