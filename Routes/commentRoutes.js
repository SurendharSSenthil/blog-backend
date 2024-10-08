const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

// Get all comments for a specific post
router.get('/post/:postId', commentController.getCommentsByPost);

// Create a new comment - Protected
router.post('/comment', protect, commentController.createComment);

// Update a comment by ID - Protected
router.put('/:id', protect, commentController.updateComment);

// Delete a comment by ID - Protected
router.delete('/:id', protect, commentController.deleteComment);

// Like a comment by ID - Protected
router.post('/like', protect, commentController.likeComment);

module.exports = router;
