// ===== FarmConnect AI - Core App =====
let lang = 'en';
let listings = loadListings();
let nextId = listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 100;

function loadListings() {
  const saved = localStorage.getItem('fc_listings');
  if (saved) { try { return JSON.parse(saved); } catch(e) {} }
  // First time: seed with sample listings and save
  localStorage.setItem('fc_listings', JSON.stringify(SAMPLE_LISTINGS));
  return [...SAMPLE_LISTINGS];
}

function saveListings() {
  localStorage.setItem('fc_listings', JSON.stringify(listings));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav(); initDashboard(); initPrediction(); initMarket();
  initMarketplace(); initWeather(); initAnalytics();
  document.getElementById('themeToggle').onclick = toggleTheme;
  document.getElementById('langToggle').onclick = toggleLang;
  document.getElementById('menuToggle').onclick = () => document.getElementById('navLinks').classList.toggle('open');
  createParticles();
  updateStatCards();
  
  // Real-time market data sync
  if (typeof syncMarketData === 'function') {
    syncMarketData();
  }
});

function initNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(link.dataset.section).classList.add('active');
      document.getElementById('navLinks').classList.remove('open');
      
      // If navigating to analytics, ensure charts are drawn with correct visible dimensions
      if (link.dataset.section === 'analytics') {
        setTimeout(() => initAnalytics(), 50);
      } else if (link.dataset.section === 'dashboard') {
        setTimeout(() => renderQuickPriceTable(), 50);
      }
    };
  });
}

function toggleTheme() {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  document.getElementById('themeIcon').innerHTML = t === 'dark'
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}

const LANG_ORDER = ['en', 'hi', 'te', 'ta', 'kn'];
const LANG_LABELS = { en: 'EN', hi: 'HI', te: 'TE', ta: 'TA', kn: 'KN' };
const LANG_NEXT_LABEL = { en: 'HI', hi: 'TE', te: 'TA', ta: 'KN', kn: 'EN' };

function updateStatCards() {
  // Get top gainer
  const market = 'delhi'; // or use selected market
  let topGainer = null;
  let maxChange = 0;
  
  COMMODITIES.forEach(c => {
    const prices = PRICE_HISTORY[c.id][market];
    const cur = prices[prices.length - 1].price;
    const prev = prices[prices.length - 2].price;
    const change = ((cur - prev) / prev * 100);
    
    if (Math.abs(change) > Math.abs(maxChange)) {
      maxChange = change;
      topGainer = { name: getCommodityName(c), change };
    }
  });
  
  // Update stat cards
  if (topGainer) {
    document.getElementById('topGainer').textContent = 
      `${topGainer.name} ${topGainer.change >= 0 ? '▲' : '▼'} ${Math.abs(topGainer.change).toFixed(1)}%`;
  }
  
  // Alert count (5 active alerts)
  document.getElementById('alertCount').textContent = '5 Active';
  
  // Listings count
  document.getElementById('listingCount').textContent = listings.length + ' Items';
  
  // Markets tracked (8 mandis)
  document.getElementById('statMarkets').querySelector('.stat-value').textContent = MARKETS.length + ' Mandis';
}

function toggleLang() {
  const idx = LANG_ORDER.indexOf(lang);
  lang = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
  document.getElementById('langLabel').textContent = LANG_NEXT_LABEL[lang] || 'EN';
  applyLang();
  
  // Re-render all dynamic data
  initDashboard(); 
  updateStatCards();
  if (typeof initPrediction === 'function') initPrediction();
  if (typeof initMarket === 'function') initMarket(); 
  if (typeof initMarketplace === 'function') initMarketplace(); 
  if (typeof initWeather === 'function') initWeather(); 
  if (typeof initAnalytics === 'function') initAnalytics();
  if (typeof renderOrders === 'function') renderOrders();
}

