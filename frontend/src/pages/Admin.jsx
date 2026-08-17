import React, { useState, useEffect, useMemo } from 'react';
import { COMMODITIES, MARKETS } from '../data';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load Users
    const uStr = localStorage.getItem('fc_users');
    if (uStr) {
      try {
        const uArr = JSON.parse(uStr);
        setUsers(Array.isArray(uArr) ? uArr : Object.values(uArr));
      } catch (e) {
        setUsers([]);
      }
    }

    // Load Listings
    const lStr = localStorage.getItem('fc_listings');
    if (lStr) {
      try {
        setListings(JSON.parse(lStr));
      } catch (e) {
        setListings([]);
      }
    }

    // Load Orders
    const oStr = localStorage.getItem('fc_orders_all');
    if (oStr) {
      try {
        setOrders(JSON.parse(oStr));
      } catch (e) {
        setOrders([]);
      }
    }
  }, []);

  const handleResetListings = () => {
    if (window.confirm('Clear all listings and reset to defaults?')) {
      localStorage.removeItem('fc_listings');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      users,
      listings,
      orders,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmconnect_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section active" id="admin">
      <div className="section-header">
        <h2 className="section-title">🔒 Admin Dashboard</h2>
        <p className="section-desc">Full platform control — manage users, listings, and data</p>
      </div>
      
      <div className="admin-stats stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-info"><span className="stat-label">Total Users</span><span className="stat-value">{users.length}</span></div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-info"><span className="stat-label">Active Listings</span><span className="stat-value">{listings.length}</span></div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="stat-info"><span className="stat-label">Markets Tracked</span><span className="stat-value">{MARKETS.length}</span></div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="stat-info"><span className="stat-label">Commodities</span><span className="stat-value">{COMMODITIES.length}</span></div>
        </div>
      </div>

      <div className="admin-actions-bar" style={{ margin: '24px 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={handleResetListings} style={{ background: 'linear-gradient(135deg,#e74c3c,#c0392b)' }}>🗑️ Reset All Listings</button>
        <button className="btn-primary" onClick={handleExportData} style={{ background: 'linear-gradient(135deg,#3498db,#2980b9)' }}>📥 Export Data (JSON)</button>
      </div>

      <div className="card glass" style={{ marginTop: '24px' }}>
        <h3 className="card-title">👥 Registered Users</h3>
        <div className="table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Location</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.phone}>
                  <td>{u.name}</td>
                  <td>{u.phone}</td>
                  <td><span className={`status-badge ${u.role === 'admin' ? 'status-delivered' : 'status-active'}`}>{u.role}</span></td>
                  <td>{u.location || 'Unknown'}</td>
                  <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card glass" style={{ marginTop: '24px' }}>
        <h3 className="card-title">📦 All Marketplace Listings</h3>
        <div className="table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Seller</th>
                <th>Qty (Qt)</th>
                <th>Price (₹/Qt)</th>
                <th>Location</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id}>
                  <td>{l.emoji} {l.name}</td>
                  <td>{l.seller}</td>
                  <td>{l.qty}</td>
                  <td>₹{l.price.toLocaleString()}</td>
                  <td>{l.location}</td>
                  <td>{l.contact}</td>
                </tr>
              ))}
              {listings.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No listings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card glass" style={{ marginTop: '24px' }}>
        <h3 className="card-title">🚚 All Orders ({orders.length})</h3>
        <div className="table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.listing.emoji} {o.listing.name}</td>
                  <td>{o.buyer}</td>
                  <td>{o.seller}</td>
                  <td>₹{o.totalPrice.toLocaleString()}</td>
                  <td><span className={`status-badge ${o.status === 'delivered' ? 'status-delivered' : o.status === 'cancelled' ? 'status-cancelled' : 'status-active'}`}>{o.status}</span></td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Admin;
