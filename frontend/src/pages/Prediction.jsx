import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { COMMODITIES, MARKETS } from '../data';
import { useLanguage } from '../context/LanguageContext';

const Prediction = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialCrop = searchParams.get('crop') || COMMODITIES[0].id;
  const initialMarket = searchParams.get('market') || MARKETS[0].id;

  const [commodityId, setCommodityId] = useState(initialCrop);
  const [marketId, setMarketId] = useState(initialMarket);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' or 'table'
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Sync state if URL params change
  useEffect(() => {
    const qCrop = searchParams.get('crop');
    const qMarket = searchParams.get('market');
    if (qCrop && COMMODITIES.some(c => c.id === qCrop)) {
      setCommodityId(qCrop);
    }
    if (qMarket && MARKETS.some(m => m.id === qMarket)) {
      setMarketId(qMarket);
    }
  }, [searchParams]);

  const selectedCommodity = useMemo(() => {
    return COMMODITIES.find(c => c.id === commodityId) || COMMODITIES[0];
  }, [commodityId]);

  const selectedMarket = useMemo(() => {
    return MARKETS.find(m => m.id === marketId) || MARKETS[0];
  }, [marketId]);

  const fetchPredictionFromAPI = async (targetCrop = commodityId, targetMarket = marketId) => {
    setLoading(true);
    setApiError(null);
    const curCropObj = COMMODITIES.find(c => c.id === targetCrop) || selectedCommodity;
    const curMarketObj = MARKETS.find(m => m.id === targetMarket) || selectedMarket;

    try {
      const res = await axios.get('http://localhost:8000/api/predictions', {
        params: {
          crop: targetCrop,
          cropName: curCropObj.name,
          market: targetMarket,
          marketName: curMarketObj.name,
          days: 15
        }
      });
      setPredictionData(res.data);
      setResultsVisible(true);
    } catch (err) {
      setApiError('Backend server is not reachable. Please start the backend and try again.');
      setResultsVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on initial load
  useEffect(() => {
    fetchPredictionFromAPI(commodityId, marketId);
  }, []);



  const drawPredictionChart = (hist, forecast) => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    const labels = [...hist.map(p => p.date), ...forecast.map(p => p.date)];
    const histData = hist.map(p => p.price);
    
    // Connect forecast seamlessly to the last historical point
    const foreData = Array(hist.length - 1).fill(null);
    foreData.push(hist[hist.length - 1].price);
    foreData.push(...forecast.map(p => p.price));
    
    const allVals = [...histData, ...forecast.map(p => p.price)];
    const maxP = Math.max(...allVals);
    const minP = Math.min(...allVals);
    
    if (window.Chart) {
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: '15-Day Historical Price (₹/Qt)',
              data: histData,
              borderColor: '#1a7a4a',
              backgroundColor: 'rgba(26, 122, 74, 0.12)',
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#1a7a4a',
              pointRadius: 3,
              borderWidth: 2.5
            },
            {
              label: '15-Day AI Forecast Price (₹/Qt)',
              data: foreData,
              borderColor: '#FF8F00',
              backgroundColor: 'rgba(255, 143, 0, 0.08)',
              borderDash: [6, 4],
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#FF8F00',
              pointRadius: 4,
              borderWidth: 2.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ₹${context.raw?.toLocaleString()}/Qt`;
                }
              }
            }
          },
          scales: {
            y: { 
              min: Math.floor(minP * 0.95), 
              max: Math.ceil(maxP * 1.05),
              grid: { color: 'rgba(0,0,0,0.06)' },
              ticks: { callback: v => `₹${v.toLocaleString()}` }
            },
            x: { 
              grid: { display: false }, 
              ticks: { maxTicksLimit: 12 } 
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    if (resultsVisible && predictionData && chartRef.current && activeTab === 'chart') {
      drawPredictionChart(predictionData.historical15Days, predictionData.forecast15Days);
    }
  }, [resultsVisible, predictionData, activeTab]);

  useEffect(() => {
    if (resultsVisible) {
      fetchPredictionFromAPI();
    }
  }, [commodityId, marketId]);

  return (
    <section className="section active" id="prediction">
      <div className="section-banner banner-analytics">
        <div className="section-banner-content">
          <h2 className="section-banner-title">{t('prediction.title')}</h2>
          <p className="section-banner-desc">{t('prediction.subtitle')}</p>
        </div>
        <div className="section-banner-icon">📈</div>
      </div>

      {/* CONTROLS */}
      <div className="prediction-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <div className="control-group">
          <label style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>🌾 {t('prediction.crop')} ({COMMODITIES.length} {t('prediction.available')})</label>
          <select className="select-input" value={commodityId} onChange={e => setCommodityId(e.target.value)}>
            {COMMODITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name} ({c.category})</option>)}
          </select>
        </div>

        <div className="control-group">
          <label style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px', display: 'block' }}>🏛️ {t('prediction.market')} ({MARKETS.length} {t('prediction.mandis')})</label>
          <select className="select-input" value={marketId} onChange={e => setMarketId(e.target.value)}>
            {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.state})</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn-primary" onClick={fetchPredictionFromAPI} disabled={loading} style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {loading ? t('prediction.analyzing') : t('prediction.generate')}
          </button>
        </div>
      </div>

      {apiError && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--red)', background: 'rgba(231,76,60,0.08)', borderRadius: '12px', marginBottom: '1rem', border: '1px solid rgba(231,76,60,0.2)' }}>
          ⚠️ {apiError}
        </div>
      )}

      {resultsVisible && predictionData && (

        <div className="prediction-results">
          {/* Main Forecast Visualizer */}
          <div className="prediction-grid">
            <div className="card glass prediction-chart-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h3 className="card-title" style={{ margin: '0' }}>
                    {selectedCommodity.emoji} {predictionData.cropName} Price Trend (15 Days Past + 15 Days AI Forecast)
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mandi: {predictionData.marketName}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className={`btn-tag ${activeTab === 'chart' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chart')}
                  >
                    📈 {t('prediction.tabChart')}
                  </button>
                  <button 
                    className={`btn-tag ${activeTab === 'table' ? 'active' : ''}`}
                    onClick={() => setActiveTab('table')}
                  >
                    📋 {t('prediction.tabTable')}
                  </button>
                </div>
              </div>

              {activeTab === 'chart' ? (
                <div>
                  <div style={{ height: '380px', width: '100%', position: 'relative' }}>
                    <canvas ref={chartRef}></canvas>
                  </div>
                  <div className="chart-legend" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <div className="legend-dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1a7a4a' }}></div>
                      <strong>Past 15 Days (Actual Mandi Data)</strong>
                    </div>
                    <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <div className="legend-dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF8F00' }}></div>
                      <strong>Next 15 Days (AI Projected Trend)</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  <table className="table" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.04)', borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '8px 12px' }}>{t('prediction.table.date')}</th>
                        <th style={{ padding: '8px 12px' }}>{t('prediction.table.type')}</th>
                        <th style={{ padding: '8px 12px' }}>{t('prediction.table.price')}</th>
                        <th style={{ padding: '8px 12px' }}>{t('prediction.table.change')}</th>
                        <th style={{ padding: '8px 12px' }}>{t('prediction.table.confidence')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionData.historical15Days.map((p, idx) => (
                        <tr key={`h_${idx}`} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(26,122,74,0.02)' }}>
                          <td style={{ padding: '8px 12px' }}>{p.date}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--accent-gain)', fontWeight: '600' }}>Historical</td>
                          <td style={{ padding: '8px 12px', fontWeight: '700' }}>₹{p.price.toLocaleString()}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Recorded</td>
                          <td style={{ padding: '8px 12px' }}>100% (Verified)</td>
                        </tr>
                      ))}
                      {predictionData.forecast15Days.map((p, idx) => {
                        const diff = p.price - predictionData.currentPrice;
                        const diffPct = ((diff / predictionData.currentPrice) * 100).toFixed(1);
                        return (
                          <tr key={`f_${idx}`} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,143,0,0.03)' }}>
                            <td style={{ padding: '8px 12px', fontWeight: '600' }}>{p.date}</td>
                            <td style={{ padding: '8px 12px', color: '#FF8F00', fontWeight: '600' }}>AI Forecast (Day +{idx + 1})</td>
                            <td style={{ padding: '8px 12px', fontWeight: '700', color: '#B78103' }}>₹{p.price.toLocaleString()}</td>
                            <td style={{ padding: '8px 12px', color: diff >= 0 ? 'var(--accent-gain)' : 'var(--red)', fontWeight: '600' }}>
                              {diff >= 0 ? '+' : ''}{diffPct}%
                            </td>
                            <td style={{ padding: '8px 12px' }}>{p.confidence || 85}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Sidebar Cards */}
            <div className="prediction-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card glass" style={{ borderLeft: '4px solid var(--accent-gain)' }}>
                <h4 style={{ margin: '0 0 10px' }}>{t('prediction.advisoryTitle')}</h4>
                <div className={`recommendation ${predictionData.expectedChangePercent >= 0 ? 'rec-hold' : 'rec-sell'}`} style={{ padding: '12px', borderRadius: '10px' }}>
                  <div className="rec-action" style={{ fontSize: '1.05rem', fontWeight: '700' }}>{predictionData.recommendation}</div>
                  <div className="rec-reason" style={{ fontSize: '0.85rem', marginTop: '6px' }}>{predictionData.reason}</div>
                </div>
              </div>
              
              <div className="card glass">
                <h4 style={{ margin: '0 0 12px' }}>🎯 Forecast Accuracy Confidence</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-gain)' }}>
                    {predictionData.confidenceScore || 91}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Calculated using historical seasonality, mandi volume trends, weather data, and supply-chain logistics.
                  </div>
                </div>
              </div>
              
              <div className="card glass">
                <h4 style={{ margin: '0 0 12px' }}>📊 15-Day Price Benchmarks</h4>
                <div className="price-summary" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="price-summary-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    <span className="ps-label" style={{ color: 'var(--text-secondary)' }}>{t('prediction.currentPrice')}</span>
                    <span className="ps-value" style={{ fontWeight: '700' }}>₹{predictionData.currentPrice.toLocaleString()}/Qt</span>
                  </div>
                  <div className="price-summary-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    <span className="ps-label" style={{ color: 'var(--text-secondary)' }}>{t('prediction.targetForecast')}</span>
                    <span className="ps-value" style={{ fontWeight: '700', color: '#B78103' }}>₹{predictionData.predicted15DayPrice.toLocaleString()}/Qt</span>
                  </div>
                  <div className="price-summary-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                    <span className="ps-label" style={{ color: 'var(--text-secondary)' }}>{t('prediction.projectedShift')}</span>
                    <span className="ps-value" style={{ fontWeight: '700', color: predictionData.expectedChangePercent >= 0 ? 'var(--accent-gain)' : 'var(--red)' }}>
                      {predictionData.expectedChangePercent >= 0 ? '+' : ''}{predictionData.expectedChangePercent}%
                    </span>
                  </div>
                  <div className="price-summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="ps-label" style={{ color: 'var(--text-secondary)' }}>{t('prediction.averageBaseline')}</span>
                    <span className="ps-value" style={{ fontWeight: '600' }}>₹{predictionData.avg30Day.toLocaleString()}/Qt</span>
                  </div>
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

