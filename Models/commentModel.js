const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the comment
	createdAt: { type: Date, default: Date.now },
});

CommentSchema.index({ post: 1 });
CommentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', CommentSchema);
