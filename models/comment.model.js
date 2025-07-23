const mongoose = require("mongoose");

const Comment = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	comment: {
		type: String,
		required: true,
	},
	answerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Answer",
	},
	upVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	downVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("Comment", Comment);
