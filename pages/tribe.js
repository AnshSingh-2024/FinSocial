/* Tribe Rooms Page — Discord-style with multi-channel support */

/* ── Consistent user pool used across the entire app ── */
const TRIBE_USERS = {
  RS: { av: 'RS', name: 'Rahul Sharma', status: 'online' },
  PM: { av: 'PM', name: 'Priya Menon', status: 'online' },
  AK: { av: 'AK', name: 'Ashmit K.', status: 'online' },
  VM: { av: 'VM', name: 'Vikram Malhotra', status: 'online' },
  AP: { av: 'AP', name: 'Ananya Patel', status: 'idle' },
  DR: { av: 'DR', name: 'Deepak Rathi', status: 'offline' },
  ST: { av: 'ST', name: 'Sneha Trivedi', status: 'offline' },
  NK: { av: 'NK', name: 'Nikhil Kapoor', status: 'online' },
  RG: { av: 'RG', name: 'Ritu Gupta', status: 'idle' },
};

const TRIBE_CHANNELS = {
  'beginners-lounge': {
    messages: [
      { av: 'RS', name: 'Rahul Sharma', time: '12:34 PM', text: 'Has anyone been tracking Reliance post the Q4 results? The Jio subscriber numbers look really strong.' },
      { av: 'PM', name: 'Priya Menon', time: '12:36 PM', text: 'Yeah, I think the stock is undervalued at current levels. The refining margins are a concern though with crude above $88.' },
      { av: 'AK', name: 'Ashmit K.', time: '12:38 PM', text: 'I ran the AI signal board on it — showing BUY with 78% confidence. MACD crossover looks promising.' },
      { av: 'VM', name: 'Vikram Malhotra', time: '12:40 PM', text: 'Be careful with over-relying on technicals. The macro picture with Fed rate expectations could shift sentiment quickly.' },
      { av: 'AP', name: 'Ananya Patel', time: '12:42 PM', text: 'Good point. I\'m keeping my position small — about 5% of portfolio. The risk-reward is decent here.' },
      { av: 'RS', name: 'Rahul Sharma', time: '12:45 PM', text: 'What about TCS? Seeing some selling pressure after the earnings miss. Any bottom-fishing opportunities?' },
      { av: 'PM', name: 'Priya Menon', time: '12:47 PM', text: 'IT sector is tricky right now. Might wait for more clarity on US demand. INFY looks better positioned than TCS imo.' },
    ],
  },
  'ipo-watch': {
    messages: [
      { av: 'NK', name: 'Nikhil Kapoor', time: '11:02 AM', text: 'Ola Electric IPO opening next week at ₹72-76 band. Anyone planning to subscribe? The valuation seems steep at 10x revenue.' },
      { av: 'PM', name: 'Priya Menon', time: '11:05 AM', text: 'I\'m skipping Ola Electric. EV margins are too thin. Waiting for Swiggy IPO instead — that\'s the real one to watch.' },
      { av: 'VM', name: 'Vikram Malhotra', time: '11:08 AM', text: 'Swiggy will be interesting but Zomato\'s already listed and profitable. Hard to justify Swiggy\'s expected premium.' },
      { av: 'RS', name: 'Rahul Sharma', time: '11:15 AM', text: 'NTPC Green IPO was a massive success — 18x oversubscribed. Government disinvestment via IPOs is a solid theme for 2026.' },
      { av: 'RG', name: 'Ritu Gupta', time: '11:22 AM', text: 'For IPO investing, I follow a simple rule: only subscribe if GMP is 30%+ on day 2 of bidding. Has worked well historically.' },
      { av: 'AK', name: 'Ashmit K.', time: '11:30 AM', text: 'Pro tip: always check anchor investor allocation before subscribing. If marquee funds like BlackRock or GIC are in, it\'s usually a good sign.' },
    ],
  },
  'sector-spotlight': {
    messages: [
      { av: 'DR', name: 'Deepak Rathi', time: '9:20 AM', text: '🏦 Banking sector is on fire! HDFCBANK, ICICIBANK, SBIN all hitting 52-week highs. Credit growth at 16% YoY driving the rally.' },
      { av: 'AP', name: 'Ananya Patel', time: '9:25 AM', text: 'IT sector is the opposite story. TCS, INFY, WIPRO all under pressure. US spending slowdown is real. Avoid IT for now.' },
      { av: 'NK', name: 'Nikhil Kapoor', time: '9:30 AM', text: 'Pharma is the dark horse. Sun Pharma and Dr Reddy\'s have broken out. US generics market stabilizing + specialty pipeline.' },
      { av: 'VM', name: 'Vikram Malhotra', time: '9:40 AM', text: 'Power sector is structural. NTPC, PowerGrid, Tata Power — India needs 2x current capacity by 2030. Long runway.' },
      { av: 'RS', name: 'Rahul Sharma', time: '9:45 AM', text: 'Auto is mixed. Maruti struggling with EV transition, but Tata Motors killing it with JLR + EVs. Selective bets only.' },
      { av: 'AK', name: 'Ashmit K.', time: '9:55 AM', text: 'Running our sector momentum model: Banking > Power > Pharma > FMCG > Auto > IT. Banking has 3x the momentum score of IT right now.' },
      { av: 'RG', name: 'Ritu Gupta', time: '10:05 AM', text: 'Don\'t forget Telecom — Bharti Airtel is a compounding machine. ARPU growth + 5G monetization. Sector re-rating happening.' },
    ],
  },
  'news-feed': {
    messages: [
      { av: 'PM', name: 'Priya Menon', time: '10:00 AM', text: '📰 Breaking: RBI keeps repo rate unchanged at 6.5% for the 8th consecutive time. As expected by most economists.' },
      { av: 'VM', name: 'Vikram Malhotra', time: '10:03 AM', text: 'No surprise there. Inflation is still sticky above 5%. Rate cuts probably delayed to Q3 FY26 now.' },
      { av: 'RS', name: 'Rahul Sharma', time: '10:10 AM', text: '📰 SEBI proposes new regulations for algo trading — mandatory registration for all algo strategies. Could impact HFT firms.' },
      { av: 'NK', name: 'Nikhil Kapoor', time: '10:15 AM', text: 'That SEBI move is long overdue. Retail traders were getting front-run by unregulated algos. Level playing field is needed.' },
      { av: 'AP', name: 'Ananya Patel', time: '10:30 AM', text: '📰 Adani Group considering $2B bond issuance. Credit Suisse and JP Morgan in talks to manage the deal.' },
      { av: 'DR', name: 'Deepak Rathi', time: '10:45 AM', text: '📰 TCS wins $500M deal from UK-based insurance major. Largest deal in Q1 so far. Stock up 1.2% in early trade.' },
    ],
  },
  'platform-help': {
    messages: [
      { av: 'AK', name: 'Ashmit K.', time: '2:00 PM', text: 'Welcome to Platform Help! Ask any question about how to use FinSocial — placing trades, reading charts, understanding signals, anything!' },
      { av: 'VM', name: 'Vikram Malhotra', time: '2:05 PM', text: 'Quick tip: to place a virtual trade, go to Stocks → click any stock → click the "Trade" button. You can BUY or SELL with simulated money.' },
      { av: 'RS', name: 'Rahul Sharma', time: '2:08 PM', text: 'How do I read the Signal Board? What does "78% confidence" mean exactly?' },
      { av: 'AK', name: 'Ashmit K.', time: '2:15 PM', text: '@Rahul The Signal Board uses an XGBoost ML model trained on historical OHLCV data. 78% confidence means the model predicts a BUY with 78% probability based on technical indicators.' },
      { av: 'NK', name: 'Nikhil Kapoor', time: '2:20 PM', text: 'How do I add stocks to my watchlist? I want to track specific tickers without buying them.' },
      { av: 'PM', name: 'Priya Menon', time: '2:30 PM', text: '@Nikhil On the Stocks page, click the ☆ star icon next to any stock. It turns ★ and the stock appears in your Watchlist filter tab. Easy!' },
    ],
  },
  'mutual-funds-corner': {
    messages: [
      { av: 'AP', name: 'Ananya Patel', time: '8:30 AM', text: 'Monthly SIP report 📊: Parag Parikh Flexi Cap up 18.2% XIRR, Quant Small Cap up 28.4% XIRR. Very happy with both.' },
      { av: 'RS', name: 'Rahul Sharma', time: '8:35 AM', text: 'Quant AMC has been phenomenal. Their momentum strategy really works. I also have Quant Mid Cap — 31% XIRR in 2 years.' },
      { av: 'RG', name: 'Ritu Gupta', time: '8:42 AM', text: 'Be careful with chasing past returns in MFs. Many small cap funds are sitting on cash now because they can\'t deploy at these valuations.' },
      { av: 'DR', name: 'Deepak Rathi', time: '8:50 AM', text: 'I switched 30% of my equity MF allocation to Balanced Advantage Funds. HDFC BAF and ICICI BAF. Helps me sleep at night 😄' },
      { av: 'PM', name: 'Priya Menon', time: '9:00 AM', text: 'Index funds are still the way to go for most people. Nifty 50 + Nifty Next 50 combo covers 80% of market cap. Low cost, no fund manager risk.' },
      { av: 'NK', name: 'Nikhil Kapoor', time: '9:10 AM', text: 'Has anyone looked at the new Motilal Oswal S&P 500 fund? Good way to get US exposure with INR convenience. TER is 0.49%.' },
    ],
  },
};

