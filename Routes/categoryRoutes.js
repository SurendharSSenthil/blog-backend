const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/categoryController');
// const { protect, isAdmin } = require('../middleware/authMiddleware'); // Add middleware

// Create a category - Only admin (blog owner) can create categories
router.post('/', categoryController.createCategory);

module.exports = router;
