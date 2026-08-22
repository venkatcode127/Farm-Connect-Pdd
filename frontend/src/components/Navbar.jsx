import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getUserReputation } from '../api';

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [buyerRep, setBuyerRep] = useState(null);
  const { t, language, setLanguage, languages } = useLanguage();
  const navigate = useNavigate();
  const navRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.name) {
      getUserReputation(user.name)
        .then(res => setBuyerRep(res.data))
        .catch(() => {
          // Fallback check from local orders if backend offline
          try {
            const localOrders = JSON.parse(localStorage.getItem('fc_local_orders') || '[]');
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
            const cancelled = localOrders.filter(o => 
              o.buyer === user.name && 
              o.status === 'cancelled' && 
              (!o.createdAt || new Date(o.createdAt) >= oneMonthAgo)
            ).length;
            setBuyerRep({
              isNotGoodDealer: cancelled > 5,
              cancelledLastMonth: cancelled
            });
          } catch (e) {
            setBuyerRep(null);
          }
        });
    }
  }, [user]);

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'farmer':
        return { label: 'Farmer / Grower', emoji: '🌾', bg: 'rgba(16,185,129,0.15)', color: '#059669', border: 'rgba(16,185,129,0.3)' };
      case 'buyer':
        return { label: 'Wholesale Buyer', emoji: '🛒', bg: 'rgba(245,158,11,0.15)', color: '#d97706', border: 'rgba(245,158,11,0.3)' };
      case 'admin':
        return { label: 'System Admin', emoji: '🛡️', bg: 'rgba(139,92,246,0.15)', color: '#7c3aed', border: 'rgba(139,92,246,0.3)' };
      default:
        return { label: role || 'Member', emoji: '👤', bg: 'rgba(100,116,139,0.15)', color: '#475569', border: 'rgba(100,116,139,0.3)' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <nav className="navbar" id="navbar" ref={navRef}>
      <div className="nav-container">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <svg className="nav-logo" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" />
            <path d="M20 8 L20 28 M14 14 Q20 8 26 14 M12 20 Q20 12 28 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#2ECC71" />
                <stop offset="100%" stopColor="#0B3D2E" />
              </linearGradient>
            </defs>
          </svg>
          <span className="brand-text">Farm<span className="brand-accent">Connect</span> AI</span>
        </div>
        
        <div className="nav-links" id="navLinks">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.dashboard')}</NavLink>
          <NavLink to="/prediction" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.aiPrediction')}</NavLink>
          <NavLink to="/market" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.marketPrices')}</NavLink>
          <NavLink to="/marketplace" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.marketplace')}</NavLink>
          <NavLink to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.myOrders')}</NavLink>
          <NavLink to="/weather" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.weather')}</NavLink>
          <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.analytics')}</NavLink>
          {user?.role === 'admin' && (
             <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{t('nav.adminPanel')}</NavLink>
          )}
        </div>
        
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-icon"
              title={t('common.selectLanguage')}
              onClick={() => { setShowLangDropdown(!showLangDropdown); setShowDropdown(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card-solid)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                width: 'auto',
                height: '38px'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🌐</span>
              <span style={{ fontWeight: 600 }}>{languages.find(l => l.code === language)?.nativeName || 'English'}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>▼</span>
            </button>
            
            {showLangDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  backgroundColor: 'var(--bg-card-solid)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '8px',
                  zIndex: 200,
                  minWidth: '220px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                  animation: 'fadeIn 0.15s ease'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t('common.selectLanguage')}
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangDropdown(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: language === lang.code ? 'rgba(16,185,129,0.15)' : 'none',
                      border: language === lang.code ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                      color: language === lang.code ? 'var(--primary-glow)' : 'var(--text)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.88rem',
                      fontWeight: language === lang.code ? 700 : 500,
                      transition: 'all 0.15s',
                      marginBottom: '2px'
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{lang.flag}</span>
                    <span style={{ flex: 1 }}>{lang.nativeName}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lang.name}</span>
                    {language === lang.code && <span style={{ color: 'var(--primary-glow)' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          {user && (
            <div className="user-profile" style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowDropdown(!showDropdown); setShowLangDropdown(false); }}
                title="View Profile Details"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 6px',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card-solid)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  height: '38px'
                }}
              >
                {/* Avatar Badge with gradient */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 6px rgba(16,185,129,0.3)'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '700', lineHeight: 1.1, color: 'var(--text)' }}>
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                </div>

                <span style={{ fontSize: '0.65rem', opacity: 0.6, marginLeft: '2px' }}>▼</span>
              </button>

              {/* Rich Elevated Profile Dropdown */}
              {showDropdown && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    right: 0, 
                    top: 'calc(100% + 8px)', 
                    backgroundColor: 'var(--bg-card-solid)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '16px', 
                    padding: '18px', 
                    zIndex: 200, 
                    minWidth: '280px', 
                    boxShadow: '0 20px 48px rgba(0,0,0,0.22)',
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  {/* Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                      flexShrink: 0
                    }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '700', fontSize: '1.02rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.name}
                        </span>
                        <span title="Verified Account" style={{ color: '#10b981', fontSize: '0.9rem' }}>✓</span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '3px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: roleInfo.bg,
                        border: `1px solid ${roleInfo.border}`,
                        color: roleInfo.color,
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px'
                      }}>
                        <span>{roleInfo.emoji}</span>
                        <span>{roleInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details List */}
                  <div style={{ 
                    background: 'rgba(0,0,0,0.03)', 
                    borderRadius: '12px', 
                    padding: '10px 12px', 
                    marginBottom: '14px',
                    border: '1px solid var(--border)'
                  }}>
                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '0.84rem' }}>
                      <span style={{ fontSize: '0.95rem' }}>📱</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '55px' }}>Phone:</span>
                      <strong style={{ color: 'var(--text)', letterSpacing: '0.5px' }}>{user.phone || 'Not registered'}</strong>
                    </div>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '0.84rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.95rem' }}>📍</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '55px' }}>Location:</span>
                      <span style={{ color: 'var(--text)', fontWeight: '500' }}>{user.location || 'India (Pan-India)'}</span>
                    </div>

                    {/* Email if available */}
                    {user.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '0.84rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '0.95rem' }}>✉️</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '55px' }}>Email:</span>
                        <span style={{ color: 'var(--text)', fontWeight: '500', wordBreak: 'break-all' }}>{user.email}</span>
                      </div>
                    )}

                    {/* Status / Dealer Standing */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', fontSize: '0.84rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.95rem' }}>{buyerRep?.isNotGoodDealer ? '⚠️' : '🟢'}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: '55px' }}>Standing:</span>
                      <span style={{ 
                        color: buyerRep?.isNotGoodDealer ? '#ef4444' : '#10b981', 
                        fontWeight: '700', 
                        fontSize: '0.78rem' 
                      }}>
                        {buyerRep?.isNotGoodDealer 
                          ? `Not a Good Dealer (${buyerRep.cancelledLastMonth || 6} Cancellations)` 
                          : 'Active & Verified Dealer'}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Shortcuts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                    <button 
                      onClick={() => { setShowDropdown(false); navigate('/orders'); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>📦</span>
                      <span>{t('nav.myOrders')}</span>
                    </button>

                    <button 
                      onClick={() => { setShowDropdown(false); navigate('/marketplace'); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text)',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>🛍️</span>
                      <span>{t('nav.marketplace')}</span>
                    </button>
                  </div>

                  <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0 12px' }} />

                  {/* Logout Button */}
                  <button 
                    onClick={() => { setShowDropdown(false); onLogout(); }} 
                    style={{ 
                      width: '100%', 
                      textAlign: 'center', 
                      background: 'rgba(239, 68, 68, 0.08)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      color: 'var(--red)', 
                      padding: '9px 12px', 
                      borderRadius: '10px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      transition: 'all 0.15s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

