import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <div className="nav-brand">
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
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
          <NavLink to="/prediction" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>AI Prediction</NavLink>
          <NavLink to="/market" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Market Prices</NavLink>
          <NavLink to="/marketplace" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Marketplace</NavLink>
          <NavLink to="/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>My Orders</NavLink>
          <NavLink to="/weather" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Weather</NavLink>
          <NavLink to="/analytics" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Analytics</NavLink>
          {user?.role === 'admin' && (
             <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>🔒 Admin Panel</NavLink>
          )}
        </div>
        
        <div className="nav-actions">
          {user && (
            <div className="user-profile" style={{ display: 'block', position: 'relative' }}>
              <button className="btn-icon user-avatar" title="Profile" onClick={() => setShowDropdown(!showDropdown)}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              <div className={`profile-dropdown ${showDropdown ? 'show' : ''}`} style={{ display: 'block', position: 'absolute', right: 0, top: '120%', opacity: showDropdown ? 1 : 0, visibility: showDropdown ? 'visible' : 'hidden', transition: '0.3s', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px', zIndex: 100, minWidth: '200px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <div className="profile-info">
                  <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '5px' }}>{user.name}</strong>
                  <span className="profile-role" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--green)', textTransform: 'capitalize', marginBottom: '5px' }}>{user.role}</span>
                  <span className="profile-phone" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.phone}</span>
                </div>
                <hr style={{ margin: '15px 0', borderColor: 'var(--border)' }} />
                <button className="dropdown-item" onClick={onLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--red)', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
