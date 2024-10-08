const mongoose = require('mongoose');
const Post = require('../Models/postModel');
const Category = require('../Models/categoryModel');

const createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (name === '' || description === '') {
			return res
				.status(400)
				.send({ message: 'name and description is needed' });
		}
		const cat = new Category({
			name,
			description,
			createdAt: Date.now(),
		});
		await cat.save();
		console.log(cat);
		res.status(200).send({ message: 'category is created', cat });
	} catch (err) {
		console.log('Error at createCategory /api/categories', err);
		res.status(500).send({ message: 'Internal Server Error' });
	}
};

module.exports = {
	createCategory,
};
