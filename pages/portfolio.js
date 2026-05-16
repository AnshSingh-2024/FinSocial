/* Portfolio Page with AI Optimizer — Enhanced */

const getPortfolioHoldings = () => {
  return [
    {ticker:'RELIANCE',qty:50,avg:2820,sector:'Energy'},
    {ticker:'TCS',qty:30,avg:3510,sector:'IT'},
    {ticker:'INFY',qty:80,avg:1490,sector:'IT'},
    {ticker:'HDFCBANK',qty:40,avg:1620,sector:'Banking'},
    {ticker:'ITC',qty:100,avg:440,sector:'FMCG'},
    {ticker:'BAJFINANCE',qty:15,avg:7800,sector:'NBFC'},
    {ticker:'TATAMOTORS',qty:60,avg:920,sector:'Auto'},
    {ticker:'SUNPHARMA',qty:45,avg:1580,sector:'Pharma'},
  ].map(h => {
    const s = typeof STOCKS_DATA !== 'undefined' ? STOCKS_DATA.find(x => x.ticker === h.ticker) : null;
    if (s) { h.ltp = s.price; h.dayChg = s.changePct; h.absChg = s.change; }
    else { h.ltp = h.avg; h.dayChg = 0; h.absChg = 0; }
    return h;
  });
};

const renderPortSummary = (holdings) => {
  const totalVal=holdings.reduce((s,h)=>s+h.qty*h.ltp,0);
  const totalInvested=holdings.reduce((s,h)=>s+h.qty*h.avg,0);
  const totalPL=totalVal-totalInvested;
  const totalPLPct=((totalPL/totalInvested)*100).toFixed(2);
  const dayChange=holdings.reduce((s,h)=>s+(h.qty*h.absChg),0);
  return `
    <div class="card port-stat"><div class="val">₹${(totalVal/100000).toFixed(2)}L</div><div class="lbl">Total Value</div></div>
    <div class="card port-stat"><div class="val ${totalPL>=0?'positive':'negative'}">${totalPL>=0?'+':''}₹${(totalPL/1000).toFixed(1)}K</div><div class="lbl">Total P&L</div></div>
    <div class="card port-stat"><div class="val ${totalPL>=0?'positive':'negative'}">${totalPL>=0?'+':''}${totalPLPct}%</div><div class="lbl">Returns</div></div>
    <div class="card port-stat"><div class="val ${dayChange>=0?'positive':'negative'}">${dayChange>=0?'+':''}₹${(dayChange/1000).toFixed(1)}K</div><div class="lbl">Today's Change</div></div>
  `;
};

const renderPortHoldings = (holdings) => {
  const totalVal=holdings.reduce((s,h)=>s+h.qty*h.ltp,0);
  return holdings.map(h=>{
    const val=h.qty*h.ltp;const pl=h.qty*(h.ltp-h.avg);const plPct=((h.ltp-h.avg)/h.avg*100).toFixed(2);const alloc=((val/totalVal)*100).toFixed(1);
    return `<tr>
      <td class="mono" style="font-weight:700">${h.ticker}</td>
      <td>${h.qty}</td>
      <td class="mono">₹${h.avg.toFixed(2)}</td>
      <td class="mono">₹${h.ltp.toFixed(2)}</td>
      <td class="mono">₹${(val/1000).toFixed(1)}K</td>
      <td class="mono ${pl>=0?'positive':'negative'}">${pl>=0?'+':''}₹${pl.toFixed(0)}</td>
      <td class="mono ${pl>=0?'positive':'negative'}">${pl>=0?'+':''}${plPct}%</td>
      <td class="mono ${h.dayChg>=0?'positive':'negative'}">${h.dayChg>=0?'+':''}${h.dayChg.toFixed(2)}%</td>
      <td>${alloc}%</td>
    </tr>`;
  }).join('');
};

window.updateLivePortfolio = function() {
  const h = getPortfolioHoldings();
  const summary = document.getElementById('portSummary');
  if (summary) summary.innerHTML = renderPortSummary(h);
  const table = document.getElementById('portHoldingsBody');
  if (table) table.innerHTML = renderPortHoldings(h);
};

