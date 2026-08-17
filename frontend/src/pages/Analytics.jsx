import React, { useEffect, useRef } from 'react';
import { COMMODITIES, PRICE_HISTORY } from '../data';

const Analytics = () => {
  const seasonalCanvasRef = useRef(null);
  const comparisonCanvasRef = useRef(null);

  const crops = COMMODITIES.slice(0, 8);
  const volatilityData = crops.map(c => {
    const prices = PRICE_HISTORY[c.id].delhi.map(p => p.price);
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const std = Math.sqrt(prices.reduce((s, p) => s + (p - mean) ** 2, 0) / prices.length);
    const vol = Math.min(((std / mean) * 100 * 10).toFixed(0), 100);
    const color = vol > 60 ? 'var(--red)' : vol > 30 ? 'var(--amber)' : 'var(--green)';
    const name = c.name.split(' ')[0];
    return { c, name, vol, color };
  });

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const sellTimingData = COMMODITIES.slice(0, 6).map((c, i) => {
    const bestMonth = c.seasonal.indexOf(Math.max(...c.seasonal));
    const reasons = ['Peak demand season', 'Festival demand spike', 'Low supply period', 'Export window opens', 'Cold storage costs rise', 'Seasonal peak pricing'];
    return {
      c,
      bestMonth: months[bestMonth],
      reason: reasons[i % 6]
    };
  });

  useEffect(() => {
    if (seasonalCanvasRef.current) {
      drawSeasonalChart(seasonalCanvasRef.current);
    }
    if (comparisonCanvasRef.current) {
      drawComparisonChart(comparisonCanvasRef.current);
    }
  }, []);

  const drawSeasonalChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = 300;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#a0aec0' : '#5a6278';
    
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    
    ctx.clearRect(0, 0, W, H);
    
    const topCrops = [COMMODITIES[0], COMMODITIES[2], COMMODITIES[3], COMMODITIES[7]];
    const allSeasonal = topCrops.flatMap(c => c.seasonal);
    const minS = Math.min(...allSeasonal);
    const maxS = Math.max(...allSeasonal);
    const rangeS = maxS - minS || 1;
    
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const yy = pad.top + (i / 4) * ch;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
      const val = (maxS - (i / 4) * rangeS).toFixed(1);
      ctx.fillText(val + 'x', pad.left - 10, yy + 4);
    }
    
    ctx.textAlign = 'center';
    months.forEach((m, i) => ctx.fillText(m, pad.left + (i / 11) * cw, H - pad.bottom + 18));
    
    const colors = ['#2ecc71', '#e74c3c', '#f39c12', '#3498db'];
    
    topCrops.forEach((c, ci) => {
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
      
      c.seasonal.forEach((s, i) => {
        const xx = pad.left + (i / 11) * cw;
        const yy = pad.top + ch - ((s - minS) / rangeS) * ch;
        ctx.fillStyle = colors[ci];
        ctx.beginPath(); ctx.arc(xx, yy, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = isDark ? '#1a202c' : '#fff';
        ctx.beginPath(); ctx.arc(xx, yy, 1.5, 0, Math.PI*2); ctx.fill();
      });
    });
  
    ctx.textAlign = 'left';
    let legendX = pad.left;
    topCrops.forEach((c, ci) => {
      const name = c.name.split(' ')[0];
      ctx.fillStyle = colors[ci];
      ctx.beginPath(); ctx.arc(legendX + 6, H - 8, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = textColor; ctx.font = '12px Inter';
      ctx.fillText(name, legendX + 16, H - 4);
      legendX += ctx.measureText(name).width + 30;
    });
  };

  const drawComparisonChart = (canvas) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = 300;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#a0aec0' : '#5a6278';
    
    const pad = { top: 20, right: 20, bottom: 60, left: 60 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    
    ctx.clearRect(0, 0, W, H);
    
    const topCrops = COMMODITIES.slice(0, 6);
    const barW = cw / topCrops.length * 0.6;
    const gap = cw / topCrops.length;
    const maxP = Math.max(...topCrops.map(c => {
      const p = PRICE_HISTORY[c.id].delhi;
      return p[p.length - 1].price;
    }));
    
    const colors = ['#2ecc71','#e74c3c','#f39c12','#3498db','#9b59b6','#1abc9c'];
    
    topCrops.forEach((c, i) => {
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
      const name = c.name.split(' ')[0].substring(0, 6);
      ctx.fillText(name, xx + barW / 2, H - pad.bottom + 30);
      ctx.fillStyle = isDark ? '#e8ecf1' : '#1a1a2e'; ctx.font = 'bold 10px Inter';
      ctx.fillText('₹' + price.toLocaleString(), xx + barW / 2, yy - 6);
    });
  };

  return (
    <section className="section active" id="analytics">
      <div className="section-banner banner-analytics">
        <div className="section-banner-content">
          <h2 className="section-banner-title">Analytics & Insights</h2>
          <p className="section-banner-desc">Data-driven insights for smarter decisions</p>
        </div>
        <div className="section-banner-icon">🧠</div>
      </div>
      <div className="analytics-grid">
        <div className="card glass">
          <h3>Price Volatility Index</h3>
          <div className="volatility-bars">
            {volatilityData.map(v => (
              <div className="volatility-item" key={v.c.id}>
                <span className="vol-name">{v.c.emoji} {v.name}</span>
                <div className="vol-bar-track">
                  <div className="vol-bar-fill" style={{ width: `${v.vol}%`, background: v.color }}></div>
                </div>
                <span className="vol-value">{v.vol}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card glass">
          <h3>Seasonal Trends</h3>
          <canvas ref={seasonalCanvasRef} width="600" height="300" style={{ width: '100%' }}></canvas>
        </div>
        <div className="card glass">
          <h3>Best Time to Sell</h3>
          <div className="sell-timing">
            {sellTimingData.map(s => (
              <div className="sell-timing-item" key={s.c.id}>
                <div>
                  <div className="st-crop">{s.c.emoji} {s.c.name}</div>
                  <div className="st-reason">{s.reason}</div>
                </div>
                <div className="st-month">{s.bestMonth}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card glass">
          <h3>Market Comparison</h3>
          <canvas ref={comparisonCanvasRef} width="600" height="300" style={{ width: '100%' }}></canvas>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
