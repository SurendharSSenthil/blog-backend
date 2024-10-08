const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	categories: [{ type: String }],
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked the post
	dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who disliked the post
	imageUrl: { type: String }, // URL to the image
	published: { type: Boolean, default: false },
	scheduledAt: { type: Date },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

PostSchema.index({ title: 1 });
PostSchema.index({ author: 1 });

module.exports = mongoose.model("Post", PostSchema);
