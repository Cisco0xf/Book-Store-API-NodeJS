const { default: mongoose } = require("mongoose");
require('dotenv').config();

const dbConnect = () => {
    try {
        mongoose
            .connect(process.env.MONGODB_URI, {
                dbName: process.env.DB_NAME,
            })
            .then(() => {
                console.log(`Connected to Database success`);
            })
            .catch(() => {
                console.error("Error connecting to db");
            });
    } catch (error) {
        console.error("Error connecting to db");
        process.exit(1);
    }
};

module.exports = dbConnect;