function applyLang() {
  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    if (el.dataset[lang]) el.textContent = el.dataset[lang];
  });
  // Handle placeholders
  const capLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.dataset['placeholder' + capLang] || el.placeholder;
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function createParticles() {
  const c = document.getElementById('heroParticles');
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = 6 + Math.random() * 20;
    Object.assign(p.style, { width: s+'px', height: s+'px', left: Math.random()*100+'%', top: Math.random()*100+'%', animationDelay: Math.random()*6+'s', animationDuration: (4+Math.random()*4)+'s' });
    c.appendChild(p);
  }
}

// ===== Dashboard =====
function getLocalName(obj, field) {
  if (lang === 'hi' && obj[field+'Hi']) return obj[field+'Hi'];
  if (lang === 'te' && obj[field+'Te']) return obj[field+'Te'];
  if (lang === 'ta' && obj[field+'Ta']) return obj[field+'Ta'];
  if (lang === 'kn' && obj[field+'Kn']) return obj[field+'Kn'];
  return obj[field] || obj.name || '';
}
function getCommodityName(c) {
  if (lang === 'hi') return c.nameHi || c.name;
  if (lang === 'te') return c.nameTe || c.name;
  if (lang === 'ta') return c.nameTa || c.name;
  if (lang === 'kn') return c.nameKn || c.name;
  return c.name;
}
function getMarketName(m) {
  if (lang === 'hi') return m.nameHi || m.name;
  if (lang === 'te') return m.nameTe || m.name;
  if (lang === 'ta') return m.nameTa || m.name;
  if (lang === 'kn') return m.nameKn || m.name;
  return m.name;
}

function initDashboard() {
  // Render quick price table with sparklines
  renderQuickPriceTable();
  
  // Render AI predictions for top 3 crops
  renderTopCropsPredictions();
  
  // Render activity feed
  renderActivityFeed();
  
  // Render weather impact widget
  renderWeatherImpact();
  
  // Initialize dashboard market selector
  initDashboardMarketSelector();
  
  // Make stat cards clickable
  makeStatCardsClickable();
  
  // Hero CTA button handler
  const heroCtaBtn = document.getElementById('heroCtaBtn');
  if (heroCtaBtn) {
    heroCtaBtn.onclick = () => {
      document.querySelector('[data-section="prediction"]').click();
    };
  }
}

function renderQuickPriceTable() {
  const tbody = document.getElementById('quickPriceTableBody');
  let html = '';
  
  // Get current market (default: delhi, or from selector)
  const market = document.getElementById('dashboardMarketSelect')?.value || 'delhi';
  
  COMMODITIES.slice(0, 8).forEach(c => {
    const prices = PRICE_HISTORY[c.id][market];
    const cur = prices[prices.length-1].price;
    const prev = prices[prices.length-2].price;
    const chg = ((cur - prev) / prev * 100).toFixed(1);
    const up = chg >= 0;
    
    // Get 30-day history for sparkline
    const thirtyDayPrices = prices.slice(-30).map(p => p.price);
    
    html += `<tr>
      <td class="crop-cell">
        <span class="crop-emoji">${c.emoji}</span>
        <span>${getCommodityName(c)}</span>
      </td>
      <td class="price-cell">₹${cur.toLocaleString()}</td>
      <td class="change-cell ${up ? 'positive' : 'negative'}">
        ${up ? '▲' : '▼'} ${Math.abs(chg)}%
      </td>
      <td class="sparkline-cell">
        <canvas class="sparkline" data-values="${thirtyDayPrices.join(',')}"></canvas>
      </td>
    </tr>`;
  });
  
  tbody.innerHTML = html;
  
  // Draw sparklines for each row
  setTimeout(() => {
    tbody.querySelectorAll('.sparkline').forEach(canvas => {
      drawDashboardSparkline(canvas);
    });
  }, 100);
}