function renderPortfolio(){
  const holdings = getPortfolioHoldings();
  const totalVal=holdings.reduce((s,h)=>s+h.qty*h.ltp,0);
  const totalInvested=holdings.reduce((s,h)=>s+h.qty*h.avg,0);
  const totalPL=totalVal-totalInvested;
  const totalPLPct=((totalPL/totalInvested)*100).toFixed(2);

  // Sector allocation
  const sectorMap={};
  holdings.forEach(h=>{
    const val=h.qty*h.ltp;
    sectorMap[h.sector]=(sectorMap[h.sector]||0)+val;
  });
  const sectorColors={Energy:'#f59e0b',IT:'#3b82f6',Banking:'#10b981',FMCG:'#8b5cf6',NBFC:'#ef4444',Auto:'#06b6d4',Pharma:'#ec4899'};

  // Risk metrics
  const sharpeRatio = 1.42;
  const beta = 0.94;
  const maxDrawdown = -8.3;
  const diversificationScore = 78;

  const optimizerResults=[
    {ticker:'RELIANCE',action:'BUY',currentAlloc:((holdings[0].qty*holdings[0].ltp/totalVal)*100).toFixed(1),targetAlloc:'32.0',reason:'Strong Jio subscriber growth, bullish MACD crossover, and 50-DMA trending above 200-DMA. Confidence: 78%.'},
    {ticker:'TCS',action:'SELL',currentAlloc:((holdings[1].qty*holdings[1].ltp/totalVal)*100).toFixed(1),targetAlloc:'10.0',reason:'Earnings miss in Q4, US IT spending slowdown, and negative RSI divergence. Reallocate to higher-conviction positions. Confidence: 71%.'},
    {ticker:'INFY',action:'HOLD',currentAlloc:((holdings[2].qty*holdings[2].ltp/totalVal)*100).toFixed(1),targetAlloc:((holdings[2].qty*holdings[2].ltp/totalVal)*100).toFixed(1),reason:'Stable positioning with margin expansion story intact. Fair valuation at 22x PE. No action recommended. Confidence: 65%.'},
    {ticker:'HDFCBANK',action:'BUY',currentAlloc:((holdings[3].qty*holdings[3].ltp/totalVal)*100).toFixed(1),targetAlloc:'18.0',reason:'Credit growth acceleration, improving NIMs, and favorable regulatory environment. Banking sector poised for re-rating. Confidence: 74%.'},
    {ticker:'ITC',action:'HOLD',currentAlloc:((holdings[4].qty*holdings[4].ltp/totalVal)*100).toFixed(1),targetAlloc:((holdings[4].qty*holdings[4].ltp/totalVal)*100).toFixed(1),reason:'Defensive positioning justified in current macro uncertainty. Hotel business providing growth kicker. Maintain position. Confidence: 60%.'},
    {ticker:'BAJFINANCE',action:'BUY',currentAlloc:((holdings[5].qty*holdings[5].ltp/totalVal)*100).toFixed(1),targetAlloc:'16.0',reason:'AUM growth at 32% YoY, record customer additions. Digital lending platform scaling rapidly. Increase allocation. Confidence: 72%.'},
    {ticker:'TATAMOTORS',action:'HOLD',currentAlloc:((holdings[6].qty*holdings[6].ltp/totalVal)*100).toFixed(1),targetAlloc:((holdings[6].qty*holdings[6].ltp/totalVal)*100).toFixed(1),reason:'JLR recovery on track, EV transition progressing. Maintain current weight as cyclical buffer. Confidence: 58%.'},
    {ticker:'SUNPHARMA',action:'BUY',currentAlloc:((holdings[7].qty*holdings[7].ltp/totalVal)*100).toFixed(1),targetAlloc:'12.0',reason:'Specialty pharma pipeline strong, US generics stabilizing. Defensive sector allocation useful in current environment. Confidence: 66%.'},
  ];

  // Efficient frontier data (simulated)
  const benchmarkReturn = 14.2;
  const portfolioReturn = parseFloat(totalPLPct);

  return `<div class="page" id="portfolioPage">
  <h1 class="page-title">Portfolio</h1>

  <!-- Summary Stats -->
  <div class="port-summary" id="portSummary">
    ${renderPortSummary(holdings)}
  </div>

  <!-- Risk Metrics -->
  <div class="risk-metrics-grid">
    <div class="card risk-metric">
      <div class="risk-metric-icon" style="background:#eff6ff;color:#2563eb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div><div class="risk-val">${sharpeRatio}</div><div class="risk-lbl">Sharpe Ratio</div></div>
    </div>
    <div class="card risk-metric">
      <div class="risk-metric-icon" style="background:#f0fdf4;color:#16a34a">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
      </div>
      <div><div class="risk-val">${beta}</div><div class="risk-lbl">Portfolio Beta</div></div>
    </div>
    <div class="card risk-metric">
      <div class="risk-metric-icon" style="background:#fef2f2;color:#dc2626">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
      </div>
      <div><div class="risk-val negative">${maxDrawdown}%</div><div class="risk-lbl">Max Drawdown</div></div>
    </div>
    <div class="card risk-metric">
      <div class="risk-metric-icon" style="background:#faf5ff;color:#8b5cf6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div><div class="risk-val">${diversificationScore}/100</div><div class="risk-lbl">Diversification</div></div>
    </div>
  </div>

  <!-- Holdings Table -->
  <div class="card holdings-section">
    <div class="card-title">Current Holdings</div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Ticker</th><th>Qty</th><th>Avg Cost</th><th>LTP</th><th>Current Val</th><th>P&L</th><th>P&L %</th><th>Day %</th><th>Alloc %</th></tr></thead>
        <tbody id="portHoldingsBody">
          ${renderPortHoldings(holdings)}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Sector Allocation + Performance -->
  <div class="grid-2" style="margin-top:16px">
    <div class="card">
      <div class="card-title">Sector Allocation</div>
      <div class="sector-chart" id="sectorChart">
        ${Object.entries(sectorMap).map(([sector, val]) => {
          const pct = ((val/totalVal)*100).toFixed(1);
          return `<div class="sector-bar-row">
            <div class="sector-bar-label">${sector}</div>
            <div class="sector-bar-track">
              <div class="sector-bar-fill" style="width:${pct}%;background:${sectorColors[sector]||'#6b7280'}"></div>
            </div>
            <div class="sector-bar-val mono">${pct}%</div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-title">Performance vs Benchmark</div>
      <div class="perf-comparison">
        <div class="perf-row">
          <span class="perf-label">Your Portfolio</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill" style="width:${Math.min(portfolioReturn * 3, 100)}%;background:linear-gradient(90deg,#2563eb,#3b82f6)"></div>
          </div>
          <span class="perf-val mono positive">+${portfolioReturn}%</span>
        </div>
        <div class="perf-row">
          <span class="perf-label">NIFTY 50</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill" style="width:${Math.min(benchmarkReturn * 3, 100)}%;background:linear-gradient(90deg,#6b7280,#9ca3af)"></div>
          </div>
          <span class="perf-val mono positive">+${benchmarkReturn}%</span>
        </div>
        <div class="perf-row">
          <span class="perf-label">Alpha</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill" style="width:${Math.min(Math.abs(portfolioReturn - benchmarkReturn) * 6, 100)}%;background:${portfolioReturn > benchmarkReturn ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#dc2626,#ef4444)'}"></div>
          </div>
          <span class="perf-val mono ${portfolioReturn > benchmarkReturn ? 'positive' : 'negative'}">${portfolioReturn > benchmarkReturn ? '+' : ''}${(portfolioReturn - benchmarkReturn).toFixed(2)}%</span>
        </div>
      </div>
      <div class="chart-area" style="height:200px"><canvas id="portfolioChart"></canvas></div>
    </div>
  </div>

  <!-- Efficient Frontier -->
  <div class="ai-card" style="margin-top:20px">
    <div class="card-title" style="margin-top:8px">Efficient Frontier — Portfolio Optimization</div>
    <p style="font-size:.82rem;color:var(--text2);margin-bottom:12px">Your portfolio plotted against the efficient frontier using Modern Portfolio Theory. The optimal portfolio maximizes return for a given level of risk.</p>
    <div class="chart-area" style="height:280px"><canvas id="efficientFrontierChart"></canvas></div>
    <div class="frontier-legend">
      <span class="frontier-legend-item"><span class="frontier-dot" style="background:#2563eb"></span>Efficient Frontier</span>
      <span class="frontier-legend-item"><span class="frontier-dot" style="background:#16a34a"></span>Your Portfolio</span>
      <span class="frontier-legend-item"><span class="frontier-dot" style="background:#f59e0b"></span>Optimized Portfolio</span>
      <span class="frontier-legend-item"><span class="frontier-dot" style="background:#6b7280"></span>Individual Stocks</span>
    </div>
  </div>

  <!-- AI Recommendations -->
  <div class="ai-card optimizer-section" style="margin-top:20px">
    <div class="card-title" style="margin-top:8px">Portfolio Optimizer — AI Recommendations</div>
    <p style="font-size:.82rem;color:var(--text2);margin-bottom:16px">Based on technical indicators, fundamental analysis, and portfolio risk optimization using Modern Portfolio Theory.</p>
    <div class="opt-grid">
      ${optimizerResults.map(o=>`<div class="opt-item">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="ticker mono">${o.ticker}</span>
          <span class="badge ${o.action==='BUY'?'badge-green':o.action==='SELL'?'badge-red':'badge-gray'}">${o.action}</span>
        </div>
        <div class="opt-alloc">
          <span>Current: <strong>${o.currentAlloc}%</strong></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Target: <strong class="${parseFloat(o.targetAlloc) > parseFloat(o.currentAlloc) ? 'positive' : parseFloat(o.targetAlloc) < parseFloat(o.currentAlloc) ? 'negative' : ''}">${o.targetAlloc}%</strong></span>
        </div>
        <div class="reason">${o.reason}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Correlation Matrix -->
  <div class="card" style="margin-top:20px">
    <div class="card-title">Correlation Matrix (Top Holdings)</div>
    <p style="font-size:.82rem;color:var(--text2);margin-bottom:12px">Shows how your holdings move relative to each other. Lower correlation = better diversification.</p>
    <div class="table-wrap">
      <table class="data-table correlation-table" id="corrTable">
        <thead><tr><th></th>${holdings.slice(0,6).map(h=>`<th class="mono">${h.ticker.substring(0,4)}</th>`).join('')}</tr></thead>
        <tbody>
          ${holdings.slice(0,6).map((h1,i)=>`<tr>
            <td class="mono" style="font-weight:700">${h1.ticker.substring(0,4)}</td>
            ${holdings.slice(0,6).map((h2,j)=>{
              let corr;
              if(i===j) corr=1.00;
              else {
                const seed=(i+1)*(j+1)*7;
                corr = h1.sector===h2.sector ? (0.55 + (seed%30)/100) : (0.10 + (seed%40)/100);
                corr = Math.min(corr, 0.95);
              }
              const bg = i===j ? '#f3f4f6' : corr > 0.6 ? '#fef2f2' : corr > 0.3 ? '#fffbeb' : '#f0fdf4';
              return `<td class="mono" style="background:${bg};text-align:center;font-size:.78rem">${corr.toFixed(2)}</td>`;
            }).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Trade History -->
  <div class="card" style="margin-top:20px">
    <div class="card-title">Trade History</div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Time</th><th>Side</th><th>Ticker</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${(JSON.parse(localStorage.getItem('finsocial_trades')||'[]')).reverse().map(t=>`<tr>
            <td style="font-size:.78rem">${t.time}</td>
            <td><span class="badge ${t.side==='BUY'?'badge-green':'badge-red'}">${t.side}</span></td>
            <td class="mono" style="font-weight:700">${t.ticker}</td>
            <td>${t.qty}</td>
            <td class="mono">₹${t.price.toFixed(2)}</td>
            <td class="mono">₹${t.total.toFixed(2)}</td>
          </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">No trades yet. Go to Stocks → click any stock → Trade to place your first virtual order.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>
</div>`;
}

function initPortfolio(){
  // Portfolio performance chart (equity curve)
  const c = document.getElementById('portfolioChart');
  if(c){
    const ct=c.parentElement;c.width=ct.clientWidth*2;c.height=ct.clientHeight*2;
    c.style.width=ct.clientWidth+'px';c.style.height=ct.clientHeight+'px';
    const ctx=c.getContext('2d');ctx.scale(2,2);
    const W=ct.clientWidth,H=ct.clientHeight;
    const pts=30;
    const portfolioData=[];const niftyData=[];
    let pv=100,nv=100;
    for(let i=0;i<pts;i++){
      pv+=((Math.random()-.42)*2.5);nv+=((Math.random()-.44)*2);
      portfolioData.push(pv);niftyData.push(nv);
    }
    const allVals=[...portfolioData,...niftyData];
    const mn=Math.min(...allVals)-2,mx=Math.max(...allVals)+2,rng=mx-mn;
    const yS=v=>10+(1-(v-mn)/rng)*(H-20);
    const xS=i=>10+i*((W-20)/(pts-1));

    // Grid
    ctx.strokeStyle='#e9ecef';ctx.lineWidth=0.5;
    for(let i=0;i<=4;i++){const y=10+i*((H-20)/4);ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke()}

    // NIFTY line
    ctx.strokeStyle='#9ca3af';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.beginPath();
    portfolioData.forEach((_,i)=>{const x=xS(i),y=yS(niftyData[i]);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});
    ctx.stroke();ctx.setLineDash([]);

    // Portfolio line
    ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.beginPath();
    portfolioData.forEach((v,i)=>{const x=xS(i),y=yS(v);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});
    ctx.stroke();

    // Fill under portfolio
    ctx.globalAlpha=0.08;ctx.fillStyle='#2563eb';ctx.beginPath();
    portfolioData.forEach((v,i)=>{const x=xS(i),y=yS(v);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)});
    ctx.lineTo(xS(pts-1),H-10);ctx.lineTo(xS(0),H-10);ctx.fill();ctx.globalAlpha=1;

    // Labels
    ctx.font='9px JetBrains Mono';ctx.fillStyle='#2563eb';ctx.fillText('Portfolio',W-55,yS(portfolioData[pts-1])-4);
    ctx.fillStyle='#9ca3af';ctx.fillText('NIFTY',W-50,yS(niftyData[pts-1])+12);
  }

  // Efficient Frontier chart
  const ef = document.getElementById('efficientFrontierChart');
  if(ef){
    const ct=ef.parentElement;ef.width=ct.clientWidth*2;ef.height=ct.clientHeight*2;
    ef.style.width=ct.clientWidth+'px';ef.style.height=ct.clientHeight+'px';
    const ctx=ef.getContext('2d');ctx.scale(2,2);
    const W=ct.clientWidth,H=ct.clientHeight;
    const pad=40;

    // Axes
    ctx.strokeStyle='#e9ecef';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pad,10);ctx.lineTo(pad,H-pad);ctx.lineTo(W-10,H-pad);ctx.stroke();

    // Labels
    ctx.font='9px Inter';ctx.fillStyle='#868e96';ctx.textAlign='center';
    ctx.fillText('Risk (Std Dev %)',W/2,H-8);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);ctx.fillText('Expected Return %',0,0);ctx.restore();

    // Grid lines
    ctx.strokeStyle='#f1f3f5';ctx.lineWidth=0.5;
    for(let i=1;i<=5;i++){
      const y=H-pad-(i/5)*(H-pad-10);
      ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-10,y);ctx.stroke();
      ctx.fillStyle='#adb5bd';ctx.font='8px JetBrains Mono';ctx.textAlign='right';
      ctx.fillText((i*6)+'%',pad-4,y+3);
    }
    for(let i=1;i<=5;i++){
      const x=pad+i*((W-pad-10)/5);
      ctx.beginPath();ctx.moveTo(x,10);ctx.lineTo(x,H-pad);ctx.stroke();
      ctx.fillStyle='#adb5bd';ctx.font='8px JetBrains Mono';ctx.textAlign='center';
      ctx.fillText((i*5)+'%',x,H-pad+12);
    }

    // Efficient frontier curve
    const xScale=(v)=>pad+(v/25)*(W-pad-10);
    const yScale=(v)=>(H-pad)-(v/30)*(H-pad-10);
    ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.beginPath();
    const frontierPts=[[5,8],[7,12],[10,16],[13,19],[16,21.5],[19,23],[22,24],[25,24.5]];
    frontierPts.forEach(([x,y],i)=>{i===0?ctx.moveTo(xScale(x),yScale(y)):ctx.lineTo(xScale(x),yScale(y))});
    ctx.stroke();

    // Fill area under frontier
    ctx.globalAlpha=0.05;ctx.fillStyle='#2563eb';ctx.beginPath();
    frontierPts.forEach(([x,y],i)=>{i===0?ctx.moveTo(xScale(x),yScale(y)):ctx.lineTo(xScale(x),yScale(y))});
    ctx.lineTo(xScale(25),yScale(0));ctx.lineTo(xScale(5),yScale(0));ctx.fill();ctx.globalAlpha=1;

    // Individual stock scatter points
    const stockPts=[[12,14],[18,11],[11,16],[9,17],[8,10],[20,19],[15,13],[14,15]];
    ctx.fillStyle='#9ca3af';
    stockPts.forEach(([x,y])=>{ctx.beginPath();ctx.arc(xScale(x),yScale(y),4,0,Math.PI*2);ctx.fill()});

    // Current portfolio
    ctx.fillStyle='#16a34a';ctx.beginPath();ctx.arc(xScale(13),yScale(17),7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#16a34a';ctx.font='bold 9px Inter';ctx.textAlign='left';ctx.fillText('You',xScale(13)+10,yScale(17)+3);

    // Optimized portfolio
    ctx.fillStyle='#f59e0b';ctx.beginPath();ctx.arc(xScale(11),yScale(19.5),7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f59e0b';ctx.font='bold 9px Inter';ctx.fillText('Optimal',xScale(11)+10,yScale(19.5)+3);

    // Arrow from current to optimal
    ctx.strokeStyle='#f59e0b';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();
    ctx.moveTo(xScale(13),yScale(17));ctx.lineTo(xScale(11),yScale(19.5));ctx.stroke();ctx.setLineDash([]);
  }
}
