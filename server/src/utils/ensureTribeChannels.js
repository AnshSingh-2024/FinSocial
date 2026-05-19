const prisma = require('./prisma');
const logger = require('./logger');

const DEFAULT_TRIBE_CHANNELS = [
  { name: "Beginner's Lounge", slug: 'beginners-lounge', description: 'Ask any question, no matter how basic. No judgment here!', type: 'text' },
  { name: 'IPO Watch', slug: 'ipo-watch', description: 'Discuss upcoming IPOs, GMP, subscriptions, and allotment tips.', type: 'text' },
  { name: 'Sector Spotlight', slug: 'sector-spotlight', description: 'IT, Pharma, Banking, FMCG, and beyond. Deep sector analysis.', type: 'text' },
  { name: 'Platform Help', slug: 'platform-help', description: 'Understand FinSocial features and navigate your portfolio.', type: 'text' },
  { name: 'Mutual Funds Corner', slug: 'mutual-funds', description: 'SIPs, index funds, and long-term investing strategies.', type: 'text' },
];

async function ensureTribeChannels() {
  for (const c of DEFAULT_TRIBE_CHANNELS) {
    await prisma.tribeChannel.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
}

/** Idempotent — safe on every boot and when channels table is empty. */
async function ensureTribeChannelsIfNeeded() {
  const count = await prisma.tribeChannel.count();
  if (count > 0) return count;
  await ensureTribeChannels();
  const after = await prisma.tribeChannel.count();
  logger.info('Default tribe channels created', { count: after });
  return after;
}

module.exports = { ensureTribeChannels, ensureTribeChannelsIfNeeded, DEFAULT_TRIBE_CHANNELS };
