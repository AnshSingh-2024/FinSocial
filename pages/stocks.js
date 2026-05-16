/* Stocks — 20+ stocks, Sentiment Meter, Buy/Sell, Watchlist */
const STOCKS_DATA=[
  {ticker:'RELIANCE',name:'Reliance Industries',price:2943.55,change:38.20,changePct:1.32,sector:'Energy',mcap:'19.8L Cr',pe:28.4,high52:3024,low52:2220,vol:'12.4M',sentiment:{bullish:62,neutral:24,bearish:14},analysis:{catalyst:'Jio Q4 subscriber additions beat estimates by 12%. Retail EBITDA margin expanded 180bps YoY.',risk:'Crude oil above $88/bbl compressing refining margins.',technicals:'RSI 42, MACD bullish crossover, 50-DMA above 200-DMA.',verdict:'BUY',confidence:78}},
  {ticker:'TCS',name:'Tata Consultancy Services',price:3412.10,change:-47.30,changePct:-1.37,sector:'IT',mcap:'12.4L Cr',pe:30.2,high52:4045,low52:3310,vol:'4.2M',sentiment:{bullish:28,neutral:30,bearish:42},analysis:{catalyst:'Large deal pipeline at $12.2B. Cloud migration demand steady.',risk:'US IT spending slowdown, attrition ticking up.',technicals:'RSI 35 (oversold), MACD below signal, below 50-DMA.',verdict:'SELL',confidence:71}},
  {ticker:'INFY',name:'Infosys Limited',price:1587.40,change:22.15,changePct:1.41,sector:'IT',mcap:'6.6L Cr',pe:25.8,high52:1810,low52:1358,vol:'8.7M',sentiment:{bullish:48,neutral:35,bearish:17},analysis:{catalyst:'AI-led deal wins accelerating. Topaz platform gaining traction.',risk:'Currency headwinds from strengthening rupee.',technicals:'RSI 55, price above all key MAs. Breakout above 1600 targets 1700.',verdict:'HOLD',confidence:65}},
  {ticker:'HDFCBANK',name:'HDFC Bank Limited',price:1695.30,change:28.45,changePct:1.71,sector:'Banking',mcap:'12.9L Cr',pe:19.6,high52:1794,low52:1420,vol:'15.1M',sentiment:{bullish:58,neutral:28,bearish:14},analysis:{catalyst:'Credit growth 18% YoY. NIMs improving post-merger.',risk:'Unsecured loan stress in microfinance book.',technicals:'RSI 62, golden cross formed. Support 1650, resistance 1750.',verdict:'BUY',confidence:74}},
  {ticker:'ITC',name:'ITC Limited',price:468.25,change:-2.10,changePct:-0.45,sector:'FMCG',mcap:'5.8L Cr',pe:27.1,high52:510,low52:398,vol:'18.3M',sentiment:{bullish:40,neutral:38,bearish:22},analysis:{catalyst:'Hotel demerger unlocking value. FMCG margins crossing 10%.',risk:'Cigarette volume stagnating. ESG concerns.',technicals:'RSI 48, range 460-480. Low vol suggests breakout.',verdict:'HOLD',confidence:60}},
  {ticker:'BAJFINANCE',name:'Bajaj Finance',price:8420.50,change:156.30,changePct:1.89,sector:'NBFC',mcap:'5.2L Cr',pe:33.5,high52:8900,low52:6200,vol:'2.1M',sentiment:{bullish:55,neutral:25,bearish:20},analysis:{catalyst:'AUM growth 32% YoY. Digital lending platform scaling.',risk:'Rising NPAs in unsecured segment.',technicals:'RSI 68 (overbought), strong momentum. Resistance 8600.',verdict:'HOLD',confidence:62}},
  {ticker:'TATAMOTORS',name:'Tata Motors',price:978.40,change:8.20,changePct:0.85,sector:'Auto',mcap:'3.6L Cr',pe:8.2,high52:1080,low52:620,vol:'22.5M',sentiment:{bullish:52,neutral:30,bearish:18},analysis:{catalyst:'JLR recovery strong. EV lineup expanding.',risk:'Commodity costs rising. UK market softening.',technicals:'RSI 54, above 200-DMA. Support at 950.',verdict:'BUY',confidence:68}},
  {ticker:'SUNPHARMA',name:'Sun Pharma',price:1645.20,change:10.15,changePct:0.62,sector:'Pharma',mcap:'3.9L Cr',pe:35.8,high52:1800,low52:1200,vol:'3.8M',sentiment:{bullish:50,neutral:32,bearish:18},analysis:{catalyst:'Specialty portfolio growing 25% YoY. US generics stable.',risk:'USFDA inspection risks. Price erosion in base business.',technicals:'RSI 52, bullish flag forming above 1600.',verdict:'HOLD',confidence:58}},
  {ticker:'ICICIBANK',name:'ICICI Bank',price:1245.80,change:18.90,changePct:1.54,sector:'Banking',mcap:'8.7L Cr',pe:18.2,high52:1340,low52:950,vol:'12.8M',sentiment:{bullish:64,neutral:22,bearish:14},analysis:{catalyst:'Best-in-class asset quality. ROE at 17%.',risk:'Slowing retail loan growth.',technicals:'RSI 58, trading near ATH. Breakout above 1260 bullish.',verdict:'BUY',confidence:76}},
  {ticker:'WIPRO',name:'Wipro Limited',price:456.30,change:-5.80,changePct:-1.26,sector:'IT',mcap:'2.4L Cr',pe:22.5,high52:580,low52:380,vol:'6.2M',sentiment:{bullish:22,neutral:35,bearish:43},analysis:{catalyst:'New CEO restructuring shows early results.',risk:'Consistent market share loss. Weak guidance.',technicals:'RSI 38, below all key MAs. Bear trend intact.',verdict:'SELL',confidence:65}},
  {ticker:'SBIN',name:'State Bank of India',price:842.60,change:12.30,changePct:1.48,sector:'Banking',mcap:'7.5L Cr',pe:10.8,high52:912,low52:600,vol:'25.6M',sentiment:{bullish:56,neutral:28,bearish:16},analysis:{catalyst:'Best quarter in history. NIM expansion continues.',risk:'PSU governance concerns. Political lending risk.',technicals:'RSI 60, above 50 and 200-DMA. Strong trend.',verdict:'BUY',confidence:70}},
  {ticker:'MARUTI',name:'Maruti Suzuki',price:12450.00,change:-180.00,changePct:-1.42,sector:'Auto',mcap:'3.9L Cr',pe:29.4,high52:13400,low52:9800,vol:'0.8M',sentiment:{bullish:35,neutral:40,bearish:25},analysis:{catalyst:'SUV portfolio gaining share. Rural demand recovering.',risk:'EV transition lagging competitors.',technicals:'RSI 42, support at 12200. Sideways consolidation.',verdict:'HOLD',confidence:55}},
  {ticker:'ADANIPORTS',name:'Adani Ports',price:1380.50,change:25.40,changePct:1.87,sector:'Infra',mcap:'2.9L Cr',pe:32.1,high52:1620,low52:780,vol:'5.4M',sentiment:{bullish:48,neutral:22,bearish:30},analysis:{catalyst:'Cargo volume growth 18%. New port acquisitions.',risk:'Group-level governance concerns persist.',technicals:'RSI 56, recovery from lows. Resistance at 1420.',verdict:'HOLD',confidence:52}},
  {ticker:'NTPC',name:'NTPC Limited',price:365.40,change:6.80,changePct:1.90,sector:'Power',mcap:'3.5L Cr',pe:18.6,high52:420,low52:240,vol:'14.2M',sentiment:{bullish:60,neutral:28,bearish:12},analysis:{catalyst:'Green energy push. 60GW capacity target by 2032.',risk:'Coal dependency. Regulatory tariff risks.',technicals:'RSI 62, strong uptrend. Above all key MAs.',verdict:'BUY',confidence:72}},
  {ticker:'POWERGRID',name:'Power Grid Corp',price:312.80,change:4.50,changePct:1.46,sector:'Power',mcap:'2.9L Cr',pe:16.2,high52:345,low52:210,vol:'8.9M',sentiment:{bullish:54,neutral:32,bearish:14},analysis:{catalyst:'Transmission capex cycle. 4% dividend yield.',risk:'Regulated returns capping upside.',technicals:'RSI 55, steady uptrend since 2023.',verdict:'BUY',confidence:66}},
  {ticker:'TRENT',name:'Trent Limited',price:5840.00,change:120.50,changePct:2.11,sector:'Retail',mcap:'2.1L Cr',pe:82.5,high52:6200,low52:2800,vol:'1.2M',sentiment:{bullish:58,neutral:20,bearish:22},analysis:{catalyst:'Zudio scaling massively in tier 2-3 cities.',risk:'Extremely expensive at 82x PE.',technicals:'RSI 64, strong momentum. Parabolic rise.',verdict:'HOLD',confidence:50}},
  {ticker:'ZOMATO',name:'Zomato Limited',price:245.60,change:8.90,changePct:3.76,sector:'Tech',mcap:'2.2L Cr',pe:240.0,high52:280,low52:110,vol:'32.1M',sentiment:{bullish:65,neutral:18,bearish:17},analysis:{catalyst:'Blinkit quick commerce exploding. Path to profitability.',risk:'Heavy cash burn. Competitive intensity.',technicals:'RSI 70, overbought but momentum strong.',verdict:'BUY',confidence:60}},
  {ticker:'HCLTECH',name:'HCL Technologies',price:1542.30,change:-12.40,changePct:-0.80,sector:'IT',mcap:'4.2L Cr',pe:24.1,high52:1780,low52:1280,vol:'3.5M',sentiment:{bullish:38,neutral:40,bearish:22},analysis:{catalyst:'Strong deal wins in cloud infra. Products biz growing.',risk:'Margin pressure from wage hikes.',technicals:'RSI 45, near 100-DMA support.',verdict:'HOLD',confidence:58}},
  {ticker:'KOTAKBANK',name:'Kotak Mahindra Bank',price:1845.20,change:22.60,changePct:1.24,sector:'Banking',mcap:'3.7L Cr',pe:22.8,high52:1980,low52:1550,vol:'4.6M',sentiment:{bullish:45,neutral:35,bearish:20},analysis:{catalyst:'Digital banking push. Deposit growth improving.',risk:'RBI ban on digital onboarding impact.',technicals:'RSI 50, consolidating in 1800-1900 range.',verdict:'HOLD',confidence:56}},
  {ticker:'TATASTEEL',name:'Tata Steel',price:158.90,change:3.40,changePct:2.19,sector:'Metals',mcap:'1.9L Cr',pe:0,high52:184,low52:118,vol:'28.4M',sentiment:{bullish:42,neutral:28,bearish:30},analysis:{catalyst:'Steel demand recovery. China supply cuts helping.',risk:'UK operations restructuring. Debt concerns.',technicals:'RSI 58, breakout above 155 is positive.',verdict:'HOLD',confidence:48}},
  {ticker:'DMART',name:'Avenue Supermarts',price:3920.50,change:-45.20,changePct:-1.14,sector:'Retail',mcap:'2.5L Cr',pe:95.2,high52:4600,low52:3400,vol:'0.5M',sentiment:{bullish:32,neutral:38,bearish:30},analysis:{catalyst:'Store expansion on track. Same-store growth 8%.',risk:'Quick commerce threat. High valuation.',technicals:'RSI 40, below 50-DMA. Weak momentum.',verdict:'SELL',confidence:58}},
  {ticker:'BHARTIARTL',name:'Bharti Airtel',price:1520.40,change:28.60,changePct:1.92,sector:'Telecom',mcap:'8.8L Cr',pe:72.3,high52:1680,low52:1080,vol:'6.8M',sentiment:{bullish:62,neutral:25,bearish:13},analysis:{catalyst:'ARPU growth driven by tariff hikes. 5G rollout.',risk:'Spectrum costs. Africa operations volatile.',technicals:'RSI 60, strong uptrend. New ATH possible.',verdict:'BUY',confidence:74}},
];

