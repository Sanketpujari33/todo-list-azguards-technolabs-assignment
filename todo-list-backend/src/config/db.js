const mongoose = require("mongoose");

async function connectToDatabase() {
    const connectionString = process.env.MONGODB_URI;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    mongoose.connect(connectionString, options)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Call the function to connect to MongoDB
module.exports = connectToDatabase;