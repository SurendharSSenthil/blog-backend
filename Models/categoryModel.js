const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

CategorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', CategorySchema);
