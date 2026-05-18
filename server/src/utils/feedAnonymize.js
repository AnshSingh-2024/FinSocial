const crypto = require('crypto');

/** Stable pseudonym from user id — no real names in public feed. */
function pseudonymForUser(userId) {
  if (!userId) {
    return { label: 'Community member', initials: '?' };
  }
  const short = crypto.createHash('sha256').update(String(userId)).digest('hex').slice(0, 4).toUpperCase();
  return { label: `Trader #${short}`, initials: 'T' };
}

/**
 * Strip PII from a feed row for API / sockets.
 * @param {object} event - Prisma FeedEvent (may include user relation)
 * @param {string|null} viewerUserId - Authenticated viewer; own trades show as "You"
 */
function sanitizeFeedEvent(event, viewerUserId = null) {
  const isOwn = Boolean(viewerUserId && event.userId === viewerUserId);
  const actor = isOwn
    ? { label: 'You', initials: 'Y' }
    : pseudonymForUser(event.userId);

  return {
    id: event.id,
    type: event.type,
    payload: event.payload,
    createdAt: event.createdAt,
    actor,
    isOwn,
  };
}

module.exports = { sanitizeFeedEvent, pseudonymForUser };
