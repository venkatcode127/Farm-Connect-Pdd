// ===== AI Prediction Engine & Analytics =====

function initPrediction() {
  const cs = document.getElementById('commoditySelect');
  const ms = document.getElementById('marketSelect');
  // Preserve current values if any
  const cVal = cs.value;
  const mVal = ms.value;
  
  cs.innerHTML = COMMODITIES.map(c => `<option value="${c.id}">${getCommodityName(c)}</option>`).join('');
  ms.innerHTML = MARKETS.map(m => `<option value="${m.id}">${getMarketName(m)}</option>`).join('');
  
  if (cVal) cs.value = cVal;
  if (mVal) ms.value = mVal;
  
  document.getElementById('predictBtn').onclick = runPrediction;
  if (document.getElementById('predictionResults').style.display === 'block') {
    runPrediction();
  }
}

function runPrediction() {
  const cid = document.getElementById('commoditySelect').value;
  const mid = document.getElementById('marketSelect').value;
  const hi = lang === 'hi';
  const commodity = COMMODITIES.find(c => c.id === cid);
  const prices = PRICE_HISTORY[cid][mid];
  const recent = prices.slice(-30);
  const forecast = generateForecast(prices, commodity);
  
  document.getElementById('predictionResults').style.display = 'block';
  drawPredictionChart(recent, forecast, commodity);
  
  const cur = recent[recent.length-1].price;
  const pred7 = forecast[forecast.length-1].price;
  const change = ((pred7 - cur) / cur * 100).toFixed(1);
  const confidence = Math.round(65 + Math.random() * 25);
  
  let action, actionClass, reason;
  if (change > 3) {
    action = hi ? '🟢 रोकें (HOLD)' : '🟢 HOLD';
    actionClass = 'rec-hold';
    reason = hi ? `अगले 7 दिनों में कीमत ${Math.abs(change)}% बढ़ने की उम्मीद है। बेहतर कीमत के लिए प्रतीक्षा करें।` : `Price expected to rise ${Math.abs(change)}% in 7 days. Wait for better prices.`;
  } else if (change < -3) {
    action = hi ? '🔴 बेचें (SELL)' : '🔴 SELL NOW';
    actionClass = 'rec-sell';
    reason = hi ? `कीमत ${Math.abs(change)}% गिरने का अनुमान। अभी बेचना फायदेमंद रहेगा।` : `Price projected to drop ${Math.abs(change)}%. Selling now would be beneficial.`;
  } else {
    action = hi ? '🟡 खरीदें (BUY)' : '🟡 BUY / ACCUMULATE';
    actionClass = 'rec-buy';
    reason = hi ? 'कीमतें स्थिर हैं। खरीदारी या भंडारण का अच्छा समय है।' : 'Prices are stable. Good time to buy or accumulate stock.';
  }
  
  document.getElementById('recommendation').className = 'recommendation ' + actionClass;
  document.getElementById('recommendation').innerHTML = `<div class="rec-action">${action}</div><div class="rec-reason">${reason}</div>`;
  
  // Confidence gauge
  const arc = document.getElementById('gaugeArc');
  const gaugeLen = 251 * confidence / 100;
  arc.setAttribute('stroke-dasharray', gaugeLen + ' 251');
  document.getElementById('gaugeText').textContent = confidence + '%';
  
  // Price summary
  const allP = recent.map(p => p.price);
  const minP = Math.min(...allP), maxP = Math.max(...allP);
  const avgP = Math.round(allP.reduce((a, b) => a + b) / allP.length);
  const labels = hi
    ? ['वर्तमान मूल्य', '7-दिन पूर्वानुमान', '30-दिन औसत', '30-दिन न्यूनतम', '30-दिन अधिकतम', 'अपेक्षित बदलाव']
    : ['Current Price', '7-Day Forecast', '30-Day Average', '30-Day Low', '30-Day High', 'Expected Change'];
  document.getElementById('priceSummary').innerHTML = [
    [labels[0], '₹' + cur.toLocaleString()],
    [labels[1], '₹' + pred7.toLocaleString()],
    [labels[2], '₹' + avgP.toLocaleString()],
    [labels[3], '₹' + minP.toLocaleString()],
    [labels[4], '₹' + maxP.toLocaleString()],
    [labels[5], (change >= 0 ? '+' : '') + change + '%']
  ].map(r => `<div class="price-summary-row"><span class="ps-label">${r[0]}</span><span class="ps-value">${r[1]}</span></div>`).join('');
  
  // Chart legend
  document.getElementById('chartLegend').innerHTML = `<div class="legend-item"><div class="legend-dot" style="background:#2ecc71"></div>${hi ? 'ऐतिहासिक' : 'Historical'}</div><div class="legend-item"><div class="legend-dot" style="background:#f39c12"></div>${hi ? 'पूर्वानुमान' : 'Forecast'}</div><div class="legend-item"><div class="legend-dot" style="background:rgba(243,156,18,0.15)"></div>${hi ? 'विश्वास अंतराल' : 'Confidence Band'}</div>`;
}

