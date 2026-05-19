/**
 * Map app chart rows to TradingView Lightweight Charts series data.
 */

import { isUTCTimestamp, TickMarkType } from 'lightweight-charts';

const IST = 'Asia/Kolkata';

const istHmFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** HH:mm in IST from unix seconds (chart axis / crosshair). */
export function formatIstHmFromUnix(unixSec) {
  return istHmFormatter.format(new Date(unixSec * 1000));
}

function toTime(row, interval) {
  if (interval === 'intraday' && row.time != null && Number.isFinite(Number(row.time))) {
    return Number(row.time);
  }

  const dt = row.rawDate instanceof Date ? row.rawDate : new Date(row.date);
  if (Number.isNaN(dt.getTime())) return null;

  if (interval === 'intraday') {
    return Math.floor(dt.getTime() / 1000);
  }
  return dt.toISOString().slice(0, 10);
}

/**
 * @param {Array<{ date: string, time?: number, open, high, low, close, volume?, rawDate? }>} chartData
 * @param {'1d'|'intraday'} [interval]
 */
export function toLwcCandles(chartData, interval = '1d') {
  const seen = new Set();
  const out = [];

  for (const row of chartData || []) {
    if (!row || !Number.isFinite(row.close)) continue;
    const time = toTime(row, interval);
    if (time == null || seen.has(time)) continue;
    seen.add(time);
    out.push({
      time,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
    });
  }

  out.sort((a, b) => {
    if (typeof a.time === 'number' && typeof b.time === 'number') return a.time - b.time;
    return String(a.time).localeCompare(String(b.time));
  });

  return out;
}

/**
 * @param {Array} chartData
 * @param {'1d'|'intraday'} [interval]
 */
export function toLwcVolume(chartData, interval = '1d') {
  const seen = new Set();
  const out = [];

  for (const row of chartData || []) {
    if (!row || !Number.isFinite(row.close)) continue;
    const time = toTime(row, interval);
    if (time == null || seen.has(time)) continue;
    seen.add(time);
    const vol = Number(row.volume);
    out.push({
      time,
      value: Number.isFinite(vol) ? vol : 0,
      color: row.close >= row.open ? 'rgba(22,163,74,0.45)' : 'rgba(220,38,38,0.45)',
    });
  }

  out.sort((a, b) => {
    if (typeof a.time === 'number' && typeof b.time === 'number') return a.time - b.time;
    return String(a.time).localeCompare(String(b.time));
  });

  return out;
}

/** Format unix seconds for tooltips / labels in IST. */
export function formatIstFromUnix(unixSec) {
  return formatIstHmFromUnix(unixSec);
}

/** Crosshair time label (LWC localization.timeFormatter). */
export function createIstTimeFormatter() {
  return (time) => {
    if (typeof time === 'number') {
      return formatIstHmFromUnix(time);
    }
    return null;
  };
}

/** X-axis tick labels — timeFormatter does not affect these in LWC v5. */
export function createIstTickMarkFormatter() {
  return (time, tickMarkType) => {
    if (!isUTCTimestamp(time)) return null;
    if (
      tickMarkType === TickMarkType.Time
      || tickMarkType === TickMarkType.TimeWithSeconds
    ) {
      return formatIstHmFromUnix(time);
    }
    return null;
  };
}

export { IST };