let _watchlist = JSON.parse(localStorage.getItem('finsocial_watchlist') || '[]');
let _virtualTrades = JSON.parse(localStorage.getItem('finsocial_trades') || '[]');
let _stocksFilter = 'all';

function renderStocks(selectedTicker){
  if(selectedTicker){
    const s=STOCKS_DATA.find(x=>x.ticker===selectedTicker);
    if(!s)return renderStocksList();
    const pl=s.change>=0;
    const sent=s.sentiment;
    return `<div class="page stock-detail-view" id="stocksPage">
    <button class="stock-back" onclick="navigateStocks()">← Back to Stocks</button>
    <div class="card">
      <div class="stock-info-bar">
        <div><h2>${s.ticker}</h2><div style="font-size:.82rem;color:var(--text2)">${s.name} · ${s.sector}</div></div>
        <div style="text-align:right;display:flex;align-items:center;gap:12px">
          <div><div class="price mono ${pl?'positive':'negative'}" data-live-price="${s.ticker}" data-decimals="2" data-color="true">₹${s.price.toFixed(2)}</div><div class="mono ${pl?'positive':'negative'}" style="font-size:.9rem" data-live-chg="${s.ticker}">${pl?'+':''}₹${s.change.toFixed(2)} (${pl?'+':''}${s.changePct}%)</div></div>
          <button class="btn btn-primary" onclick="openTradeModal('${s.ticker}')">Trade</button>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;font-size:.82rem;color:var(--text2)">
        <span>MCap: <strong>${s.mcap}</strong></span>
        <span>P/E: <strong>${s.pe}</strong></span>
        <span>52W H: <strong class="mono">₹${s.high52}</strong></span>
        <span>52W L: <strong class="mono">₹${s.low52}</strong></span>
        <span>Vol: <strong>${s.vol}</strong></span>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:8px">
        <div class="forum-tabs" id="chartTimeframeTabs">
          <button class="forum-tab" data-tf="1D">1D</button>
          <button class="forum-tab" data-tf="1W">1W</button>
          <button class="forum-tab active" data-tf="1M">1M</button>
          <button class="forum-tab" data-tf="3M">3M</button>
          <button class="forum-tab" data-tf="1Y">1Y</button>
        </div>
      </div>
      <div class="chart-area" style="margin-top:0"><canvas id="stockChart"></canvas></div>
    </div>
    <!-- Sentiment Meter -->
    <div class="card" style="margin-top:16px">
      <div class="card-title">Community Sentiment</div>
      <div class="sentiment-meter">
        <div class="sentiment-bar">
          <div class="sentiment-fill bullish" style="width:${sent.bullish}%"></div>
          <div class="sentiment-fill neutral" style="width:${sent.neutral}%"></div>
          <div class="sentiment-fill bearish" style="width:${sent.bearish}%"></div>
        </div>
        <div class="sentiment-labels">
          <span class="sentiment-label positive">🟢 Bullish ${sent.bullish}%</span>
          <span class="sentiment-label" style="color:var(--text3)">⚪ Neutral ${sent.neutral}%</span>
          <span class="sentiment-label negative">🔴 Bearish ${sent.bearish}%</span>
        </div>
        <div class="sentiment-verdict">${sent.bullish>50?'Overall: <strong class="positive">Bullish</strong>':sent.bearish>50?'Overall: <strong class="negative">Bearish</strong>':'Overall: <strong>Neutral</strong>'} <span style="color:var(--text3)">(based on ${Math.floor(Math.random()*200+100)} community votes & signals)</span></div>
      </div>
    </div>
    <div class="analysis-grid">
      <div class="ai-card">
        <div class="card-title" style="margin-top:8px">Signal: <span class="${s.analysis.verdict==='BUY'?'positive':s.analysis.verdict==='SELL'?'negative':''}" style="font-size:1.1rem">${s.analysis.verdict}</span> <span style="font-size:.82rem;color:var(--text3)">(${s.analysis.confidence}% confidence)</span></div>
        <p style="font-size:.85rem;color:var(--text2);line-height:1.6">${s.analysis.technicals}</p>
      </div>
      <div class="card">
        <div class="card-title">P&L Reasoning</div>
        <div style="margin-bottom:12px"><span class="badge badge-green" style="margin-bottom:6px">Catalyst</span><p style="font-size:.85rem;color:var(--text2);line-height:1.5;margin-top:4px">${s.analysis.catalyst}</p></div>
        <div><span class="badge badge-red" style="margin-bottom:6px">Risk</span><p style="font-size:.85rem;color:var(--text2);line-height:1.5;margin-top:4px">${s.analysis.risk}</p></div>
      </div>
    </div>
  </div>`;
  }
  return renderStocksList();
}

