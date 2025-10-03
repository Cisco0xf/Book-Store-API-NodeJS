const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    is_published: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: false },
    is_borrowed: { type: Boolean, default: false },
    borrowed_from: { type: Date, default: null },
    borrowed_to: { type: Date, default: null },
    borrowed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    history: [{
        borrowed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        borrowed_from: { type: Date },
        borrowed_to: { type: Date },
        returned_date: { type: Date }
    }]
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;