function drawDashboardSparkline(canvas) {
  const vals = canvas.dataset.values.split(',').map(Number);
  if (vals.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = 90;
  canvas.height = 30;
  
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const up = vals[vals.length - 1] >= vals[0];
  
  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 30);
  if (up) {
    gradient.addColorStop(0, 'rgba(46,204,113,0.3)');
    gradient.addColorStop(1, 'rgba(46,204,113,0.05)');
  } else {
    gradient.addColorStop(0, 'rgba(231,76,60,0.3)');
    gradient.addColorStop(1, 'rgba(231,76,60,0.05)');
  }
  
  // Draw area
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = (i / (vals.length - 1)) * 90;
    const y = 28 - (v - min) / range * 24;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(90, 28);
  ctx.lineTo(0, 28);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw line
  ctx.strokeStyle = up ? '#2ecc71' : '#e74c3c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = (i / (vals.length - 1)) * 90;
    const y = 28 - (v - min) / range * 24;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function renderTopCropsPredictions() {
  // Get top 3 commodities by current price change
  const market = document.getElementById('dashboardMarketSelect')?.value || 'delhi';
  const topCrops = COMMODITIES.map(c => {
    const prices = PRICE_HISTORY[c.id][market];
    const cur = prices[prices.length - 1].price;
    const prev = prices[prices.length - 2].price;
    const change = ((cur - prev) / prev * 100);
    
    // Generate 7-day prediction
    const forecast = generateCropForecast(c, market);
    
    return { ...c, change, forecast };
  }).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3);
  
  const container = document.getElementById('topCropsPrediction');
  container.innerHTML = topCrops.map(crop => {
    const rec = getRecommendation(crop.forecast.confidence, crop.change);
    const badgeClass = rec.type === 'sell' ? 'badge-sell' : rec.type === 'wait' ? 'badge-wait' : 'badge-buy';
    
    return `<div class="crop-prediction-card">
      <div class="crop-pred-emoji">${crop.emoji}</div>
      <div class="crop-pred-info">
        <span class="crop-pred-name">${getCommodityName(crop)}</span>
        <div class="crop-pred-details">
          <span>📈 7-day: ₹${crop.forecast.predicted.toLocaleString()}</span>
          <span>🎯 ${crop.forecast.confidence}% confidence</span>
        </div>
        <span class="crop-pred-badge ${badgeClass}">
          ${rec.emoji} ${rec.text}
        </span>
      </div>
      <div class="crop-pred-value">
        <span class="crop-pred-forecast">${crop.change >= 0 ? '▲' : '▼'} ${Math.abs(crop.change).toFixed(1)}%</span>
        <span class="crop-pred-confidence">Today's change</span>
      </div>
    </div>`;
  }).join('');
}

function generateCropForecast(commodity, market) {
  const prices = PRICE_HISTORY[commodity.id][market];
  const recent = prices.slice(-7).map(p => p.price);
  const current = prices[prices.length - 1].price;
  
  // Simple trend-based prediction
  const trend = (recent[recent.length - 1] - recent[0]) / recent[0];
  const volatility = Math.sqrt(recent.reduce((sum, p, i) => {
    if (i === 0) return sum;
    return sum + Math.pow((p - recent[i-1]) / recent[i-1], 2);
  }, 0) / recent.length);
  
  // Predicted price with confidence
  const predicted = Math.round(current * (1 + trend * 0.8));
  const confidence = Math.max(45, Math.min(92, Math.round((1 - volatility) * 100)));
  
  return {
    predicted,
    confidence,
    trend,
    volatility
  };
}

function getRecommendation(confidence, change) {
  if (change > 8 && confidence > 75) {
    return { type: 'sell', text: 'SELL NOW', emoji: '🔴' };
  } else if (change > 4 && confidence > 70) {
    return { type: 'sell', text: 'Consider Selling', emoji: '🟠' };
  } else if (change < -5) {
    return { type: 'wait', text: 'WAIT', emoji: '🟡' };
  } else {
    return { type: 'buy', text: 'HOLD/BUY', emoji: '🟢' };
  }
}

