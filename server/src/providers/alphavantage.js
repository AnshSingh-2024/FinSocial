/**
 * Alpha Vantage GLOBAL_QUOTE (free tier friendly; rate limits apply — see upstream docs).
 */
const axios = require('axios');
const logger = require('../utils/logger');

/** @typedef {{ price:number,change:number,changePct:number,volume:number|null, displayTicker:string, name:string, source:string }} NormalizedQuote */

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

/**
 * @returns {NormalizedQuote|null}
 */
async function fetchGlobalQuote(apiKey, ticker) {
  const symbol = tickerToAlphaSymbol(ticker);
  const { data } = await axios.get('https://www.alphavantage.co/query', {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: apiKey,
    },
    timeout: 20000,
    validateStatus: () => true,
  });

  if (data.Note) {
    logger.warn('Alpha Vantage throttled (Note)', { ticker, note: String(data.Note).slice(0, 120) });
    return null;
  }
  if (data.Information) {
    logger.warn('Alpha Vantage notice', { ticker, info: String(data.Information).slice(0, 160) });
    return null;
  }

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

module.exports = { tickerToAlphaSymbol, fetchGlobalQuote };
