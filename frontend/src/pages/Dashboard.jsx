import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMODITIES, MARKETS, PRICE_HISTORY, WEATHER_DATA } from '../data';

const Sparkline = ({ data }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const up = data[data.length - 1] >= data[0];
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 90;
    const y = 28 - ((v - min) / range) * 24;
    return `${x},${y}`;
  }).join(' L ');
  
  const color = up ? '#2ecc71' : '#e74c3c';
  const fillGrad = up ? 'url(#gradUp)' : 'url(#gradDown)';

  return (
    <svg width="90" height="30" viewBox="0 0 90 30">
      <defs>
        <linearGradient id="gradUp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(46,204,113,0.3)" />
          <stop offset="100%" stopColor="rgba(46,204,113,0.05)" />
        </linearGradient>
        <linearGradient id="gradDown" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(231,76,60,0.3)" />
          <stop offset="100%" stopColor="rgba(231,76,60,0.05)" />
        </linearGradient>
      </defs>
      <path d={`M 0,${28 - ((data[0] - min) / range) * 24} L ${points} L 90,28 L 0,28 Z`} fill={fillGrad} />
      <path d={`M 0,${28 - ((data[0] - min) / range) * 24} L ${points}`} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
};

const Dashboard = () => {
  const [marketId, setMarketId] = useState('delhi');
  const navigate = useNavigate();

  // Top Gainer Calculation
  const getTopGainer = () => {
    let topGainer = null;
    let maxChange = 0;
    COMMODITIES.forEach(c => {
      const prices = PRICE_HISTORY[c.id][marketId];
      if(!prices) return;
      const cur = prices[prices.length - 1].price;
      const prev = prices[prices.length - 2].price;
      const change = ((cur - prev) / prev * 100);
      if (Math.abs(change) > Math.abs(maxChange)) {
        maxChange = change;
        topGainer = { name: c.name, change };
      }
    });
    return topGainer;
  };

  const topGainer = getTopGainer();
  const weather = WEATHER_DATA[marketId];

  // Top 3 AI Predictions
  const getTopPredictions = () => {
    return COMMODITIES.map(c => {
      const prices = PRICE_HISTORY[c.id][marketId];
      if(!prices) return null;
      const recent = prices.slice(-7).map(p => p.price);
      const cur = prices[prices.length - 1].price;
      const prev = prices[prices.length - 2].price;
      const change = ((cur - prev) / prev * 100);
      
      const trend = (recent[recent.length - 1] - recent[0]) / recent[0];
      const volatility = Math.sqrt(recent.reduce((sum, p, i) => i === 0 ? sum : sum + Math.pow((p - recent[i-1]) / recent[i-1], 2), 0) / recent.length);
      const predicted = Math.round(cur * (1 + trend * 0.8));
      const confidence = Math.max(45, Math.min(92, Math.round((1 - volatility) * 100)));
      
      let recType, recText, recEmoji, badgeClass;
      if (change > 8 && confidence > 75) { recType = 'sell'; recText = 'SELL NOW'; recEmoji = '🔴'; badgeClass = 'badge-sell'; }
      else if (change > 4 && confidence > 70) { recType = 'sell'; recText = 'Consider Selling'; recEmoji = '🟠'; badgeClass = 'badge-sell'; }
      else if (change < -5) { recType = 'wait'; recText = 'WAIT'; recEmoji = '🟡'; badgeClass = 'badge-wait'; }
      else { recType = 'buy'; recText = 'HOLD/BUY'; recEmoji = '🟢'; badgeClass = 'badge-buy'; }
      
      return { ...c, cur, change, predicted, confidence, recType, recText, recEmoji, badgeClass };
    }).filter(Boolean).sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3);
  };

  const topPredictions = getTopPredictions();

  return (
    <section className="section active" id="dashboard">
      <div className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-content" style={{ zIndex: 10, position: 'relative' }}>
          <h1 className="hero-title">Smart Farming Starts Here</h1>
          <p className="hero-subtitle">AI-powered price predictions to maximize your profits</p>
          <button className="btn-primary hero-cta" onClick={() => navigate('/prediction')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Get My AI Prediction
          </button>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass clickable" onClick={() => navigate('/market')}>
          <div className="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Top Gainer Today</span>
            <span className="stat-value">{topGainer?.name} {topGainer?.change >= 0 ? '▲' : '▼'} {Math.abs(topGainer?.change || 0).toFixed(1)}%</span>
          </div>
        </div>
        <div className="stat-card glass clickable" onClick={() => navigate('/prediction')}>
          <div className="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Price Alerts</span>
            <span className="stat-value">5 Active</span>
          </div>
        </div>
        <div className="stat-card glass clickable" onClick={() => navigate('/marketplace')}>
          <div className="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Listings</span>
            <span className="stat-value">24 Items</span>
          </div>
        </div>
        <div className="stat-card glass clickable" onClick={() => navigate('/market')}>
          <div className="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18" />
              <path d="M9 3v18" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Markets Tracked</span>
            <span className="stat-value">{MARKETS.length} Mandis</span>
          </div>
        </div>
      </div>

      <div className="dashboard-selector">
        <label>Select Mandi / State:</label>
        <select className="select-input" value={marketId} onChange={e => setMarketId(e.target.value)}>
          {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="card glass">
          <h3 className="card-title">Quick Price Overview</h3>
          <div className="quick-price-table-wrapper">
            <table className="quick-price-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Price (₹/Qt)</th>
                  <th>Change 24h</th>
                  <th>30-Day Trend</th>
                </tr>
              </thead>
              <tbody>
                {COMMODITIES.slice(0, 8).map(c => {
                  const prices = PRICE_HISTORY[c.id][marketId];
                  if(!prices) return null;
                  const cur = prices[prices.length-1].price;
                  const prev = prices[prices.length-2].price;
                  const chg = ((cur - prev) / prev * 100);
                  const up = chg >= 0;
                  const thirtyDayPrices = prices.slice(-30).map(p => p.price);
                  
                  return (
                    <tr key={c.id}>
                      <td className="crop-cell"><span className="crop-emoji">{c.emoji}</span><span>{c.name}</span></td>
                      <td className="price-cell">₹{cur.toLocaleString()}</td>
                      <td className={`change-cell ${up ? 'positive' : 'negative'}`}>{up ? '▲' : '▼'} {Math.abs(chg).toFixed(1)}%</td>
                      <td className="sparkline-cell"><Sparkline data={thirtyDayPrices} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card glass">
          <h3 className="card-title">🤖 AI Prediction - Top 3 Crops</h3>
          <div className="top-crops-container">
            {topPredictions.map(crop => (
              <div className="crop-prediction-card" key={crop.id}>
                <div className="crop-pred-emoji">{crop.emoji}</div>
                <div className="crop-pred-info">
                  <span className="crop-pred-name">{crop.name}</span>
                  <div className="crop-pred-details">
                    <span>📈 7-day: ₹{crop.predicted.toLocaleString()}</span>
                    <span>🎯 {crop.confidence}% confidence</span>
                  </div>
                  <span className={`crop-pred-badge ${crop.badgeClass}`}>{crop.recEmoji} {crop.recText}</span>
                </div>
                <div className="crop-pred-value">
                  <span className="crop-pred-forecast">{crop.change >= 0 ? '▲' : '▼'} {Math.abs(crop.change).toFixed(1)}%</span>
                  <span className="crop-pred-confidence">Today's change</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card glass">
          <h3 className="card-title">🌤️ Weather Impact on Prices</h3>
          {weather && (
            <div className="weather-impact-widget">
              <div className="weather-impact-item weather-impact-rain">
                <div className="weather-impact-icon">🌧️</div>
                <div className="weather-impact-details">
                  <span className="weather-impact-title">Rainfall Impact</span>
                  <span className="weather-impact-effect">
                    {weather.rainfall > 30 ? `High rainfall (${weather.rainfall}mm) may increase crop diseases` : weather.rainfall > 10 ? `Moderate rainfall (${weather.rainfall}mm) is beneficial for growth` : `Low rainfall (${weather.rainfall}mm) may stress crops`}
                  </span>
                  <div className="weather-impact-crops">
                    <span className="impact-crop-tag">Rice</span>
                    <span className="impact-crop-tag">Sugarcane</span>
                    <span className="impact-crop-tag">Onion</span>
                  </div>
                </div>
              </div>
              <div className="weather-impact-item weather-impact-heat">
                <div className="weather-impact-icon">🔥</div>
                <div className="weather-impact-details">
                  <span className="weather-impact-title">Temperature Impact</span>
                  <span className="weather-impact-effect">
                    {weather.temp > 35 ? `High temperature (${weather.temp}°C) increases evaporation` : weather.temp > 28 ? `Moderate temperature (${weather.temp}°C) supports growth` : `Cool temperature (${weather.temp}°C) may slow crop development`}
                  </span>
                  <div className="weather-impact-crops">
                    <span className="impact-crop-tag">Wheat</span>
                    <span className="impact-crop-tag">Potato</span>
                    <span className="impact-crop-tag">Tomato</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
