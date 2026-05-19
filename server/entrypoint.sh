#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Cleaning up legacy tables if present..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    await p.\$executeRawUnsafe('DROP TABLE IF EXISTS langchain_pg_embedding CASCADE');
    await p.\$executeRawUnsafe('DROP TABLE IF EXISTS langchain_pg_collection CASCADE');
    console.log('Legacy langchain tables dropped (if existed)');
  } catch(e) { console.log('Skip legacy cleanup:', e.message); }
  await p.\$disconnect();
})();
"

echo "Applying database schema..."
npx prisma db push --skip-generate

echo "Ensuring default tribe channels (no Render Shell / seed required)..."
node -e "
require('dotenv').config();
const { ensureTribeChannelsIfNeeded } = require('./src/utils/ensureTribeChannels');
ensureTribeChannelsIfNeeded()
  .then((n) => { console.log('Tribe channels ready:', n); })
  .catch((e) => { console.warn('Tribe channel ensure skipped:', e.message); });
"

echo "Starting server..."
exec node server.js
