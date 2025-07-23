const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

router.get("/profile", authenticateUser, userController.getUserProfile);
router.get(
	"/questions",
	authenticateUser,
	userController.getAllQuestionsByUser
);
router.get("/get-all-users-with-username-userId", authenticateUser, userController.getAllUsersWithUsernameAndUserId)
module.exports = router;
