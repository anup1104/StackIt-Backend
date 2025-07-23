const Comment = require("../models/comment.model")
const User = require("../models/user.model")
const Answer = require("../models/answer.model")
const Notification = require("../models/notification.model")

exports.addComment = async(req, res)=>{
    const {answerId} = req.params;
    const {comment, userIdOfPersonWhoPostedQuestion, idOfQuestion} = req.body;
    const userId = '687249299aea5cd7c8df32fc';
    
    if (!answerId || !comment) {
		return res.status(400).json({
			success: false,
			message: "AnswerId and comment are required.",
		});
	}


    try{
        const answer = await Answer.findById(answerId);
        if(!answer){
            res.status(404).json({
                success: false,
                message: "Answer not found!",
            })
        }
        const newcomment = new Comment({
            userId,
            comment,
            answerId,
        })
        await newcomment.save();

        answer.comment.push(newcomment._id);

        await answer.save();


        // Notification
        const notificationString = "A new comment has come on your answer"
        const newNotification = new Notification({
            userId: userIdOfPersonWhoPostedQuestion,
            questionId: idOfQuestion,
            notification: notificationString
        })
       const notificationSent =  await newNotification.save();

        if(!notificationSent){
            res.status(500).json({
                success:false,
                message:"Internal server error!"
            })
        }

        res.status(201).json({
            success: true,
            message: "comment Added!",
            newcomment
        });
        
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: error.message || "Error adding comment.",
		});
    }
}

exports.getAllCommentsForAnswerId = async(req, res)=>{
    const {answerId} = req.params;
    if (!answerId) {
		return res.status(400).json({
			success: false,
			message: "Answer ID is required.",
		});
	}
    try{
        const allCommentsForAnswerId = await Comment.find({answerId}).populate("answerId", "userId comment upVotedBy downVotedBy").populate("userId","username");
    
        res.status(200).json({
            success:true,
            message:"Got all comments for answer Id!",
            allCommentsForAnswerId,
        })
    }
    catch(error){
       return res.status(500).json({
			success: false,
			message: error.message
		});
    }
}

exports.deleteComment = async(req, res)=>{
    const {commentId} = req.params;
    if (!commentId) {
		return res.status(400).json({
			success: false,
			message: "Comment Id is required.",
		});
	}
    try{
        const comment = await Comment.findByIdAndDelete(commentId);
       res.status(200).json({
        success:true,
        message:"Comment deleted!"
       })

    }
    catch(error){
       return res.status(500).json({
			success: false,
			message: error.message
		});
    }
}
exports.voteComment = async (req, res) => {
  const { commentId, voteType } = req.params;
 const userId = '687249299aea5cd7c8df32fc';
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "comment not found" });
    }

    const alreadyUpvoted = comment.upVotedBy.includes(userId);
    const alreadyDownvoted = comment.downVotedBy.includes(userId);

    // Remove previous vote if switching
    if (voteType === "upvote") {
      if (alreadyUpvoted) {
        // remove upvote
        comment.upVotedBy.pull(userId);
      } else {
        // remove downvote if exists
        if (alreadyDownvoted) {
          comment.downVotedBy.pull(userId);
        }
        comment.upVotedBy.push(userId);
      }
    } else if (voteType === "downvote") {
      if (alreadyDownvoted) {
        comment.downVotedBy.pull(userId);
      } else {
        if (alreadyUpvoted) {
          comment.upVotedBy.pull(userId);
        }
        comment.downVotedBy.push(userId);
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid vote type" });
    }

    // Update counts
    comment.upVotes = comment.upVotedBy.length;
    comment.downVotes = comment.downVotedBy.length;

    await comment.save();

    res.status(200).json({
      success: true,
      message: "Vote updated",
      upVotes: comment.upVotes,
      downVotes: comment.downVotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};