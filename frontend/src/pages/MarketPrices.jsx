import React, { useState, useMemo } from 'react';
import { COMMODITIES, MARKETS, PRICE_HISTORY } from '../data';

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
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  // Extract unique states from MARKETS
  const states = useMemo(() => {
    return [...new Set(MARKETS.map(m => m.state))];
  }, []);

  const filteredData = useMemo(() => {
    const results = [];
    const searchLower = search.toLowerCase();

    COMMODITIES.forEach(c => {
      MARKETS.forEach(m => {
        if (stateFilter !== 'all' && m.state !== stateFilter) return;
        
        if (searchLower && !c.name.toLowerCase().includes(searchLower)) return;
        
        const prices = PRICE_HISTORY[c.id]?.[m.id];
        if (!prices) return;

        const cur = prices[prices.length - 1].price;
        const prev = prices[prices.length - 2].price;
        const chg = ((cur - prev) / prev * 100);
        const up = chg >= 0;
        const spark = prices.slice(-10).map(p => p.price);
        
        results.push({
          key: `${c.id}-${m.id}`,
          commodity: c,
          market: m,
          cur,
          chg,
          up,
          spark
        });
      });
    });

    return results;
  }, [search, stateFilter]);

  return (
    <section className="section active" id="market">
      <div className="section-banner banner-market">
        <div className="section-banner-content">
          <h2 className="section-banner-title">Market Prices</h2>
          <p className="section-banner-desc">Current commodity prices across Indian markets</p>
        </div>
        <div className="section-banner-icon">🧺</div>
      </div>
      
      <div className="market-filters">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search commodity..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="select-input" 
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
        >
          <option value="all">All States</option>
          {states.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="table-container glass">
        <table className="market-table">
          <thead>
            <tr>
              <th>Commodity</th>
              <th>Market</th>
              <th>Price (₹/Qt)</th>
              <th>Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => (
              <tr key={row.key}>
                <td className="commodity-cell">
                  <span className="commodity-emoji">{row.commodity.emoji}</span>
                  {row.commodity.name}
                </td>
                <td>{row.market.name}</td>
                <td><strong>₹{row.cur.toLocaleString()}</strong></td>
                <td className={row.up ? 'change-up' : 'change-down'}>
                  {row.up ? '+' : ''}{row.chg.toFixed(1)}%
                </td>
                <td>
                  <SimpleSparkline data={row.spark} />
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No results found for your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MarketPrices;
