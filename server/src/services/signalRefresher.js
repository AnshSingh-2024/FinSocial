const axios = require('axios');
const prisma = require('../utils/prisma');
const logger = require('../utils/logger');
const { mlBaseUrl } = require('../utils/serviceUrls');
const { notificationQueue } = require('../jobs/index');

const ML_URL = mlBaseUrl();
const PREDICT_TIMEOUT_MS = 10000;
const STOCK_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Run ML /predict for every stock, persist Signal rows, emit socket events.
 * Used by the Bull signal worker and POST /feed/signals/refresh.
 */
async function refreshAllSignals() {
  const stocks = await prisma.stock.findMany({ select: { id: true, ticker: true } });
  let updated = 0;
  let failed = 0;

  for (const stock of stocks) {
    try {
      const { data } = await axios.post(
        `${ML_URL}/predict`,
        { ticker: stock.ticker },
        { timeout: PREDICT_TIMEOUT_MS }
      );

      const signal = await prisma.signal.create({
        data: {
          stockId: stock.id,
          verdict: data.verdict,
          confidence: data.confidence,
          reasoning: data.reasoning || '',
          rsi: data.technicals?.rsi || null,
          macd: data.technicals?.macd || null,
          source: data.model_used ? 'xgboost' : 'heuristic',
        },
        include: { stock: { select: { ticker: true, displayTicker: true } } },
      });

      if (global.io) {
        global.io.emit('signal:new', {
          id: signal.id,
          ticker: signal.stock.displayTicker,
          verdict: signal.verdict,
          confidence: signal.confidence,
          reasoning: signal.reasoning,
        });
      }

      if (data.confidence >= 70 && (data.verdict === 'BUY' || data.verdict === 'SELL')) {
        try {
          const watchlistUsers = await prisma.watchlistItem.findMany({
            where: { stockId: stock.id },
            select: { userId: true },
          });
          for (const { userId } of watchlistUsers) {
            const notification = await prisma.notification.create({
              data: {
                userId,
                type: 'signal_alert',
                title: `${data.verdict} Signal: ${signal.stock.displayTicker}`,
                body: `ML model signals ${data.verdict} with ${data.confidence}% confidence. ${data.reasoning || ''}`.trim(),
              },
            });
            notificationQueue.add({ notificationId: notification.id });
          }
        } catch (notifErr) {
          logger.warn('[Signals] Watchlist notification failed', { error: notifErr.message });
        }
      }

      updated += 1;
      logger.info('[Signals] Saved', { ticker: stock.ticker, verdict: data.verdict });
      await sleep(STOCK_DELAY_MS);
    } catch (err) {
      failed += 1;
      logger.warn('[Signals] Predict failed', { ticker: stock.ticker, error: err.message });
    }
  }

  return { success: true, count: stocks.length, updated, failed };
}

module.exports = { refreshAllSignals };
