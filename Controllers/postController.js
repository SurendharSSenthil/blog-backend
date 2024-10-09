const mongoose = require('mongoose');
const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const Comment = require('../Models/commentModel');

const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({});
		if (posts) {
			return res.status(200).send(posts);
		} else {
			return res.status(404).send({ message: 'No posts found' });
		}
	} catch (Err) {
		console.log('Error at getPosts /api/posts/', Err);
		res.status(500).send({ message: 'server side error' });
	}
};

const getPost = async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);
		const posts = await Post.find({ _id: id });
		if (posts) {
			console.log(posts);
			let comments_res = [];
			if (posts[0].comments && posts[0].comments.length) {
				for (const comment of posts[0].comments) {
					const res = await Comment.find({ _id: comment });
					comments_res.push(res);
				}
			}
			return res.status(200).json({ posts, comments: comments_res });
		} else {
			return res.status(404).send({ message: 'No posts found' });
		}
	} catch (Err) {
		console.log('Error at getPosts /api/posts/', Err);
		res.status(500).send({ message: 'server side error' });
	}
};

const createPost = async (req, res) => {
	const { title, content, imageUrl, userId } = req.body; // Change username to userId

	try {
		// Find the author by userId
		const author = await User.findById(userId); // Use findById instead of find
		if (!author) {
			return res.status(400).send({ message: 'Author not found' });
		}

		// Create a new post
		const newPost = new Post({
			title,
			content,
			category: req.body.category || '', // Optional category
			author: userId,
			imageUrl,
			createdAt: Date.now(),
		});

		// Save the post to the database
		await newPost.save();

		res
			.status(201)
			.send({ message: 'Post created successfully', post: newPost });
	} catch (error) {
		console.error('Error at createPost /api/posts', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const updatePost = async (req, res) => {
	const postId = req.params.id;
	const { title, content, category } = req.body;
	const image = req.file ? req.file.filename : null;

	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).send({ message: 'Post not found' });
		}

		post.title = title || post.title;
		post.content = content || post.content;
		post.category = category || post.category;
		if (image) {
			post.image = image;
		}

		await post.save();
		res.status(200).send({ message: 'Post updated successfully', post });
	} catch (error) {
		console.error('Error at updatePost /api/posts/:id', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const deletePost = async (req, res) => {
	const postId = req.params.id;
	try {
		const post = await Post.findOneAndDelete({ _id: postId });
		if (post) {
			console.log(post);
			return res
				.status(200)
				.send({ message: 'Post deleted successfully', post });
		} else {
			return res.status(404).send({ message: 'Post not found' });
		}
	} catch (error) {
		console.error('Error at deletePost /api/posts/:id', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const getuserPost = async (req, res) => {
	const userId = req.params.id;
	try {
		const posts = await Post.find({ author: userId });
		if (posts.length != 0) {
			console.log('@get users posts', posts);
			return res.status(200).send(posts);
		} else {
			return res.status(404).send({ message: 'No posts found' });
		}
	} catch (error) {
		console.error('Error at getUserPost /api/posts/user/:id', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const getPostsByCategory = async (req, res) => {
	const category = req.params.category;

	try {
		const posts = await Post.find({ categories: { $in: [category] } });

		if (posts.length === 0) {
			return res.status(404).send({ message: 'No posts found' });
		}

		res.status(200).send({ posts });
	} catch (error) {
		console.error(
			'Error at getPostsByCategory /api/posts/category/:category',
			error
		);
		res.status(500).send({ message: 'Server error' });
	}
};

const likePost = async (req, res) => {
	const { postId, userId } = req.body;
	try {
		const post = await Post.findOne({ _id: postId });
		if (!post) {
			return res.status(404).send({ message: 'Post not found' });
		}
		if (post.likes.length > 0) {
			if (post.likes.includes(userId)) {
				post.likes = post.likes.filter((like) => like !== userId);
				await post.save();
				console.log(post);
				return res.status(200).send({ message: 'Post liked' });
			}
		} else {
			if (post.dislikes.includes(userId)) {
				post.dislikes = post.dislikes.filter((dislike) => dislike != userId);
			}
			post.likes.push(userId);
			await post.save();
			console.log(post);
			return res.status(200).send({ message: 'Post liked' });
		}
	} catch (error) {
		console.error('Error at likePost /api/posts/like', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const unlikePost = async (req, res) => {
	const { userId, postId } = req.body;
	try {
		const post = await Post.findOne({ _id: postId });
		if (!post) {
			return res.status(404).send({ message: 'Post not found' });
		}
		if (post.dislikes.includes(userId)) {
			return res.status(200).send({ message: 'Post disliked' });
		} else {
			if (post.likes.includes(userId)) {
				post.likes = post.likes.filter((like) => like != userId);
			}
			post.dislikes.push(userId);
			await post.save();
			console.log(post);
			res.status(200).send({ message: 'Post disliked' });
		}
	} catch (error) {
		console.error('Error at unlikePost /api/posts/unlike', error);
		res.status(500).send({ message: 'Server error' });
	}
};

module.exports = {
	getPosts,
	getPost,
	createPost,
	updatePost,
	deletePost,
	getuserPost,
	getPostsByCategory,
	likePost,
	unlikePost,
};
