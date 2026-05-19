const prisma = require('../utils/prisma');
const logger = require('../utils/logger');
const { sanitizeFeedEvent } = require('../utils/feedAnonymize');
const { fetchAndStoreNews } = require('../services/newsFetcher');
const { refreshAllSignals } = require('../services/signalRefresher');

async function fetchLatestSignals(limit = 10) {
  return prisma.signal.findMany({
    include: {
      stock: { select: { ticker: true, displayTicker: true, name: true, price: true, changePct: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    distinct: ['stockId'],
  });
}

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const viewerUserId = req.user?.userId ?? null;

    const events = await prisma.feedEvent.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    res.json(events.map((e) => sanitizeFeedEvent(e, viewerUserId)));
  } catch (error) {
    logger.error('getFeed error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

exports.getNews = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
        source: true,
        url: true,
        tickers: true,
        sentiment: true,
        publishedAt: true,
        createdAt: true,
      },
    });
    res.set('Cache-Control', 'no-store');
    res.json(articles);
  } catch (error) {
    logger.error('getNews error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.refreshNews = async (req, res) => {
  try {
    const result = await fetchAndStoreNews();
    if (result.error && result.saved === 0) {
      return res.status(result.error.includes('not configured') ? 503 : 502).json(result);
    }
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        summary: true,
        description: true,
        source: true,
        url: true,
        tickers: true,
        sentiment: true,
        publishedAt: true,
        createdAt: true,
      },
    });
    res.json({ ...result, articles });
  } catch (error) {
    logger.error('refreshNews error', { error: error.message });
    res.status(500).json({ error: 'Failed to refresh news' });
  }
};

exports.getSignalsTop = async (req, res) => {
  try {
    const signals = await fetchLatestSignals(10);
    res.json(signals);
  } catch (error) {
    logger.error('getSignalsTop error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
};

exports.refreshSignals = async (req, res) => {
  try {
    const result = await refreshAllSignals();
    const signals = await fetchLatestSignals(10);

    let message;
    if (result.updated === 0) {
      message = 'Could not generate signals. Check that the ML service is running.';
    } else if (result.failed > 0) {
      message = `Generated ${result.updated} signal(s); ${result.failed} stock(s) failed.`;
    } else {
      message = `Generated ${result.updated} new signal(s).`;
    }

    res.json({ ...result, message, signals });
  } catch (error) {
    logger.error('refreshSignals error', { error: error.message });
    res.status(500).json({ error: 'Failed to refresh signals' });
  }
};
