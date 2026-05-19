const STORAGE_PREFIX = 'finsocial_dashboard_chart';

function storageKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : `${STORAGE_PREFIX}_guest`;
}

export function loadDashboardChartTicker(userId, fallback = 'RELIANCE.NS') {
  try {
    return localStorage.getItem(storageKey(userId)) || fallback;
  } catch {
    return fallback;
  }
}

export function saveDashboardChartTicker(userId, ticker) {
  try {
    if (!ticker) return;
    localStorage.setItem(storageKey(userId), ticker);
  } catch {
    /* quota / private mode */
  }
}
