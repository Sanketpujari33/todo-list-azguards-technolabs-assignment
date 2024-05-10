// models/TodoItem.js
const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

module.exports = mongoose.model('TodoItem', todoItemSchema);
