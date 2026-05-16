/* Home Page — Enhanced Community Feed + Trending Tickers + Leaderboard */
const VERIFIED_USERS = ['Ashmit K.', 'Vikram Malhotra', 'Ananya Patel'];

function renderHome(){
  const trendingTickers = [
    {ticker:'RELIANCE',price:2943.55,chg:'+1.32%',up:true,vol:'High'},
    {ticker:'ZOMATO',price:245.60,chg:'+3.76%',up:true,vol:'Very High'},
    {ticker:'TRENT',price:5840.00,chg:'+2.11%',up:true,vol:'High'},
    {ticker:'HDFCBANK',price:1695.30,chg:'+1.71%',up:true,vol:'Medium'},
    {ticker:'TCS',price:3412.10,chg:'-1.37%',up:false,vol:'Medium'},
    {ticker:'TATAMOTORS',price:978.40,chg:'+0.85%',up:true,vol:'High'},
    {ticker:'NTPC',price:365.40,chg:'+1.90%',up:true,vol:'High'},
    {ticker:'BHARTIARTL',price:1520.40,chg:'+1.92%',up:true,vol:'Medium'},
  ];
  const feedItems = [
    {user:'Rahul Sharma',av:'RS',action:'bought',qty:'50 shares',stock:'RELIANCE',time:'2 min ago',type:'buy',likes:25,comments:2,verified:false},
    {user:'Priya Menon',av:'PM',action:'sold',qty:'120 shares',stock:'TCS',time:'5 min ago',type:'sell',likes:41,comments:4,verified:false},
    {user:'Nikhil Kapoor',av:'NK',action:'bought',qty:'200 shares',stock:'INFY',time:'8 min ago',type:'buy',likes:38,comments:7,verified:false},
    {user:'Vikram Malhotra',av:'VM',action:'bought',qty:'75 shares',stock:'HDFCBANK',time:'14 min ago',type:'buy',likes:52,comments:3,verified:true},
    {user:'Ananya Patel',av:'AP',action:'sold',qty:'50 shares',stock:'BAJFINANCE',time:'22 min ago',type:'sell',likes:19,comments:1,verified:true},
    {user:'Ritu Gupta',av:'RG',action:'bought',qty:'300 shares',stock:'ITC',time:'30 min ago',type:'buy',likes:33,comments:5,verified:false},
    {user:'Deepak Rathi',av:'DR',action:'bought',qty:'100 shares',stock:'NTPC',time:'45 min ago',type:'buy',likes:28,comments:2,verified:false},
    {user:'Sneha Trivedi',av:'ST',action:'bought',qty:'25 shares',stock:'ZOMATO',time:'1 hour ago',type:'buy',likes:45,comments:8,verified:false},
  ];

  return `<div class="page" id="homePage">
  <h1 class="page-title">Dashboard</h1>
  <div class="home-stats">
    <div class="card stat-card"><div class="stat-val positive">₹12,48,320</div><div class="stat-label">Portfolio Value</div></div>
    <div class="card stat-card"><div class="stat-val positive">+₹1,24,580</div><div class="stat-label">Total P&L</div></div>
    <div class="card stat-card"><div class="stat-val">₹2,943.55</div><div class="stat-label">RELIANCE (Top Holding)</div></div>
    <div class="card stat-card"><div class="stat-val">23,847</div><div class="stat-label">NIFTY 50</div></div>
  </div>

  <!-- Trending Tickers -->
  <div class="card trending-card">
    <div class="card-title" style="margin-bottom:8px">🔥 Trending on FinSocial</div>
    <div class="trending-strip">
      ${trendingTickers.map(t=>`<div class="trending-item" onclick="window._pendingStock='${t.ticker}';location.hash='stocks'">
        <span class="trending-ticker mono">${t.ticker}</span>
        <span class="trending-price mono" data-live-price="${t.ticker}" data-decimals="0">₹${t.price.toFixed(0)}</span>
        <span class="mono ${t.up?'positive':'negative'}" data-live-chg="${t.ticker}" data-short="true">${t.chg}</span>
        <div class="trending-spark">${t.up?'<svg width="40" height="16"><polyline points="0,14 8,10 16,12 24,6 32,8 40,2" fill="none" stroke="#16a34a" stroke-width="1.5"/></svg>':'<svg width="40" height="16"><polyline points="0,2 8,6 16,4 24,10 32,8 40,14" fill="none" stroke="#dc2626" stroke-width="1.5"/></svg>'}</div>
      </div>`).join('')}
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">RELIANCE — 1M Chart</div>
      <div class="chart-area"><canvas id="homeChart"></canvas></div>
    </div>
    <div class="ai-card" style="margin-top:0">
      <div class="card-title" style="margin-top:8px">Signal Board — XGBoost ML</div>
      <div class="signal-grid">
        <div><div class="label">Prediction</div><div class="signal-verdict positive">BUY</div></div>
        <div><div class="label">Confidence</div><div class="conf-bar" style="margin-top:8px"><div class="conf-bar-fill" style="width:78%"></div></div><div style="font-size:.78rem;color:var(--text3);margin-top:4px" class="mono">78%</div></div>
        <div style="grid-column:1/-1"><div class="label">Technical Reasoning</div><p style="font-size:.85rem;color:var(--text2);line-height:1.6;margin-top:4px">RSI at 42 (neutral zone), MACD showing bullish crossover. 50-day MA above 200-day MA. Volume surge of 18% above 20-day avg supports upward momentum.</p></div>
      </div>
    </div>
  </div>

  <div class="grid-2" style="margin-top:16px">
    <!-- Community Feed -->
    <div class="card">
      <div class="card-title">Community Feed</div>
      <div id="feedList">
        ${feedItems.map(f=>`<div class="feed-item">
          <div class="feed-av">${f.av}</div>
          <div class="feed-body"><strong>${f.user}</strong>${f.verified?' <span class="verified-badge" title="Verified Trader">✓</span>':''} ${f.action} <span class="${f.type==='buy'?'positive':'negative'}">${f.qty}</span> of <strong>${f.stock}</strong><div class="feed-time">${f.time}</div></div>
          <div class="feed-actions">
            <button class="feed-btn" onclick="this.classList.toggle('liked')">▲ ${f.likes}</button>
            <button class="feed-btn">💬 ${f.comments}</button>
            <button class="feed-btn" onclick="this.textContent=this.textContent==='Follow'?'Following':'Follow'">Follow</button>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="card leaderboard-card">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
        <span>🏆 Community Leaderboard</span>
        <div class="leaderboard-tabs">
          <button class="lb-tab active" data-period="weekly">Weekly</button>
          <button class="lb-tab" data-period="monthly">Monthly</button>
          <button class="lb-tab" data-period="alltime">All Time</button>
        </div>
      </div>
      <div id="leaderboardContent">
        ${renderLeaderboardContent('weekly')}
      </div>
    </div>
  </div>
</div>`;
}

function renderLeaderboardContent(period) {
  const leaderboardData = {
    weekly: [
      { rank: 1, name: 'Vikram Malhotra', av: 'VM', returns: '+8.42%', trades: 12, winRate: '83%', badge: '🥇', streak: '5 wins', verified: true },
      { rank: 2, name: 'Ananya Patel', av: 'AP', returns: '+6.18%', trades: 8, winRate: '75%', badge: '🥈', streak: '3 wins', verified: true },
      { rank: 3, name: 'Ashmit K.', av: 'AK', returns: '+5.73%', trades: 15, winRate: '73%', badge: '🥉', streak: '4 wins', verified: true },
      { rank: 4, name: 'Nikhil Kapoor', av: 'NK', returns: '+4.91%', trades: 6, winRate: '67%', badge: '', streak: '2 wins' },
      { rank: 5, name: 'Rahul Sharma', av: 'RS', returns: '+3.65%', trades: 10, winRate: '60%', badge: '', streak: '1 win' },
      { rank: 6, name: 'Ritu Gupta', av: 'RG', returns: '+2.87%', trades: 4, winRate: '75%', badge: '', streak: '2 wins' },
      { rank: 7, name: 'Priya Menon', av: 'PM', returns: '+1.94%', trades: 7, winRate: '57%', badge: '', streak: '—' },
      { rank: 8, name: 'Deepak Rathi', av: 'DR', returns: '+0.82%', trades: 3, winRate: '67%', badge: '', streak: '—' },
      { rank: 9, name: 'Sneha Trivedi', av: 'ST', returns: '-0.45%', trades: 5, winRate: '40%', badge: '', streak: '—' },
    ],
    monthly: [
      { rank: 1, name: 'Ananya Patel', av: 'AP', returns: '+22.4%', trades: 34, winRate: '71%', badge: '🥇', streak: '8 wins', verified: true },
      { rank: 2, name: 'Ashmit K.', av: 'AK', returns: '+18.7%', trades: 42, winRate: '69%', badge: '🥈', streak: '6 wins', verified: true },
      { rank: 3, name: 'Vikram Malhotra', av: 'VM', returns: '+16.3%', trades: 28, winRate: '75%', badge: '🥉', streak: '5 wins', verified: true },
      { rank: 4, name: 'Nikhil Kapoor', av: 'NK', returns: '+14.1%', trades: 22, winRate: '68%', badge: '', streak: '4 wins' },
      { rank: 5, name: 'Rahul Sharma', av: 'RS', returns: '+11.8%', trades: 31, winRate: '61%', badge: '', streak: '3 wins' },
      { rank: 6, name: 'Ritu Gupta', av: 'RG', returns: '+9.2%', trades: 15, winRate: '73%', badge: '', streak: '3 wins' },
      { rank: 7, name: 'Priya Menon', av: 'PM', returns: '+6.5%', trades: 19, winRate: '58%', badge: '', streak: '2 wins' },
      { rank: 8, name: 'Deepak Rathi', av: 'DR', returns: '+3.1%', trades: 11, winRate: '64%', badge: '', streak: '—' },
      { rank: 9, name: 'Sneha Trivedi', av: 'ST', returns: '+1.2%', trades: 14, winRate: '50%', badge: '', streak: '—' },
    ],
    alltime: [
      { rank: 1, name: 'Ashmit K.', av: 'AK', returns: '+142.3%', trades: 312, winRate: '68%', badge: '🥇', streak: '12 wins', verified: true },
      { rank: 2, name: 'Vikram Malhotra', av: 'VM', returns: '+128.7%', trades: 245, winRate: '72%', badge: '🥈', streak: '9 wins', verified: true },
      { rank: 3, name: 'Ananya Patel', av: 'AP', returns: '+98.4%', trades: 198, winRate: '65%', badge: '🥉', streak: '7 wins', verified: true },
      { rank: 4, name: 'Rahul Sharma', av: 'RS', returns: '+87.2%', trades: 278, winRate: '59%', badge: '', streak: '6 wins' },
      { rank: 5, name: 'Nikhil Kapoor', av: 'NK', returns: '+74.6%', trades: 156, winRate: '66%', badge: '', streak: '5 wins' },
      { rank: 6, name: 'Priya Menon', av: 'PM', returns: '+62.1%', trades: 189, winRate: '61%', badge: '', streak: '4 wins' },
      { rank: 7, name: 'Ritu Gupta', av: 'RG', returns: '+51.8%', trades: 98, winRate: '70%', badge: '', streak: '4 wins' },
      { rank: 8, name: 'Deepak Rathi', av: 'DR', returns: '+38.5%', trades: 134, winRate: '58%', badge: '', streak: '3 wins' },
      { rank: 9, name: 'Sneha Trivedi', av: 'ST', returns: '+22.9%', trades: 87, winRate: '55%', badge: '', streak: '—' },
    ],
  };

  const data = leaderboardData[period] || leaderboardData.weekly;
  return data.map((entry, i) => `
    <div class="lb-row${entry.name === 'Ashmit K.' ? ' lb-you' : ''}${i < 3 ? ' lb-top' : ''}">
      <div class="lb-rank">${entry.badge || entry.rank}</div>
      <div class="lb-avatar">${entry.av}</div>
      <div class="lb-info">
        <div class="lb-name">${entry.name}${entry.verified ? ' <span class="verified-badge">✓</span>' : ''}${entry.name === 'Ashmit K.' ? ' <span class="lb-you-tag">You</span>' : ''}</div>
        <div class="lb-stats">${entry.trades} trades · ${entry.winRate} win rate · ${entry.streak}</div>
      </div>
      <div class="lb-returns mono ${entry.returns.startsWith('+') ? 'positive' : 'negative'}">${entry.returns}</div>
    </div>
  `).join('');
}

function initHome(){
  const c=document.getElementById('homeChart');if(!c)return;
  const ct=c.parentElement;c.width=ct.clientWidth*2;c.height=ct.clientHeight*2;
  c.style.width=ct.clientWidth+'px';c.style.height=ct.clientHeight+'px';
  const ctx=c.getContext('2d');ctx.scale(2,2);
  const W=ct.clientWidth,H=ct.clientHeight;
  const bars=40,data=[];let p=2880;
  for(let i=0;i<bars;i++){const ch=(Math.random()-.45)*25;const o=p,cl=p+ch;const h=Math.max(o,cl)+Math.random()*12;const l=Math.min(o,cl)-Math.random()*12;data.push({o,c:cl,h,l});p=Math.max(2840,Math.min(2980,cl))}
  const minL=Math.min(...data.map(d=>d.l)),maxH=Math.max(...data.map(d=>d.h)),range=maxH-minL;
  const yS=v=>20+(1-(v-minL)/range)*(H-40);const bW=(W-40)/bars;
  ctx.strokeStyle='#e9ecef';ctx.lineWidth=.5;
  for(let i=0;i<=4;i++){const y=20+i*((H-40)/4);ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-10,y);ctx.stroke();
    ctx.fillStyle='#adb5bd';ctx.font='9px JetBrains Mono';ctx.textAlign='right';ctx.fillText('₹'+(maxH-(i/4)*range).toFixed(0),W-12,y+3)}
  data.forEach((d,i)=>{const x=20+i*bW+bW/2;const up=d.c>=d.o;const col=up?'#16a34a':'#dc2626';
    ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,yS(d.h));ctx.lineTo(x,yS(d.l));ctx.stroke();
    const bT=yS(Math.max(d.o,d.c)),bB=yS(Math.min(d.o,d.c));ctx.fillStyle=col;ctx.fillRect(x-bW*.3,bT,bW*.6,Math.max(bB-bT,1))});
  ctx.strokeStyle='#2563eb';ctx.lineWidth=1.5;ctx.globalAlpha=.6;ctx.beginPath();
  for(let i=7;i<data.length;i++){let s=0;for(let j=i-7;j<=i;j++)s+=data[j].c;const a=s/8;const x=20+i*bW+bW/2;i===7?ctx.moveTo(x,yS(a)):ctx.lineTo(x,yS(a))}ctx.stroke();ctx.globalAlpha=1;

  // Leaderboard tab switching
  document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('leaderboardContent').innerHTML = renderLeaderboardContent(tab.dataset.period);
    });
  });
}
