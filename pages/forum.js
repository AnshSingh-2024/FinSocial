/* Q&A Forum — Stack Overflow inspired with answers */

const FORUM_QUESTIONS = [
  {
    id: 1, votes: 42, userVote: 0, answers: [
      { id: 101, user: 'Vikram Malhotra', av: 'VM', votes: 28, userVote: 0, accepted: true, time: '1 hour ago',
        text: 'For swing trading NIFTY options, I recommend **straddle-to-strangle adjustments**. Entry: buy ATM straddle on Monday morning. By Wednesday, if NIFTY moves 100+ points, convert to a strangle by booking profit on the winning leg and re-entering OTM.\n\nKey rules:\n• Always use weekly expiry, not monthly — better gamma\n• Keep position size under 5% of capital per trade\n• Set a hard stop-loss at 30% of premium paid\n• Avoid trading on Thursdays (expiry day theta crush)\n\nThis has given me ~60% win rate over the last 6 months with a 1.8:1 reward-to-risk ratio.' },
      { id: 102, user: 'Ananya Patel', av: 'AP', votes: 15, userVote: 0, accepted: false, time: '45 min ago',
        text: 'I use a simpler approach — **calendar spreads** on NIFTY. Buy the next month ATM call and sell the current week ATM call. You profit from the difference in theta decay rates.\n\nThe key advantage is that your risk is capped and you don\'t need to predict direction. Works best when VIX is between 12-16.' },
      { id: 103, user: 'Nikhil Kapoor', av: 'NK', votes: 8, userVote: 0, accepted: false, time: '30 min ago',
        text: 'Adding to Vikram\'s point — use the PUT-CALL ratio as a confirmation. If PCR is above 1.2, the market bias is bullish, so lean towards bull call spreads. If below 0.8, use bear put spreads. This filter alone improved my win rate by about 12%.' },
    ],
    title: 'What is the best strategy for swing trading NIFTY options?',
    excerpt: 'I\'ve been trying to swing trade NIFTY weekly options but keep getting burned by theta decay. Looking for strategies that work in the current volatility regime...',
    fullText: 'I\'ve been trying to swing trade NIFTY weekly options for the past 3 months but keep getting burned by theta decay. My typical approach has been buying ATM calls/puts and holding for 2-3 days, but the time decay is eating into my profits even when direction is correct.\n\nLooking for strategies that work in the current low-volatility regime (VIX around 12). Specifically:\n1. How do you manage theta decay on multi-day option holds?\n2. Are spreads better than directional bets in this environment?\n3. What position sizing rules do you follow?\n\nMy capital is around ₹5L dedicated to options trading. Appreciate any real-world experience sharing!',
    tags: ['options', 'nifty', 'swing-trading'], user: 'Rahul Sharma', time: '2 hours ago', views: 1240
  },
  {
    id: 2, votes: 38, userVote: 0, answers: [
      { id: 201, user: 'Ashmit K.', av: 'AK', votes: 22, userVote: 0, accepted: true, time: '3 hours ago',
        text: 'Great question! MACD divergence is indeed less reliable in small-caps due to lower liquidity and higher noise. Based on my backtesting on NSE data:\n\n**Minimum volume threshold**: 500K daily average volume. Below this, MACD signals have only ~45% accuracy. Above 1M volume, accuracy jumps to ~62%.\n\n**Best practices for Indian markets:**\n• Use MACD(8,21,5) instead of default (12,26,9) — faster response suits Indian market\'s higher volatility\n• Combine with ADX > 25 filter to avoid false signals in sideways markets\n• Divergence on weekly timeframe is more reliable than daily for mid/small caps\n• Always confirm with volume — divergence without volume increase is usually a false signal' },
      { id: 202, user: 'Ritu Gupta', av: 'RG', votes: 11, userVote: 0, accepted: false, time: '2 hours ago',
        text: 'I\'d also add that in Indian markets, hidden divergence is more actionable than regular divergence. Hidden bullish divergence (higher lows in price, lower lows in MACD) has a ~55% success rate vs ~48% for regular divergence. Backtest on NIFTY 500 stocks from 2020-2024.' },
    ],
    title: 'How to interpret MACD divergence signals in Indian markets?',
    excerpt: 'I notice MACD divergence signals seem less reliable in small-cap stocks. Is there a minimum volume threshold where these signals become meaningful?',
    fullText: 'I notice MACD divergence signals seem less reliable in small-cap stocks compared to large-caps. I\'ve been tracking divergences on the daily chart for about 6 months and my success rate is only about 40% on small-caps vs 58% on NIFTY 50 stocks.\n\nIs there a minimum volume threshold where these signals become meaningful? Also, should I adjust the default MACD parameters (12,26,9) for Indian markets which have different volatility characteristics compared to US markets?\n\nAny backtesting data or empirical evidence would be highly appreciated.',
    tags: ['technical-analysis', 'macd', 'indicators'], user: 'Priya Menon', time: '4 hours ago', views: 890
  },
  {
    id: 3, votes: 27, userVote: 0, answers: [
      { id: 301, user: 'Sneha Trivedi', av: 'ST', votes: 19, userVote: 0, accepted: false, time: '5 hours ago',
        text: 'The new tax rates for FY26:\n• **STCG** (held < 1 year): 20% (up from 15%)\n• **LTCG** (held > 1 year): 12.5% (up from 10%)\n• LTCG exemption limit: ₹1.25L (up from ₹1L)\n\nFor tax efficiency, consider:\n1. **Tax-loss harvesting** — sell losing positions before March 31 to offset gains\n2. **Hold winning positions > 1 year** when possible to get LTCG rates\n3. **Use ELSS funds** for Section 80C deduction + equity exposure\n4. **Debt allocation** through debt mutual funds (now taxed at slab rate, so less attractive)' },
      { id: 302, user: 'Deepak Rathi', av: 'DR', votes: 7, userVote: 0, accepted: false, time: '4 hours ago',
        text: 'One often-overlooked strategy: if you\'re a frequent trader, consider setting up an HUF (Hindu Undivided Family) for a separate ₹1.25L LTCG exemption. Effectively doubles your tax-free limit. Consult a CA for the setup — it\'s perfectly legal.' },
    ],
    title: 'Tax implications of short-term vs long-term equity gains in India (FY26)',
    excerpt: 'With the new tax regime changes, what\'s the most tax-efficient way to structure a portfolio? STCG is now 20% and LTCG is 12.5%...',
    fullText: 'With the new tax regime changes in Budget 2025, I\'m trying to restructure my portfolio for maximum tax efficiency. The key changes:\n\n• STCG tax increased from 15% to 20%\n• LTCG tax increased from 10% to 12.5%\n• LTCG exemption limit raised to ₹1.25L\n\nMy portfolio is roughly ₹30L with a mix of stocks, mutual funds, and some F&O trades. What\'s the most tax-efficient way to structure all of this? Should I shift more towards long-term holdings given the STCG increase?\n\nAlso, how does the new regime affect debt mutual fund taxation?',
    tags: ['taxation', 'india', 'portfolio'], user: 'Vikram Malhotra', time: '6 hours ago', views: 2100
  },
  {
    id: 4, votes: 19, userVote: 0, answers: [
      { id: 401, user: 'Ashmit K.', av: 'AK', votes: 14, userVote: 0, accepted: true, time: '7 hours ago',
        text: 'I\'ve benchmarked both extensively on NSE data (NIFTY 50 stocks, daily OHLCV, 2018-2024):\n\n**XGBoost** — Directional accuracy: 57.3%, Sharpe: 1.42\n**LSTM** — Directional accuracy: 54.8%, Sharpe: 1.18\n**Ensemble (XGBoost + LSTM)** — Directional accuracy: 59.1%, Sharpe: 1.61\n\nKey findings:\n• XGBoost dominates when you have good feature engineering (RSI, MACD, volume ratios, sector momentum)\n• LSTM catches regime changes better but has higher variance\n• The ensemble approach is best — use XGBoost for the base prediction and LSTM as a meta-learner\n\nCode and backtest results are on my GitHub if anyone wants to replicate.' },
    ],
    title: 'XGBoost vs LSTM for stock price prediction — which performs better?',
    excerpt: 'Building an ML model for price prediction. XGBoost seems to work better on tabular features while LSTM captures temporal patterns. Has anyone benchmarked both on NSE data?',
    fullText: 'Building an ML model for price prediction on Indian markets. I\'ve been experimenting with both XGBoost and LSTM architectures.\n\nXGBoost seems to work better on tabular features (technical indicators, fundamentals) while LSTM captures temporal patterns better. Has anyone done a proper benchmark comparing both on NSE data?\n\nSpecifically interested in:\n1. Which model gives better directional accuracy?\n2. Feature engineering tips for XGBoost\n3. Optimal LSTM architecture (layers, units, lookback period)\n4. Has anyone tried ensemble approaches?',
    tags: ['machine-learning', 'prediction', 'python'], user: 'Ananya Patel', time: '8 hours ago', views: 650
  },
  {
    id: 5, votes: 15, userVote: 0, answers: [
      { id: 501, user: 'Priya Menon', av: 'PM', votes: 10, userVote: 0, accepted: false, time: '11 hours ago',
        text: 'Classic **hidden bullish divergence** pattern. Price making higher lows while RSI makes lower lows typically indicates the underlying trend is still bullish and the range-bound price action is accumulation.\n\nFor Reliance specifically, I see this resolving to the upside within 2-3 weeks. The ₹2950 level is key — a close above that with volume confirms the breakout.\n\nHistorically, this pattern on large-cap Indian stocks has a 62% probability of an upside breakout (based on my database of 1200+ instances).' },
    ],
    title: 'Why is Reliance showing bullish divergence on RSI while price is flat?',
    excerpt: 'The daily RSI for Reliance has been making higher lows while the price remains range-bound between 2900-2950. What does this typically indicate?',
    fullText: 'The daily RSI for Reliance has been making higher lows while the price remains range-bound between 2900-2950. What does this typically indicate?\n\nI\'ve noticed this divergence building over the last 10 trading sessions. The RSI has gone from 35 to 42 while price hasn\'t moved much. Volume is slightly above average.\n\nIs this a reliable signal? What\'s the typical resolution timeframe for such divergences on large-cap stocks?',
    tags: ['reliance', 'rsi', 'technical-analysis'], user: 'Deepak Rathi', time: '12 hours ago', views: 430
  },
  {
    id: 6, votes: 11, userVote: 0, answers: [
      { id: 601, user: 'Rahul Sharma', av: 'RS', votes: 6, userVote: 0, accepted: false, time: '20 hours ago',
        text: 'During previous RBI pause cycles (2019, 2022), the best performing sectors were:\n1. **Banking** — NIMs stabilize, credit growth continues\n2. **Capital Goods / Infrastructure** — government capex accelerates\n3. **Pharma** — defensive play with secular growth\n\nWorst performers during pause cycles:\n1. **Real Estate** — rate-sensitive, buyers wait for cuts\n2. **Auto** — financing costs stay elevated\n\nI\'d suggest a barbell approach: 60% in quality banking + infra, 40% in defensive pharma + FMCG.' },
    ],
    title: 'Best sector rotation strategy for the current rate cycle?',
    excerpt: 'With RBI potentially pausing rate cuts, which sectors historically outperform? Looking at data from previous pause cycles...',
    fullText: 'With RBI potentially pausing rate cuts, which sectors historically outperform? Looking at data from previous pause cycles in India.\n\nI\'m trying to build a sector rotation strategy that adjusts based on the interest rate cycle. Currently we seem to be in a \'prolonged pause\' phase where rates are neither going up nor down.\n\nWould love to see data or personal experience on which sectors tend to outperform/underperform during rate pause cycles. Also, how quickly should one rotate when the cycle shifts?',
    tags: ['sector-rotation', 'macro', 'rbi'], user: 'Sneha Trivedi', time: '1 day ago', views: 320
  },
];

