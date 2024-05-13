const swaggerDoc = require('swagger-jsdoc');
require("dotenv").config({ path: ".env" });
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Assignment: Todo List Management System',
            version: '1.0.0',
            description: 'Below is the assignment to test your Back end (Node.js) skills, complete the assignment and submit it before the deadline using the form to the right. Develop a backend application using Node.js and Express.js to manage a todo list. Users should be able to perform CRUD operations on todo items, upload todo items from a CSV file, download the todo list in CSV format, and set a status flag for each todo item.',
        },
        servers: [
            {
                url: process.env.ACCESS_CONTROL_ALLOW_ORIGIN
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    name: 'session-token',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                },
            },
        },
    },
    apis: ['./src/routes/*.js']
};

const swaggerDocument = swaggerDoc(options);

module.exports = swaggerDocument;