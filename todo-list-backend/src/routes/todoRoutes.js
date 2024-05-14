const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
// Import middleware for authentication and authorization
const { verifyToken } = require("../middleware/authJwt");

// CRUD operations
/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve all todos from the database.
 *     tags:
 *       - Todos
 *     responses:
 *       '200':
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the todo item.
 *                   description:
 *                     type: string
 *                     description: The description of the todo item.
 *                   status:
 *                     type: string
 *                     description: The status of the todo item (pending/completed).
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the todo item was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the todo item was last updated.
 *       '500':
 *         description: Internal server error.
 */

router.get('/', todoController.getAllTodos);
/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     description: Retrieve a todo item from the database by its ID.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the todo item.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The requested todo item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the todo item.
 *                 description:
 *                   type: string
 *                   description: The description of the todo item.
 *                 status:
 *                   type: string
 *                   description: The status of the todo item (pending/completed).
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the todo item was created.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the todo item was last updated.
 *       '404':
 *         description: Todo not found.
 *       '500':
 *         description: Internal server error.
 */

router.get('/:id', todoController.getTodoById);
/**
 * @swagger
 * /todos/{id}:
 *   post:
 *     summary: Create a new todo
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       '201':
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todos'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post('/:id', [verifyToken], todoController.createTodo);
/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     description: Update a todo item by its ID.
  *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo item to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The updated description of the todo item.
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *                 description: The updated status of the todo item (pending/completed).
 *     responses:
 *       '200':
 *         description: The updated todo item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the todo item.
 *                 description:
 *                   type: string
 *                   description: The updated description of the todo item.
 *                 status:
 *                   type: string
 *                   description: The updated status of the todo item (pending/completed).
 *                 owner:
 *                   type: string
 *                   description: The ID of the owner of the todo item.
 *       '404':
 *         description: Todo not found.
 *       '400':
 *         description: Bad request - Invalid input data or unauthorized access.
 */

router.put('/:id', [verifyToken], todoController.updateTodoById);
/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     description: Delete a todo item by its ID.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Todo deleted successfully.
 *       '404':
 *         description: Todo not found.
 *       '500':
 *         description: Internal server error.
 */

router.delete('/:id', [verifyToken], todoController.deleteTodoById);
/**
 * @swagger
 * /todos/user/{id}:
 *   get:
 *     summary: Get all todos for a specific user
 *     description: Retrieve all todos belonging to a specific user.
 *     tags:
 *       - Todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user whose todos are to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of todos belonging to the specified user.
 *       '500':
 *         description: Internal server error.
 */

router.get('/User/:id', [verifyToken], todoController.getAllTodosUser);

module.exports = router;