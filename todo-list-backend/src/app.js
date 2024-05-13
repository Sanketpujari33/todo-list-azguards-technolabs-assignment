const express = require("express");
const app = express();

require("dotenv").config({ path: ".env" });
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger');

const todoRouters = require('./routes/todoRoutes');
const csvRoutes = require('./routes/csvRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware for parsing URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// HTTP request logger middleware (Morgan) with "tiny" format
app.use(morgan("tiny"));

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */
app.use("/api/auth", authRoutes);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: APIs for managing stores
 */
app.use("/api/todos", todoRouters);
/**
 * @swagger
 * tags:
 *   name: CSV
 *   description: APIs for managing stores
 */
app.use("/api/todo/", csvRoutes);

// Serve the Swagger UI using the generated documentation
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;