const Todo = require('../models/Todo');
const User = require('../models/user');
// CRUD operations
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controller function to create a new todo
async function createTodo(req, res) {
    try {
        const { description, status } = req.body;
        const ownerId = await User.findById(req.params.id); // Assuming you have user information stored in req.user after authentication
        if (!ownerId) {
            return res.status(400).json({ success: false, message: 'owner Not found' });
        }
        // Validate required fields
        if (!description || !status) {
            return res.status(400).json({ success: false, message: 'Description and status are required' });
        }
        // Validate status value
        const allowedStatus = ['pending', 'completed'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        // Create new todo
        const todo = new Todo({
            description,
            status,
            owner: ownerId
        });

        // Save new todo to database
        const newTodo = await todo.save();

        // Respond with the newly created todo
        res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Controller function to get all todos
async function getAllTodosUser(req, res) {
    try {
        const ownerId = await User.findById(req.params.id); // Assuming you have user information stored in req.user after authentication
        if (!ownerId) {
            return res.status(400).json({ success: false, message: 'owner Not found' });
        }
        const todos = await Todo.find({ owner: ownerId }); // Fetch todos belonging to the authenticated user
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Controller function to update a todo by ID
async function updateTodoById(req, res) {
    try {
        // Find and update the todo item
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // Check if todo item was found and updated
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Send the updated todo item in the response
        res.status(200).json(updatedTodo);
    } catch (error) {
        // Handle any errors and send a meaningful error message
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Controller function to delete a todo by ID
async function deleteTodoById(req, res) {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id });
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllTodos,
    getAllTodosUser,
    getTodoById,
    createTodo,
    updateTodoById,
    deleteTodoById,
};
