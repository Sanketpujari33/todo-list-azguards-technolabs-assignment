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

const uploadTodoFromCSV = async (req, res) => {
    try {
        const todos = [];
        const ownerId = req.params.id;

        if (!ownerId) {
            return res.status(400).json({ success: false, message: 'Owner not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File path:', req.file.path);

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                // Logging the data received from CSV
                console.log('CSV Row:', data);

                if (data.Description) {
                    todos.push({
                        description: data.description,
                        status: data.status || 'pending',
                        owner: ownerId
                    });
                    console.log('Todo added:', {
                        description: data.description,
                        status: data.status || 'pending',
                        owner: ownerId
                    });
                } else {
                    console.error('Row is missing description:', data);
                }
            })
            .on('end', async () => {
                if (todos.length === 0) {
                    return res.status(400).json({ message: 'No valid todos found in CSV' });
                }

                try {
                    const insertedTodos = await Todo.insertMany(todos);
                    res.json({ message: 'Todos uploaded successfully', todos: insertedTodos });
                } catch (dbError) {
                    console.error('Database insertion error:', dbError);
                    res.status(500).json({ message: 'Error inserting todos into database' });
                }
            })
            .on('error', (error) => {
                console.error('CSV parsing error:', error);
                res.status(400).json({ message: 'CSV parsing error' });
            });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: error.message });
    }
};

const downloadTodoListCSV = async (req, res) => {
    try {
        const ownerId = req.params.id; // Assuming the owner's ID is passed as a URL parameter

        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID not provided' });
        }

        // Fetch todos for the specified owner from the database
        const todos = await Todo.find({ owner: ownerId });

        if (todos.length === 0) {
            return res.status(404).json({ message: 'No todos found for the specified owner' });
        }

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
        res.download(filePath, 'todos.csv', (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ message: "Failed to download todo list CSV" });
            } else {
                // Optionally delete the file after download
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error deleting file:", unlinkErr);
                    }
                });
            }
        });
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
