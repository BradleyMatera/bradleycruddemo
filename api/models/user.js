const mongoose = require('mongoose'); // Importing mongoose library for MongoDB interaction
const bcrypt = require('bcrypt-nodejs'); // Importing bcrypt-nodejs for password hashing

// Validators

// Email Validator: Ensures the email string is in a valid email format
const ValidateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Regex checks for basic email structure
};

// Username Validator: Ensures the username meets specific criteria
const ValidateUserName = (user_name) => {
  return /^[a-zA-Z0-9]{6,20}$/.test(user_name); // Regex checks for alphanumeric characters only, length 6-20
};

// Schema Definition for User model
const userSchema = new mongoose.Schema({
  user_name: {
    type: String, // Defines the type as String
    required: true, // Marks this field as required
    unique: true, // Ensures no two users can have the same username
    validate: [ValidateUserName, 'Username must be between 6 and 20 characters long, and contain only letters and numbers'], // Custom validator for username
  },
  email: {
    type: String, // Defines the type as String
    unique: true, // Ensures no two users can have the same email
    lowercase: true, // Automatically converts email to lowercase before saving
    required: true, // Marks this field as required
    validate: [ValidateEmail, 'Please provide a valid email address'], // Custom validator for email
  },
  password: {
    type: String, // Defines the type as String
    required: true, // Marks this field as required
    // Note: Password validation is handled in the middleware, not here
  },
  created_at: {
    type: Date, // Defines the type as Date
    required: true, // Marks this field as required
    default: Date.now, // Automatically sets the default value to the current date and time
  },
});

// Middleware: Pre-save Hook
userSchema.pre('save', function (next) {
  const user = this; // 'this' refers to the current document being saved

  // Checks if the password field is new or has been modified
  if (user.isNew || user.isModified('password')) {
    // Custom Password Validation
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(user.password)) {
      // Regex ensures password meets length and complexity requirements
      return next(
        new Error('Password must be between 6 and 20 characters long, and contain at least one numeric digit, one uppercase, and one lowercase letter')
      ); // If validation fails, an error is passed to 'next'
    }

    // Hashing the Password
    bcrypt.genSalt(10, (err, salt) => {
      // Generates a salt with 10 rounds
      if (err) return next(err); // Passes error to 'next' if salt generation fails

      bcrypt.hash(user.password, salt, null, (err, hash) => {
        // Hashes the password using the generated salt
        if (err) return next(err); // Passes error to 'next' if hashing fails

        user.password = hash; // Replaces the plain text password with the hashed version
        next(); // Calls 'next' to proceed with saving the document
      });
    });
  } else {
    next(); // If password is not new/modified, proceed without hashing
  }
});

module.exports = mongoose.model('User', userSchema); // Exports the User model for use in other parts of the application