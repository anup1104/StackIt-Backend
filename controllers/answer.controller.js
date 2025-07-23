const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");

exports.addAnswer = async (req, res) => {
	const { content, userIdOfPersonWhoPostedQuestion } = req.body;
	const { questionId } = req.params;

	 const userId = '687249299aea5cd7c8df32fc';

	if (!content || !questionId) {
		return res.status(400).json({
			success: false,
			message: "Content and question ID are required.",
		});
	}

	try {
		const question = await Question.findById(questionId);
		if (!question) {
			return res.status(404).json({
				success: false,
				message: "Question not found.",
			});
		}

		const answer = new Answer({
			content,
			question: questionId,
			user: userId,
		});

		await answer.save();

		// Update the user's answers array
		await User.findByIdAndUpdate(userId, {
			$push: { answers: answer._id },
		});

		// Update the question's answers array
		await Question.findByIdAndUpdate(questionId, {
			$push: { answers: answer._id },
		});

		// Notification
		const notificationString = "A new answer has come on your question"

		const newNotification = new Notification({
			userId: userIdOfPersonWhoPostedQuestion,
			questionId,
			notification: notificationString
		});
		const notificationSent = await newNotification.save();

		if (!notificationSent) {
			res.status(500).json({
				success: false,
				message: "Internal server error!",
			});
		}

		return res.status(201).json({
			success: true,
			message: "Answer added successfully.",
			answer,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Error adding answer.",
		});
	}
};

exports.getAnswersByQuestion = async (req, res) => {
	const { questionId } = req.params;

	if (!questionId) {
		return res.status(400).json({
			success: false,
			message: "Question ID is required.",
		});
	}

	try {
		const answers = await Answer.find({ question: questionId })
			.populate("user", "username profile_image")
			.populate("comment");

		if (!answers || answers.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No answers found for this question.",
			});
		}

		return res.status(200).json({
			success: true,
			answers,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Error fetching answers.",
		});
	}
};

exports.voteAnswer = async (req, res) => {
	const { answerId,voteType } = req.params;
	// const { voteType } = req.body; // "upvote" or "downvote"
	 const userId = '687249299aea5cd7c8df32fc';
	try {
		const answer = await Answer.findById(answerId);
		if (!answer) {
			return res
				.status(404)
				.json({ success: false, message: "Answer not found" });
		}

		const alreadyUpvoted = answer.upVotedBy.includes(userId);
		const alreadyDownvoted = answer.downVotedBy.includes(userId);

		// Remove previous vote if switching
		if (voteType === "upvote") {
			if (alreadyUpvoted) {
				// remove upvote
				answer.upVotedBy.pull(userId);
			} else {
				// remove downvote if exists
				if (alreadyDownvoted) {
					answer.downVotedBy.pull(userId);
				}
				answer.upVotedBy.push(userId);
			}
		} else if (voteType === "downvote") {
			if (alreadyDownvoted) {
				answer.downVotedBy.pull(userId);
			} else {
				if (alreadyUpvoted) {
					answer.upVotedBy.pull(userId);
				}
				answer.downVotedBy.push(userId);
			}
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Invalid vote type" });
		}

		// Update counts
		const upVotes = answer.upVotedBy.length;
		const downVotes = answer.downVotedBy.length;

		await answer.save();

		res.status(200).json({
			success: true,
			message: "Vote updated",
			upVotes,
			downVotes,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

exports.deleteAnswer = async (req, res) => {
	const { answerId } = req.params;

	if (!answerId) {
		return res.status(400).json({
			success: false,
			message: "AnswerId is required to delete a answer!",
		});
	}
	try {
		await Answer.findByIdAndDelete(answerId).then(() => {
			return res.status(200).json({
				success: true,
				message: "Answer deleted successfully!",
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Error while deleting answer!",
		});
	}
};

exports.accpetAnswer = async (req, res) => {
	const { answerId } = req.params;
	if (!answerId) {
		return res.status(400).json({
			success: false,
			message: "Answer Id is required to accept a answer!",
		});
	}

	try {
		const totalAcceptedAnswers = await Answer.countDocuments({
			isAccepted: true,
		});
		if (totalAcceptedAnswers > 0) {
			return res.status(401).json({
				success: false,
				message: "You can only accept one answer!",
			});
		}
		const answer = await Answer.findById(answerId);

		if (!answer) {
			return res.status(404).json({
				success: false,
				message: "Answer not found!",
			});
		}

		answer.isAccepted = true;

		await answer.save();

		return res.status(200).json({
			success: true,
			message: "Answer accepted successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
