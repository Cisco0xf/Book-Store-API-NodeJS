const express = require('express');
const Book = require('../models/Book');
const authenticate = require('../middlewares/authenticate');
const authorizeAuthor = require('../middlewares/authorizeAuthor');
const router = express.Router();

// POST upload book
router.post('/books', authenticate, authorizeAuthor, async (req, res) => {
    const { title, author, price } = req.body;
    const authorId = req.user.id;
    
    const book = await Book.create({ 
        title, 
        author, 
        author_id: authorId,
        price,
        is_published: false,
        is_approved: false
    });
    
    res.send({
        message: 'Book uploaded successfully. Waiting for admin approval.',
        data: book
    });
});

// GET author's books
router.get('/my-books', authenticate, authorizeAuthor, async (req, res) => {
    const authorId = req.user.id;
    const books = await Book.find({ author_id: authorId });
    
    res.send({
        message: 'Your books retrieved successfully',
        data: books
    });
});

// PUT publish/unpublish book
router.put('/books/:id/publish', authenticate, authorizeAuthor, async (req, res) => {
    const bookId = req.params.id;
    const authorId = req.user.id;
    const { is_published } = req.body;
    
    const book = await Book.findOne({ _id: bookId, author_id: authorId });
    
    if (!book) {
        return res.send({ message: 'Book not found or not owned by you', code: 404 });
    }
    
    await Book.updateOne({ _id: bookId }, { is_published: is_published });
    
    res.send({
        message: `Book ${is_published ? 'published' : 'unpublished'} successfully`,
        data: book
    });
});

// PUT update book
router.put('/books/:id', authenticate, authorizeAuthor, async (req, res) => {
    const bookId = req.params.id;
    const authorId = req.user.id;
    const { title, author, price } = req.body;
    
    const book = await Book.findOne({ _id: bookId, author_id: authorId });
    
    if (!book) {
        return res.send({ message: 'Book not found or not owned by you', code: 404 });
    }
    
    await Book.updateOne({ _id: bookId }, { title, author, price, is_approved: false });
    
    res.send({
        message: 'Book updated successfully. Needs admin approval again.',
        data: book
    });
});

// DELETE book
router.delete('/books/:id', authenticate, authorizeAuthor, async (req, res) => {
    const bookId = req.params.id;
    const authorId = req.user.id;
    
    const book = await Book.findOne({ _id: bookId, author_id: authorId });
    
    if (!book) {
        return res.send({ message: 'Book not found or not owned by you', code: 404 });
    }
    
    await Book.deleteOne({ _id: bookId });
    
    res.send({
        message: 'Book deleted successfully'
    });
});

module.exports = router;