function renderStocksList(){
  let stocks = [...STOCKS_DATA];
  if(_stocksFilter==='watchlist') stocks = stocks.filter(s=>_watchlist.includes(s.ticker));
  return `<div class="page" id="stocksPage">
  <h1 class="page-title">Stocks</h1>
  <div style="display:flex;gap:8px;margin-bottom:16px;align-items:center;flex-wrap:wrap">
    <input class="stocks-search" id="stocksSearch" placeholder="Search ${STOCKS_DATA.length} stocks by name or ticker..." style="flex:1;margin-bottom:0" />
    <div class="forum-tabs">
      <button class="forum-tab${_stocksFilter==='all'?' active':''}" data-sf="all">All (${STOCKS_DATA.length})</button>
      <button class="forum-tab${_stocksFilter==='watchlist'?' active':''}" data-sf="watchlist">★ Watchlist (${_watchlist.length})</button>
    </div>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table class="data-table" id="stocksTable">
        <thead><tr><th></th><th>Ticker</th><th>Company</th><th>Price</th><th>Change</th><th>Sector</th><th>Sentiment</th><th>Signal</th></tr></thead>
        <tbody>
          ${stocks.map(s=>{const pl=s.change>=0;const w=_watchlist.includes(s.ticker);return `<tr>
            <td><button class="watchlist-star${w?' active':''}" data-ticker="${s.ticker}" onclick="event.stopPropagation();toggleWatchlist('${s.ticker}')">${w?'★':'☆'}</button></td>
            <td class="mono" style="font-weight:700;cursor:pointer" onclick="navigateStocks('${s.ticker}')">${s.ticker}</td>
            <td style="cursor:pointer" onclick="navigateStocks('${s.ticker}')">${s.name}</td>
            <td class="mono" data-live-price="${s.ticker}" data-decimals="2">₹${s.price.toFixed(2)}</td>
            <td class="mono ${pl?'positive':'negative'}" data-live-chg="${s.ticker}">${pl?'+':''}${s.changePct}%</td>
            <td><span class="badge badge-gray">${s.sector}</span></td>
            <td><div class="mini-sentiment"><div class="mini-sent-fill" style="width:${s.sentiment.bullish}%;background:${s.sentiment.bullish>50?'var(--green)':s.sentiment.bearish>50?'var(--red)':'var(--text3)'}"></div></div></td>
            <td><span class="badge ${s.analysis.verdict==='BUY'?'badge-green':s.analysis.verdict==='SELL'?'badge-red':'badge-gray'}">${s.analysis.verdict}</span></td>
          </tr>`}).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <!-- Trade Modal -->
  <div class="modal-overlay" id="tradeModal" style="display:none">
    <div class="modal-card" id="tradeModalContent"></div>
  </div>
</div>`;
}

