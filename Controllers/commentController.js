const mongoose = require('mongoose');
const Post = require('../Models/postModel');
const Comment = require('../Models/commentModel');
const User = require('../Models/userModel');

// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
	const postId = req.params.postId;
	try {
		const comments = await Comment.find({ post: postId }).populate(
			'author',
			'username'
		); // Populate author details
		console.log(comments);
		return res.status(200).json(comments);
	} catch (err) {
		console.error('Error at getCommentsByPost /api/comment/post/:postId', err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Create a new comment
const createComment = async (req, res) => {
	const { content, userId, postId } = req.body;
	console.log(req.body);

	try {
		// Validate input
		if (!content || !userId || !postId) {
			return res
				.status(400)
				.json({ message: 'Content, userId, and postId are required' });
		}

		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: 'User is not authenticated' });
		}

		// Create a new comment
		const comment = new Comment({
			content,
			author: userId,
			post: postId,
			createdAt: Date.now(),
		});

		await comment.save();

		// Update the post with the new comment
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		post.comments.push(comment._id);
		await post.save();

		console.log(comment);
		res.status(201).json({ message: 'Comment saved', comment });
	} catch (err) {
		console.error('Error at createComment /api/comment', err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Update a comment by ID
const updateComment = async (req, res) => {
	const { content } = req.body;
	const commentId = req.params.id;

	try {
		if (!content) {
			return res.status(400).json({ message: 'Content is required' });
		}

		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		comment.content = content;
		comment.updatedAt = Date.now();

		await comment.save();
		console.log('Updated comment:', comment);
		res.status(200).json({ message: 'Comment updated', comment });
	} catch (err) {
		console.error('Error at updateComment PUT /comments/:id', err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
	const commentId = req.params.id;
	try {
		const comment = await Comment.findByIdAndDelete(commentId);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		console.log('Deleted comment:', comment);
		res.status(200).json({ message: 'Comment deleted', comment });
	} catch (err) {
		console.error('Error at deleteComment DELETE /comments/:id', err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Like or Unlike a comment
const likeComment = async (req, res) => {
	const { author, commentId } = req.body;

	try {
		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: 'Comment not found' });
		}

		// Check if the user already liked the comment
		if (comment.likes.includes(author)) {
			comment.likes = comment.likes.filter(
				(like) => like.toString() !== author
			);
			await comment.save();
			console.log('Comment unliked:', comment);
			return res.status(200).json({ message: 'Comment unliked', comment });
		} else {
			comment.likes.push(author);
			await comment.save();
			console.log('Comment liked:', comment);
			return res.status(200).json({ message: 'Comment liked', comment });
		}
	} catch (error) {
		console.error('Error at likeComment /api/comments/like', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = {
	getCommentsByPost,
	createComment,
	updateComment,
	deleteComment,
	likeComment,
};