function renderWeatherImpact() {
  const market = document.getElementById('dashboardMarketSelect')?.value || 'delhi';
  const weather = WEATHER_DATA[market];
  const container = document.getElementById('weatherImpactContent');
  
  let html = '';
  
  // Rain impact
  const rainImpactText = weather.rainfall > 30 
    ? `High rainfall (${weather.rainfall}mm) may increase crop diseases and reduce prices` 
    : weather.rainfall > 10 
    ? `Moderate rainfall (${weather.rainfall}mm) is beneficial for growth` 
    : `Low rainfall (${weather.rainfall}mm) may stress crops, affecting supply`;
  
  html += `<div class="weather-impact-item weather-impact-rain">
    <div class="weather-impact-icon">🌧️</div>
    <div class="weather-impact-details">
      <span class="weather-impact-title">Rainfall Impact</span>
      <span class="weather-impact-effect">${rainImpactText}</span>
      <div class="weather-impact-crops">
        <span class="impact-crop-tag">Rice</span>
        <span class="impact-crop-tag">Sugarcane</span>
        <span class="impact-crop-tag">Onion</span>
      </div>
    </div>
  </div>`;
  
  // Heat impact
  const heatImpactText = weather.temp > 35
    ? `High temperature (${weather.temp}°C) increases evaporation, reducing yields`
    : weather.temp > 28
    ? `Moderate temperature (${weather.temp}°C) supports growth`
    : `Cool temperature (${weather.temp}°C) may slow crop development`;
  
  html += `<div class="weather-impact-item weather-impact-heat">
    <div class="weather-impact-icon">🔥</div>
    <div class="weather-impact-details">
      <span class="weather-impact-title">Temperature Impact</span>
      <span class="weather-impact-effect">${heatImpactText}</span>
      <div class="weather-impact-crops">
        <span class="impact-crop-tag">Cotton</span>
        <span class="impact-crop-tag">Chilli</span>
        <span class="impact-crop-tag">Groundnut</span>
      </div>
    </div>
  </div>`;
  
  // Wind impact
  const windImpactText = weather.wind > 15
    ? `Strong winds (${weather.wind} km/h) may cause crop damage and leaf fall`
    : `Light winds (${weather.wind} km/h) support healthy pollination`;
  
  html += `<div class="weather-impact-item weather-impact-wind">
    <div class="weather-impact-icon">💨</div>
    <div class="weather-impact-details">
      <span class="weather-impact-title">Wind Impact</span>
      <span class="weather-impact-effect">${windImpactText}</span>
      <div class="weather-impact-crops">
        <span class="impact-crop-tag">Wheat</span>
        <span class="impact-crop-tag">Mustard</span>
        <span class="impact-crop-tag">Maize</span>
      </div>
    </div>
  </div>`;
  
  // Humidity impact
  const humidityImpactText = weather.humidity > 70
    ? `High humidity (${weather.humidity}%) increases disease risk`
    : `Normal humidity (${weather.humidity}%) is optimal for crops`;
  
  html += `<div class="weather-impact-item weather-impact-humidity">
    <div class="weather-impact-icon">💧</div>
    <div class="weather-impact-details">
      <span class="weather-impact-title">Humidity Impact</span>
      <span class="weather-impact-effect">${humidityImpactText}</span>
      <div class="weather-impact-crops">
        <span class="impact-crop-tag">Tomato</span>
        <span class="impact-crop-tag">Potato</span>
        <span class="impact-crop-tag">Soybean</span>
      </div>
    </div>
  </div>`;
  
  container.innerHTML = html;
}

function initDashboardMarketSelector() {
  const selector = document.getElementById('dashboardMarketSelect');
  if (!selector) return;
  
  // Populate options
  selector.innerHTML = MARKETS.map(m => `<option value="${m.id}">${getMarketName(m)} 📍</option>`).join('');
  
  // Update dashboard when selection changes
  selector.onchange = () => {
    initDashboard();
  };
}