function generateForecast(prices, commodity) {
  const recent = prices.slice(-14);
  const vals = recent.map(p => p.price);
  const n = vals.length;
  
  // Linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) { sumX += i; sumY += vals[i]; sumXY += i * vals[i]; sumX2 += i * i; }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Weighted moving average
  const wma = vals.slice(-5).reduce((s, v, i) => s + v * (i + 1), 0) / 15;
  
  const today = new Date();
  const month = today.getMonth();
  const forecast = [];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const trend = intercept + slope * (n + i);
    const seasonal = commodity.seasonal[(month + (i > 25 ? 1 : 0)) % 12];
    const noise = (Math.random() - 0.5) * vals[n - 1] * 0.015;
    const price = Math.round((trend * 0.4 + wma * 0.5 + vals[n - 1] * 0.1) * seasonal + noise);
    forecast.push({ date: date.toISOString().split('T')[0], price: Math.max(price, 10) });
  }
  return forecast;
}

function drawPredictionChart(history, forecast, commodity) {
  const canvas = document.getElementById('predictionChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = 400 * dpr;
  ctx.scale(dpr, dpr);
  const W = canvas.clientWidth, H = 400;
  
  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#a0aec0' : '#5a6278';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  
  const allPrices = [...history.map(p => p.price), ...forecast.map(p => p.price)];
  const minP = Math.min(...allPrices) * 0.97;
  const maxP = Math.max(...allPrices) * 1.03;
  const range = maxP - minP || 1;
  
  const pad = { top: 20, right: 20, bottom: 50, left: 65 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const total = history.length + forecast.length;
  
  function x(i) { return pad.left + (i / (total - 1)) * cw; }
  function y(v) { return pad.top + ch - ((v - minP) / range) * ch; }
  
  ctx.clearRect(0, 0, W, H);
  
  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const yy = pad.top + (i / 5) * ch;
    ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
    const val = maxP - (i / 5) * range;
    ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    ctx.fillText('₹' + Math.round(val).toLocaleString(), pad.left - 8, yy + 4);
  }
  
  // X-axis labels
  ctx.textAlign = 'center';
  const labelInterval = Math.ceil(total / 8);
  const allDates = [...history, ...forecast];
  for (let i = 0; i < total; i += labelInterval) {
    const d = new Date(allDates[i].date);
    ctx.fillText(d.getDate() + '/' + (d.getMonth() + 1), x(i), H - pad.bottom + 20);
  }
  
  // Forecast divider
  const divX = x(history.length - 1);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(divX, pad.top); ctx.lineTo(divX, H - pad.bottom); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = textColor; ctx.font = '10px Inter';
  ctx.fillText(lang === 'hi' ? 'आज' : 'Today', divX, pad.top - 6);
  
  // Confidence band
  ctx.fillStyle = 'rgba(243,156,18,0.12)';
  ctx.beginPath();
  forecast.forEach((p, i) => {
    const idx = history.length + i;
    const band = p.price * 0.03 * (i + 1) / 7;
    ctx.lineTo(x(idx), y(p.price - band));
  });
  for (let i = forecast.length - 1; i >= 0; i--) {
    const idx = history.length + i;
    const band = forecast[i].price * 0.03 * (i + 1) / 7;
    ctx.lineTo(x(idx), y(forecast[i].price + band));
  }
  ctx.closePath(); ctx.fill();
  
  // Historical line
  ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 2.5; ctx.beginPath();
  history.forEach((p, i) => { i === 0 ? ctx.moveTo(x(i), y(p.price)) : ctx.lineTo(x(i), y(p.price)); });
  ctx.stroke();
  
  // Forecast line
  ctx.strokeStyle = '#f39c12'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.beginPath();
  ctx.moveTo(x(history.length - 1), y(history[history.length - 1].price));
  forecast.forEach((p, i) => ctx.lineTo(x(history.length + i), y(p.price)));
  ctx.stroke(); ctx.setLineDash([]);
  
  // Data points
  history.forEach((p, i) => {
    if (i % 3 === 0 || i === history.length - 1) {
      ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(x(i), y(p.price), 3, 0, Math.PI * 2); ctx.fill();
    }
  });
  forecast.forEach((p, i) => {
    ctx.fillStyle = '#f39c12'; ctx.beginPath(); ctx.arc(x(history.length + i), y(p.price), 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x(history.length + i), y(p.price), 2, 0, Math.PI * 2); ctx.fill();
  });
}

// ===== Analytics =====
function initAnalytics() {
  renderVolatility(); renderSellTiming(); drawSeasonalChart(); drawComparisonChart();
}

function renderVolatility() {
  const el = document.getElementById('volatilityBars');
  let html = '';
  COMMODITIES.slice(0, 8).forEach(c => {
    const prices = PRICE_HISTORY[c.id].delhi.map(p => p.price);
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const std = Math.sqrt(prices.reduce((s, p) => s + (p - mean) ** 2, 0) / prices.length);
    const vol = Math.min(((std / mean) * 100 * 10).toFixed(0), 100);
    const color = vol > 60 ? 'var(--red)' : vol > 30 ? 'var(--amber)' : 'var(--green)';
    const name = lang === 'hi' ? c.nameHi.split(' ')[0] : c.name.split(' ')[0];
    html += `<div class="volatility-item"><span class="vol-name">${c.emoji} ${name}</span><div class="vol-bar-track"><div class="vol-bar-fill" style="width:${vol}%;background:${color}"></div></div><span class="vol-value">${vol}%</span></div>`;
  });
  el.innerHTML = html;
}

function renderSellTiming() {
  const hi = lang === 'hi';
  const el = document.getElementById('sellTiming');
  const months = hi ? ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'] : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let html = '';
  COMMODITIES.slice(0, 6).forEach(c => {
    const bestMonth = c.seasonal.indexOf(Math.max(...c.seasonal));
    const reasons = {
      en: ['Peak demand season', 'Festival demand spike', 'Low supply period', 'Export window opens', 'Cold storage costs rise', 'Seasonal peak pricing'],
      hi: ['चरम मांग का मौसम', 'त्योहारी मांग', 'कम आपूर्ति अवधि', 'निर्यात खिड़की खुलती है', 'कोल्ड स्टोरेज लागत बढ़ती है', 'मौसमी उच्चतम मूल्य']
    };
    html += `<div class="sell-timing-item"><div><div class="st-crop">${c.emoji} ${hi?c.nameHi:c.name}</div><div class="st-reason">${hi?reasons.hi[COMMODITIES.indexOf(c)%6]:reasons.en[COMMODITIES.indexOf(c)%6]}</div></div><div class="st-month">${months[bestMonth]}</div></div>`;
  });
  el.innerHTML = html;
}

function drawSeasonalChart() {
  const canvas = document.getElementById('seasonalChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.scale(dpr, dpr);
  const W = canvas.clientWidth || 600, H = 300;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#a0aec0' : '#5a6278';
  
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
  const months = lang === 'hi' 
    ? ['जन','फ़र','मार्च','अप्रै','मई','जून','जुल','अग','सितं','अक्टू','नवं','दिसं'] 
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  ctx.clearRect(0, 0, W, H);
  
  const crops = [COMMODITIES[0], COMMODITIES[2], COMMODITIES[3], COMMODITIES[7]];
  const allSeasonal = crops.flatMap(c => c.seasonal);
  const minS = Math.min(...allSeasonal);
  const maxS = Math.max(...allSeasonal);
  const rangeS = maxS - minS || 1;
  
  // Y-axis labels and Grid
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const yy = pad.top + (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
    // Optional Y-axis index values
    const val = (maxS - (i / 4) * rangeS).toFixed(1);
    ctx.fillText(val + 'x', pad.left - 10, yy + 4);
  }
  
  // X labels
  ctx.textAlign = 'center';
  months.forEach((m, i) => ctx.fillText(m, pad.left + (i / 11) * cw, H - pad.bottom + 18));
  
  const colors = ['#2ecc71', '#e74c3c', '#f39c12', '#3498db'];
  
  // Draw lines with slight curves and data points
  crops.forEach((c, ci) => {
    ctx.strokeStyle = colors[ci];
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    c.seasonal.forEach((s, i) => {
      const xx = pad.left + (i / 11) * cw;
      const yy = pad.top + ch - ((s - minS) / rangeS) * ch;
      i === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
    });
    ctx.stroke();
    
    // Draw points
    c.seasonal.forEach((s, i) => {
      const xx = pad.left + (i / 11) * cw;
      const yy = pad.top + ch - ((s - minS) / rangeS) * ch;
      ctx.fillStyle = colors[ci];
      ctx.beginPath(); ctx.arc(xx, yy, 3.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = isDark ? '#1a202c' : '#fff';
      ctx.beginPath(); ctx.arc(xx, yy, 1.5, 0, Math.PI*2); ctx.fill();
    });
  });

  // Draw Legend
  ctx.textAlign = 'left';
  let legendX = pad.left;
  crops.forEach((c, ci) => {
    const name = lang === 'hi' ? (c.nameHi || c.name).split(' ')[0] : c.name.split(' ')[0];
    ctx.fillStyle = colors[ci];
    ctx.beginPath(); ctx.arc(legendX + 6, H - 8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = textColor; ctx.font = '12px Inter';
    ctx.fillText(name, legendX + 16, H - 4);
    legendX += ctx.measureText(name).width + 30;
  });
}

function drawComparisonChart() {
  const canvas = document.getElementById('comparisonChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.scale(dpr, dpr);
  const W = canvas.clientWidth || 600, H = 300;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#a0aec0' : '#5a6278';
  
  const pad = { top: 20, right: 20, bottom: 60, left: 60 };
  const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
  
  ctx.clearRect(0, 0, W, H);
  
  const crops = COMMODITIES.slice(0, 6);
  const barW = cw / crops.length * 0.6;
  const gap = cw / crops.length;
  const maxP = Math.max(...crops.map(c => {
    const p = PRICE_HISTORY[c.id].delhi;
    return p[p.length - 1].price;
  }));
  
  const colors = ['#2ecc71','#e74c3c','#f39c12','#3498db','#9b59b6','#1abc9c'];
  
  crops.forEach((c, i) => {
    const p = PRICE_HISTORY[c.id].delhi;
    const price = p[p.length - 1].price;
    const barH = (price / (maxP * 1.1)) * ch;
    const xx = pad.left + i * gap + (gap - barW) / 2;
    const yy = pad.top + ch - barH;
    
    const grad = ctx.createLinearGradient(xx, yy, xx, pad.top + ch);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, colors[i] + '44');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(xx, yy, barW, barH, [4, 4, 0, 0]);
    ctx.fill();
    
    ctx.fillStyle = textColor; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(c.emoji, xx + barW / 2, H - pad.bottom + 16);
    const name = (lang === 'hi' ? c.nameHi : c.name).split(' ')[0].substring(0, 6);
    ctx.fillText(name, xx + barW / 2, H - pad.bottom + 30);
    ctx.fillStyle = isDark ? '#e8ecf1' : '#1a1a2e'; ctx.font = 'bold 10px Inter';
    ctx.fillText('₹' + price.toLocaleString(), xx + barW / 2, yy - 6);
  });
}
