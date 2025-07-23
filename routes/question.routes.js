const express = require('express')
const router = express.Router();
const {addQuestion, getQuestionById, getQuestionCount, getPaginatedQuestions, reportQuestion, deleteQuestion, voteQuestion, getAllQuestions} = require('../controllers/questions.controller');
const { authenticateUser } = require('../middleware/auth.middleware');


router.post('/add-question',authenticateUser,addQuestion)
router.get('/get-question-by-id/:questionId', getQuestionById)
router.get('/get-question-count', getQuestionCount)
router.get('/get-question-paginated', getPaginatedQuestions)
router.get('/get-all-questions',getAllQuestions)
router.post('/report-question/:questionId',authenticateUser, reportQuestion)
router.delete('/delete-question/:questionId', authenticateUser,deleteQuestion)
router.put('/vote-question/:voteType/:questionId', authenticateUser,voteQuestion)

module.exports = router