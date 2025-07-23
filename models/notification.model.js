const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question",
	},
	notification: {
		type: String,
		required: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Notification", Notification);
