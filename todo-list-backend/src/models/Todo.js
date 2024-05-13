// models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    // Add more fields as needed
});

module.exports = mongoose.model('Todo', todoSchema);
