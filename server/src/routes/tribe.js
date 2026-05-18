const express = require('express');
const router = express.Router();
const tribeController = require('../controllers/tribeController');
const { requireAuth } = require('../middleware/auth');

router.get('/channels', requireAuth, tribeController.getChannels);
router.get('/channels/:channelId/messages', requireAuth, tribeController.getMessages);
router.get('/channels/:channelId/polls', requireAuth, tribeController.getPolls);
router.post('/channels/:channelId/polls', requireAuth, tribeController.createPoll);
router.post('/polls/:pollId/vote', requireAuth, tribeController.votePoll);
router.post('/finbot', requireAuth, tribeController.finbotReply);

module.exports = router;
