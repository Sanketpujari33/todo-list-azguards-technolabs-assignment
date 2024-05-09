// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // for MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Define your routes here

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
