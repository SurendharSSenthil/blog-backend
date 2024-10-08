const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Authentication middleware

// Get all posts
router.get('/', postController.getPosts);

// Get a single post by ID
router.get('/post/:id', postController.getPost);

// Create a new post - Admin only
router.post('/posts', protect, isAdmin, postController.createPost);

// Get posts by a specific user
router.get('/posts/user/:id', postController.getuserPost);

// Get posts by category
router.get('/posts/category/:category', postController.getPostsByCategory);

// Update a post by ID - Admin only
router.put('/posts/:id', protect, isAdmin, postController.updatePost);

// Like a post - Protected
router.post('/like', protect, postController.likePost);

// Unlike a post - Protected
router.post('/unlike', protect, postController.unlikePost);

// Delete a post by ID - Admin only
router.delete('/:id', protect, isAdmin, postController.deletePost);

module.exports = router;