function makeStatCardsClickable() {
  const statCards = document.querySelectorAll('.stat-card.clickable');
  
  statCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.id;
      if (id === 'statGainers') {
        // Show top gainer details - scroll to quick price table
        document.querySelector('[data-section="market"]').click();
      } else if (id === 'statAlerts') {
        // Show alerts - scroll to prediction section
        document.querySelector('[data-section="prediction"]').click();
      } else if (id === 'statListings') {
        // Go to marketplace
        document.querySelector('[data-section="marketplace"]').click();
      } else if (id === 'statMarkets') {
        // Show all markets
        document.querySelector('[data-section="market"]').click();
      }
    });
    
    // Keyboard support
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.click();
      }
    });
  });
}


function renderActivityFeed() {
  const af = document.getElementById('activityFeed');
  
  // Get current market
  const market = document.getElementById('dashboardMarketSelect')?.value || 'delhi';
  
  // Generate live activity items based on price movements
  const activities = [];
  COMMODITIES.slice(0, 5).forEach(c => {
    const prices = PRICE_HISTORY[c.id][market];
    const cur = prices[prices.length - 1].price;
    const prev = prices[prices.length - 2].price;
    const change = ((cur - prev) / prev * 100).toFixed(1);
    const up = change >= 0;
    
    activities.push({
      emoji: c.emoji,
      name: getCommodityName(c),
      change: Math.abs(change),
      up,
      market: getMarketName(MARKETS.find(m => m.id === market)),
      time: '2 hours ago'
    });
  });
  
  af.innerHTML = activities.map(a => {
    const color = a.up ? '#2ecc71' : '#e74c3c';
    const text = `${a.emoji} ${a.name} ${a.up ? '▲' : '▼'} ${a.change}% in ${a.market}`;
    return `<div class="activity-item">
      <div class="activity-dot" style="background:${color}"></div>
      <div>
        <div>${text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`;
  }).join('');
}


// Auto-refresh dashboard activity every 30 seconds
setInterval(() => {
  if (document.getElementById('dashboard').classList.contains('active')) {
    refreshDashboardData();
  }
}, 30000);

function refreshDashboardData() {
  // Rotate activities to simulate live feed
  if (ACTIVITIES.length > 1) {
    ACTIVITIES.push(ACTIVITIES.shift());
  }
  // Re-generate recent price changes for quick prices
  initDashboard();
}

// ===== Market Prices =====
function initMarket() {
  const sf = document.getElementById('stateFilter');
  const currentState = sf.value;
  const states = [...new Set(MARKETS.map(m => m.state))];
  const allLabel = {en:'All States',hi:'सभी राज्य',te:'అన్ని రాష్ట్రాలు',ta:'அனைத்து மாநிலங்கள்',kn:'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು'};
  sf.innerHTML = `<option value="all">${allLabel[lang]||allLabel.en}</option>` + states.map(s => `<option value="${s}">${s}</option>`).join('');
  if (currentState) sf.value = currentState;
  renderMarketTable();
  document.getElementById('marketSearch').oninput = renderMarketTable;
  sf.onchange = renderMarketTable;
}

function renderMarketTable() {
  const search = document.getElementById('marketSearch').value.toLowerCase();
  const state = document.getElementById('stateFilter').value;
  const tbody = document.getElementById('marketTableBody');
  let html = '';
  COMMODITIES.forEach(c => {
    MARKETS.forEach(m => {
      if (state !== 'all' && m.state !== state) return;
      const name = getCommodityName(c);
      if (search && !name.toLowerCase().includes(search) && !c.name.toLowerCase().includes(search)) return;
      const prices = PRICE_HISTORY[c.id][m.id];
      const cur = prices[prices.length-1].price, prev = prices[prices.length-2].price;
      const chg = ((cur-prev)/prev*100).toFixed(1);
      const up = chg >= 0;
      const spark = prices.slice(-10).map(p=>p.price);
      html += `<tr><td class="commodity-cell"><span class="commodity-emoji">${c.emoji}</span>${name}</td><td>${getMarketName(m)}</td><td><strong>₹${cur.toLocaleString()}</strong></td><td class="${up?'change-up':'change-down'}">${up?'+':''}${chg}%</td><td><canvas class="sparkline" data-values="${spark.join(',')}"></canvas></td></tr>`;
    });
  });
  tbody.innerHTML = html;
  tbody.querySelectorAll('.sparkline').forEach(drawSparkline);
}

