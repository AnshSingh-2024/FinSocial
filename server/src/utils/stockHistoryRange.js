const YahooFinance = require('yahoo-finance2').default;
const prisma = require('./prisma');
const logger = require('./logger');

const yf = new YahooFinance();

const VALID_RANGES = new Set(['1d', '1w', '1m', '3m', '1y', '2y']);

/** Max daily bars per range (~trading days). */
const TRADING_DAY_TAKE = {
  '1w': 7,
  '1m': 22,
  '3m': 66,
  '1y': 252,
  '2y': 560,
};

function normalizeRange(raw) {
  if (!raw || typeof raw !== 'string') return '2y';
  const key = raw.trim().toLowerCase().replace(/\s+/g, '');
  const aliases = {
    '1day': '1d',
    '1week': '1w',
    '1wk': '1w',
    '1month': '1m',
    '1mo': '1m',
    '3month': '3m',
    '3months': '3m',
    '3mo': '3m',
    '1year': '1y',
    '1yr': '1y',
    '2year': '2y',
    '2years': '2y',
    '2yr': '2y',
  };
  const mapped = aliases[key] || key;
  return VALID_RANGES.has(mapped) ? mapped : '2y';
}

function dayKey(d) {
  return new Date(d).toISOString().slice(0, 10);
}

function latestSessionBars(quotes) {
  const valid = (quotes || []).filter(
    (q) => q?.date && Number.isFinite(q.open) && Number.isFinite(q.close),
  );
  if (!valid.length) return [];
  const sorted = [...valid].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastKey = dayKey(sorted[sorted.length - 1].date);
  return sorted.filter((q) => dayKey(q.date) === lastKey);
}

async function fetchYahooIntraday(ticker) {
  const period2 = new Date();
  const period1 = new Date();
  period1.setDate(period1.getDate() - 7);

  for (const interval of ['5m', '15m', '30m', '1h']) {
    try {
      const chart = await yf.chart(ticker, { period1, period2, interval });
      const session = latestSessionBars(chart?.quotes);
      if (session.length >= 2) {
        return session.map((q) => ({
          date: new Date(q.date),
          open: q.open,
          high: q.high ?? q.open,
          low: q.low ?? q.open,
          close: q.close,
          volume: q.volume ?? 0,
        }));
      }
    } catch (e) {
      logger.warn('Intraday chart fetch failed', { ticker, interval, error: e.message });
    }
  }
  return null;
}

async function fetchDbHistory(stockId, range) {
  const take = TRADING_DAY_TAKE[range] || TRADING_DAY_TAKE['2y'];
  const desc = await prisma.stockHistory.findMany({
    where: { stockId },
    orderBy: { date: 'desc' },
    take,
  });
  return desc.reverse();
}

/**
 * @returns {Promise<{ history: object[], interval: '1d'|'intraday', range: string }>}
 */
async function fetchHistoryForRange(stockId, ticker, rangeInput) {
  const range = normalizeRange(rangeInput);

  if (range === '1d') {
    const intraday = await fetchYahooIntraday(ticker);
    if (intraday?.length) {
      return { history: intraday, interval: 'intraday', range: '1d' };
    }
    const fallback = await fetchDbHistory(stockId, '1w');
    return { history: fallback.slice(-1), interval: '1d', range: '1d' };
  }

  const history = await fetchDbHistory(stockId, range);
  return { history, interval: '1d', range };
}

module.exports = {
  normalizeRange,
  fetchHistoryForRange,
  VALID_RANGES,
  TRADING_DAY_TAKE,
};