let _forumView = 'list'; // 'list' or 'detail'
let _forumSelectedQ = null;
let _forumFilter = 'newest';

function renderForum() {
  if (_forumView === 'detail' && _forumSelectedQ) {
    return renderQuestionDetail(_forumSelectedQ);
  }
  return renderQuestionList();
}

function renderQuestionList() {
  let questions = [...FORUM_QUESTIONS];
  if (_forumFilter === 'top') questions.sort((a, b) => b.votes - a.votes);
  else if (_forumFilter === 'unanswered') questions = questions.filter(q => !q.answers.some(a => a.accepted));

  return `<div class="page" id="forumPage">
  <div class="forum-header">
    <h1 class="page-title" style="margin-bottom:0">Q&A Forum</h1>
    <div style="display:flex;gap:8px;align-items:center">
      <div class="forum-tabs">
        <button class="forum-tab${_forumFilter === 'newest' ? ' active' : ''}" data-filter="newest">Newest</button>
        <button class="forum-tab${_forumFilter === 'top' ? ' active' : ''}" data-filter="top">Top</button>
        <button class="forum-tab${_forumFilter === 'unanswered' ? ' active' : ''}" data-filter="unanswered">Unanswered</button>
      </div>
      <button class="btn btn-primary" id="askQuestionBtn">Ask Question</button>
    </div>
  </div>
  <div class="question-list">
    ${questions.map(q => {
      const hasAccepted = q.answers.some(a => a.accepted);
      return `<div class="card question-card" data-qid="${q.id}">
      <div class="question-votes">
        <div class="vote-count">${q.votes}</div><div class="vote-label">votes</div>
        <div class="answers-count${hasAccepted ? ' has-accepted' : ''}">${q.answers.length} ans</div>
        <div class="vote-label">${q.views} views</div>
      </div>
      <div class="question-body">
        <div class="question-title">${q.title}</div>
        <div class="question-excerpt">${q.excerpt}</div>
        <div class="question-meta">
          ${q.tags.map(t => `<span class="question-tag">${t}</span>`).join('')}
          <span style="margin-left:auto;font-size:.72rem;color:var(--text3)">${q.user} · ${q.time}</span>
        </div>
      </div>
    </div>`;
    }).join('')}
  </div>
</div>`;
}

