/** ~Trading-day bar limits (must match server TRADING_DAY_TAKE). */
export const RANGE_BAR_LIMITS = {
  '1d': 1,
  '1w': 7,
  '1m': 22,
  '3m': 66,
  '1y': 252,
  '2y': 560,
};

const RANGE_LOOKBACK_DAYS = {
  '1d': 2,
  '1w': 10,
  '1m': 35,
  '3m': 100,
  '1y': 380,
  '2y': 760,
};

function dayKey(d) {
  return new Date(d.date || d).toISOString().slice(0, 10);
}

/** Trim history to the selected range (daily bars by count; intraday unchanged). */
export function applyChartRange(history = [], range = '2y', interval = '1d') {
  if (!history?.length) return [];
  if (interval === 'intraday') return history;
  const limit = RANGE_BAR_LIMITS[range] ?? RANGE_BAR_LIMITS['2y'];
  return history.slice(-limit);
}

/** Slice daily/intraday rows ending at endDate (inclusive) — Time Machine. */
export function sliceHistoryForRange(history = [], range = '2y', endDate = null) {
  if (!history.length) return [];
  const lookback = RANGE_LOOKBACK_DAYS[range] ?? RANGE_LOOKBACK_DAYS['2y'];
  const end = endDate ? new Date(`${endDate}T23:59:59`) : new Date(history[history.length - 1].date);
  const start = new Date(end);
  start.setDate(start.getDate() - lookback);

  let sliced = history.filter((d) => {
    const dt = new Date(d.date);
    return dt >= start && dt <= end;
  });

  const limit = RANGE_BAR_LIMITS[range];
  if (limit && sliced.length > limit) {
    sliced = sliced.slice(-limit);
  }

  if (range === '1d' && sliced.length > 1) {
    const lastKey = dayKey(sliced[sliced.length - 1]);
    const session = sliced.filter((d) => dayKey(d) === lastKey);
    if (session.length > 1) return session;
    return sliced.slice(-1);
  }

  return sliced;
}

/** Map API history rows to CandlestickChart data points. */
export function mapHistoryToChartData(history = [], interval = '1d') {
  const intraday = interval === 'intraday';
  return (history || [])
    .filter((d) => d && Number.isFinite(d.close))
    .map((d) => {
      const dt = new Date(d.date);
      const date = intraday
        ? dt.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
        : dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      return {
        date,
        open: d.open,
        close: d.close,
        high: d.high,
        low: d.low,
        rawDate: dt,
      };
    });
}

/** Build chart points for a range from raw API history. */
export function historyToChartData(history, range, interval = '1d') {
  return mapHistoryToChartData(applyChartRange(history, range, interval), interval);
}
