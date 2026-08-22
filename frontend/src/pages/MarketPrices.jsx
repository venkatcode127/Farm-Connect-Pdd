import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { COMMODITIES, MARKETS } from '../data';
import { useLanguage } from '../context/LanguageContext';

const SimpleSparkline = ({ data }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const up = data[data.length - 1] >= data[0];

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 78 + 1;
    const y = 28 - ((v - min) / range) * 26 + 1;
    return `${x},${y}`;
  }).join(' L ');

  const color = up ? '#2ecc71' : '#e74c3c';

  return (
    <svg width="80" height="30" viewBox="0 0 80 30">
      <path d={`M ${1},${28 - ((data[0] - min) / range) * 26 + 1} L ${points}`} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

const MarketPrices = () => {
  const [marketId, setMarketId] = useState('delhi');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const { t, getCropName } = useLanguage();

  // Fetch real-time prices from the SAME backend API as Dashboard
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:8000/api/market/overview', {
          params: { market: marketId }
        });
        setApiData(res.data);
      } catch (err) {
        setError('Backend unavailable. Please ensure the backend server is running.');
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, [marketId]);

  const states = useMemo(() => ['all', ...new Set(MARKETS.map(m => m.state))], []);

  // Filter the API commodities by search term
  const filteredRows = useMemo(() => {
    if (!apiData?.commodities) return [];
    const searchLower = search.toLowerCase();
    return apiData.commodities.filter(item => {
      const com = COMMODITIES.find(c => c.id === item.crop || c.id === item.id);
      const name = com ? getCropName(com) : item.name;
      return !searchLower || name.toLowerCase().includes(searchLower) || (item.crop || '').includes(searchLower);
    });
  }, [apiData, search, getCropName]);

  return (
    <section className="section active" id="market">
      <div className="section-banner banner-market">
        <div className="section-banner-content">
          <h2 className="section-banner-title">{t('marketPrices.title', 'Market Prices')}</h2>
          <p className="section-banner-desc">{t('marketPrices.subtitle', 'Live prices from backend — same data as Dashboard & AI Prediction')}</p>
        </div>
        <div className="section-banner-icon">🧺</div>
      </div>

      <div className="market-filters">
        {/* Market Selector — same as Dashboard for consistent prices */}
        <select
          className="select-input"
          value={marketId}
          onChange={e => setMarketId(e.target.value)}
        >
          {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <input
          type="text"
          className="search-input"
          placeholder={t('marketPrices.searchPlaceholder', 'Search commodity...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="select-input"
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
        >
          <option value="all">{t('marketPrices.allStates', 'All States')}</option>
          {states.filter(s => s !== 'all').map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          ⏳ Loading live prices from backend...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--red)', background: 'rgba(231,76,60,0.08)', borderRadius: '12px', margin: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-container glass">
          <table className="market-table">
            <thead>
              <tr>
                <th>{t('dashboard.colCrop', 'Commodity')}</th>
                <th>{t('dashboard.colMarket', 'Market')}</th>
                <th>{t('dashboard.colCurrentPrice', 'Live Price')} (₹/Qt)</th>
                <th>{t('dashboard.colTrend', '24h Change')}</th>
                <th>15-Day Forecast</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(item => {
                const com = COMMODITIES.find(c => c.id === item.crop || c.id === item.id) || { emoji: '🌾', name: item.name };
                const up = item.change24h >= 0;
                const forecastUp = item.expectedChangePercent >= 0;
                const sparkData = item.sparkline || [];

                return (
                  <tr key={item.id || item.crop}>
                    <td className="commodity-cell">
                      <span className="commodity-emoji">{com.emoji}</span>
                      {getCropName(com)}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {MARKETS.find(m => m.id === marketId)?.name || marketId}
                    </td>
                    <td><strong>₹{item.currentPrice?.toLocaleString()}</strong></td>
                    <td className={up ? 'change-up' : 'change-down'}>
                      {up ? '+' : ''}{item.change24h?.toFixed(1)}%
                    </td>
                    <td style={{ fontSize: '0.82rem', color: forecastUp ? 'var(--green)' : 'var(--red)', fontWeight: '700' }}>
                      ₹{item.predicted15DayPrice?.toLocaleString()}
                      <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>
                        ({forecastUp ? '+' : ''}{item.expectedChangePercent?.toFixed(1)}%)
                      </span>
                    </td>
                    <td>
                      <SimpleSparkline data={sparkData} />
                    </td>
                  </tr>
                );
              })}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MarketPrices;
