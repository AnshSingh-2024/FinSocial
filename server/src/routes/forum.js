const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { requireAuth } = require('../middleware/auth');

router.get('/', forumController.getQuestions);
router.get('/:id', forumController.getQuestionById);
router.post('/', requireAuth, forumController.createQuestion);
router.post('/:id/answers', requireAuth, forumController.createAnswer);
router.post('/:id/vote', requireAuth, forumController.voteQuestion);
router.post('/:id/ai-suggest', requireAuth, forumController.aiSuggest);
router.post('/answers/:answerId/vote', requireAuth, forumController.voteAnswer);
router.post('/answers/:answerId/accept', requireAuth, forumController.acceptAnswer);

module.exports = router;
