const passport = require('passport'); // Passport library for authentication
const ExtractJwt = require('passport-jwt').ExtractJwt; // Extracting JWT from request, used to extract the token from the request
const JwtStrategy = require('passport-jwt').Strategy;  // JWT Strategy for passport, used to authenticate requests

const User = require('../models/user'); // Import the User model
const config = require('../config'); // Import the configuration file

// Options for the JWT Strategy
const jwtOptions = {
    secretOrKey: config.secret, // Secret key to decode the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Extract the token from the header

}

const JwtStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.sub, function (error, user) {
        if (error) { return done(error, false)}
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

passport.use(JwtStrategy) // Use the JWT Strategy for passport