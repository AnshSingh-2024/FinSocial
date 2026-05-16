/* FinSocial — SPA Router with Auth & Notifications */
(function(){
  // ── Notifications Data ──
  const NOTIFICATIONS = [
    { id: 1, type: 'signal', icon: '📊', text: '<strong>BUY Signal</strong> on RELIANCE — 78% confidence', time: '2 min ago', unread: true },
    { id: 2, type: 'reply', icon: '💬', text: '<strong>Vikram Malhotra</strong> answered your question on NIFTY options', time: '15 min ago', unread: true },
    { id: 3, type: 'trade', icon: '✅', text: 'Your <strong>BUY</strong> order for 50 shares of HDFCBANK executed at ₹1,695.30', time: '1 hour ago', unread: true },
    { id: 4, type: 'signal', icon: '📉', text: '<strong>SELL Signal</strong> on TCS — 71% confidence. RSI approaching oversold.', time: '2 hours ago', unread: true },
    { id: 5, type: 'mention', icon: '🏷️', text: '<strong>Ananya Patel</strong> mentioned you in #stock-picks', time: '3 hours ago', unread: true },
    { id: 6, type: 'badge', icon: '🏆', text: 'You ranked <strong>#3 on the Weekly Leaderboard</strong>! +5.73% returns', time: '5 hours ago', unread: false },
    { id: 7, type: 'reply', icon: '💬', text: '<strong>Rahul Sharma</strong> upvoted your answer on MACD divergence', time: '6 hours ago', unread: false },
    { id: 8, type: 'trade', icon: '✅', text: 'Your <strong>SELL</strong> order for 30 shares of TCS executed at ₹3,412.10', time: '1 day ago', unread: false },
  ];

  // ── Auth Check ──
  function checkAuth() {
    const auth = localStorage.getItem('finsocial_auth');
    if (auth) {
      try {
        const data = JSON.parse(auth);
        if (data.loggedIn) return true;
      } catch(e) {}
    }
    return false;
  }

  function showAuth() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('authRoot').innerHTML = renderAuth();
    initAuth();
  }

  function showApp() {
    document.getElementById('authRoot').innerHTML = '';
    document.getElementById('app').style.display = 'flex';
    renderNotifications();
    if (!window._liveMarketStarted) {
      window._liveMarketStarted = true;
      startLiveMarket();
    }
    route();
  }

  window.showApp = showApp;

  // ── Router Setup ──
  const main = document.getElementById('main');
  const pages = {
    home: { render: renderHome, init: initHome },
    tribe: { render: renderTribe, init: initTribe },
    forum: { render: renderForum, init: initForum },
    portfolio: { render: renderPortfolio, init: initPortfolio },
    stocks: { render: () => renderStocks(window._selectedStock), init: initStocks },
  };

  // ── Check on load ──
  if (checkAuth()) {
    showApp();
  } else {
    showAuth();
  }

  // ── Notifications ──
  function renderNotifications() {
    const list = document.getElementById('notifList');
    if (!list) return;
    list.innerHTML = NOTIFICATIONS.map(n => `
      <div class="notif-item${n.unread ? ' unread' : ''}" data-nid="${n.id}">
        <div class="notif-icon">${n.icon}</div>
        <div class="notif-content">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="notif-dot"></div>' : ''}
      </div>
    `).join('');
    // Update badge counts
    const unread = NOTIFICATIONS.filter(n => n.unread).length;
    document.querySelectorAll('.notif-badge').forEach(b => {
      b.textContent = unread;
      b.style.display = unread > 0 ? '' : 'none';
    });
  }

  // Toggle notification panel
  function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    panel?.classList.toggle('open');
  }
  document.getElementById('notifBell')?.addEventListener('click', toggleNotifPanel);
  document.getElementById('mobNotifBell')?.addEventListener('click', toggleNotifPanel);
  // Close on outside click
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifPanel');
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !e.target.closest('.notif-bell')) {
      panel.classList.remove('open');
    }
  });
  // Mark all read
  document.getElementById('notifClear')?.addEventListener('click', () => {
    NOTIFICATIONS.forEach(n => n.unread = false);
    renderNotifications();
  });

  // ── Logout ──
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('finsocial_auth');
    showAuth();
  });

  // ── Router ──
  function route(){
    if (!checkAuth()) return;
    const hash = location.hash.replace('#','') || 'home';
    const page = pages[hash];
    if (!page) return;
    
    if (window._pendingStock) {
      window._selectedStock = window._pendingStock;
      window._pendingStock = null;
    } else {
      window._selectedStock = null;
    }
    
    // Reset forum view when navigating away
    if (hash !== 'forum') { _forumView = 'list'; _forumSelectedQ = null; }
    main.innerHTML = page.render();
    page.init();
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.page === hash);
    });
    // Close mobile sidebar & notif panel
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
    document.getElementById('notifPanel')?.classList.remove('open');
    main.scrollTop = 0;
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('load', () => {
    if (checkAuth()) showApp();
  });

  // Handle clicking nav items that are already active
  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.addEventListener('click', (e) => {
      const hash = nav.getAttribute('href').replace('#', '');
      if (location.hash.replace('#','') === hash) {
        window._pendingStock = null;
        if (hash === 'forum') { _forumView = 'list'; _forumSelectedQ = null; }
        route();
      }
    });
  });

  // Mobile menu
  document.getElementById('mobMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
  });
  document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  });

  // ── Live Market Simulator ──
  function startLiveMarket() {
    setInterval(() => {
      if (!checkAuth() || typeof STOCKS_DATA === 'undefined') return;
      
      let chartNeedsUpdate = false;
      STOCKS_DATA.forEach(s => {
        // small random walk, max +/- 0.4%
        const delta = s.price * (Math.random() - 0.5) * 0.008;
        s.price += delta;
        s.change += delta;
        s.changePct = (s.change / (s.price - s.change)) * 100;
        
        const priceText = '₹' + s.price.toFixed(2);
        const up = s.change >= 0;
        const colorClass = up ? 'positive' : 'negative';
        const chgText = (up ? '+' : '') + '₹' + Math.abs(s.change).toFixed(2) + ' (' + (up ? '+' : '') + s.changePct.toFixed(2) + '%)';
        const homeChgText = (up ? '+' : '') + s.changePct.toFixed(2) + '%';
        
        document.querySelectorAll(`[data-live-price="${s.ticker}"]`).forEach(el => {
          const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 2;
          el.textContent = '₹' + s.price.toFixed(decimals);
          if (el.dataset.color === 'true') {
             el.className = 'price mono ' + colorClass;
          }
        });
        
        document.querySelectorAll(`[data-live-chg="${s.ticker}"]`).forEach(el => {
          el.textContent = el.dataset.short === 'true' ? homeChgText : chgText;
          el.className = 'mono ' + colorClass;
        });
        
        if (window._selectedStock === s.ticker) {
          chartNeedsUpdate = true;
        }
      });
      
      if (chartNeedsUpdate && typeof window.updateLiveChart === 'function') {
         window.updateLiveChart();
      }
      if (location.hash.replace('#','') === 'portfolio' && typeof window.updateLivePortfolio === 'function') {
         window.updateLivePortfolio();
      }
    }, 5000); // 5-second interval
  }
})();
