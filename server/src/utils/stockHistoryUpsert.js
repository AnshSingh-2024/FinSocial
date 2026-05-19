const prisma = require('./prisma');
const logger = require('./logger');

/**
 * Upsert daily OHLC rows into StockHistory.
 * @param {string} stockId
 * @param {{ date: Date, open: number, high: number, low: number, close: number, volume: number }[]} bars
 */
async function upsertDailyHistory(stockId, bars) {
  if (!stockId || !bars?.length) return 0;

  let count = 0;
  for (const bar of bars) {
    const day = new Date(bar.date);
    day.setUTCHours(12, 0, 0, 0);
    try {
      await prisma.stockHistory.upsert({
        where: {
          stockId_date: { stockId, date: day },
        },
        create: {
          stockId,
          date: day,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume ?? 0,
        },
        update: {
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume ?? 0,
        },
      });
      count += 1;
    } catch (e) {
      logger.warn('stockHistory upsert failed', { stockId, error: e.message });
    }
  }
  return count;
}

module.exports = { upsertDailyHistory };
