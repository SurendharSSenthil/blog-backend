const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Authentication middleware

// Get all posts
router.get('/', postController.getPosts);

// Get a single post by ID
router.get('/post/:id', postController.getPost);

// Create a new post - Admin only
router.post('/posts', postController.createPost);

// Get posts by category
router.get('/posts/category/:category', postController.getPostsByCategory);

// Like a post - Protected
router.post('/like', postController.likePost);

// Unlike a post - Protected
router.post('/unlike', postController.unlikePost);

// Delete a post by ID - Admin only
router.delete('/:id', postController.deletePost);

module.exports = router;
