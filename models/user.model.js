const mongoose = require("mongoose");

const User = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	username:{
		type:String,
		required:true
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	profile_image: {
		type: String,
	},
	questions: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Question",
			},
		],
	},
    answers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Answer",
            },
        ],
    },
    notifications: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Notification",
            },
        ],
    },
});

module.exports = mongoose.model("User", User);