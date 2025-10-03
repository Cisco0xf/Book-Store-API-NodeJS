const express = require('express');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// GET all users (admin only)
router.get('/', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.send({ message: 'Access denied', code: 403 });
    }
    
    const users = await User.find();
    res.send({
        message: 'users retrieved success',
        data: users
    });
});

// GET current user's borrowed books
router.get('/my-books', authenticate, async (req, res) => {
    if (req.user.role !== 'user') {
        return res.send({ message: 'Only users can have borrowed books', code: 403 });
    }
    
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
        return res.send({ message: 'User not found', code: 404 });
    }
    
    res.send({
        message: 'Current borrowed books retrieved',
        data: user.borrowed_books
    });
});

// GET current user's history
router.get('/my-history', authenticate, async (req, res) => {
    if (req.user.role !== 'user') {
        return res.send({ message: 'Only users can have borrowing history', code: 403 });
    }
    
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
        return res.send({ message: 'User not found', code: 404 });
    }
    
    res.send({
        message: 'Borrowing history retrieved',
        data: user.history
    });
});

module.exports = router;