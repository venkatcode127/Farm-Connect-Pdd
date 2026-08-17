import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { COMMODITIES } from '../data';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [cropId, setCropId] = useState(COMMODITIES[0].id);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [desc, setDesc] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const fetchListings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/listings');
      setListings(res.data);
    } catch (err) {
      showToast('⚠️ Error loading listings from server');
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const sellerName = user ? user.name : 'You';
    const com = COMMODITIES.find(c => c.id === cropId);
    
    const newListing = {
      crop: cropId,
      emoji: com.emoji,
      name: com.name,
      qty: Number(qty),
      price: Number(price),
      location,
      contact,
      desc: desc || "No description provided",
      seller: sellerName
    };
    
    try {
      await axios.post('http://localhost:8000/api/listings', newListing);
      setShowModal(false);
      
      // Reset form
      setCropId(COMMODITIES[0].id);
      setQty('');
      setPrice('');
      setLocation('');
      setContact('');
      setDesc('');
      
      showToast('✅ Your produce has been listed successfully!');
      fetchListings(); // Refresh listings
    } catch (err) {
      showToast('❌ Error creating listing');
    }
  };

  const handleOrder = async (listing) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const buyerName = user ? user.name : 'Guest Buyer';
    
    const newOrder = {
      listingId: String(listing.id),
      listingEmoji: listing.emoji,
      listingName: listing.name,
      listingPrice: Number(listing.price),
      buyer: buyerName,
      seller: listing.seller,
      qty: Number(listing.qty),
      totalPrice: Number(listing.qty * listing.price),
      status: 'placed',
      timeline: [{ status: 'placed', time: new Date().toISOString() }]
    };
    
    try {
      await axios.post('http://localhost:8000/api/orders', newOrder);
      showToast(`🛒 Order placed for ${listing.name}!`);
    } catch (err) {
      showToast('❌ Error placing order');
    }
  };

  return (
    <section className="section active" id="marketplace">
      <div className="section-banner banner-market">
        <div className="section-banner-content">
          <h2 className="section-banner-title">Farmer Marketplace</h2>
          <p className="section-banner-desc">Buy and sell produce directly</p>
        </div>
        <div className="section-banner-icon">🛍️</div>
      </div>
      
      <div className="marketplace-actions">
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Sell Your Produce
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass">
            <div className="modal-header">
              <h3>List Your Produce</h3>
              <button className="btn-icon modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSellSubmit} className="sell-form">
              <div className="form-group">
                <label>Crop Name</label>
                <select className="select-input" value={cropId} onChange={e => setCropId(e.target.value)} required>
                  {COMMODITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity (Quintals)</label>
                  <input type="number" className="text-input" min="1" value={qty} onChange={e => setQty(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Price (₹/Quintal)</label>
                  <input type="number" className="text-input" min="1" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" className="text-input" placeholder="Village, District, State" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="tel" className="text-input" placeholder="+91 XXXXX XXXXX" value={contact} onChange={e => setContact(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="text-input" rows="3" placeholder="Quality details, organic, etc." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn-primary btn-full">List for Sale</button>
            </form>
          </div>
        </div>
      )}

      <div className="listings-grid">
        {listings.map(l => (
          <div className="listing-card" key={l.id}>
            <div className="listing-img">{l.emoji}</div>
            <div className="listing-body">
              <div className="listing-title">{l.name}</div>
              <div className="listing-location">📍 {l.location} • {l.seller}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0' }}>{l.desc}</p>
              <div className="listing-meta">
                <span className="listing-price">₹{l.price.toLocaleString()}/Qt</span>
                <span className="listing-qty">{l.qty} Qt</span>
              </div>
              <div className="listing-actions">
                <button className="listing-contact" onClick={() => showToast(`📞 Contact: ${l.contact}`)}>📞 Contact Seller</button>
                <button className="listing-order-btn" onClick={() => handleOrder(l)}>🛒 Order Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toastMsg && (
        <div id="toast" className="show">{toastMsg}</div>
      )}
    </section>
  );
};

export default Marketplace;
