import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const AuthLayout = ({ children }) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { t, language, setLanguage, languages } = useLanguage();

  return (
    <div className="auth-screen active" id="authScreen" style={{ display: 'flex' }}>
      <div className="auth-bg-shapes">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
      </div>

      {/* Language Selector - top-right corner on auth pages */}
      <div style={{ position: 'fixed', top: '16px', right: '20px', zIndex: 300 }}>
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <span>🌐</span>
          <span>{languages.find(l => l.code === language)?.nativeName || 'English'}</span>
          <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
        </button>
        
        {showLangDropdown && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '8px',
              minWidth: '210px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.15s ease'
            }}
          >
            <div style={{ padding: '4px 10px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
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
                  padding: '7px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  fontWeight: language === lang.code ? 700 : 500,
                  transition: 'all 0.15s',
                  marginBottom: '1px'
                }}
              >
                <span>{lang.flag}</span>
                <span style={{ flex: 1 }}>{lang.nativeName}</span>
                {language === lang.code && <span style={{ color: 'var(--primary-glow)' }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="auth-wrapper">
        <div className="auth-hero-side">
          <div className="auth-hero-content">
            <svg viewBox="0 0 40 40" fill="none" width="64" height="64">
              <circle cx="20" cy="20" r="18" fill="url(#logoGrad2)" />
              <path d="M20 8 L20 28 M14 14 Q20 8 26 14 M12 20 Q20 12 28 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#2ECC71" />
                  <stop offset="100%" stopColor="#0B3D2E" />
                </linearGradient>
              </defs>
            </svg>
            <h1>Farm<span className="brand-accent">Connect</span> AI</h1>
            <p className="auth-tagline">AI-Powered Agricultural Price Prediction & Distribution Platform</p>
            <div className="auth-features">
              <div className="auth-feature"><span className="auth-feature-icon">🤖</span><span>AI Price Forecasting</span></div>
              <div className="auth-feature"><span className="auth-feature-icon">📊</span><span>Live Market Prices</span></div>
              <div className="auth-feature"><span className="auth-feature-icon">🛒</span><span>Farmer-Buyer Marketplace</span></div>
              <div className="auth-feature"><span className="auth-feature-icon">🌤️</span><span>Weather & Crop Advisory</span></div>
            </div>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-container glass">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
