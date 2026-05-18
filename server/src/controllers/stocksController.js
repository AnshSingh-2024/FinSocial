const YahooFinance = require('yahoo-finance2').default;
const { fetchGlobalQuote } = require('../providers/alphavantage');
const prisma = require('../utils/prisma');
const logger = require('../utils/logger');
const { fetchHistoryForRange } = require('../utils/stockHistoryRange');
const yf = new YahooFinance();

/** @typedef {{ price:number,change:number,changePct:number,volume:number|null, mcap:number|null, pe:number|null, high52:number|null, low52:number|null, displayTicker:string, name:string, sector?:string|null, industry?:string|null }} QuoteFields */

async function quoteFromYahoo(ticker) {
  const quote = await yf.quote(ticker);
  const price = quote.regularMarketPrice;
  if (!Number.isFinite(price)) {
    throw new Error('Yahoo quote missing price');
  }
  return {
    price,
    change: quote.regularMarketChange ?? 0,
    changePct: quote.regularMarketChangePercent ?? 0,
    mcap: quote.marketCap ? Number(quote.marketCap) : null,
    pe: quote.trailingPE ?? null,
    high52: quote.fiftyTwoWeekHigh ?? null,
    low52: quote.fiftyTwoWeekLow ?? null,
    volume: quote.regularMarketVolume ?? null,
    displayTicker:
      ticker.replace(/\.NS$|\.BO$/i, '') ||
      (quote.symbol && String(quote.symbol).includes(':')
        ? String(quote.symbol).split(':').pop()
        : quote.symbol),
    name: quote.shortName || quote.longName || ticker,
    sector: null,
    industry: null,
    source: 'yahoo',
  };
}

async function fetchBestEffortQuote(ticker) {
  const avKey = process.env.ALPHAVANTAGE_API_KEY;
  if (avKey && avKey.trim()) {
    try {
      const q = await fetchGlobalQuote(avKey.trim(), ticker);
      if (q && Number.isFinite(q.price)) return q;
    } catch (e) {
      logger.warn('Alpha Vantage fetch failed', { ticker, error: e.message });
    }
  }

  try {
    return await quoteFromYahoo(ticker);
  } catch (e) {
    logger.warn('Yahoo Finance fetch failed', { ticker, error: e.message });
    return null;
  }
}

/** Persist snapshot; updates only overwrite fields present on the quote (AV has no PE, etc.). */
async function persistQuoteUpdate(ticker, q) {
  if (!q || !Number.isFinite(q.price)) return;

  const existing = await prisma.stock.findUnique({ where: { ticker } });

  if (!existing) {
    await prisma.stock.create({
      data: {
        ticker,
        displayTicker: q.displayTicker || ticker.replace(/\.NS$|\.BO$/i, ''),
        name: q.name || q.displayTicker || ticker,
        sector: q.sector || 'Unknown',
        industry: q.industry ?? null,
        price: q.price,
        change: q.change ?? 0,
        changePct: q.changePct ?? 0,
        mcap: q.mcap ?? null,
        pe: q.pe ?? null,
        high52: q.high52 ?? null,
        low52: q.low52 ?? null,
        volume: q.volume ?? null,
      },
    });
    return;
  }

  await prisma.stock.update({
    where: { ticker },
    data: {
      price: q.price,
      change: q.change ?? 0,
      changePct: q.changePct ?? 0,
      ...(q.volume != null && Number.isFinite(q.volume) ? { volume: q.volume } : {}),
      ...(q.mcap != null && Number.isFinite(q.mcap) ? { mcap: q.mcap } : {}),
      ...(q.pe != null && Number.isFinite(q.pe) ? { pe: q.pe } : {}),
      ...(q.high52 != null && Number.isFinite(q.high52) ? { high52: q.high52 } : {}),
      ...(q.low52 != null && Number.isFinite(q.low52) ? { low52: q.low52 } : {}),
      lastUpdated: new Date(),
    },
  });
}

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { changePct: 'desc' },
      take: 50,
      include: {
        signals: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      }
    });

    const result = stocks.map((s) => ({
      ...s,
      latestSignal: s.signals[0] || null,
      signals: undefined,
    }));

    res.json(result);
  } catch (error) {
    logger.error('getAllStocks error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

exports.getStock = async (req, res) => {
  try {
    const { ticker } = req.params;

    const q = await fetchBestEffortQuote(ticker);
    if (q) {
      await persistQuoteUpdate(ticker, q);
    }

    const stock = await prisma.stock.findUnique({ where: { ticker } });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const range = req.query.range || '2y';
    const { history, interval, range: resolvedRange } = await fetchHistoryForRange(
      stock.id,
      ticker,
      range,
    );

    const latestSignal = await prisma.signal.findFirst({
      where: { stockId: stock.id },
      orderBy: { createdAt: 'desc' },
    });

    res.set('Cache-Control', 'no-store');
    res.json({
      ...stock,
      history,
      historyRange: resolvedRange,
      historyInterval: interval,
      latestSignal,
    });
  } catch (error) {
    logger.error('getStock error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

exports.getStockByTicker = async (req, res) => {
  const { ticker } = req.params;
  req.params.ticker = decodeURIComponent(ticker);
  return exports.getStock(req, res);
};
