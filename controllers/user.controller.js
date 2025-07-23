const User = require("../models/user.model");

exports.getAllQuestionsByUser = async (req, res) => {
     const userId = '687249299aea5cd7c8df32fc';

    try {
        const questions = await User.findById(userId).populate("questions");

        if (!questions) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this user.",
            });
        }

        return res.status(200).json({
            success: true,
            questions: questions.questions,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching user's questions.",
        });
    }
}

exports.getUserProfile = async (req, res) => {
    const userId = '687249299aea5cd7c8df32fc';

    try {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching user profile.",
        });
    }
}
exports.getAllUsersWithUsernameAndUserId = async (req, res) => {
  try {
    const users = await User.find().select('_id username'); // Only fetch _id and username

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
