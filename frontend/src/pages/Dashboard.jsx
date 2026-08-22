import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMMODITIES, MARKETS, WEATHER_DATA } from '../data';
import { useLanguage } from '../context/LanguageContext';

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
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, getCropName } = useLanguage();

  // Fetch unified real-time market overview from backend API
  useEffect(() => {
    const fetchMarketOverview = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/market/overview', {
          params: { market: marketId }
        });
        setMarketData(res.data);
      } catch (err) {
        console.error('Failed to fetch market overview', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketOverview();
  }, [marketId]);

  const weather = WEATHER_DATA[marketId];
  const topGainer = marketData?.topGainer;
  const topPredictions = marketData?.topPredictions || [];

  const handleCropClick = (cropId) => {
    navigate(`/prediction?crop=${cropId}&market=${marketId}`);
  };

  const getTranslatedRec = (rec) => {
    if (!rec) return '';
    const upper = rec.toUpperCase();
    if (upper.includes('SELL')) return t('rec.sell', 'SELL NOW');
    if (upper.includes('BUY')) return t('rec.buy', 'BUY NOW');
    if (upper.includes('HOLD') || upper.includes('WAIT')) return t('rec.hold', 'HOLD');
    return rec;
  };

  return (
    <section className="section active" id="dashboard">
      <div className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-content" style={{ zIndex: 10, position: 'relative' }}>
          <h1 className="hero-title">{t('dashboard.heroTitle', 'Smart Farming Starts Here')}</h1>
          <p className="hero-subtitle">{t('dashboard.heroSubtitle', 'AI-powered price predictions to maximize your profits')}</p>
          <button className="btn-primary hero-cta" onClick={() => navigate(`/prediction?market=${marketId}`)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {t('dashboard.getPredictionBtn', 'Get My AI Prediction')}
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
            <span className="stat-label">{t('dashboard.topGainer', 'Top Gainer Today')}</span>
            <span className="stat-value">
              {topGainer ? `${getCropName(topGainer.name)} ${topGainer.change24h >= 0 ? '▲' : '▼'} ${Math.abs(topGainer.change24h).toFixed(1)}%` : t('common.loading', 'Loading...')}
            </span>
          </div>
        </div>

        <div className="stat-card glass clickable" onClick={() => navigate(`/prediction?market=${marketId}`)}>
          <div className="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">{t('dashboard.weatherAlert', 'AI Price Alerts')}</span>
            <span className="stat-value">Real-Time Active</span>
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
            <span className="stat-label">{t('nav.marketplace', 'Marketplace')}</span>
            <span className="stat-value">Live Mandi</span>
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
            <span className="stat-label">{t('dashboard.activeMarkets', 'Active APMC Mandis')}</span>
            <span className="stat-value">{MARKETS.length} Mandis</span>
          </div>
        </div>
      </div>

      <div className="dashboard-selector">
        <label>{t('dashboard.selectMarket', 'Select Mandi / State:')}</label>
        <select className="select-input" value={marketId} onChange={e => setMarketId(e.target.value)}>
          {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="dashboard-grid">
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>📊 {t('dashboard.marketOverview', 'Market Overview')}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('dashboard.viewForecast', 'Click crop for AI prediction')}</span>
          </div>
          <div className="quick-price-table-wrapper">
            <table className="quick-price-table">
              <thead>
                <tr>
                  <th>{t('dashboard.colCrop', 'Crop')}</th>
                  <th>{t('dashboard.colCurrentPrice', 'Current Price')} (₹/Qt)</th>
                  <th>{t('dashboard.colTrend', 'Change 24h')}</th>
                  <th>7-Day Trend</th>
                </tr>
              </thead>
              <tbody>
                {(marketData?.commodities || COMMODITIES.slice(0, 12)).map(c => {
                  const com = COMMODITIES.find(item => item.id === c.id || item.id === c.crop) || { emoji: '🌾', name: c.name || c.id };
                  const price = c.currentPrice || com.basePrice || 3000;
                  const change = c.change24h !== undefined ? c.change24h : 0.8;
                  const up = change >= 0;
                  const sparklineData = c.sparkline || [price * 0.98, price * 0.99, price, price * 1.01, price];
                  const displayName = getCropName(com);

                  return (
                    <tr 
                      key={c.id || com.id} 
                      onClick={() => handleCropClick(c.id || com.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to view detailed 15-day AI forecast"
                    >
                      <td className="crop-cell">
                        <span className="crop-emoji">{com.emoji}</span>
                        <span>{displayName}</span>
                      </td>
                      <td className="price-cell">₹{price.toLocaleString()}</td>
                      <td className={`change-cell ${up ? 'positive' : 'negative'}`}>
                        {up ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                      </td>
                      <td className="sparkline-cell"><Sparkline data={sparklineData} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>🤖 {t('prediction.title', 'AI Prediction')}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>15-Day Database Forecast</span>
          </div>
          <div className="top-crops-container">
            {topPredictions.map(crop => {
              const com = COMMODITIES.find(item => item.id === crop.id || item.id === crop.crop) || { emoji: '🌾', name: crop.name };
              const isBullish = crop.expectedChangePercent >= 2.5;
              const isBearish = crop.expectedChangePercent <= -2.5;
              const badgeClass = isBullish ? 'badge-buy' : isBearish ? 'badge-sell' : 'badge-wait';
              const displayName = getCropName(com);

              return (
                <div 
                  className="crop-prediction-card" 
                  key={crop.id}
                  onClick={() => handleCropClick(crop.id)}
                  style={{ cursor: 'pointer' }}
                  title="Click to open full AI Prediction page for this crop"
                >
                  <div className="crop-pred-emoji">{com.emoji}</div>
                  <div className="crop-pred-info">
                    <span className="crop-pred-name">{displayName}</span>
                    <div className="crop-pred-details">
                      <span>📈 15-Day: <strong>₹{crop.predicted15DayPrice?.toLocaleString()}</strong></span>
                      <span>🎯 {crop.confidenceScore}% {t('prediction.confidence', 'confidence')}</span>
                    </div>
                    <span className={`crop-pred-badge ${badgeClass}`} style={{ marginTop: '4px' }}>
                      {getTranslatedRec(crop.recommendation)}
                    </span>
                  </div>
                  <div className="crop-pred-value">
                    <span className="crop-pred-forecast" style={{ color: isBullish ? 'var(--green)' : isBearish ? 'var(--red)' : 'var(--amber)' }}>
                      {crop.expectedChangePercent >= 0 ? '▲ +' : '▼ '}{crop.expectedChangePercent}%
                    </span>
                    <span className="crop-pred-confidence">15-day forecast</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '24px' }}>
        <div className="card glass">
          <h3 className="card-title">🌤️ {t('weather.title', 'Weather Impact on Prices')}</h3>
          {weather && (
            <div className="weather-impact-widget">
              <div className="weather-impact-item weather-impact-rain">
                <div className="weather-impact-icon">🌧️</div>
                <div className="weather-impact-details">
                  <span className="weather-impact-title">Rainfall Impact</span>
                  <span className="weather-impact-effect">
                    {weather.rainfall > 30 ? `High rainfall (${weather.rainfall}mm) may increase moisture & storage rot risk` : weather.rainfall > 10 ? `Moderate rainfall (${weather.rainfall}mm) is beneficial for growth` : `Low rainfall (${weather.rainfall}mm) may cause temporary supply tightness`}
                  </span>
                  <div className="weather-impact-crops">
                    <span className="impact-crop-tag">{getCropName('Rice (Basmati)')}</span>
                    <span className="impact-crop-tag">{getCropName('Sugarcane')}</span>
                    <span className="impact-crop-tag">{getCropName('Onion')}</span>
                  </div>
                </div>
              </div>
              <div className="weather-impact-item weather-impact-heat">
                <div className="weather-impact-icon">🔥</div>
                <div className="weather-impact-details">
                  <span className="weather-impact-title">{t('weather.temperature', 'Temperature')} Impact</span>
                  <span className="weather-impact-effect">
                    {weather.temp > 35 ? `High temperature (${weather.temp}°C) accelerates drying & early arrivals` : weather.temp > 28 ? `Optimal temperature (${weather.temp}°C) supports normal trading` : `Cool weather (${weather.temp}°C) preserves perishable shelf life`}
                  </span>
                  <div className="weather-impact-crops">
                    <span className="impact-crop-tag">{getCropName('Wheat')}</span>
                    <span className="impact-crop-tag">{getCropName('Potato')}</span>
                    <span className="impact-crop-tag">{getCropName('Tomato')}</span>
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