function drawSparkline(canvas) {
  const vals = canvas.dataset.values.split(',').map(Number);
  const ctx = canvas.getContext('2d');
  canvas.width = 80; canvas.height = 30;
  const min = Math.min(...vals), max = Math.max(...vals), range = max-min||1;
  const up = vals[vals.length-1] >= vals[0];
  ctx.strokeStyle = up ? '#2ecc71' : '#e74c3c';
  ctx.lineWidth = 1.5; ctx.beginPath();
  vals.forEach((v,i) => { const x=i/(vals.length-1)*78+1, y=28-(v-min)/range*26+1; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();
}

// ===== Marketplace =====
function initMarketplace() {
  const sel = document.getElementById('sellCrop');
  sel.innerHTML = COMMODITIES.map(c => `<option value="${c.id}">${getCommodityName(c)}</option>`).join('');
  renderListings();
  document.getElementById('sellBtn').onclick = () => document.getElementById('sellModal').style.display = 'flex';
  document.getElementById('closeSellModal').onclick = () => document.getElementById('sellModal').style.display = 'none';
  document.getElementById('sellForm').onsubmit = e => {
    e.preventDefault();
    const cid = document.getElementById('sellCrop').value;
    const com = COMMODITIES.find(c=>c.id===cid);
    const currentUser = JSON.parse(localStorage.getItem('fc_current_user') || 'null');
    const sellerName = currentUser ? currentUser.name : 'You';
    listings.unshift({ id: nextId++, crop: cid, emoji: com.emoji, name: com.name, nameHi: com.nameHi || com.name, nameTe: com.nameTe || com.name, nameTa: com.nameTa || com.name, nameKn: com.nameKn || com.name, qty: +document.getElementById('sellQty').value, price: +document.getElementById('sellPrice').value, location: document.getElementById('sellLocation').value, locationHi: document.getElementById('sellLocation').value, contact: document.getElementById('sellContact').value, desc: document.getElementById('sellDesc').value, descHi: document.getElementById('sellDesc').value, seller: sellerName });
    saveListings();
    document.getElementById('sellModal').style.display = 'none';
    document.getElementById('sellForm').reset();
    document.getElementById('listingCount').textContent = listings.length + ' Items';
    renderListings();
    const msgs = {en:'✅ Your produce has been listed successfully!',hi:'✅ आपकी उपज सफलतापूर्वक लिस्ट हो गई!',te:'✅ మీ ఉత్పత్తి విజయవంతంగా జాబితా చేయబడింది!',ta:'✅ உங்கள் விளைபொருள் வெற்றிகரமாக பட்டியலிடப்பட்டது!',kn:'✅ ನಿಮ್ಮ ಉತ್ಪನ್ನ ಯಶಸ್ವಿಯಾಗಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ!'};
    showToast(msgs[lang]||msgs.en);
  };
}

function getListingName(l) {
  if (lang === 'hi') return l.nameHi || l.name;
  if (lang === 'te') return l.nameTe || l.name;
  if (lang === 'ta') return l.nameTa || l.name;
  if (lang === 'kn') return l.nameKn || l.name;
  return l.name;
}

function renderListings() {
  const contactLabel = {en:'📞 Contact Seller',hi:'विक्रेता से संपर्क करें',te:'📞 విక్రేతను సంప్రదించండి',ta:'📞 விற்பனையாளரை தொடர்புகொள்ளுங்கள்',kn:'📞 ಮಾರಾಟಗಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ'};
  const orderLabel = {en:'🛒 Order Now',hi:'🛒 ऑर्डर करें',te:'🛒 ఆర్డర్ చేయండి',ta:'🛒 இப்போது ஆர்டர் செய்யுங்கள்',kn:'🛒 ಈಗ ಆರ್ಡರ್ ಮಾಡಿ'};
  document.getElementById('listingsGrid').innerHTML = listings.map(l => `<div class="listing-card"><div class="listing-img">${l.emoji}</div><div class="listing-body"><div class="listing-title">${getListingName(l)}</div><div class="listing-location">📍 ${l.location} • ${l.seller}</div><p style="font-size:0.85rem;color:var(--text-secondary);margin:8px 0">${lang==='hi'?(l.descHi||l.desc):l.desc}</p><div class="listing-meta"><span class="listing-price">₹${l.price.toLocaleString()}/Qt</span><span class="listing-qty">${l.qty} Qt</span></div><div class="listing-actions"><button class="listing-contact" onclick="showToast('📞 Contact: ${l.contact}')">${contactLabel[lang]||contactLabel.en}</button><button class="listing-order-btn" onclick="placeOrder(${l.id})">${orderLabel[lang]||orderLabel.en}</button></div></div></div>`).join('');
}

// ===== Weather =====
function initWeather() {
  const sel = document.getElementById('weatherRegion');
  const currentVal = sel.value;
  sel.innerHTML = `<option value="auto">📍 Auto (My Location)</option>` + MARKETS.map(m => `<option value="${m.id}">${getMarketName(m)}</option>`).join('');
  if (currentVal) sel.value = currentVal;
  sel.onchange = () => {
    if (sel.value === 'auto') {
      fetchLiveWeather();
    } else {
      renderWeather(sel.value);
    }
  };
  
  if (navigator.geolocation) {
    fetchLiveWeather();
  } else {
    sel.value = 'delhi';
    renderWeather('delhi');
  }
}

function fetchLiveWeather() {
  const L = {
    loading: { en: 'Locating & Fetching Live Weather...', hi: 'लाइव मौसम प्राप्त कर रहा है...' },
    error: { en: 'Location access denied. Showing default.', hi: 'स्थान पहुँच अस्वीकृत। डिफ़ॉल्ट दिखा रहा है।' }
  };
  
  document.getElementById('weatherCurrent').innerHTML = `<div style="padding:40px;text-align:center"><p>${L.loading[lang]||L.loading.en}</p></div>`;

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        
        const temp = Math.round(data.current_weather.temperature);
        const wind = Math.round(data.current_weather.windspeed);
        
        // find current hour index for humidity
        const currentHour = new Date().getHours();
        const humidity = data.hourly.relative_humidity_2m[currentHour] || 60;
        
        const high = Math.round(data.daily.temperature_2m_max[0]);
        const low = Math.round(data.daily.temperature_2m_min[0]);
        const code = data.current_weather.weathercode;
        
        let icon = '☀️', condition = 'Clear', conditionHi = 'साफ़';
        if (code >= 1 && code <= 3) { icon = '⛅'; condition = 'Partly Cloudy'; conditionHi = 'आंशिक रूप से बादल'; }
        if (code >= 45 && code <= 48) { icon = '🌫️'; condition = 'Foggy'; conditionHi = 'कोहरा'; }
        if (code >= 51 && code <= 67) { icon = '🌧️'; condition = 'Rain'; conditionHi = 'बारिश'; }
        if (code >= 71 && code <= 77) { icon = '❄️'; condition = 'Snow'; conditionHi = 'बर्फबारी'; }
        if (code >= 95) { icon = '⛈️'; condition = 'Thunderstorm'; conditionHi = 'आंधी-तूफान'; }
        
        renderWeatherUI({
          icon, temp, condition, conditionHi, humidity, wind, high, low,
          soil_moisture: 45, rainfall: (code >= 51 && code <= 67) ? 15 : 0
        }, 'delhi'); // Use delhi advisories as default fallback for auto location
      } catch (err) {
        showToast(L.error[lang]||L.error.en);
        document.getElementById('weatherRegion').value = 'delhi';
        renderWeather('delhi');
      }
    },
    (err) => {
      showToast(L.error[lang]||L.error.en);
      document.getElementById('weatherRegion').value = 'delhi';
      renderWeather('delhi');
    },
    { timeout: 10000 }
  );
}

