const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, watchlistController.getWatchlist);
router.post('/', requireAuth, watchlistController.addToWatchlist);
router.delete('/:stockId', requireAuth, watchlistController.removeFromWatchlist);

module.exports = router;
