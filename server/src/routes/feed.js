const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, feedController.getFeed);
router.get('/news', feedController.getNews);
router.post('/news/refresh', feedController.refreshNews);
router.get('/signals', feedController.getSignalsTop);
router.post('/signals/refresh', feedController.refreshSignals);

module.exports = router;
