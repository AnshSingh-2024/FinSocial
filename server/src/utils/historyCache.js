/** In-memory TTL cache for intraday history (per server process). */

const store = new Map();

const DEFAULT_TTL_MS = 90_000;

/**
 * @param {string} key
 * @returns {*|null}
 */
function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * @param {string} key
 * @param {*} value
 * @param {number} [ttlMs]
 */
function set(key, value, ttlMs = DEFAULT_TTL_MS) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

module.exports = { get, set, DEFAULT_TTL_MS };
