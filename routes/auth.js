const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authValidate = require('../middlewares/authValidate');
require('dotenv').config();

const authRouter = express.Router();

authRouter.post('/login', authValidate, async (req, res) => {
    const errors = {};
    const { email, password } = req.body;

    const existUser = await User.findOne({ email: email });
    if (!existUser) {
        errors.email = 'email is incorrect';
        return res.send({
            message: 'invalid credentials',
            errors,
            code: 404
        });
    }

    const hashedPasswordCheck = bcrypt.compareSync(password, existUser.password);
    if (!hashedPasswordCheck) {
        errors.password = 'password is incorrect';
        return res.send({
            message: 'invalid credentials',
            errors,
            code: 404
        });
    }

    const token = jwt.sign({ 
        email: existUser.email, 
        id: existUser._id, 
        role: existUser.role 
    }, process.env.JWT_SECRET);
    
    res.send({
        message: 'logged in success',
        token,
        user: {
            id: existUser._id,
            email: existUser.email,
            role: existUser.role
        }
    });
});

authRouter.post('/register', authValidate, async (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser = await User.create({
        email: email,
        password: hashedPassword,
        role: role || 'user'
    });
    
    res.send({
        message: 'user registered',
        user: {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        }
    });
});

module.exports = authRouter;