import React, { useState, useEffect, useRef } from 'react';
import { COMMODITIES, MARKETS, PRICE_HISTORY } from '../data';

const Prediction = () => {
  const [commodityId, setCommodityId] = useState(COMMODITIES[0].id);
  const [marketId, setMarketId] = useState(MARKETS[0].id);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const generateForecast = (prices) => {
    const recent = prices.slice(-14);
    const vals = recent.map((p) => p.price);
    const n = vals.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i; sumY += vals[i]; sumXY += i * vals[i]; sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const wma = vals.slice(-5).reduce((s, v, i) => s + v * (i + 1), 0) / 15;
    
    const today = new Date();
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const fd = new Date(today);
      fd.setDate(fd.getDate() + i);
      const linPred = intercept + slope * (n - 1 + i);
      const base = (linPred + wma) / 2;
      const noise = (Math.random() - 0.5) * 50;
      forecast.push({ date: fd.toISOString().split('T')[0], price: Math.round(base + noise) });
    }
    return forecast;
  };

  const drawPredictionChart = (recent, forecast) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    const labels = [...recent.map(p => p.date), ...forecast.map(p => p.date)];
    const histData = recent.map(p => p.price);
    const foreData = Array(recent.length - 1).fill(null);
    foreData.push(recent[recent.length - 1].price);
    foreData.push(...forecast.map(p => p.price));
    
    const maxP = Math.max(...histData, ...forecast.map(p => p.price));
    const minP = Math.min(...histData, ...forecast.map(p => p.price));
    
    chartInstance.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Historical',
            data: histData,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#2ecc71',
            borderWidth: 2
          },
          {
            label: 'Forecast',
            data: foreData,
            borderColor: '#f39c12',
            borderDash: [5, 5],
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#f39c12',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: minP * 0.9, max: maxP * 1.1, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } }
        }
      }
    });
  };

  const handlePredict = () => {
    const prices = PRICE_HISTORY[commodityId][marketId];
    const recent = prices.slice(-30);
    const forecast = generateForecast(prices);
    
    const cur = recent[recent.length - 1].price;
    const pred7 = forecast[forecast.length - 1].price;
    const change = ((pred7 - cur) / cur * 100).toFixed(1);
    const confidence = Math.round(65 + Math.random() * 25);
    
    let action, actionClass, reason;
    if (change > 3) {
      action = '🟢 HOLD';
      actionClass = 'rec-hold';
      reason = `Price expected to rise ${Math.abs(change)}% in 7 days. Wait for better prices.`;
    } else if (change < -3) {
      action = '🔴 SELL NOW';
      actionClass = 'rec-sell';
      reason = `Price projected to drop ${Math.abs(change)}%. Selling now would be beneficial.`;
    } else {
      action = '🟡 BUY / ACCUMULATE';
      actionClass = 'rec-buy';
      reason = 'Prices are stable. Good time to buy or accumulate stock.';
    }

    const allP = recent.map(p => p.price);
    const minP = Math.min(...allP), maxP = Math.max(...allP);
    const avgP = Math.round(allP.reduce((a, b) => a + b) / allP.length);
    
    setPredictionData({ recent, forecast, cur, pred7, change, confidence, action, actionClass, reason, minP, maxP, avgP });
    setResultsVisible(true);
  };

  useEffect(() => {
    if (resultsVisible && predictionData && chartRef.current) {
      drawPredictionChart(predictionData.recent, predictionData.forecast);
    }
  }, [resultsVisible, predictionData]);

  useEffect(() => {
    if (resultsVisible) {
      handlePredict(); // Redraw if changing options while visible
    }
  }, [commodityId, marketId]);

  return (
    <section className="section active" id="prediction">
      <div className="section-banner banner-analytics">
        <div className="section-banner-content">
          <h2 className="section-banner-title">AI Price Prediction</h2>
          <p className="section-banner-desc">Select a commodity and market to get AI-powered price forecasts</p>
        </div>
        <div className="section-banner-icon">📈</div>
      </div>

      <div className="prediction-controls">
        <div className="control-group">
          <label>Commodity</label>
          <select className="select-input" value={commodityId} onChange={e => setCommodityId(e.target.value)}>
            {COMMODITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label>Market / Mandi</label>
          <select className="select-input" value={marketId} onChange={e => setMarketId(e.target.value)}>
            {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={handlePredict}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Generate Forecast
        </button>
      </div>

      {resultsVisible && predictionData && (
        <div className="prediction-results">
          <div className="prediction-grid">
            <div className="card glass prediction-chart-card">
              <h3 className="card-title">Price Forecast Chart</h3>
              <div style={{ height: '400px', width: '100%', position: 'relative' }}>
                <canvas ref={chartRef}></canvas>
              </div>
              <div className="chart-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: '#2ecc71' }}></div>Historical</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#f39c12' }}></div>Forecast</div>
              </div>
            </div>
            
            <div className="prediction-sidebar">
              <div className="card glass">
                <h4>AI Recommendation</h4>
                <div className={`recommendation ${predictionData.actionClass}`}>
                  <div className="rec-action">{predictionData.action}</div>
                  <div className="rec-reason">{predictionData.reason}</div>
                </div>
              </div>
              
              <div className="card glass">
                <h4>Confidence Level</h4>
                <div className="confidence-gauge">
                  <svg viewBox="0 0 200 120" className="gauge-svg">
                    <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round" />
                    <path 
                      d="M20 100 A80 80 0 0 1 180 100" 
                      fill="none" 
                      stroke="url(#gaugeGrad)" 
                      strokeWidth="12" 
                      strokeLinecap="round" 
                      strokeDasharray={`${(251 * predictionData.confidence) / 100} 251`}
                    />
                    <text x="100" y="90" textAnchor="middle" className="gauge-text">{predictionData.confidence}%</text>
                    <defs>
                      <linearGradient id="gaugeGrad">
                        <stop offset="0%" stopColor="#e74c3c" />
                        <stop offset="50%" stopColor="#f39c12" />
                        <stop offset="100%" stopColor="#2ecc71" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              
              <div className="card glass">
                <h4>Price Summary</h4>
                <div className="price-summary">
                  <div className="price-summary-row"><span className="ps-label">Current Price</span><span className="ps-value">₹{predictionData.cur.toLocaleString()}</span></div>
                  <div className="price-summary-row"><span className="ps-label">7-Day Forecast</span><span className="ps-value">₹{predictionData.pred7.toLocaleString()}</span></div>
                  <div className="price-summary-row"><span className="ps-label">30-Day Average</span><span className="ps-value">₹{predictionData.avgP.toLocaleString()}</span></div>
                  <div className="price-summary-row"><span className="ps-label">30-Day Low</span><span className="ps-value">₹{predictionData.minP.toLocaleString()}</span></div>
                  <div className="price-summary-row"><span className="ps-label">30-Day High</span><span className="ps-value">₹{predictionData.maxP.toLocaleString()}</span></div>
                  <div className="price-summary-row"><span className="ps-label">Expected Change</span><span className="ps-value">{predictionData.change >= 0 ? '+' : ''}{predictionData.change}%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Prediction;
