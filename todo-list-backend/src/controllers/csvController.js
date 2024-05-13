// controllers/csvController.js
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Todo = require('../models/Todo');
const path = require('path');
const User = require('../models/user');

// Filtering options
const filterTodoByStatus = async (req, res) => {
    try {

        let query = {};
        if (!req.query.status) {
            return res.status(400).json({ success: false, message: 'Status parameter is required' });
        }
        if (req.query.status) {
            // Validate status parameter
            const allowedStatus = ['pending', 'completed'];
            if (!allowedStatus.includes(req.query.status)) {
                return res.status(400).json({ success: false, message: 'Invalid status parameter' });
            }
            query.status = req.query.status;
        }
        // Execute query using Todo model
        const todos = await Todo.find(query);
        // Get total count of documents
        const totalResults = await Todo.find(query).countDocuments();
        // Send response
        return res
            .status(200)
            .json({ success: true, data: todos, total: totalResults });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
// CSV file upload and download
const uploadTodoFromCSV = async (req, res) => {
    try {
        const todos = [];
        const ownerId = req.params.id; // Assuming you have user information stored in req.user after authentication
        if (!ownerId) {
            return res.status(400).json({ success: false, message: 'Owner not found' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                // Validate if the required fields are present in the CSV data
                if (!data.description) {
                    return res.status(400).json({ success: false, message: 'Description is required' });
                }
                // Push data to todos array
                todos.push({ description: data.description, status: data.status, owner: ownerId });
            })
            .on('end', async () => {
                // Insert todos into database
                await Todo.insertMany(todos);
                res.json({ message: 'Todos uploaded successfully' });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const downloadTodoListCSV = async (req, res) => {

    try {
        // Fetch all todos from the database
        const todos = await Todo.find();

        // Define the file path for the CSV file
        const filePath = path.join(__dirname, '../uploads/todos.csv');

        // Create CSV writer
        const csvWriter = createCsvWriter({
            path: filePath,
            header: [
                { id: 'description', title: 'Description' },
                { id: 'status', title: 'Status' },
                { id: 'owner', title: 'Owner' },
            ]
        });

        // Write todos to the CSV file
        await csvWriter.writeRecords(todos);

        // Send the CSV file as a download to the client
        res.download(filePath, 'todos.csv');
    } catch (error) {
        console.error("Error downloading todo list CSV:", error);
        res.status(500).json({ message: "Failed to download todo list CSV" });
    }
};


module.exports = {
    filterTodoByStatus,
    uploadTodoFromCSV,
    downloadTodoListCSV
};
