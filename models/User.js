const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'author', 'admin'], default: 'user' },
    borrowed_books: [{
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        title: String,
        author: String,
        borrowed_from: Date,
        borrowed_to: Date
    }],
    history: [{
        book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        title: String,
        author: String,
        borrowed_from: Date,
        borrowed_to: Date,
        returned_date: Date
    }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;