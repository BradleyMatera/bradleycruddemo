const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// Validators
const ValidateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ValidateUserName = (user_name) => {
  return /^[a-zA-Z0-9]{6,20}$/.test(user_name);
};

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
    validate: [ValidateUserName, 'Username must be between 6 and 20 characters long, and contain only letters and numbers'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: [ValidateEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true, // No regex here
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Custom Pre-Save Middleware
userSchema.pre('save', function (next) {
  const user = this;

  if (user.isNew || user.isModified('password')) {
    // Custom Password Validation
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(user.password)) {
      return next(
        new Error('Password must be between 6 and 20 characters long, and contain at least one numeric digit, one uppercase, and one lowercase letter')
      );
    }

    // Hash Password
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);