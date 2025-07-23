const mongoose = require("mongoose");

const Answer = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	upVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	downVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	comment: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	isAccepted: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Answer", Answer);
