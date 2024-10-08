const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Post = require("../Models/postModel");
const User = require("../Models/userModel");
const ObjectId = mongoose.Types.ObjectId;

const addUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (username) {
			const existingUserByUsername = await User.findOne({ username });
			if (existingUserByUsername) {
				return res.status(400).send({ message: "Username already exists" });
			}
		}

		if (email) {
			const existingUserByEmail = await User.findOne({ email });
			if (existingUserByEmail) {
				return res.status(400).send({ message: "Email already exists" });
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			createdAt: Date.now(),
		});

		await newUser.save();
		res
			.status(201)
			.send({ message: "User created successfully", user: newUser });
	} catch (error) {
		console.log("Error at addUser /api/user/add-user", error);
		res.status(500).send({ message: "Server error" });
	}
};

const loginUser = async (req, res) => {
	const { username, password, email } = req.body;

	if ((!username && !email) || !password) {
		return res
			.status(400)
			.send({ message: "Provide username or email and password" });
	}

	try {
		let user;
		if (username) {
			user = await User.findOne({ username });
		} else if (email) {
			user = await User.findOne({ email });
		}

		if (!user) {
			return res
				.status(400)
				.send({ message: "Invalid username/email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.send({ message: "Invalid username/email or password" });
		}

		res.status(200).send({ message: "Login successful", user });
	} catch (error) {
		console.log("Error at loginUser /api/user/login", error);
		res.status(500).send({ message: "Server error" });
	}
};

const updateUser = async (req, res) => {
	console.log("@update user");
};

const getUser = async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}
		return res.status(200).send({ user: user });
	} catch (error) {
		console.log("Error at getUser /api/users/user/:id", error);
		res.status(500).send({ message: "Server error" });
	}
};

const deleteUser = async (req, res) => {
	try {
		const username = req.params.id;
		const user = await User.findOneAndDelete({ _id: username });
		if (!user) {
			return res.status(404).send({ message: "user not found" });
		}
		return res.status(201).send({ message: "user deleted successfully", user });
	} catch (error) {
		console.log("Error at getUser /api/users/user/:id", error);
		res.status(500).send({ message: "Server error" });
	}
};

module.exports = {
	addUser,
	loginUser,
	updateUser,
	getUser,
	deleteUser,
};
