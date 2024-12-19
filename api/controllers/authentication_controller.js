const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ 
        sub: user.id,
         iat: timestamp
         }, config.secret);


}



exports.signup = (req, res) => {
    const {
        user_name,
        email,
        password
    } = req.body;
    if (!email || !password || !user_name) {
        return res.status().json({ error: "Please add all the fields" });   
    }   
        User.findOne({ email: email }), (err, user) => {
            if (user) {
                return res.status().json({ error: "User already exists" });
            }
            const newUser = new User({
                user_name,
                email,
                password
            })
            newUser.save((error) => {
                if (error) {
                    return res.status().json({ error: "User already exists" });
                }
                res.json({ message: "Saved successfully" });
            });
        }}