window.navigateStocks = function(ticker){
  window._selectedStock = ticker || null;
  document.getElementById('main').innerHTML = renderStocks(window._selectedStock);
  initStocks();
};

window.toggleWatchlist = function(ticker){
  const idx = _watchlist.indexOf(ticker);
  if(idx>=0) _watchlist.splice(idx,1); else _watchlist.push(ticker);
  localStorage.setItem('finsocial_watchlist',JSON.stringify(_watchlist));
  document.getElementById('main').innerHTML = renderStocks(window._selectedStock);
  initStocks();
};

window.openTradeModal = function(ticker){
  const s = STOCKS_DATA.find(x=>x.ticker===ticker);
  if(!s) return;
  const modal = document.getElementById('tradeModal') || createTradeModal();
  document.getElementById('tradeModalContent').innerHTML = `
    <button class="modal-close" onclick="closeTradeModal()">✕</button>
    <h3 style="margin-bottom:16px">Trade ${s.ticker}</h3>
    <div class="trade-tabs">
      <button class="trade-tab active" data-side="BUY" onclick="setTradeSide(this,'BUY')">BUY</button>
      <button class="trade-tab" data-side="SELL" onclick="setTradeSide(this,'SELL')">SELL</button>
    </div>
    <div class="form-group"><label class="form-label">Price</label><input class="form-input mono" id="tradePrice" value="₹${s.price.toFixed(2)}" readonly /></div>
    <div class="form-group"><label class="form-label">Quantity</label><input class="form-input mono" type="number" id="tradeQty" value="10" min="1" oninput="updateTradeTotal('${s.ticker}')" /></div>
    <div class="trade-total">
      <span>Estimated Total</span>
      <span class="mono" id="tradeTotal" style="font-weight:700">₹${(s.price*10).toFixed(2)}</span>
    </div>
    <input type="hidden" id="tradeSide" value="BUY" />
    <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="executeTrade('${s.ticker}')">Place Order</button>
    <div class="auth-security" style="margin-top:12px">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>Virtual trade — simulated with historical prices</span>
    </div>`;
  modal.style.display = 'flex';
};

