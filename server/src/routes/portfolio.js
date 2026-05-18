const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, portfolioController.getPortfolio);
router.post('/optimize', requireAuth, portfolioController.optimizePortfolio);

module.exports = router;
