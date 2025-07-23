const Notification = require("../models/notification.model");

exports.getNotificationsByUserId = async (req, res) => {
	const userId = req.user.id;

	try {
		const notifications = await Notification.find({ userId });

		if (!notifications) {
			return res.status(404).json({
				success: true,
				message: "Notifications not found!",
			});
		}

		return res.status(200).json({
			success: true,
			notifications,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteNotification = async (req, res) => {
	try {
		const { notificationId } = req.params;

		await Notification.findByIdAndDelete(notificationId).then(() => {
			return res.status(200).json({
				success: true,
				message: "Notification deleted successfully!",
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.markAsRead = async (req, res) => {
	try {
		const { notificationId } = req.params;

		const notification = await Notification.findById(notificationId);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found!",
			});
		}

		notification.isRead = true;

		await notification.save();

		return res.status(200).json({
			successs: true,
			messsage: "Notification marked as read!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
