const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

router.get(
	"/",
	authenticateUser,
	notificationController.getNotificationsByUserId
);

router.delete(
	"/:notificationId",
	authenticateUser,
	notificationController.deleteNotification
);

router.put(
	"/mark-as-read/:notificationId",
	authenticateUser,
	notificationController.markAsRead
);

module.exports = router;