window.closeTradeModal = function(){ const m=document.getElementById('tradeModal'); if(m) m.style.display='none'; };

window.setTradeSide = function(el, side){
  document.querySelectorAll('.trade-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tradeSide').value = side;
};

window.updateTradeTotal = function(ticker){
  const s=STOCKS_DATA.find(x=>x.ticker===ticker);
  const qty=parseInt(document.getElementById('tradeQty').value)||0;
  document.getElementById('tradeTotal').textContent = '₹'+(s.price*qty).toFixed(2);
};

window.executeTrade = function(ticker){
  const s=STOCKS_DATA.find(x=>x.ticker===ticker);
  const qty=parseInt(document.getElementById('tradeQty').value)||0;
  const side=document.getElementById('tradeSide').value;
  if(qty<=0) return;
  const trade = {ticker,side,qty,price:s.price,total:s.price*qty,time:new Date().toLocaleString()};
  _virtualTrades.push(trade);
  localStorage.setItem('finsocial_trades',JSON.stringify(_virtualTrades));
  closeTradeModal();
  // Show confirmation
  const main=document.getElementById('main');
  const toast=document.createElement('div');
  toast.className='trade-toast';
  toast.innerHTML=`✅ ${side} order executed: ${qty} shares of <strong>${ticker}</strong> at ₹${s.price.toFixed(2)}`;
  main.appendChild(toast);
  setTimeout(()=>toast.remove(),3000);
};

