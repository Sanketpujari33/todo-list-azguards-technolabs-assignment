// Load environment variables from .env file
require("dotenv").config({ path: ".env" });
var cron = require('node-cron');


// Import required modules
const app = require("./src/app");
const connectToDatabase = require("./src/config/db");

// Connect to the database
connectToDatabase();

// Define the port for the server to listen on
const PORT = process.env.PORT || 8000;


// Schedules given task to be executed whenever the cron expression ticks.
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});