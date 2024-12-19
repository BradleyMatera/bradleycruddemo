const mongoose = require('mongoose');
const { validate } = require('./animeCharacter');

const ValidateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ValidatePassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
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
        uniuqe: true,
        lowercase: true,
        required: true,
        validate: [ValidateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        validate: [ValidatePassword, 'Password must be between 6 and 20 characters long, and contain at least one numeric digit, one uppercase and one lowercase letter'],
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
        
    },
    });

module.exports = mongoose.model('User', userSchema);