let _activeTribeChannel = 'beginners-lounge';

function renderTribe() {
  const channelList = [
    { type: 'text', name: 'beginners-lounge' },
    { type: 'text', name: 'ipo-watch' },
    { type: 'text', name: 'sector-spotlight' },
    { type: 'text', name: 'platform-help' },
    { type: 'text', name: 'mutual-funds-corner' },
    { type: 'text', name: 'news-feed' },
    { type: 'voice', name: 'Voice — General', users: ['Rahul Sharma', 'Priya Menon'] },
    { type: 'voice', name: 'Voice — Trading Floor', users: ['Vikram Malhotra'] },
  ];

  const members = Object.values(TRIBE_USERS);
  const activeChannel = TRIBE_CHANNELS[_activeTribeChannel] || TRIBE_CHANNELS['beginners-lounge'];
  const messages = activeChannel.messages;

  return `<div class="page" id="tribePage">
  <h1 class="page-title">Tribe Rooms</h1>
  <div class="tribe-layout">
    <div class="tribe-servers">
      <div class="server-icon active" title="FinSocial Hub">F</div>
      <div class="server-icon" title="Nifty Traders">NT</div>
      <div class="server-icon" title="Crypto Club">CC</div>
      <div class="server-icon" title="IPO Watch">IP</div>
      <div class="server-icon" title="Global Markets">GM</div>
    </div>
    <div class="tribe-channels">
      <div class="channel-header">FinSocial Hub</div>
      <div class="channel-group">Text Channels</div>
      ${channelList.filter(c => c.type === 'text').map(c => `
        <div class="channel-item${c.name === _activeTribeChannel ? ' active' : ''}" data-channel="${c.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18"/></svg>
          ${c.name}
        </div>`).join('')}
      <div class="channel-group" style="margin-top:12px">Voice Channels</div>
      ${channelList.filter(c => c.type === 'voice').map(c => `
        <div class="channel-item" data-channel="${c.name}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          ${c.name}
        </div>
        <div class="voice-users">${c.users.map(u => `<div class="voice-user"><span class="voice-dot"></span>${u}</div>`).join('')}</div>
      `).join('')}
    </div>
    <div class="tribe-chat">
      <div class="chat-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18"/></svg>
        <span id="chatChannelName">${_activeTribeChannel}</span>
      </div>
      <div class="chat-messages" id="chatMessages">
        ${messages.map(m => `<div class="chat-msg">
          <div class="chat-msg-av">${m.av}</div>
          <div class="chat-msg-body"><span class="chat-msg-name">${m.name}</span><span class="chat-msg-time">${m.time}</span><div class="chat-msg-text">${m.text}</div></div>
        </div>`).join('')}
      </div>
      <div class="chat-input-area">
        <input class="chat-input" id="tribeInput" placeholder="Message #${_activeTribeChannel}" />
        <button class="btn btn-primary btn-sm" id="tribeSendBtn">Send</button>
      </div>
    </div>
    <div class="tribe-members">
      <div class="member-section">Online — ${members.filter(m => m.status === 'online').length}</div>
      ${members.filter(m => m.status === 'online').map(m => `<div class="member-item"><span class="member-dot online"></span>${m.name}</div>`).join('')}
      <div class="member-section">Idle — ${members.filter(m => m.status === 'idle').length}</div>
      ${members.filter(m => m.status === 'idle').map(m => `<div class="member-item"><span class="member-dot idle"></span>${m.name}</div>`).join('')}
      <div class="member-section">Offline — ${members.filter(m => m.status === 'offline').length}</div>
      ${members.filter(m => m.status === 'offline').map(m => `<div class="member-item"><span class="member-dot offline"></span>${m.name}</div>`).join('')}
    </div>
  </div>
</div>`;
}

