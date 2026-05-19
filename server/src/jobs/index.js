const Queue = require('bull');
const { getRedisUrl } = require('../utils/redisUrl');

const redisUrl = getRedisUrl();

const feedQueue = new Queue('feed-updates', redisUrl);
const leaderboardQueue = new Queue('leaderboard-updates', redisUrl);
const signalQueue = new Queue('signal-updates', redisUrl);
const notificationQueue = new Queue('notifications', redisUrl);

const setupJobs = async () => {
  // Drop stale repeatables (e.g. old */15 cron) so only the 5-minute schedule runs
  const repeatable = await signalQueue.getRepeatableJobs();
  await Promise.all(repeatable.map((j) => signalQueue.removeRepeatableByKey(j.key)));

  // Refresh ML signals every 5 minutes
  signalQueue.add({}, { repeat: { cron: '*/5 * * * *' } });

  // Refresh leaderboard every 1 hour
  leaderboardQueue.add({}, { repeat: { cron: '0 * * * *' } });

  // Fetch news every 30 minutes + once shortly after startup
  feedQueue.add({ type: 'fetch_news' }, { repeat: { cron: '*/30 * * * *' } });
  feedQueue.add({ type: 'fetch_news' }, { delay: 8000 });

  // Rotate stock quotes (AV rate-limit friendly: small batch per run)
  feedQueue.add({ type: 'refresh_quotes' }, { repeat: { cron: '*/5 * * * *' } });

  // Daily AI Stock Pick at 9 AM IST (3:30 AM UTC)
  feedQueue.add({ type: 'daily_pick' }, { repeat: { cron: '30 3 * * *' } });

  // One symbol per hour — full universe over ~2 days on free AV tier
  feedQueue.add({ type: 'refresh_daily_history' }, { repeat: { cron: '15 * * * *' } });

  console.log('Background jobs initialized.');
};

module.exports = {
  feedQueue,
  leaderboardQueue,
  signalQueue,
  notificationQueue,
  setupJobs,
};