function createTradeModal(){
  const div=document.createElement('div');
  div.className='modal-overlay';div.id='tradeModal';div.style.display='none';
  div.innerHTML='<div class="modal-card" id="tradeModalContent"></div>';
  document.getElementById('stocksPage').appendChild(div);
  div.addEventListener('click',(e)=>{if(e.target===div)closeTradeModal()});
  return div;
}

function initStocks(){
  const c=document.getElementById('stockChart');
  if(c){
    const ct=c.parentElement;c.width=ct.clientWidth*2;c.height=ct.clientHeight*2;
    c.style.width=ct.clientWidth+'px';c.style.height=ct.clientHeight+'px';
    const ctx=c.getContext('2d');ctx.scale(2,2);
    const W=ct.clientWidth,H=ct.clientHeight;
    const s=STOCKS_DATA.find(x=>x.ticker===window._selectedStock);
    
    const drawStockChart = (timeframe, isLiveUpdate = false) => {
      ctx.clearRect(0,0,W,H);
      const base=s?s.price*.95:2850;const top_=s?s.price*1.03:3000;
      
      let bars=50; let variance=0.03;
      if (timeframe === '1D') { bars=30; variance=0.01; }
      else if (timeframe === '1W') { bars=40; variance=0.02; }
      else if (timeframe === '1M') { bars=50; variance=0.03; }
      else if (timeframe === '3M') { bars=60; variance=0.05; }
      else if (timeframe === '1Y') { bars=80; variance=0.08; }
      
      window._chartDataCache = window._chartDataCache || {};
      if (window._chartDataCache.ticker !== (s?s.ticker:'')) window._chartDataCache = { ticker: s?s.ticker:'' };
      
      let data = window._chartDataCache[timeframe];
      if (!data) {
        data=[];let p=base+Math.random()*(top_-base)*.5;
        for(let i=0;i<bars;i++){const ch=(Math.random()-.45)*((top_-base)*variance);const o=p,cl=p+ch;
          data.push({o,c:cl,h:Math.max(o,cl)+Math.random()*(top_-base)*(variance/2),l:Math.min(o,cl)-Math.random()*(top_-base)*(variance/2)});
          p=Math.max(base,Math.min(top_,cl))}
        window._chartDataCache[timeframe] = data;
      }
        
      if (s && data.length > 0) {
        const last = data[data.length-1];
        if (isLiveUpdate) {
          last.c = s.price;
          last.h = Math.max(last.h, s.price);
          last.l = Math.min(last.l, s.price);
        } else {
          const diff = s.price - last.c;
          last.c = s.price; last.h = Math.max(last.h, s.price); last.l = Math.min(last.l, s.price);
          for(let i=data.length-1; i>=Math.max(0, data.length-5); i--) {
             data[i].c += diff * (1 - (data.length - 1 - i) * 0.2);
             data[i].o += diff * (1 - (data.length - i) * 0.2);
             data[i].h += diff * (1 - (data.length - 1 - i) * 0.2);
             data[i].l += diff * (1 - (data.length - 1 - i) * 0.2);
          }
        }
      }

      const minL=Math.min(...data.map(d=>d.l)),maxH=Math.max(...data.map(d=>d.h)),range=maxH-minL||1;
      const yS=v=>20+(1-(v-minL)/range)*(H-50);const bW=(W-70)/bars;
      ctx.strokeStyle='#e9ecef';ctx.lineWidth=.5;
      for(let i=0;i<=4;i++){const y=20+i*((H-50)/4);ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(W-10,y);ctx.stroke();
        ctx.fillStyle='#adb5bd';ctx.font='9px JetBrains Mono';ctx.textAlign='right';ctx.fillText('₹'+(maxH-(i/4)*range).toFixed(0),W-12,y+3)}
      
      ctx.fillStyle='#adb5bd';ctx.font='10px Inter';ctx.textAlign='center';
      for(let i=1;i<5;i++){
        const x = 20 + i*((W-70)/5);
        let lbl = '';
        const now = new Date();
        if (timeframe === '1D') { now.setHours(now.getHours() - (5-i)*1); lbl = now.getHours() + ':00'; }
        else if (timeframe === '1W') { now.setDate(now.getDate() - (5-i)*1); lbl = now.toLocaleDateString('en-US', {weekday:'short'}); }
        else if (timeframe === '1M') { now.setDate(now.getDate() - (5-i)*6); lbl = now.toLocaleDateString('en-US', {day:'numeric', month:'short'}); }
        else if (timeframe === '3M') { now.setMonth(now.getMonth() - (5-i)*1); lbl = now.toLocaleDateString('en-US', {month:'short'}); }
        else if (timeframe === '1Y') { now.setMonth(now.getMonth() - (5-i)*2); lbl = now.toLocaleDateString('en-US', {month:'short', year:'2-digit'}); }
        ctx.fillText(lbl, x, H-5);
      }

      data.forEach((d,i)=>{const x=20+i*bW+bW/2;const up=d.c>=d.o;const col=up?'#16a34a':'#dc2626';
        ctx.strokeStyle=col;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,yS(d.h));ctx.lineTo(x,yS(d.l));ctx.stroke();
        const bT=yS(Math.max(d.o,d.c)),bB=yS(Math.min(d.o,d.c));ctx.fillStyle=col;ctx.fillRect(x-bW*.3,bT,bW*.6,Math.max(bB-bT,1))});
      ctx.strokeStyle='#2563eb';ctx.lineWidth=1.5;ctx.globalAlpha=.5;ctx.beginPath();
      for(let i=7;i<data.length;i++){let sm=0;for(let j=i-7;j<=i;j++)sm+=data[j].c;const a=sm/8;const x=20+i*bW+bW/2;i===7?ctx.moveTo(x,yS(a)):ctx.lineTo(x,yS(a))}ctx.stroke();ctx.globalAlpha=1;
    };
    
    drawStockChart('1M');

    window.updateLiveChart = () => {
      const activeTab = document.querySelector('#chartTimeframeTabs .forum-tab.active');
      if (activeTab) drawStockChart(activeTab.dataset.tf, true);
    };

    document.querySelectorAll('#chartTimeframeTabs .forum-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#chartTimeframeTabs .forum-tab').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        drawStockChart(e.target.dataset.tf);
      });
    });
  }
  // Search
  const search=document.getElementById('stocksSearch');
  if(search){search.addEventListener('input',()=>{
    const q=search.value.toLowerCase();
    document.querySelectorAll('#stocksTable tbody tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'});
  })}
  // Filter tabs
  document.querySelectorAll('[data-sf]').forEach(t=>{
    t.addEventListener('click',()=>{_stocksFilter=t.dataset.sf;navigateStocks()});
  });
}
