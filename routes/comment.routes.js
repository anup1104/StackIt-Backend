const express = require("express");
const router = express.Router();
const {
	addComment,
	getAllCommentsForAnswerId,
	deleteComment,
	voteComment,
} = require("../controllers/comments.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

router.post("/add-comment/:answerId", authenticateUser, addComment);
router.get(
	"/get-all-comments-for-answerId/:answerId",
	getAllCommentsForAnswerId
);
router.delete("/delete-comment/:commentId", authenticateUser, deleteComment);
router.put("/vote-comment/:voteType/:commentId", authenticateUser, voteComment);

module.exports = router;
