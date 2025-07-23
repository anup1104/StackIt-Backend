const mongoose = require("mongoose");

const Question = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tags: {
		type: [
			{
				type: String,
				required: true,
			},
		],
	},
	upVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	downVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
	isReported: {
		type: Boolean,
		default: false,
	},
	answers: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Answer",
			},
		],
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
module.exports = mongoose.model("Question", Question);
