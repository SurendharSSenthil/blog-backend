const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../Models/postModel');
const User = require('../Models/userModel');
const ObjectId = mongoose.Types.ObjectId;

const JWT_SECRET = process.env.JWT_SECRET;

// Function to add a new user
const addUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Check for existing username
		if (username) {
			const existingUserByUsername = await User.findOne({ username });
			if (existingUserByUsername) {
				return res.status(400).send({ message: 'Username already exists' });
			}
		}

		// Check for existing email
		if (email) {
			const existingUserByEmail = await User.findOne({ email });
			if (existingUserByEmail) {
				return res.status(400).send({ message: 'Email already exists' });
			}
		}

		// Hash the password
		// const hashedPassword = await bcrypt.hash(password, 10);

		// Create the new user
		const newUser = new User({
			username,
			email,
			role: 'U',
			password,
			createdAt: Date.now(),
		});

		// Save the user in the database
		await newUser.save();

		// Create JWT token
		const token = jwt.sign(
			{ userId: newUser._id, email: newUser.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		);

		res.status(201).send({
			message: 'User created successfully',
			user: newUser,
			token,
		});
	} catch (error) {
		console.log('Error at addUser /api/user/add-user', error);
		res.status(500).send({ message: 'Server error' });
	}
};

// Function to log in a user
const loginUser = async (req, res) => {
	const { username, password, email } = req.body;

	if ((!username && !email) || !password) {
		return res
			.status(400)
			.send({ message: 'Provide username or email and password' });
	}

	try {
		let user;
		// Find the user by username or email
		if (username) {
			user = await User.findOne({ username });
		} else if (email) {
			user = await User.findOne({ email });
		}

		if (!user) {
			return res
				.status(400)
				.send({ message: 'Invalid username/email or password' });
		}

		// Compare the hashed password with the one provided by the user
		const isMatch = user.password === password;
		if (!isMatch) {
			return res
				.status(400)
				.send({ message: 'Invalid username/email or password' });
		}

		// Generate JWT token after successful login
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1d' }
		);

		res.status(200).json({
			message: 'Login successful',
			user,
			token, // Send the JWT token back to the client
		});
	} catch (error) {
		console.log('Error at loginUser /api/user/login', error);
		res.status(500).send({ message: 'Server error' });
	}
};
const updateUser = async (req, res) => {
	console.log('@update user');
};

const getUser = async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}
		return res.status(200).send({ user: user });
	} catch (error) {
		console.log('Error at getUser /api/users/user/:id', error);
		res.status(500).send({ message: 'Server error' });
	}
};

const deleteUser = async (req, res) => {
	try {
		const username = req.params.id;
		const user = await User.findOneAndDelete({ _id: username });
		if (!user) {
			return res.status(404).send({ message: 'user not found' });
		}
		return res.status(201).send({ message: 'user deleted successfully', user });
	} catch (error) {
		console.log('Error at getUser /api/users/user/:id', error);
		res.status(500).send({ message: 'Server error' });
	}
};

module.exports = {
	addUser,
	loginUser,
	updateUser,
	getUser,
	deleteUser,
};
