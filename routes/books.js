const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// GET all approved books for users
router.get('/', async (req, res) => {
    const books = await Book.find({ is_published: true, is_approved: true });
    res.send({
        message: 'Books retrieved successfully',
        data: books
    });
});

// POST borrow book
router.post('/borrow/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'user') {
        return res.send({ message: 'Only users can borrow books', code: 403 });
    }

    const bookId = req.params.id;
    const userId = req.user.id;
    
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);
    
    if (!book) {
        return res.send({ message: 'This book is not found', code: 404 });
    }

    if (!book.is_published || !book.is_approved) {
        return res.send({ message: 'This book is not available for borrowing', code: 400 });
    }
    
    if (book.is_borrowed) {
        return res.send({ message: 'Book already borrowed', code: 400 });
    }
    
    const borrowed_from = new Date();
    const borrowed_to = new Date();
    borrowed_to.setDate(borrowed_to.getDate() + 14);
    
    await Book.updateOne({ _id: bookId }, {
        is_borrowed: true,
        borrowed_from: borrowed_from,
        borrowed_to: borrowed_to,
        borrowed_by: userId
    });
    
    const borrowedBook = {
        book_id: bookId,
        title: book.title,
        author: book.author,
        borrowed_from: borrowed_from,
        borrowed_to: borrowed_to
    };
    
    await User.updateOne(
        { _id: userId }, 
        { $push: { borrowed_books: borrowedBook } }
    );
    
    res.send({
        message: 'Book borrowed successfully',
        data: borrowedBook
    });
});

// POST return book
router.post('/return/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'user') {
        return res.send({ message: 'Only users can return books', code: 403 });
    }

    const bookId = req.params.id;
    const userId = req.user.id;
    
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);
    
    if (!book) {
        return res.send({ message: 'Book not found', code: 404 });
    }
    
    if (book.borrowed_by.toString() !== userId) {
        return res.send({ message: 'You did not borrow this book', code: 400 });
    }
    
    const returned_date = new Date();
    
    await Book.updateOne({ _id: bookId }, {
        $push: {
            history: {
                borrowed_by: userId,
                borrowed_from: book.borrowed_from,
                borrowed_to: book.borrowed_to,
                returned_date: returned_date
            }
        }
    });
    
    const returnedBook = user.borrowed_books.find(b => b.book_id.toString() === bookId);
    if (returnedBook) {
        await User.updateOne({ _id: userId }, {
            $push: {
                history: {
                    book_id: bookId,
                    title: returnedBook.title,
                    author: returnedBook.author,
                    borrowed_from: returnedBook.borrowed_from,
                    borrowed_to: returnedBook.borrowed_to,
                    returned_date: returned_date
                }
            }
        });
        
        await User.updateOne({ _id: userId }, {
            $pull: { borrowed_books: { book_id: bookId } }
        });
    }
    
    await Book.updateOne({ _id: bookId }, {
        is_borrowed: false,
        borrowed_from: null,
        borrowed_to: null,
        borrowed_by: null
    });
    
    res.send({
        message: 'Book returned successfully'
    });
});

module.exports = router;