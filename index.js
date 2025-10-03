const express = require('express');
const dbConnect = require('./config/database');
const bodyParser = require('body-parser');
const studentRouter = require('./routes/students');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const adminRouter = require('./routes/admin');
const authorRouter = require('./routes/author');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
dbConnect();

app.use('/students', studentRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/author', authorRouter);

app.listen(3000, () => {
    console.log('this app runs on port 3000');
});



/* 
   "bcrypt": "^6.0.0",
    "body-parser": "^2.2.0",
    "dotenv": "^16.0.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^6.18.0",
    "mongoose": "^8.18.0"

*/