function renderWeather(region) {
  const w = WEATHER_DATA[region];
  renderWeatherUI(w, region);
}

function renderWeatherUI(w, region) {
  const L = {humidity:{en:'Humidity',hi:'आर्द्रता',te:'తేమ',ta:'ஈரப்பதம்',kn:'ತೇವಾಂಶ'},wind:{en:'Wind',hi:'हवा',te:'గాలి',ta:'காற்று',kn:'ಗಾಳಿ'},soil:{en:'Soil Moisture',hi:'मिट्टी की नमी',te:'నేల తేమ',ta:'மண் ஈரப்பதம்',kn:'ಮಣ್ಣಿನ ತೇವಾಂಶ'},rain:{en:'Rainfall Level',hi:'वर्षा स्तर',te:'వర్షపాతం',ta:'மழை அளவு',kn:'ಮಳೆ ಮಟ್ಟ'}};
  document.getElementById('weatherCurrent').innerHTML = `<div class="weather-icon-large">${w.icon}</div><div class="weather-temp">${w.temp}°C</div><div class="weather-desc">${lang==='hi'?(w.conditionHi||w.condition):w.condition}</div><div class="weather-details"><span>💧 ${L.humidity[lang]||L.humidity.en}: ${w.humidity}%</span><span>💨 ${L.wind[lang]||L.wind.en}: ${w.wind} km/h</span><span>🌡️ H:${w.high}° L:${w.low}°</span></div>`;
  const icons = ['☀️','⛅','🌤️','☁️','🌧️'];
  const dayNames = {en:['Mon','Tue','Wed','Thu','Fri'],hi:['सोम','मंगल','बुध','गुरु','शुक्र'],te:['సోమ','మంగళ','బుధ','గురు','శుక్ర'],ta:['திங்','செவ்','புத','வியா','வெள்'],kn:['ಸೋಮ','ಮಂಗಳ','ಬುಧ','ಗುರು','ಶುಕ್ರ']};
  const days = dayNames[lang] || dayNames.en;
  document.getElementById('forecastRow').innerHTML = days.map((d,i) => `<div class="forecast-day"><div class="forecast-day-name">${d}</div><div class="forecast-icon">${icons[i%5]}</div><div class="forecast-temp">${w.temp+Math.round(Math.random()*4-2)}°/${w.low+Math.round(Math.random()*3)}°</div></div>`).join('');
  const advisories = CROP_ADVISORIES[region] || CROP_ADVISORIES.delhi;
  document.getElementById('cropAdvisory').innerHTML = advisories.map(a => `<div class="advisory-item"><span class="advisory-icon">${a.icon}</span><span>${lang==='hi'?a.textHi:a.text}</span></div>`).join('');
  document.getElementById('soilRainfall').innerHTML = `<div class="indicator-bar"><div class="indicator-label"><span>${L.soil[lang]||L.soil.en}</span><span>${w.soil_moisture}%</span></div><div class="indicator-track"><div class="indicator-fill" style="width:${w.soil_moisture}%;background:linear-gradient(90deg,#e74c3c,#f39c12,#2ecc71)"></div></div></div><div class="indicator-bar"><div class="indicator-label"><span>${L.rain[lang]||L.rain.en}</span><span>${w.rainfall}mm</span></div><div class="indicator-track"><div class="indicator-fill" style="width:${Math.min(w.rainfall,100)}%;background:linear-gradient(90deg,#3498db,#2980b9)"></div></div></div>`;
}
