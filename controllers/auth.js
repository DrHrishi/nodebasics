const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
require('dotenv').config()

exports.signup = async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) return res.status(403).json({ error: "Email is taken" });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup success! please login.' })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'user with email does not exist , please sign in' })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({ error: 'Email and password do not match' })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } })
    })
}


exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({ message: 'Signout success' });
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})