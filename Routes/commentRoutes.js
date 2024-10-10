const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');
// const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

// Get all comments for a specific post
router.get('/post/:postId', commentController.getCommentsByPost);

// Create a new comment - Protected
router.post('/comment', commentController.createComment);

// Update a comment by ID - Protected
router.put('/:id', commentController.updateComment);

// Delete a comment by ID - d
router.delete('/:id', commentController.deleteComment);

// Like a comment by ID - Protected
router.post('/like', commentController.likeComment);

module.exports = router;
