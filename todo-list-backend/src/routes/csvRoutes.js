const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const fs = require('fs');

const csvController = require('../controllers/csvController');
// Import middleware for authentication and authorization
const { verifyToken } = require("../middleware/authJwt");

// Filtering options
/**
 * @swagger
 * /todo/filter:
 *   get:
 *     summary: Filter todos by status
 *     description: Retrieve todos filtered by their status.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         description: Status of the todos to filter by (pending or completed).
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *     responses:
 *       '200':
 *         description: A list of todos filtered by status.
 *       '400':
 *         description: Bad request. Indicates that the status parameter is missing or invalid.
 *       '500':
 *         description: Internal server error.
 */

router.get('/filter', csvController.filterTodoByStatus);

// the below code fragment can be found in:
/**
 * @swagger
 * /todo/download/{id}:
 *   get:
 *     summary: Download todo list as CSV
 *     description: Download a CSV file containing the todo list for the specified owner.
 *     tags:
 *       - CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the owner
 *     responses:
 *       200:
 *         description: CSV file containing the todos
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Owner ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Owner ID not provided
 *       404:
 *         description: No todos found for the specified owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No todos found for the specified owner
 *       500:
 *         description: Failed to download todo list CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to download todo list CSV
 */

router.get('/download/:id', [verifyToken], csvController.downloadTodoListCSV);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'src/storage/upload/';
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.csv');
    }
});

const upload = multer({ storage: storage });
/**
 * @swagger
 * /todo/upload/{id}:
 *   post:
 *     summary: Upload CSV file to create todos
 *     tags:
 *       - CSV
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Todos uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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

router.post('/upload/:id', [verifyToken], upload.single('file'), csvController.uploadTodoFromCSV);


module.exports = router;