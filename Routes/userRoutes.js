const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
// const { protect, isAdmin } = require('../middleware/authMiddleware'); // Authentication middleware

// Register a new user
router.post('/add-user', userController.addUser);

// User login
router.post('/login', userController.loginUser);

// Get user details by ID
router.get('/user/:id', userController.getUser);

// Delete a user by ID - Admin only
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
