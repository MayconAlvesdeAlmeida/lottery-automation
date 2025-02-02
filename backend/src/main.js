require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/lottery';
const port = process.env.PORT;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/lottery', require('./routes/lottery'));

console.log(`mongoUri: ${mongoUri}`);
console.log(`port: ${port}`);

mongoose
    .connect(
        mongoUri
    )
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    })
    .catch((err) => {
        console.log(err);
    });