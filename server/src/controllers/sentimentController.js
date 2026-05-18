const prisma = require('../utils/prisma');
const logger = require('../utils/logger');

exports.voteSentiment = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { vote } = req.body; // bullish | neutral | bearish
    const userId = req.user.userId;

    if (!['bullish', 'neutral', 'bearish'].includes(vote)) {
      return res.status(400).json({ error: 'vote must be bullish, neutral, or bearish' });
    }

    const stock = await prisma.stock.findUnique({ where: { ticker } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const existing = await prisma.sentimentVote.findUnique({
      where: { userId_stockId: { userId, stockId: stock.id } }
    });

    if (existing) {
      if (existing.vote === vote) {
        // Undo vote
        await prisma.sentimentVote.delete({ where: { id: existing.id } });
      } else {
        await prisma.sentimentVote.update({
          where: { id: existing.id },
          data: { vote, date: new Date() }
        });
      }
    } else {
      await prisma.sentimentVote.create({
        data: { userId, stockId: stock.id, vote }
      });
    }

    const aggregate = await getSentimentAggregate(stock.id);
    res.json(aggregate);
  } catch (error) {
    logger.error('voteSentiment error', { error: error.message });
    res.status(500).json({ error: 'Failed to vote on sentiment' });
  }
};

exports.getSentiment = async (req, res) => {
  try {
    const { ticker } = req.params;
    const stock = await prisma.stock.findUnique({ where: { ticker } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const aggregate = await getSentimentAggregate(stock.id);

    // Return user's vote if authenticated
    let userVote = null;
    if (req.user) {
      const vote = await prisma.sentimentVote.findUnique({
        where: { userId_stockId: { userId: req.user.userId, stockId: stock.id } }
      });
      userVote = vote?.vote || null;
    }

    res.json({ ...aggregate, userVote });
  } catch (error) {
    logger.error('getSentiment error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch sentiment' });
  }
};

async function getSentimentAggregate(stockId) {
  const votes = await prisma.sentimentVote.groupBy({
    by: ['vote'],
    where: { stockId },
    _count: { vote: true }
  });

  const counts = { bullish: 0, neutral: 0, bearish: 0 };
  for (const v of votes) counts[v.vote] = v._count.vote;
  const total = counts.bullish + counts.neutral + counts.bearish;

  return {
    bullish: total > 0 ? Math.round((counts.bullish / total) * 100) : 0,
    neutral: total > 0 ? Math.round((counts.neutral / total) * 100) : 0,
    bearish: total > 0 ? Math.round((counts.bearish / total) * 100) : 0,
    total,
    verdict: total === 0 ? 'Neutral' : counts.bullish > counts.bearish ? 'Bullish' : counts.bearish > counts.bullish ? 'Bearish' : 'Neutral',
  };
}
