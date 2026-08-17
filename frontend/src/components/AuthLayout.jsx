import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-screen active" id="authScreen" style={{ display: 'flex' }}>
      <div className="auth-bg-shapes">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
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
