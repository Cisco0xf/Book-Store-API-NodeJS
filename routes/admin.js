const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const router = express.Router();

// GET all books
router.get('/books', authenticate, authorizeAdmin, async (req, res) => {
    const books = await Book.find().populate('author_id', 'email');
    res.send({
        message: 'All books retrieved successfully',
        data: books
    });
});

// GET publish requests (books waiting for approval)
router.get('/publish-requests', authenticate, authorizeAdmin, async (req, res) => {
    const books = await Book.find({ is_published: true, is_approved: false }).populate('author_id', 'email');
    res.send({
        message: 'Publish requests retrieved successfully',
        data: books
    });
});

// PUT approve/disapprove book
router.put('/books/:id/approve', authenticate, authorizeAdmin, async (req, res) => {
    const bookId = req.params.id;
    const { is_approved } = req.body;
    
    const book = await Book.findById(bookId);
    
    if (!book) {
        return res.send({ message: 'Book not found', code: 404 });
    }
    
    await Book.updateOne({ _id: bookId }, { is_approved: is_approved });
    
    res.send({
        message: `Book ${is_approved ? 'approved' : 'disapproved'} successfully`,
        data: book
    });
});

// GET all users
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
    const users = await User.find().select('-password');
    res.send({
        message: 'All users retrieved successfully',
        data: users
    });
});

// PUT update user role
router.put('/users/:id/role', authenticate, authorizeAdmin, async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    
    if (!['user', 'author', 'admin'].includes(role)) {
        return res.send({ message: 'Invalid role', code: 400 });
    }
    
    await User.updateOne({ _id: userId }, { role: role });
    
    res.send({
        message: 'User role updated successfully'
    });
});

module.exports = router;