import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CACHE_TTL_MS,
  clearDashboardCache,
  hasDashboardContent,
  isDashboardCacheFresh,
  setDashboardCache,
} from './dashboardCache';

describe('dashboardCache', () => {
  beforeEach(() => {
    clearDashboardCache();
    vi.useRealTimers();
  });

  it('is fresh within TTL for same user', () => {
    setDashboardCache({ userId: 'u1', trendingTickers: [{ tickerFull: 'X' }] });
    expect(isDashboardCacheFresh('u1')).toBe(true);
  });

  it('is stale after TTL', () => {
    vi.useFakeTimers();
    setDashboardCache({ userId: 'u1', signals: [{ id: '1' }] });
    vi.advanceTimersByTime(CACHE_TTL_MS + 1);
    expect(isDashboardCacheFresh('u1')).toBe(false);
  });

  it('tracks populated dashboard content', () => {
    setDashboardCache({ userId: 'u1', signals: [{}] });
    expect(hasDashboardContent()).toBe(true);
    clearDashboardCache();
    expect(hasDashboardContent()).toBe(false);
  });
});
