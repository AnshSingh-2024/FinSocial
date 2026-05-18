const prisma = require('../utils/prisma');
const logger = require('../utils/logger');

exports.getWatchlist = async (req, res) => {
  try {
    const items = await prisma.watchlistItem.findMany({
      where: { userId: req.user.userId },
      include: {
        stock: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items.map((i) => i.stock));
  } catch (error) {
    logger.error('getWatchlist error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;
    const userId = req.user.userId;

    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    await prisma.watchlistItem.upsert({
      where: { userId_stockId: { userId, stockId } },
      update: {},
      create: { userId, stockId }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('addToWatchlist error', { error: error.message });
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.params;
    const userId = req.user.userId;

    await prisma.watchlistItem.deleteMany({
      where: { userId, stockId }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('removeFromWatchlist error', { error: error.message });
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};
