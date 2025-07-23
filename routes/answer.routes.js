const router = require("express").Router();
const answerController = require("../controllers/answer.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

router.post(
	"/add-answer/:questionId",
	authenticateUser,
	answerController.addAnswer
);

router.get("/get-answers/:questionId", answerController.getAnswersByQuestion);

router.put(
	"/vote-answer/:voteType/:answerID",
	authenticateUser,
	answerController.voteAnswer
);

router.delete("/:answerId", authenticateUser, answerController.deleteAnswer);

router.put(
	"/accept-answer/:answerId",
	authenticateUser,
	answerController.accpetAnswer
);
module.exports = router;
