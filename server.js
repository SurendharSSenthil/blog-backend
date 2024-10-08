const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
require('dotenv').config();

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		console.log('MongoDB connected with the string', process.env.MONGO_URI)
	)
	.catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', async (req, res) => res.send({ message: 'Hello World!' }));
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
