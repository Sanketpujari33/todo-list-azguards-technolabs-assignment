// Load environment variables from .env file
require("dotenv").config({ path: ".env" });

// Import required modules
const app = require("./src/app");
const connectToDatabase = require("./src/config/db");

// Create an HTTP server using the app
const http = require("http").createServer(app);
// Connect to the database
connectToDatabase();

// Define the port for the server to listen on
const port = process.env.PORT || 8000;


// Start the server and listen on the defined port
http.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});