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
 * /todo/download:
 *   get:
 *     summary: Download todo list in CSV format
 *     tags:
 *       - CSV
 *     description: |
 *       Allows users to download the todo list in CSV format. The todo list will be downloaded as a CSV file.
 *       Each row in the CSV file represents a todo item, with columns for description and status.
 *       The CSV file can be opened and viewed using spreadsheet software such as Microsoft Excel or Google Sheets.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Todo list downloaded successfully.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: An error occurred while downloading the todo list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 */

router.get('/download', [verifyToken], csvController.downloadTodoListCSV);

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
 * /todo/upload:
 *   post:
 *     summary: Upload todo items from CSV file
 *     tags:
 *       - CSV
 *     description: |
 *       Allows users to upload todo items from a CSV file. The CSV file should contain columns for description and status.
 *       Each row in the CSV file represents a todo item to be uploaded.
 *       After successful upload, the todo items will be saved in the database.
 *     security:
 *       - bearerAuth: []
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
 *         description: Todos uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming successful upload.
 *       '400':
 *         description: Bad request. No file uploaded.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: An error occurred while processing the upload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 */

router.post('/upload/:id', [verifyToken], upload.single('file'), csvController.uploadTodoFromCSV);


module.exports = router;