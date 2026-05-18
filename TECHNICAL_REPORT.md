# FinSocial — Technical Report & Fix Plan

> Generated: 18 May 2026 | Based on full codebase audit

---

## 1. What We're Building

**FinSocial** is a community-driven simulated brokerage platform for web (and future mobile). It combines virtual stock trading on Indian markets (NSE/BSE) with social features that make investing collaborative rather than isolated.

### Core Value Proposition
Retail investors—especially beginners—discover what peers are trading, exchange signals, ask questions, and learn from experienced traders, all within a single platform powered by collective intelligence.

### Target Users
- First-time investors needing guidance
- Intermediate traders looking for community consensus
- Experienced traders willing to mentor and share signals

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX (:9999)                        │
│   Static SPA (React)  │  /api/* → core-api  │  /ai/* → genai│
│                       │  /ml/* → ml-service  │  WebSocket ↑  │
└────────────────────────┬───────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌──────▼──────┐   ┌────▼─────┐
   │ core-api │    │ ml-service  │   │ gen-ai   │
   │ (Node/  │    │ (Flask)     │   │ (FastAPI)│
   │ Express)│    │ XGBoost +   │   │ Gemini + │
   │ :5000   │    │ FinBERT     │   │ pgvector │
   └────┬────┘    │ :5001       │   │ :5002    │
        │         └──────┬──────┘   └────┬─────┘
        │                │               │
   ┌────▼────┐     ┌─────▼───────────────▼────┐
   │  Redis  │     │     PostgreSQL + pgvector │
   │ (Bull)  │     │     (shared DB)           │
   └─────────┘     └──────────────────────────┘
```

### Service Responsibilities

| Service | Tech | Role |
|---------|------|------|
| **core-api** | Node 20, Express 5, Prisma, Bull, Socket.IO | Auth, CRUD, trades, portfolio, forum, tribe chat, notifications, job scheduling |
| **ml-service** | Python 3.10, Flask, XGBoost, FinBERT | Stock predictions (/predict), portfolio optimization (/optimize), batch sentiment |
| **gen-ai-service** | Python 3.10, FastAPI, Google Gemini, sentence-transformers | FinBot chat, Q&A AI suggestions, news summarization, tribe bot |
| **nginx** | Nginx 1.25 | Reverse proxy, static SPA hosting, rate limiting, WebSocket upgrade |
| **PostgreSQL** | pgvector/pgvector:pg16 | Relational data + vector embeddings for RAG |
| **Redis** | Redis 7 | Bull job queue (signals, leaderboard, feed, notifications) |

### Frontend Stack
React 19 + Vite + Tailwind CSS 4 + Zustand + Socket.IO Client + Recharts + Custom SVG Candlestick Chart

---

## 3. Feature Inventory

### Must-Have (from guidelines)

| Feature | Status | Notes |
|---------|--------|-------|
| JWT auth (register/login) | ✅ Working | Missing input validation, no refresh tokens |
| Community Feed | ⚠️ Partial | Backend exists; frontend shows feed items but real-time updates depend on socket |
| Signal Board (BUY/SELL + confidence + reasoning) | ✅ Working | ML predictions with real technicals from seeded data |
| 5 Tribe Rooms with real-time chat | ❌ Broken | Socket payload field mismatch (`content` vs `message`) — messages don't display |
| Q&A Forum with upvotes/replies | ✅ Working | Voting, AI suggestions functional |
| Virtual Portfolio (buy/sell/P&L) | ✅ Working | P&L calc has edge cases (division by zero) |
| Responsive UI | ✅ Working | Mobile sidebar, responsive grid |

### Good-to-Have

| Feature | Status | Notes |
|---------|--------|-------|
| Leaderboard | ✅ Working | Seeded snapshots; worker computes from trades |
| AI-assisted Q&A replies | ⚠️ Partial | Depends on Gemini key being configured correctly |
| Push notifications | ⚠️ Partial | Backend infrastructure exists but `notificationQueue.add` never called |
| Verified trader badges | ✅ Working | `isVerified` field + UI badge |

### Creative Additions

| Feature | Status | Notes |
|---------|--------|-------|
| Copy Trading | ✅ Working | `parentTradeId` provenance |
| Trade Reasoning Tags | ✅ Working | Optional `reason` field |
| Time Machine Replay | ⚠️ Bug | Division by zero when `daysBetween === 0` |
| Daily AI Stock Pick | ❌ Dead | Job scheduled but worker never processes it |
| Mentor Match / Social Follow | ✅ Working | Follow/unfollow + mentor list |
| Tribe Polls | ⚠️ Partial | Backend works; frontend never subscribes to poll socket events |
| FinBot Chatbot | ⚠️ Partial | Works if Gemini key configured; falls back to canned responses otherwise |
| Candlestick Charts | ✅ Working | Custom SVG OHLC component |
| Sentiment Meter | ✅ Working | Per-stock community voting |

---

## 4. Critical Issues (Must Fix)

These prevent core features from working:

| # | Area | Issue | Impact |
|---|------|-------|--------|
| 1 | **Tribe Chat** | Client sends `{ roomId, content }` but server expects `{ roomId, message }` | **Chat messages never persist or display** |
| 2 | **Tribe Chat** | Server emits `receive_message` with field `message`; client renders `msg.content` | **Socket-delivered messages show as empty bubbles** |
| 3 | **NotificationPanel** | Calls `setUnreadCount(c => c-1)` but store's setter is not a functional updater | **Badge count breaks or stores a function** |
| 4 | **ml-service Dockerfile** | Healthcheck uses `curl` but image never installs it | **Container stays unhealthy in Compose** |
| 5 | **entrypoint.sh** | Runs `prisma db push --accept-data-loss` on every boot | **Production data loss risk** |
| 6 | **Stock History** | `orderBy: asc, take: 365` returns oldest 365 rows, not latest | **Charts show wrong time range** |
| 7 | **Daily AI Stock Pick** | Job scheduled but no processor handles `type === 'daily_pick'` | **Dead feature, silent failure** |

---

## 5. High-Severity Issues

| # | Area | Issue |
|---|------|-------|
| 8 | **Socket auth** | `join_room` accepts arbitrary room IDs with no channel existence/membership check |
| 9 | **Notifications** | IDOR: any user can mark any notification read by guessing UUID |
| 10 | **Auth** | No input validation on register/login (missing email/password → 500 not 400) |
| 11 | **Shared Socket** | `useSocket` never disconnects on logout; old JWT stays on wire |
| 12 | **Tribe** | Creates duplicate Socket.IO connection (page-level `io()` + global `useSocket`) |
| 13 | **Portfolio** | No null-guard on `user` in `getPortfolio` (deleted user → crash) |
| 14 | **TimeMachine** | `365 / daysBetween` when daysBetween=0 → Infinity/NaN displayed |
| 15 | **PrismaClient** | 10+ separate `new PrismaClient()` instances → DB connection exhaustion |
| 16 | **Docker** | `env_file` references `.env` files that don't exist on fresh clone → Compose fails |
| 17 | **Security** | ML and Gen-AI endpoints have no authentication (cost exposure if reachable) |
| 18 | **feedController** | `distinct: ['stockId']` with non-matching `orderBy` → potential SQL errors |
| 19 | **notificationQueue** | Worker defined but nothing ever adds jobs to it (dead code) |
| 20 | **Stocks filter** | `s.name.toLowerCase()` with no null guard → page crash |

---

## 6. Medium-Severity Issues (Summary)

- **Logger** in production only writes to files (no stdout for Docker/k8s)
- **Bull** has no Redis password/TLS support
- **CORS error** handling returns unclear errors (not JSON)
- **Forum** references undefined CSS class `forum-q-card`
- **Tribe** `skeleton` class not in CSS
- **Portfolio** P&L divides by `averageCost` without zero-guard
- **Social** follow-self not properly blocked (type mismatch)
- **Polls** have race conditions on concurrent votes (JSON field mutation)
- **Leaderboard** "win rate" logic is non-obvious and likely incorrect
- **Nginx** doesn't wait for ml/gen-ai before starting (502s on cold start)
- **CI/CD** tests install minimal deps (not full requirements.txt)
- **Vercel deploy** expects `/api` rewrites that aren't configured
- **torch** version ambiguity between Dockerfile and requirements.txt
- **Two embedding models** loaded in gen-ai (doubles memory)

---

## 7. Fix Plan (Prioritized)

### Phase 1: Make Core Features Work (Critical)

| Task | Files | Effort |
|------|-------|--------|
| Fix Tribe socket payload: client sends `message` field, reads `message` from server | `client/src/pages/Tribe.jsx`, `server/src/socket.js` | 30 min |
| Fix NotificationPanel: use store getter pattern correctly | `client/src/components/NotificationPanel.jsx`, `client/src/store/index.js` | 15 min |
| Fix stock history query: `orderBy desc, take 365, then reverse` | `server/src/controllers/stocksController.js` | 5 min |
| Install `curl` in ml-service Dockerfile | `ml-service/Dockerfile` | 2 min |
| Fix daily_pick worker: add processor case or remove scheduled job | `server/src/jobs/workers.js` or `index.js` | 15 min |
| Fix TimeMachine division by zero | `client/src/pages/TimeMachine.jsx` | 5 min |
| Fix entrypoint: use `migrate deploy` (not `db push`) or conditional logic | `server/entrypoint.sh` | 10 min |

### Phase 2: Security & Stability (High)

| Task | Files | Effort |
|------|-------|--------|
| Add Zod validation to auth register/login | `server/src/controllers/authController.js` | 30 min |
| Fix notification IDOR (scope by userId) | `server/src/controllers/notificationsController.js` | 5 min |
| Socket: validate channel exists before `join_room` | `server/src/socket.js` | 15 min |
| Fix shared socket lifecycle (disconnect on logout, reconnect on login) | `client/src/hooks/useSocket.js` | 30 min |
| Remove duplicate socket connection in Tribe.jsx | `client/src/pages/Tribe.jsx` | 20 min |
| Create shared PrismaClient singleton | `server/src/utils/prisma.js` + all controllers | 45 min |
| Add null guard in getPortfolio | `server/src/controllers/portfolioController.js` | 5 min |
| Add null guard in stocks filter | `client/src/pages/Stocks.jsx` | 2 min |
| Create `.env` files from `.env.example` in Docker build or document clearly | `docker-compose.yml` + README | 15 min |
| Wire notificationQueue.add in trade/signal flows | `server/src/controllers/tradesController.js`, `workers.js` | 30 min |

### Phase 3: Polish & UX (Medium)

| Task | Effort |
|------|--------|
| Add loading/error states to Home, Portfolio, Stocks pages | 1 hr |
| Fix forum/tribe CSS classes (add missing definitions) | 20 min |
| Logger: add Console transport for Docker | 10 min |
| Add `depends_on` for ml/gen-ai in Compose | 5 min |
| Fix leaderboard win-rate logic | 30 min |
| Add poll socket subscriptions in Tribe.jsx | 30 min |
| Keyboard/a11y: ESC to close modals, aria-labels on icon buttons | 1 hr |
| Fix `withCredentials` / CORS interaction | 10 min |
| Add proper error boundaries in React | 30 min |
| Remove dead `App.css`, unused `cookie-parser` | 5 min |

### Phase 4: Production Hardening

| Task | Effort |
|------|--------|
| Pin Docker base image digests for reproducibility | 15 min |
| Add `USER node` to server Dockerfile (non-root) | 5 min |
| Use `npm ci` instead of `npm install` in Dockerfiles | 5 min |
| Add Redis password support to Bull config | 15 min |
| CI: install full requirements.txt in test jobs | 15 min |
| Add auth middleware to internal Python services (or restrict to Docker network only) | 30 min |
| Vercel: configure `/api` rewrites or switch to nginx-only deploy | 30 min |
| Deduplicate sentence-transformer loading in gen-ai | 20 min |
| Pin torch CPU in requirements.txt (not just Dockerfile) | 5 min |

---

## 8. Quick Wins (< 5 minutes each)

1. `ml-service/Dockerfile`: add `curl` to apt-get line
2. `stocksController.js` line 140: change to `orderBy: { date: 'desc' }, take: 365` then `.reverse()`
3. `notificationsController.js`: add `userId: req.user.userId` to `markRead` where clause
4. `TimeMachine.jsx`: guard `daysBetween === 0` before annualized calc
5. `Stocks.jsx`: add `(s.name || '').toLowerCase()` guard
6. `index.html`: change `<title>` to "FinSocial"
7. Remove `version: '3.8'` from `docker-compose.yml`

---

## 9. Current State Summary

| Metric | Value |
|--------|-------|
| Total services | 6 (nginx, core-api, ml, gen-ai, postgres, redis) |
| Database models | 16 (User, Stock, StockHistory, Trade, PortfolioHolding, Signal, FeedEvent, Notification, Follow, WatchlistItem, NewsArticle, LeaderboardSnapshot, TribeChannel, ChatMessage, TribePoll, Document) |
| API routes | ~40 endpoints across 12 route files |
| Frontend pages | 8 (Auth, Home, Stocks, Portfolio, Forum, ForumDetail, Tribe, TimeMachine) |
| Seeded data | 25 stocks, 4168 history rows, 8 users, 5 channels |
| Critical bugs | 7 |
| High-severity issues | 13 |
| Medium issues | ~25 |
| Estimated fix time (Phase 1+2) | ~5-6 hours |

---

## 10. Recommended Next Steps

1. **Fix Phase 1** (critical) — gets all core features demonstrably working
2. **Fix Phase 2** (security) — prevents embarrassing exploits in demo/judging
3. **Seed + verify** — run full docker compose, seed, and manually test each feature
4. **Record demo** — with working Tribe chat, FinBot, candlestick charts, and trades
5. **Phase 3-4** only if time permits before submission

---

*This document should be kept updated as fixes are applied.*
