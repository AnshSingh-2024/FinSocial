/** Indian market (NSE/BSE) timezone helpers. */

const IST = 'Asia/Kolkata';

function isIndianTicker(ticker) {
  if (!ticker || typeof ticker !== 'string') return false;
  const t = ticker.toUpperCase();
  return t.endsWith('.NS') || t.endsWith('.BO') || t.startsWith('NSE:') || t.startsWith('BSE:');
}

/**
 * Calendar day in IST (YYYY-MM-DD) for grouping intraday sessions.
 * @param {Date|string|number} d
 */
function marketDayKey(d, ticker) {
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  if (isIndianTicker(ticker)) {
    return date.toLocaleDateString('en-CA', { timeZone: IST });
  }
  return date.toISOString().slice(0, 10);
}

/**
 * Parse vendor datetime strings into a correct instant.
 * AV intraday for NSE is exchange-local time without a TZ suffix.
 * @param {string} ts
 * @param {string} [ticker]
 */
function parseMarketDateTime(ts, ticker) {
  if (!ts) return new Date(NaN);
  const raw = String(ts).trim();

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(raw)) {
    const normalized = raw.length === 16 ? `${raw}:00` : raw;
    if (isIndianTicker(ticker)) {
      return new Date(`${normalized.replace(' ', 'T')}+05:30`);
    }
    return new Date(`${normalized.replace(' ', 'T')}Z`);
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw)) {
    if (isIndianTicker(ticker)) {
      return new Date(`${raw}+05:30`);
    }
    return new Date(`${raw}Z`);
  }

  return new Date(raw);
}

/**
 * @param {{ date: Date, open, high, low, close, volume }} bar
 */
function serializeHistoryBar(bar) {
  return {
    date: bar.date instanceof Date ? bar.date.toISOString() : bar.date,
    time: bar.date instanceof Date ? Math.floor(bar.date.getTime() / 1000) : undefined,
    open: bar.open,
    high: bar.high,
    low: bar.low,
    close: bar.close,
    volume: bar.volume ?? 0,
  };
}

module.exports = {
  IST,
  isIndianTicker,
  marketDayKey,
  parseMarketDateTime,
  serializeHistoryBar,
};