function renderQuestionDetail(qId) {
  const q = FORUM_QUESTIONS.find(x => x.id === qId);
  if (!q) return renderQuestionList();

  const hasAccepted = q.answers.some(a => a.accepted);

  return `<div class="page" id="forumPage">
  <button class="stock-back" id="forumBackBtn">← Back to Questions</button>
  <div class="card question-detail">
    <div class="question-detail-header">
      <h2 class="question-detail-title">${q.title}</h2>
      <div class="question-detail-meta">
        <span>Asked by <strong>${q.user}</strong></span>
        <span>${q.time}</span>
        <span>${q.views} views</span>
      </div>
    </div>
    <div class="question-detail-tags">
      ${q.tags.map(t => `<span class="question-tag">${t}</span>`).join('')}
    </div>
    <div class="question-detail-body">${(q.fullText || q.excerpt).replace(/\n/g, '<br>')}</div>
    <div class="question-vote-bar">
      <button class="vote-btn vote-up${q.userVote === 1 ? ' active' : ''}" data-qid="${q.id}" data-dir="up">▲</button>
      <span class="vote-score">${q.votes}</span>
      <button class="vote-btn vote-down${q.userVote === -1 ? ' active' : ''}" data-qid="${q.id}" data-dir="down">▼</button>
    </div>
  </div>

  <div class="answers-section">
    <div class="answers-header">
      <h3>${q.answers.length} Answer${q.answers.length !== 1 ? 's' : ''}</h3>
      ${hasAccepted ? '<span class="badge badge-green" style="font-size:.75rem">✓ Accepted Answer</span>' : ''}
    </div>
    ${q.answers.sort((a, b) => (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0) || b.votes - a.votes).map(a => `
    <div class="card answer-card${a.accepted ? ' answer-accepted' : ''}">
      <div class="answer-vote-col">
        <button class="vote-btn vote-up${a.userVote === 1 ? ' active' : ''}" data-aid="${a.id}" data-qid="${q.id}" data-dir="up">▲</button>
        <span class="vote-score">${a.votes}</span>
        <button class="vote-btn vote-down${a.userVote === -1 ? ' active' : ''}" data-aid="${a.id}" data-qid="${q.id}" data-dir="down">▼</button>
        ${a.accepted ? '<div class="accepted-check" title="Accepted answer">✓</div>' : ''}
      </div>
      <div class="answer-body">
        <div class="answer-text">${a.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
        <div class="answer-meta">
          <div class="answer-user">
            <div class="answer-av">${a.av}</div>
            <span>${a.user}${['Ashmit K.','Vikram Malhotra','Ananya Patel'].includes(a.user)?' <span class="verified-badge" title="Verified Trader">✓</span>':''}</span>
          </div>
          <span class="answer-time">${a.time}</span>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <div class="card write-answer-section">
    <h3 class="card-title">Your Answer</h3>
    <textarea class="answer-textarea" id="answerTextarea" placeholder="Write your answer here... Use **bold** for emphasis."></textarea>
    <div class="answer-submit-row">
      <span class="answer-hint">Be specific. Share data, personal experience, or calculations to back up your answer.</span>
      <button class="btn" id="aiSuggestBtn" style="display:inline-flex;align-items:center;gap:4px">✨ AI Suggest</button>
      <button class="btn btn-primary" id="submitAnswerBtn">Post Answer</button>
    </div>
  </div>
</div>`;
}

function initForum() {
  // Tab filtering
  document.querySelectorAll('.forum-tab').forEach(t => {
    t.addEventListener('click', () => {
      _forumFilter = t.dataset.filter;
      _forumView = 'list';
      document.getElementById('main').innerHTML = renderForum();
      initForum();
    });
  });

  // Click question to view detail
  document.querySelectorAll('.question-card[data-qid]').forEach(card => {
    card.addEventListener('click', () => {
      const qId = parseInt(card.dataset.qid);
      _forumView = 'detail';
      _forumSelectedQ = qId;
      document.getElementById('main').innerHTML = renderForum();
      initForum();
    });
  });

  // Back button
  document.getElementById('forumBackBtn')?.addEventListener('click', () => {
    _forumView = 'list';
    _forumSelectedQ = null;
    document.getElementById('main').innerHTML = renderForum();
    initForum();
  });

  // Vote buttons on question
  document.querySelectorAll('.question-vote-bar .vote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = parseInt(btn.dataset.qid);
      const dir = btn.dataset.dir;
      const q = FORUM_QUESTIONS.find(x => x.id === qId);
      if (!q) return;
      if (dir === 'up') {
        if (q.userVote === 1) { q.votes--; q.userVote = 0; }
        else { q.votes += (q.userVote === -1 ? 2 : 1); q.userVote = 1; }
      } else {
        if (q.userVote === -1) { q.votes++; q.userVote = 0; }
        else { q.votes -= (q.userVote === 1 ? 2 : 1); q.userVote = -1; }
      }
      document.getElementById('main').innerHTML = renderForum();
      initForum();
    });
  });

  // Vote buttons on answers
  document.querySelectorAll('.answer-vote-col .vote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const aId = parseInt(btn.dataset.aid);
      const qId = parseInt(btn.dataset.qid);
      const dir = btn.dataset.dir;
      const q = FORUM_QUESTIONS.find(x => x.id === qId);
      if (!q) return;
      const a = q.answers.find(x => x.id === aId);
      if (!a) return;
      if (dir === 'up') {
        if (a.userVote === 1) { a.votes--; a.userVote = 0; }
        else { a.votes += (a.userVote === -1 ? 2 : 1); a.userVote = 1; }
      } else {
        if (a.userVote === -1) { a.votes++; a.userVote = 0; }
        else { a.votes -= (a.userVote === 1 ? 2 : 1); a.userVote = -1; }
      }
      document.getElementById('main').innerHTML = renderForum();
      initForum();
    });
  });

  // AI Suggest
  document.getElementById('aiSuggestBtn')?.addEventListener('click', () => {
    const q = FORUM_QUESTIONS.find(x => x.id === _forumSelectedQ);
    if (!q) return;
    const textarea = document.getElementById('answerTextarea');
    const btn = document.getElementById('aiSuggestBtn');
    btn.textContent = '⏳ Generating...';
    btn.disabled = true;
    const suggestions = {
      'options': 'Based on my analysis of NIFTY options data, I\'d recommend considering **iron condors** in the current low-VIX environment (VIX ~12). Key points:\n\n1. **Position sizing**: Keep each trade under 2% of capital\n2. **Strike selection**: Sell strikes at 1 standard deviation OTM\n3. **Exit rules**: Close at 50% profit or 2x loss\n\nBacktest data shows this approach yields ~55% win rate with 1.5:1 reward-to-risk over the past 2 years on weekly expiry.',
      'technical-analysis': 'Looking at the technical setup, here\'s my analysis:\n\n**Key Indicators:**\n• RSI: Check for divergence between price and RSI — this is often more reliable than absolute RSI levels\n• MACD: Use (8,21,5) settings for Indian markets instead of default (12,26,9)\n• Volume: Confirm breakouts with >1.5x average volume\n\n**Important**: Always combine at least 2-3 indicators for confirmation. Single-indicator strategies have <50% accuracy on NSE data.',
      'default': 'Based on my research and experience, here are the key points to consider:\n\n1. **Data-driven approach**: Always back your thesis with numbers — backtest results, historical patterns, or fundamental metrics\n2. **Risk management**: Define your stop-loss before entering any position\n3. **Diversification**: Don\'t put more than 10% in any single position\n\nI\'d be happy to elaborate on any of these points with specific examples from Indian markets.'
    };
    const matchTag = q.tags.find(t => suggestions[t]);
    setTimeout(() => {
      textarea.value = suggestions[matchTag] || suggestions['default'];
      btn.textContent = '✨ AI Suggest';
      btn.disabled = false;
    }, 1200);
  });

  // Submit answer
  document.getElementById('submitAnswerBtn')?.addEventListener('click', () => {
    const textarea = document.getElementById('answerTextarea');
    const text = textarea.value.trim();
    if (!text) { textarea.focus(); return; }
    const q = FORUM_QUESTIONS.find(x => x.id === _forumSelectedQ);
    if (!q) return;
    const newAnswer = {
      id: Date.now(),
      user: 'Ashmit K.',
      av: 'AK',
      votes: 0,
      userVote: 0,
      accepted: false,
      time: 'just now',
      text: text,
    };
    q.answers.push(newAnswer);
    document.getElementById('main').innerHTML = renderForum();
    initForum();
  });

  // Ask question button (placeholder modal)
  document.getElementById('askQuestionBtn')?.addEventListener('click', () => {
    _forumView = 'ask';
    document.getElementById('main').innerHTML = renderAskQuestion();
    initAskQuestion();
  });
}

function renderAskQuestion() {
  return `<div class="page" id="forumPage">
  <button class="stock-back" id="askBackBtn">← Back to Questions</button>
  <div class="card ask-question-form">
    <h2 class="page-title" style="margin-bottom:16px">Ask a Question</h2>
    <div class="form-group">
      <label class="form-label">Title</label>
      <input class="form-input" id="askTitle" placeholder="What's your question? Be specific." />
    </div>
    <div class="form-group">
      <label class="form-label">Details</label>
      <textarea class="answer-textarea" id="askBody" placeholder="Include all the information someone would need to answer your question. Add context, what you've tried, and what you expect." style="min-height:160px"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Tags <span style="color:var(--text3);font-weight:400">(comma-separated)</span></label>
      <input class="form-input" id="askTags" placeholder="e.g. options, nifty, technical-analysis" />
    </div>
    <button class="btn btn-primary" id="submitQuestionBtn">Post Question</button>
  </div>
</div>`;
}

function initAskQuestion() {
  document.getElementById('askBackBtn')?.addEventListener('click', () => {
    _forumView = 'list';
    document.getElementById('main').innerHTML = renderForum();
    initForum();
  });

  document.getElementById('submitQuestionBtn')?.addEventListener('click', () => {
    const title = document.getElementById('askTitle').value.trim();
    const body = document.getElementById('askBody').value.trim();
    const tagsStr = document.getElementById('askTags').value.trim();
    if (!title || !body) { alert('Please fill in the title and details.'); return; }
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : ['general'];
    const newQ = {
      id: Date.now(), votes: 0, userVote: 0,
      answers: [],
      title, excerpt: body.substring(0, 200) + (body.length > 200 ? '...' : ''), fullText: body,
      tags, user: 'Ashmit K.', time: 'just now', views: 1,
    };
    FORUM_QUESTIONS.unshift(newQ);
    _forumView = 'detail';
    _forumSelectedQ = newQ.id;
    document.getElementById('main').innerHTML = renderForum();
    initForum();
  });
}
