const express = require("express");
const User = require("../models/user.model");
const Question = require("../models/question.model");
const Notification = require("../models/notification.model");

exports.addQuestion = async (req, res) => {
	const { title, description, tags } = req.body;
	 const userId = '687249299aea5cd7c8df32fc';
	// const userId = '68720abc3a9d23ab02170812'
	if (!title || !description || tags.length == 0) {
		return res.status(400).json({
			success: false,
			message: "All fields are required.",
		});
	}
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({
				success: true,
				message: "User not found!",
			});
		}
		const newQuestion = new Question({
			title,
			description,
			tags,
			userId,
		});

		await newQuestion.save();

		user.questions.push(newQuestion._id);

		await user.save();

		res.status(201).json({
			success: true,
			message: "Question added!",
			newQuestion,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
exports.getQuestionById = async (req, res) => {
	// const userId = req.user.userId;
	const { questionId } = req.params;
	if (!questionId) {
		return res.status(400).json({
			success: false,
			message: "Question Id is required.",
		});
	}
	try {
		const question = await Question.findById(questionId);
		if (!question) {
			res.status(404).json({
				success: false,
				message: "Question not found!",
			});
		}
		res.status(200).json({
			success: true,
			message: "Question found!",
			question,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
exports.getQuestionCount = async (req, res) => {
	try {
		const count = await Question.countDocuments();
		res.status(200).json({
			success: true,
			message: "Count Done!",
			count,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getPaginatedQuestions = async (req, res) => {
	const { sIndex = 0, eIndex = 9 } = req.query; // default values

	try {
		const questions = await Question.find()
			.skip(Number(sIndex))
			.limit(Number(eIndex) - Number(sIndex) + 1);

		const totalCount = await Question.countDocuments();

		res.status(200).json({
			success: true,
			message: "Paginated questions fetched",
			data: questions,
			totalCount,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.reportQuestion = async (req, res) => {
	const { questionId } = req.params;
	if (!questionId) {
		return res.status(400).json({
			success: false,
			message: "Question Id is required.",
		});
	}
	try {
		const question = await Question.find(questionId);
		if (!question) {
			res.status(404).json({
				success: false,
				message: "Question not found!",
			});
		}
		question.isReported = true;
		await question.save();
		res.status(200).json({
			success: true,
			message: "Reported Successfully!",
			question,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteQuestion = async (req, res) => {
	const { questionId } = req.params;
	if (!questionId) {
		return res.status(400).json({
			success: false,
			message: "Question Id is required.",
		});
	}
	try {
		await Question.findByIdAndDelete(questionId);

		res.status(200).json({
			success: true,
			message: "Deleted Successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.voteQuestion = async (req, res) => {
	const { questionId , voteType} = req.params;
	// const { voteType } = req.body; // "upvote" or "downvote"
	 const userId = '687249299aea5cd7c8df32fc';

	try {
		const question = await Question.findById(questionId);
		if (!question) {
			return res
				.status(404)
				.json({ success: false, message: "Question not found" });
		}

		const alreadyUpvoted = question.upVotedBy.includes(userId);
		const alreadyDownvoted = question.downVotedBy.includes(userId);

		// Remove previous vote if switching
		if (voteType === "upvote") {
			if (alreadyUpvoted) {
				// remove upvote
				question.upVotedBy.pull(userId);
			} else {
				// remove downvote if exists
				if (alreadyDownvoted) {
					question.downVotedBy.pull(userId);
				}
				question.upVotedBy.push(userId);
			}
		} else if (voteType === "downvote") {
			if (alreadyDownvoted) {
				question.downVotedBy.pull(userId);
			} else {
				if (alreadyUpvoted) {
					question.upVotedBy.pull(userId);
				}
				question.downVotedBy.push(userId);
			}
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Invalid vote type" });
		}

		// Update counts
		question.upVotes = question.upVotedBy.length;
		question.downVotes = question.downVotedBy.length;

		await question.save();

		res.status(200).json({
			success: true,
			message: "Vote updated",
			upVotes: question.upVotes,
			downVotes: question.downVotes,
		});
	} catch (error) {
		console.error(error);
	}
};
exports.getAllQuestions = async (req, res)=>{
    try{
        const questions = await Question.find().populate("userId", "username name email");
        res.status(200).json({
            success:true,
            message:"All questions sent",
            questions
        })
    }
    catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}