﻿# todo-list-azguards-technolabs-assignment
https://todo-list-azguards-technolabs-assignment.onrender.com/api/api-docs/#/
# ASSIGNMENT

# Todo List Management System

## Overview

This is a backend application developed using Node.js and Express.js to manage a todo list. Users can perform CRUD operations on todo items, upload todo items from a CSV file, download the todo list in CSV format, and set a status flag for each todo item.

## Project Setup

1. Initialize a new Node.js project.
2. Install necessary dependencies like Express.js, body-parser, mongoose for MongoDB (or mysql for MySQL).
3. Set up the basic folder structure for the project.

## Database Setup

- MongoDB or MySQL database should be set up.
- Define a schema/table to store todo list items with fields for task description, status flag, and any other relevant information.

## CRUD API Endpoints

- **GET /todos**: Fetch all todo items.
- **GET /todos/:id**: Fetch a single todo item by ID.
- **POST /todos**: Add a new todo item.
- **PUT /todos/:id**: Update an existing todo item.
- **DELETE /todos/:id**: Delete a todo item.

## CSV File Upload

- **POST /todos/upload**: Upload todo items from a CSV file.
- Parse the CSV file and save todo items along with their status into the database.

## CSV File Download

- **GET /todos/download**: Download the todo list in CSV format.
- Include the status flag in the CSV output.

## Additional Features

- Implement filtering options in the API to fetch todo list items based on their status (e.g., fetching only completed items, only pending items, etc.).

## Detailed Requirements

### Database Schema/Table Structure

- TodoItem:
  - id: Integer
  - description: String
  - status: String (e.g., 'pending', 'completed')

### API Endpoints

- GET /todos
- GET /todos/:id
- POST /todos
- PUT /todos/:id
- DELETE /todos/:id
- POST /todos/upload
- GET /todos/download
- GET /todos/filter?status=:status

### Additional Considerations

- Validation: Implement input validation to ensure that only valid data is accepted by the API.
- Authentication & Authorization: Implement authentication and authorization mechanisms if required.
- Error Handling: Implement proper error handling to provide meaningful error messages to the clients.
- Documentation: Document the API endpoints and their usage using tools like Swagger or Postman documentation.
- Testing: Test each API endpoint thoroughly using tools like Postman or curl to ensure they work as expected.