function initTribe() {
  // Channel switching
  document.querySelectorAll('.channel-item[data-channel]').forEach(el => {
    el.addEventListener('click', () => {
      const ch = el.dataset.channel;
      if (!TRIBE_CHANNELS[ch]) return; // voice channels
      _activeTribeChannel = ch;
      // Re-render just the chat area
      const channelData = TRIBE_CHANNELS[ch];
      document.getElementById('chatChannelName').textContent = ch;
      document.getElementById('tribeInput').placeholder = `Message #${ch}`;
      document.getElementById('chatMessages').innerHTML = channelData.messages.map(m => `<div class="chat-msg">
        <div class="chat-msg-av">${m.av}</div>
        <div class="chat-msg-body"><span class="chat-msg-name">${m.name}</span><span class="chat-msg-time">${m.time}</span><div class="chat-msg-text">${m.text}</div></div>
      </div>`).join('');
      // Update active channel highlight
      document.querySelectorAll('.channel-item').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      // Scroll to bottom
      const msgs = document.getElementById('chatMessages');
      msgs.scrollTop = msgs.scrollHeight;
    });
  });

  // Send message
  const sendMsg = () => {
    const input = document.getElementById('tribeInput');
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const msg = { av: 'AK', name: 'Ashmit K.', time, text };
    TRIBE_CHANNELS[_activeTribeChannel].messages.push(msg);
    const msgs = document.getElementById('chatMessages');
    msgs.innerHTML += `<div class="chat-msg">
      <div class="chat-msg-av">${msg.av}</div>
      <div class="chat-msg-body"><span class="chat-msg-name">${msg.name}</span><span class="chat-msg-time">${msg.time}</span><div class="chat-msg-text">${msg.text}</div></div>
    </div>`;
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;
  };
  document.getElementById('tribeSendBtn')?.addEventListener('click', sendMsg);
  document.getElementById('tribeInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMsg();
  });

  // Scroll to bottom on load
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
