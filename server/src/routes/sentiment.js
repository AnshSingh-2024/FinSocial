const express = require('express');
const router = express.Router({ mergeParams: true });
const sentimentController = require('../controllers/sentimentController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/:ticker/sentiment', optionalAuth, sentimentController.getSentiment);
router.post('/:ticker/sentiment', requireAuth, sentimentController.voteSentiment);

module.exports = router;
