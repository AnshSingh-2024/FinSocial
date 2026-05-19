/**
 * Alpha Vantage market data (rate limits apply on free tier).
 */
const axios = require('axios');
const logger = require('../utils/logger');
const { parseMarketDateTime } = require('../utils/marketTime');

const AV_BASE = 'https://www.alphavantage.co/query';

/** @typedef {{ price:number,change:number,changePct:number,volume:number|null, displayTicker:string, name:string, source:string }} NormalizedQuote */
/** @typedef {{ date: Date, open: number, high: number, low: number, close: number, volume: number }} OhlcBar */

/**
 * RELIANCE.NS → NSE:RELIANCE, FOO.BO → BSE:FOO, otherwise uppercased ticker.
 */
function tickerToAlphaSymbol(ticker) {
  if (!ticker) return ticker;
  const t = ticker.toUpperCase().trim();
  if (t.endsWith('.NS')) return `NSE:${t.slice(0, -3)}`;
  if (t.endsWith('.BO')) return `BSE:${t.slice(0, -3)}`;
  return t;
}

function getApiKey() {
  const k = process.env.ALPHAVANTAGE_API_KEY;
  return k && String(k).trim() ? String(k).trim() : null;
}

/**
 * @param {object} data
 * @returns {boolean}
 */
function isAvThrottled(data) {
  if (!data || typeof data !== 'object') return true;
  if (data.Note || data.Information || data['Error Message']) return true;
  return false;
}

/**
 * @param {object} data
 * @returns {string|null}
 */
function findTimeSeriesKey(data) {
  if (!data || typeof data !== 'object') return null;
  return Object.keys(data).find((k) => k.toLowerCase().includes('time series')) || null;
}

/**
 * @param {Record<string, Record<string, string>>} series
 * @returns {OhlcBar[]}
 */
function parseTimeSeriesObject(series, ticker) {
  if (!series || typeof series !== 'object') return [];

  const bars = Object.entries(series)
    .map(([ts, row]) => {
      const open = parseFloat(row['1. open'] ?? row.open);
      const high = parseFloat(row['2. high'] ?? row.high);
      const low = parseFloat(row['3. low'] ?? row.low);
      const close = parseFloat(row['4. close'] ?? row.close);
      const vol = parseFloat(row['5. volume'] ?? row.volume ?? '0');
      if (!Number.isFinite(close)) return null;
      const date = parseMarketDateTime(ts, ticker);
      if (Number.isNaN(date.getTime())) return null;
      return {
        date,
        open: Number.isFinite(open) ? open : close,
        high: Number.isFinite(high) ? high : close,
        low: Number.isFinite(low) ? low : close,
        close,
        volume: Number.isFinite(vol) ? vol : 0,
      };
    })
    .filter(Boolean);

  bars.sort((a, b) => a.date - b.date);
  return bars;
}

async function queryAlphaVantage(params, apiKeyOverride = null) {
  const apiKey = apiKeyOverride || getApiKey();
  if (!apiKey) return null;

  const { data } = await axios.get(AV_BASE, {
    params: { ...params, apikey: apiKey },
    timeout: 25000,
    validateStatus: () => true,
  });

  if (isAvThrottled(data)) {
    const msg = data?.Note || data?.Information || data?.['Error Message'];
    logger.warn('Alpha Vantage throttled or error', {
      function: params.function,
      symbol: params.symbol,
      msg: msg ? String(msg).slice(0, 160) : 'unknown',
    });
    return null;
  }

  return data;
}

/**
 * @returns {NormalizedQuote|null}
 */
async function fetchGlobalQuote(apiKey, ticker) {
  const symbol = tickerToAlphaSymbol(ticker);
  const data = await queryAlphaVantage({
    function: 'GLOBAL_QUOTE',
    symbol,
  }, apiKey);
  if (!data) return null;

  const q = data['Global Quote'];
  if (!q || typeof q !== 'object' || !q['05. price']) return null;

  const price = parseFloat(q['05. price']);
  const change = parseFloat(q['09. change'] || '0');
  const volRaw = q['06. volume'];
  const volume = volRaw !== undefined && volRaw !== null && volRaw !== ''
    ? parseFloat(volRaw)
    : null;

  let changePct = 0;
  const pctStr = q['10. change percent'];
  if (pctStr !== undefined && pctStr !== null) {
    changePct = parseFloat(String(pctStr).replace('%', '').trim());
    if (!Number.isFinite(changePct)) changePct = 0;
  }

  const avSymbol = (q['01. symbol'] || symbol).trim();
  const displayPart = avSymbol.includes(':') ? avSymbol.split(':')[1] : avSymbol;

  return {
    price: Number.isFinite(price) ? price : 0,
    change: Number.isFinite(change) ? change : 0,
    changePct: Number.isFinite(changePct) ? changePct : 0,
    volume: volume !== null && Number.isFinite(volume) ? volume : null,
    displayTicker: displayPart || ticker.split('.')[0],
    name: displayPart || ticker,
    source: 'alphavantage',
  };
}

/**
 * @param {string} ticker
 * @param {'5min'|'15min'|'30min'|'60min'} [interval]
 * @returns {Promise<OhlcBar[]|null>}
 */
async function fetchIntradaySeries(ticker, interval = '5min') {
  const symbol = tickerToAlphaSymbol(ticker);
  const data = await queryAlphaVantage({
    function: 'TIME_SERIES_INTRADAY',
    symbol,
    interval,
    outputsize: 'compact',
    extended_hours: 'false',
  });
  if (!data) return null;

  const key = findTimeSeriesKey(data);
  if (!key) return null;
  return parseTimeSeriesObject(data[key], ticker);
}

/**
 * @param {string} ticker
 * @param {'compact'|'full'} [outputsize]
 * @returns {Promise<OhlcBar[]|null>}
 */
async function fetchDailySeries(ticker, outputsize = 'full') {
  const symbol = tickerToAlphaSymbol(ticker);
  const data = await queryAlphaVantage({
    function: 'TIME_SERIES_DAILY_ADJUSTED',
    symbol,
    outputsize,
  });
  if (!data) return null;

  const key = findTimeSeriesKey(data);
  if (!key) return null;
  return parseTimeSeriesObject(data[key], ticker);
}

module.exports = {
  tickerToAlphaSymbol,
  getApiKey,
  fetchGlobalQuote,
  fetchIntradaySeries,
  fetchDailySeries,
};
