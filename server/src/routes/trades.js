const express = require('express');
const router = express.Router();
const tradesController = require('../controllers/tradesController');
const { requireAuth } = require('../middleware/auth');

router.post('/execute', requireAuth, tradesController.executeTrade);
router.get('/history', requireAuth, tradesController.getTradeHistory);
router.post('/copy/:tradeId', requireAuth, tradesController.copyTrade);

module.exports = router;
