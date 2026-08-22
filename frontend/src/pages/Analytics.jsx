import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { COMMODITIES, MARKETS, PRICE_HISTORY } from '../data';

const Analytics = () => {
  const { t, getCropName } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropId, setSelectedCropId] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [userRole, setUserRole] = useState('farmer'); // 'farmer' or 'buyer'

  const seasonalCanvasRef = useRef(null);
  const comparisonCanvasRef = useRef(null);
  const singleCropCanvasRef = useRef(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['all'];
    COMMODITIES.forEach(c => {
      if (c.category && !cats.includes(c.category)) cats.push(c.category);
    });
    return cats;
  }, []);

  // Extract unique states from MARKETS
  const states = useMemo(() => {
    const sts = ['all'];
    MARKETS.forEach(m => {
      if (m.state && !sts.includes(m.state)) sts.push(m.state);
    });
    return sts;
  }, []);

  // Filtered commodities based on search, category, and selectedCropId
  const filteredCommodities = useMemo(() => {
    return COMMODITIES.filter(c => {
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.nameHi && c.nameHi.includes(searchTerm)) ||
        (c.nameTe && c.nameTe.includes(searchTerm)) ||
        (c.nameTa && c.nameTa.includes(searchTerm)) ||
        (c.nameKn && c.nameKn.includes(searchTerm)) ||
        (c.emoji && c.emoji.includes(searchTerm));
      
      const matchesSpecific = selectedCropId === 'all' || c.id === selectedCropId;
      return matchesCategory && matchesSearch && matchesSpecific;
    });
  }, [searchTerm, selectedCategory, selectedCropId]);

  // Selected crop details if a specific crop is active or filtered to 1
  const activeSingleCrop = useMemo(() => {
    if (selectedCropId !== 'all') {
      return COMMODITIES.find(c => c.id === selectedCropId) || null;
    }
    if (filteredCommodities.length === 1) {
      return filteredCommodities[0];
    }
    return null;
  }, [selectedCropId, filteredCommodities]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // State-filtered markets
  const stateMarkets = useMemo(() => {
    if (selectedState === 'all') return MARKETS;
    return MARKETS.filter(m => m.state === selectedState);
  }, [selectedState]);

  // Calculate Volatility Data for current crop list (incorporating state benchmark)
  const volatilityData = useMemo(() => {
    const list = activeSingleCrop ? [activeSingleCrop] : filteredCommodities.slice(0, 10);
    const targetMarketId = stateMarkets[0]?.id || 'delhi';

    return list.map(c => {
      const history = (PRICE_HISTORY[c.id] && PRICE_HISTORY[c.id][targetMarketId]) || 
                      (PRICE_HISTORY[c.id] && PRICE_HISTORY[c.id].delhi) || [];
      const prices = history.map(p => p.price);
      if (!prices.length) {
        return { c, name: c.name.split(' ')[0], vol: 15, color: 'var(--green)', std: 50, mean: c.basePrice || 2000 };
      }
      const mean = prices.reduce((s, p) => s + p, 0) / prices.length;
      const std = Math.sqrt(prices.reduce((s, p) => s + (p - mean) ** 2, 0) / prices.length);
      const vol = Math.min(Math.round(((std / mean) * 100 * 8)), 100);
      const color = vol > 55 ? 'var(--red)' : vol > 28 ? 'var(--amber)' : 'var(--green)';
      const name = c.name.split(' ')[0];
      return { c, name, vol, color, std: Math.round(std), mean: Math.round(mean) };
    });
  }, [filteredCommodities, activeSingleCrop, stateMarkets]);

  // Calculate Best Time to Sell / Buy
  const sellTimingData = useMemo(() => {
    const list = activeSingleCrop ? [activeSingleCrop] : filteredCommodities.slice(0, 8);
    const reasons = [
      'Peak seasonal demand & festival spikes',
      'Supply deficit post-harvest season',
      'High wholesale export & processor demand',
      'Stock depletion in major terminal mandis',
      'Favorable buyer procurement price point',
      'Seasonal pre-monsoon market upswing'
    ];
    return list.map((c, i) => {
      const seasonal = c.seasonal || [1,1,1,1,1,1,1,1,1,1,1,1];
      const maxMultiplier = Math.max(...seasonal);
      const minMultiplier = Math.min(...seasonal);
      const bestSellMonth = seasonal.indexOf(maxMultiplier);
      const bestBuyMonth = seasonal.indexOf(minMultiplier);
      return {
        c,
        bestSellMonth: months[bestSellMonth],
        bestBuyMonth: months[bestBuyMonth],
        peakGain: Math.round((maxMultiplier - 1) * 100),
        buyDiscount: Math.round((1 - minMultiplier) * 100),
        reason: reasons[i % reasons.length]
      };
    });
  }, [filteredCommodities, activeSingleCrop]);

  // Get mandi price list filtered state-wise
  const getSingleCropMandiPrices = (crop) => {
    if (!crop || !PRICE_HISTORY[crop.id]) return [];
    
    let marketsToUse = stateMarkets;
    if (marketsToUse.length === 0) {
      marketsToUse = MARKETS;
    }

    return marketsToUse.map(m => {
      const history = PRICE_HISTORY[crop.id][m.id] || [];
      const latestPrice = history.length ? history[history.length - 1].price : (crop.basePrice || 3000);
      const prevPrice = history.length > 7 ? history[history.length - 8].price : latestPrice;
      const change = Math.round(((latestPrice - prevPrice) / prevPrice) * 100);
      return {
        market: m.name,
        state: m.state,
        price: latestPrice,
        change
      };
    }).sort((a, b) => b.price - a.price);
  };

  // State overview metrics
  const stateAnalyticsSummary = useMemo(() => {
    const targetCrop = activeSingleCrop || filteredCommodities[0] || COMMODITIES[0];
    const pricesList = getSingleCropMandiPrices(targetCrop);
    if (!pricesList.length) return null;

    const allPrices = pricesList.map(p => p.price);
    const avgPrice = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
    const maxMandi = pricesList[0];
    const minMandi = pricesList[pricesList.length - 1];
    const arbitrage = maxMandi.price - minMandi.price;

    return {
      stateName: selectedState === 'all' ? 'All India (National Average)' : selectedState,
      mandisCount: stateMarkets.length,
      cropName: targetCrop.name,
      cropEmoji: targetCrop.emoji,
      avgPrice,
      maxMandi,
      minMandi,
      arbitrage
    };
  }, [selectedState, stateMarkets, activeSingleCrop, filteredCommodities]);

  // Redraw charts whenever filtered commodities, active crop, role, or state changes
  useEffect(() => {
    if (activeSingleCrop && singleCropCanvasRef.current) {
      drawSingleCropDetailChart(singleCropCanvasRef.current, activeSingleCrop);
    }
    if (seasonalCanvasRef.current) {
      drawSeasonalChart(seasonalCanvasRef.current, filteredCommodities);
    }
    if (comparisonCanvasRef.current) {
      drawComparisonChart(comparisonCanvasRef.current, filteredCommodities);
    }
  }, [filteredCommodities, activeSingleCrop, userRole, selectedState]);

  // --- DRAW MULTI-CROP SEASONAL CHART ---
  const drawSeasonalChart = (canvas, crops) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const pad = { top: 25, right: 20, bottom: 45, left: 45 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);

    const targetCrops = crops.slice(0, 5);
    if (!targetCrops.length) {
      ctx.fillStyle = textColor;
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No crops match your search filter', W / 2, H / 2);
      return;
    }

    const allSeasonal = targetCrops.flatMap(c => c.seasonal || [1]);
    const minS = Math.min(...allSeasonal, 0.8);
    const maxS = Math.max(...allSeasonal, 1.3);
    const rangeS = (maxS - minS) || 1;

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const yy = pad.top + (i / 4) * ch;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
      const val = (maxS - (i / 4) * rangeS).toFixed(2);
      ctx.fillText(val + 'x', pad.left - 8, yy + 4);
    }

    // Month labels
    ctx.textAlign = 'center';
    months.forEach((m, i) => ctx.fillText(m, pad.left + (i / 11) * cw, H - pad.bottom + 18));

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    targetCrops.forEach((c, ci) => {
      const seasonal = c.seasonal || [1,1,1,1,1,1,1,1,1,1,1,1];
      ctx.strokeStyle = colors[ci % colors.length];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      seasonal.forEach((s, i) => {
        const xx = pad.left + (i / 11) * cw;
        const yy = pad.top + ch - ((s - minS) / rangeS) * ch;
        i === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      });
      ctx.stroke();

      seasonal.forEach((s, i) => {
        const xx = pad.left + (i / 11) * cw;
        const yy = pad.top + ch - ((s - minS) / rangeS) * ch;
        ctx.fillStyle = colors[ci % colors.length];
        ctx.beginPath(); ctx.arc(xx, yy, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        ctx.beginPath(); ctx.arc(xx, yy, 1.5, 0, Math.PI * 2); ctx.fill();
      });
    });

    // Legend
    ctx.textAlign = 'left';
    let legendX = pad.left;
    targetCrops.forEach((c, ci) => {
      const name = c.name.split(' ')[0];
      ctx.fillStyle = colors[ci % colors.length];
      ctx.beginPath(); ctx.arc(legendX + 6, H - 8, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = textColor; ctx.font = '11px Inter';
      ctx.fillText(name, legendX + 14, H - 5);
      legendX += ctx.measureText(name).width + 26;
    });
  };

  // --- DRAW COMPARISON BAR CHART ---
  const drawComparisonChart = (canvas, crops) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = 280;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const pad = { top: 25, right: 20, bottom: 50, left: 55 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);

    const targetCrops = crops.slice(0, 7);
    if (!targetCrops.length) {
      ctx.fillStyle = textColor;
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No crops match your search filter', W / 2, H / 2);
      return;
    }

    const prices = targetCrops.map(c => {
      const history = (PRICE_HISTORY[c.id] && PRICE_HISTORY[c.id].delhi) || [];
      return history.length ? history[history.length - 1].price : (c.basePrice || 3000);
    });
    const maxP = Math.max(...prices, 1000);

    const barW = Math.min((cw / targetCrops.length) * 0.55, 45);
    const gap = cw / targetCrops.length;
    const colors = ['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];

    targetCrops.forEach((c, i) => {
      const price = prices[i];
      const barH = (price / (maxP * 1.15)) * ch;
      const xx = pad.left + i * gap + (gap - barW) / 2;
      const yy = pad.top + ch - barH;

      const grad = ctx.createLinearGradient(xx, yy, xx, pad.top + ch);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, colors[i % colors.length] + '33');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(xx, yy, barW, barH, [4, 4, 0, 0]);
      } else {
        ctx.rect(xx, yy, barW, barH);
      }
      ctx.fill();

      ctx.fillStyle = textColor; ctx.font = '12px Inter'; ctx.textAlign = 'center';
      ctx.fillText(c.emoji || '🌾', xx + barW / 2, H - pad.bottom + 16);
      const name = c.name.split(' ')[0].substring(0, 7);
      ctx.font = '10px Inter';
      ctx.fillText(name, xx + barW / 2, H - pad.bottom + 30);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a'; ctx.font = 'bold 10px Inter';
      ctx.fillText('₹' + price.toLocaleString(), xx + barW / 2, yy - 6);
    });
  };

  // --- DRAW DEDICATED SINGLE CROP 12-MONTH SEASONAL & MANDI SPREAD CHART ---
  const drawSingleCropDetailChart = (canvas, crop) => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = 260;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const pad = { top: 25, right: 25, bottom: 40, left: 55 };
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    ctx.clearRect(0, 0, W, H);

    const seasonal = crop.seasonal || [1,1,1,1,1,1,1,1,1,1,1,1];
    const base = crop.basePrice || 3000;
    const estPrices = seasonal.map(s => Math.round(base * s));
    const minP = Math.min(...estPrices) * 0.92;
    const maxP = Math.max(...estPrices) * 1.08;
    const rangeP = (maxP - minP) || 1;

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.fillStyle = textColor; ctx.font = '11px Inter'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const yy = pad.top + (i / 4) * ch;
      ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(W - pad.right, yy); ctx.stroke();
      const val = Math.round(maxP - (i / 4) * rangeP);
      ctx.fillText('₹' + val.toLocaleString(), pad.left - 8, yy + 4);
    }

    // Month labels
    ctx.textAlign = 'center';
    months.forEach((m, i) => ctx.fillText(m, pad.left + (i / 11) * cw, H - pad.bottom + 18));

    // Fill area gradient
    const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    estPrices.forEach((p, i) => {
      const xx = pad.left + (i / 11) * cw;
      const yy = pad.top + ch - ((p - minP) / rangeP) * ch;
      i === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
    });
    ctx.lineTo(pad.left + cw, pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Draw Line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    estPrices.forEach((p, i) => {
      const xx = pad.left + (i / 11) * cw;
      const yy = pad.top + ch - ((p - minP) / rangeP) * ch;
      i === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
    });
    ctx.stroke();

    // Data points & peak indicator
    const maxIdx = estPrices.indexOf(Math.max(...estPrices));
    const minIdx = estPrices.indexOf(Math.min(...estPrices));

    estPrices.forEach((p, i) => {
      const xx = pad.left + (i / 11) * cw;
      const yy = pad.top + ch - ((p - minP) / rangeP) * ch;

      ctx.fillStyle = i === maxIdx ? '#ef4444' : i === minIdx ? '#3b82f6' : '#10b981';
      ctx.beginPath(); ctx.arc(xx, yy, i === maxIdx || i === minIdx ? 6 : 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.beginPath(); ctx.arc(xx, yy, 2, 0, Math.PI * 2); ctx.fill();

      // Label peaks
      if (i === maxIdx) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Peak: ₹' + p, xx, yy - 10);
      } else if (i === minIdx) {
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Low: ₹' + p, xx, yy + 16);
      }
    });
  };

  return (
    <section className="section active" id="analytics" style={{ paddingBottom: '60px' }}>
      {/* Banner */}
      <div className="section-banner banner-analytics" style={{ marginBottom: '24px' }}>
        <div className="section-banner-content">
          <h2 className="section-banner-title">{t('analytics.title')}</h2>
          <p className="section-banner-desc">
            {t('analytics.perspective')}
          </p>
        </div>
        <div className="section-banner-icon">🧠</div>
      </div>

      {/* Streamlined Clean Filter Toolbar (Matching Navbar Style) */}
      <div className="card glass" style={{ padding: '16px 20px', marginBottom: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
          
          {/* 1. Perspective Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👁️ Perspective
            </label>
            <div style={{ display: 'flex', background: 'var(--bg)', padding: '3px', borderRadius: '12px', border: '1px solid var(--border)', height: '42px' }}>
              <button
                type="button"
                onClick={() => setUserRole('farmer')}
                style={{
                  flex: 1,
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: userRole === 'farmer' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                  color: userRole === 'farmer' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  boxShadow: userRole === 'farmer' ? '0 2px 6px rgba(16,185,129,0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>🌾</span>
                <span>Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('buyer')}
                style={{
                  flex: 1,
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: userRole === 'buyer' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
                  color: userRole === 'buyer' ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  boxShadow: userRole === 'buyer' ? '0 2px 6px rgba(59,130,246,0.3)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>🛒</span>
                <span>Buyer</span>
              </button>
            </div>
          </div>

          {/* 2. Select State */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="state-select" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📍 {t('analytics.state') || 'State'}
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card-solid)',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <option value="all">🇮🇳 All States (National)</option>
              {states.filter(s => s !== 'all').map(st => (
                <option key={st} value={st}>
                  📍 {st}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Select Crop Type / Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="category-select" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🏷️ Crop Type / Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card-solid)',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <option value="all">🌐 All Crop Types</option>
              <option value="Grain">🌾 Grain & Cereals</option>
              <option value="Pulse">🫘 Pulses / Dals</option>
              <option value="Vegetable">🥦 Vegetables</option>
              <option value="Fruit">🍎 Fruits</option>
              <option value="Cash Crop">🌱 Cash Crops</option>
              <option value="Spice">🌶️ Spices</option>
              <option value="Oilseed">🥜 Oilseeds</option>
            </select>
          </div>

          {/* 4. Select Crop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="crop-select" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🌾 {t('analytics.crop') || 'Crop'}
            </label>
            <select
              id="crop-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card-solid)',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <option value="all">🔍 View All Crops</option>
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {getCropName(c)} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Live Search Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔎 Search Crop
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search name, Hindi, Telugu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 32px 0 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card-solid)',
                  color: 'var(--text)',
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '2px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Active Filter Indicators / Reset Button */}
        {(selectedCropId !== 'all' || selectedState !== 'all' || selectedCategory !== 'all' || searchTerm.trim() !== '') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span>Showing filtered intelligence for:</span>
              {selectedState !== 'all' && <span style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--blue)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>📍 {selectedState}</span>}
              {selectedCategory !== 'all' && <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>🏷️ {selectedCategory}</span>}
              {selectedCropId !== 'all' && <span style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>🌾 {COMMODITIES.find(c => c.id === selectedCropId)?.name || selectedCropId}</span>}
              {searchTerm && <span style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>🔎 "{searchTerm}"</span>}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCropId('all');
                setSelectedState('all');
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)',
                color: 'var(--red)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✕ Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* --- STATE-WISE MARKET INTELLIGENCE HIGHLIGHT CARD --- */}
      {stateAnalyticsSummary && (
        <div className="card glass" style={{ padding: '20px 24px', marginBottom: '28px', borderLeft: '4px solid var(--blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  State-Wise Market Intelligence: {stateAnalyticsSummary.stateName}
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Live APMC Mandi price benchmarks and arbitrage analysis for {stateAnalyticsSummary.cropEmoji} {stateAnalyticsSummary.cropName}
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', background: 'rgba(59,130,246,0.15)', color: 'var(--blue)', padding: '4px 12px', borderRadius: '12px', fontWeight: 700 }}>
              🏢 {stateAnalyticsSummary.mandisCount} Mandis Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATE AVERAGE PRICE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginTop: '2px' }}>
                ₹{stateAnalyticsSummary.avgPrice.toLocaleString()} / Qtl
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>HIGHEST RATE MANDI</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                ₹{stateAnalyticsSummary.maxMandi?.price?.toLocaleString()} / Qtl
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {stateAnalyticsSummary.maxMandi?.market}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOWEST RATE MANDI</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--amber)', marginTop: '2px' }}>
                ₹{stateAnalyticsSummary.minMandi?.price?.toLocaleString()} / Qtl
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {stateAnalyticsSummary.minMandi?.market}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE ARBITRAGE SPREAD</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-glow)', marginTop: '2px' }}>
                +₹{stateAnalyticsSummary.arbitrage.toLocaleString()} / Qtl
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Max profit margin between mandis
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SPECIFIC CROP DEEP-DIVE CARD (When a specific crop is chosen) --- */}
      {activeSingleCrop && (
        <div className="card glass" style={{ padding: '24px', marginBottom: '28px', border: '2px solid var(--primary-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '3rem', background: 'var(--bg)', padding: '10px 16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                {activeSingleCrop.emoji}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{activeSingleCrop.name}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', color: 'var(--blue)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {activeSingleCrop.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Regional Names: {activeSingleCrop.nameHi || '-'} (Hindi) | {activeSingleCrop.nameTe || '-'} (Telugu) | {activeSingleCrop.nameTa || '-'} (Tamil)
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Benchmark MSP / Base Price</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-glow)' }}>
                ₹{activeSingleCrop.basePrice?.toLocaleString()} / {activeSingleCrop.unit || 'Quintal'}
              </div>
            </div>
          </div>

          {/* Key Insights Row for the specific crop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: '12px', borderLeft: '4px solid var(--green)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>👨‍🌾 BEST MONTH TO SELL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)', marginTop: '2px' }}>
                {sellTimingData[0]?.bestSellMonth || 'October'} (+{sellTimingData[0]?.peakGain || 12}% Peak)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {sellTimingData[0]?.reason}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: '12px', borderLeft: '4px solid var(--blue)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>🛒 BEST PROCUREMENT WINDOW (BUYER)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue)', marginTop: '2px' }}>
                {sellTimingData[0]?.bestBuyMonth || 'April'} ({sellTimingData[0]?.buyDiscount || 8}% Discount)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Post-harvest arrivals push mandi prices down for bulk buyers.
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg)', borderRadius: '12px', borderLeft: '4px solid var(--amber)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>📊 VOLATILITY RISK SCORE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: volatilityData[0]?.color || 'var(--amber)', marginTop: '2px' }}>
                {volatilityData[0]?.vol || 25}% ({volatilityData[0]?.vol > 50 ? 'High Fluctuations' : 'Stable Price Band'})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Standard Deviation: ±₹{volatilityData[0]?.std || 45}/Qtl
              </div>
            </div>
          </div>

          {/* Specific Crop 12-Month Projection Canvas & Mandi Arbitrage Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📈 12-Month Price Projection Curve for {activeSingleCrop.name}
              </h4>
              <canvas ref={singleCropCanvasRef} width="600" height="260" style={{ width: '100%', height: '240px' }}></canvas>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                <span>🔴 Red dot = Peak Price Month (Best to sell)</span>
                <span>🔵 Blue dot = Lowest Price Month (Best to buy)</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏢 Multi-Mandi Live Arbitrage Comparison
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Mandi / Location</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Current Price</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>7-Day Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSingleCropMandiPrices(activeSingleCrop).map((item, idx) => (
                      <tr key={item.market} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ fontWeight: 600 }}>{item.market}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.state} {idx === 0 ? '🏆 Highest' : ''}</div>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                          ₹{item.price.toLocaleString()}/Qtl
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: item.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {item.change >= 0 ? `+${item.change}% ▲` : `${item.change}% ▼`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- GENERAL ANALYTICS GRID (Filtered Crops) --- */}
      <div className="analytics-grid">
        {/* Price Volatility Card */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>📊 Price Volatility Index</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click crop to inspect</span>
          </div>
          <div className="volatility-bars">
            {volatilityData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '16px 0' }}>No matching crops found.</p>
            ) : (
              volatilityData.map(v => (
                <div
                  className="volatility-item"
                  key={v.c.id}
                  onClick={() => setSelectedCropId(v.c.id)}
                  style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: '8px', transition: 'background 0.2s' }}
                  title="Click to view full analytics for this crop"
                >
                  <span className="vol-name">
                    {v.c.emoji} {v.name}
                  </span>
                  <div className="vol-bar-track" style={{ flex: 1, margin: '0 12px' }}>
                    <div className="vol-bar-fill" style={{ width: `${v.vol}%`, background: v.color }}></div>
                  </div>
                  <span className="vol-value" style={{ fontWeight: 700, minWidth: '38px', textAlign: 'right' }}>
                    {v.vol}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Seasonal Trends Multi-Crop */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>🗓️ Seasonal Multiplier Cycles</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12-Month Relative Index</span>
          </div>
          <canvas ref={seasonalCanvasRef} width="600" height="280" style={{ width: '100%', height: '240px' }}></canvas>
        </div>

        {/* Best Time to Sell & Buy Schedule */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
              {userRole === 'farmer' ? '🌾 Optimal Selling Strategy' : '🛒 Best Procurement Windows'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Strategy based on cycles</span>
          </div>
          <div className="sell-timing" style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {sellTimingData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '16px 0' }}>No crops match filter.</p>
            ) : (
              sellTimingData.map(s => (
                <div
                  className="sell-timing-item"
                  key={s.c.id}
                  onClick={() => setSelectedCropId(s.c.id)}
                  style={{ cursor: 'pointer', marginBottom: '10px', padding: '10px 12px' }}
                  title="Click to view full analytics"
                >
                  <div style={{ flex: 1 }}>
                    <div className="st-crop" style={{ fontWeight: 700 }}>
                      {s.c.emoji} {s.c.name}
                    </div>
                    <div className="st-reason" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {s.reason}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="st-month" style={{ color: userRole === 'farmer' ? 'var(--green)' : 'var(--blue)', fontWeight: 800 }}>
                      {userRole === 'farmer' ? `Sell in ${s.bestSellMonth}` : `Buy in ${s.bestBuyMonth}`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {userRole === 'farmer' ? `+${s.peakGain}% premium` : `${s.buyDiscount}% cheaper`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Market Price Comparison */}
        <div className="card glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>⚖️ Cross-Commodity Benchmark (₹/Qtl)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wholesale Mandi Rates</span>
          </div>
          <canvas ref={comparisonCanvasRef} width="600" height="280" style={{ width: '100%', height: '240px' }}></canvas>
        </div>
      </div>
    </section>
  );
};

export default Analytics;

