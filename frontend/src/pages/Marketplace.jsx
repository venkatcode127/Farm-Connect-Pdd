import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { COMMODITIES } from '../data';
import { getListings, createListing, getReviews, createReview, getRatingSummary } from '../api';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_REVIEW_TAGS = [
  '🌱 Fresh & High Quality',
  '⚡ Fast Delivery',
  '🤝 Fair & Transparent Price',
  '📦 Excellent Packaging',
  '🌾 100% Organic',
  '📞 Responsive Communication'
];

const Marketplace = () => {
  const { t, getCropName } = useLanguage();
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ratingsMap, setRatingsMap] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  // Video Player Modal State
  const [activeVideo, setActiveVideo] = useState(null);

  // Review Modal State
  const [reviewModalData, setReviewModalData] = useState(null); // { farmerName, listing }
  const [farmerReviews, setFarmerReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Sell Form State
  const [cropId, setCropId] = useState(COMMODITIES[0].id);
  const [isCustomCrop, setIsCustomCrop] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [customCropEmoji, setCustomCropEmoji] = useState('🌾');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('Quintal');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [clusterName, setClusterName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [contact, setContact] = useState('');
  const [desc, setDesc] = useState('');
  // State to hold seller contact after successful order
  const [orderContactInfo, setOrderContactInfo] = useState(null);
  const [mediaType, setMediaType] = useState('preset'); // 'preset', 'custom_image', 'custom_video'
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }, []);

  const selectedCommodity = useMemo(() => {
    if (isCustomCrop || cropId === 'custom') {
      return {
        id: 'custom',
        name: customCropName || 'Custom Produce',
        emoji: customCropEmoji || '🌾',
        image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      };
    }
    return COMMODITIES.find(c => c.id === cropId) || COMMODITIES[0];
  }, [cropId, isCustomCrop, customCropName, customCropEmoji]);


  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const fetchListings = async () => {
    try {
      const res = await getListings();
      setListings(res.data || []);
      loadRatingsForSellers(res.data || []);
    } catch (err) {
      console.error('Error fetching listings from database:', err);
      setListings([]);
    }
  };

  const loadRatingsForSellers = async (currentListings) => {
    const sellers = [...new Set(currentListings.map(l => l.seller).filter(Boolean))];
    const newMap = { ...ratingsMap };

    for (const seller of sellers) {
      try {
        const res = await getRatingSummary(seller, 'farmer');
        newMap[seller] = res.data;
      } catch (e) {
        // Fallback calculation from local reviews
        const allReviews = JSON.parse(localStorage.getItem('fc_local_reviews') || '[]');
        const sellerReviews = allReviews.filter(r => r.targetUser === seller && r.targetType === 'farmer');
        const count = sellerReviews.length;
        const avg = count > 0 ? (sellerReviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1) : 4.9;
        newMap[seller] = {
          averageRating: Number(avg),
          totalReviews: count || 3,
          breakdown: { '5': count || 2, '4': 1, '3': 0, '2': 0, '1': 0 }
        };
      }
    }
    setRatingsMap(newMap);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Handle image upload as base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('⚠️ Image size should be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video upload as base64 or object URL
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showToast('⚠️ Video size should be under 15MB for fast loading');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomVideoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [mediaMode, setMediaMode] = useState('image_only'); // 'image_only', 'video_only', 'both'

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    const sellerName = currentUser ? currentUser.name : 'Verified Farmer';
    const isCustom = isCustomCrop || cropId === 'custom';
    const cropNameFinal = isCustom ? (customCropName.trim() || 'Custom Farm Produce') : selectedCommodity.name;
    const cropIdFinal = isCustom ? (customCropName.trim().toLowerCase().replace(/\s+/g, '_') || 'custom') : cropId;
    const emojiFinal = isCustom ? (customCropEmoji || '🌾') : selectedCommodity.emoji;

    let finalImage = null;
    let finalVideo = null;

    if (mediaMode === 'image_only') {
      finalImage = customImageUrl.trim() || selectedCommodity.image;
      finalVideo = null;
    } else if (mediaMode === 'video_only') {
      finalImage = null;
      finalVideo = customVideoUrl.trim() || null;
      if (!finalVideo) {
        showToast('⚠️ Please upload or enter a video clip');
        return;
      }
    } else if (mediaMode === 'both') {
      finalImage = customImageUrl.trim() || selectedCommodity.image;
      finalVideo = customVideoUrl.trim() || null;
      if (!finalVideo) {
        showToast('⚠️ Please attach a video clip when selecting "Both Photo & Video"');
        return;
      }
    }

    const newListing = {
      crop: cropIdFinal,
      emoji: emojiFinal,
      name: cropNameFinal,
      qty: Number(qty),
      unit: unit,
      price: Number(price),
      location: location.trim(),
      cluster_name: clusterName.trim(),
      place_name: placeName.trim(),
      contact: contact.trim(),
      desc: desc.trim() || "Farm fresh produce directly from grower.",
      seller: sellerName,
      imageUrl: finalImage,
      videoUrl: finalVideo
    };

    try {
      await createListing(newListing);
      setShowModal(false);
      resetSellForm();
      showToast('✅ Produce with photos & video listed successfully!');
      fetchListings();
    } catch (err) {
      // Local fallback
      const local = JSON.parse(localStorage.getItem('fc_local_listings') || '[]');
      const saved = { ...newListing, id: 'local_' + Date.now() };
      local.unshift(saved);
      localStorage.setItem('fc_local_listings', JSON.stringify(local));
      setListings([saved, ...listings]);
      setShowModal(false);
      resetSellForm();
      showToast('✅ Produce listed successfully!');
    }
  };

  const resetSellForm = () => {
    setCropId(COMMODITIES[0].id);
    setIsCustomCrop(false);
    setCustomCropName('');
    setCustomCropEmoji('🌾');
    setQty('');
    setUnit('Quintal');
    setPrice('');
    setLocation('');
    setContact('');
    setDesc('');
    setCustomImageUrl('');
    setCustomVideoUrl('');
    setMediaType('preset');
    setMediaMode('image_only');
  };


  const [connectedOrder, setConnectedOrder] = useState(null); // Used to show connection modal

  const handleOrder = async (listing) => {
    // Only block the specific farmer who listed this product
    const isOwnListing = currentUser && currentUser.name === listing.seller;
    if (isOwnListing) {
      showToast('⚠️ You cannot order your own listed produce!');
      return;
    }

    const buyerName = currentUser ? currentUser.name : 'Guest Buyer';

    const newOrder = {
      listingId: String(listing.id || 'order_' + Date.now()),
      listingEmoji: listing.emoji || '🌾',
      listingName: listing.name,
      listingPrice: Number(listing.price),
      buyer: buyerName,
      seller: listing.seller,
      sellerContact: listing.contact || '',
      buyerContact: currentUser?.phone || '',
      qty: Number(listing.qty),
      totalPrice: Number(listing.qty * listing.price),
      status: 'placed',
      deliveryAddress: currentUser?.location || listing.location || 'Local Delivery',
      paymentMethod: 'Cash on Delivery / Mandi Transfer',
      timeline: [{ status: 'placed', time: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    try {
      const res = await axios.post('http://localhost:8000/api/orders', newOrder);
      // Remove listing immediately from marketplace view
      setListings(prev => prev.filter(l => String(l.id) !== String(listing.id)));
      setConnectedOrder({
        ...listing,
        orderId: res.data?.id || newOrder.listingId,
        farmerPhone: listing.contact || '',
        buyerPhone: currentUser?.phone || ''
      });
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('fc_local_orders') || '[]');
      localOrders.unshift({ ...newOrder, id: 'ord_' + Date.now() });
      localStorage.setItem('fc_local_orders', JSON.stringify(localOrders));
      // Still remove from marketplace view
      setListings(prev => prev.filter(l => String(l.id) !== String(listing.id)));
      setConnectedOrder({
        ...listing,
        orderId: newOrder.listingId,
        farmerPhone: listing.contact || '',
        buyerPhone: currentUser?.phone || ''
      });
    }
  };

  // Open Reviews & Rating modal for a specific farmer
  const openFarmerReviews = async (farmerName, listing = null) => {
    setReviewModalData({ farmerName, listing });
    setUserRating(5);
    setReviewComment('');
    setSelectedTags([]);

    try {
      const res = await getReviews({ targetUser: farmerName, targetType: 'farmer' });
      if (res.data && res.data.length > 0) {
        setFarmerReviews(res.data);
      } else {
        loadDefaultFarmerReviews(farmerName);
      }
    } catch (err) {
      loadDefaultFarmerReviews(farmerName);
    }
  };

  const loadDefaultFarmerReviews = (farmerName) => {
    setFarmerReviews([]);
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('⚠️ Please log in to rate farmers');
      return;
    }
    if (!reviewModalData) return;

    setSubmittingReview(true);
    const reviewData = {
      targetUser: reviewModalData.farmerName,
      targetType: 'farmer',
      reviewer: currentUser.name,
      reviewerRole: currentUser.role || 'buyer',
      rating: userRating,
      title: `${userRating} Stars produce review`,
      comment: reviewComment.trim() || 'Verified purchase review.',
      tags: selectedTags,
      listingId: reviewModalData.listing ? String(reviewModalData.listing.id) : null,
      createdAt: new Date().toISOString()
    };

    try {
      await createReview(reviewData);
      showToast('⭐ Thank you! Your rating for the farmer has been submitted.');
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('fc_local_reviews') || '[]');
      local.unshift({ ...reviewData, id: 'rev_' + Date.now() });
      localStorage.setItem('fc_local_reviews', JSON.stringify(local));
      showToast('⭐ Rating recorded successfully!');
    }

    setFarmerReviews([reviewData, ...farmerReviews]);
    setSubmittingReview(false);
    setReviewComment('');
    setSelectedTags([]);
    
    // Refresh ratings badge
    loadRatingsForSellers(listings);
  };

  return (
    <section className="section active" id="marketplace">
      <div className="section-banner banner-market">
        <div className="section-banner-content">
          <h2 className="section-banner-title">{t('marketplace.title', 'Farmer Marketplace')}</h2>
          <p className="section-banner-desc">{t('marketplace.subtitle', 'Buy & sell farm produce directly with photos, crop inspection videos, and verified farmer ratings')}</p>
        </div>
        <div className="section-banner-icon">🛍️</div>
      </div>
      
      <div className="marketplace-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('marketplace.sellProduce', 'Sell Your Produce & Media')}
        </button>

        <div className="marketplace-stats-badge" style={{ background: 'rgba(26, 122, 74, 0.1)', border: '1px solid rgba(26, 122, 74, 0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: 'var(--accent-gain)', fontWeight: '600' }}>
          ⭐ 100% Verified Farmer Ratings & HD Video Previews
        </div>
      </div>

      {/* SELL PRODUCE MODAL */}
      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div>
                <h3>{t('marketplace.sellProduce', 'List Your Produce & Media')}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Add photos & harvest videos to get higher offers from buyers</p>
              </div>
              <button className="btn-icon modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSellSubmit} className="sell-form">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontWeight: '700' }}>🌾 {t('marketplace.cropName', 'Crop / Commodity')}</label>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsCustomCrop(!isCustomCrop);
                      if (!isCustomCrop) setCropId('custom');
                      else setCropId(COMMODITIES[0].id);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gain)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    {isCustomCrop ? '📋 Choose from Standard List' : '✏️ Enter Any Custom Crop Name'}
                  </button>
                </div>

                {!isCustomCrop ? (
                  <select 
                    className="select-input" 
                    value={cropId} 
                    onChange={e => {
                      if (e.target.value === 'custom') {
                        setIsCustomCrop(true);
                      }
                      setCropId(e.target.value);
                    }} 
                    required
                  >
                    {COMMODITIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {getCropName(c)}</option>)}
                    <option value="custom">➕ Other / Enter Custom Crop Name...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(26,122,74,0.04)', padding: '10px', borderRadius: '10px', border: '1px dashed var(--accent-gain)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="text-input" 
                        style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem' }}
                        value={customCropEmoji}
                        onChange={e => setCustomCropEmoji(e.target.value)}
                        placeholder="🌾"
                        title="Emoji Icon"
                      />
                      <input 
                        type="text" 
                        className="text-input" 
                        style={{ flex: 1 }}
                        placeholder="Enter Any Crop Name (e.g. Dragon Fruit, Turmeric, Papaya, Marigold...)" 
                        value={customCropName}
                        onChange={e => setCustomCropName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {['🌾','🌿','🍅','🧅','🥔','🥭','🍌','🍎','🌶️','🌽','🫘','🌼','🥜','🥥','🫚'].map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setCustomCropEmoji(em)}
                          style={{ background: customCropEmoji === em ? 'var(--accent-gain)' : '#fff', color: customCropEmoji === em ? '#fff' : '#000', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', padding: '2px 6px' }}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              {/* MEDIA SELECTION MODES: IMAGE ONLY, VIDEO ONLY, BOTH */}
              <div className="form-group" style={{ background: 'rgba(0,0,0,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>📸 Media Attachment Type</label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <button 
                    type="button" 
                    className={`btn-tag ${mediaMode === 'image_only' ? 'active' : ''}`}
                    onClick={() => setMediaMode('image_only')}
                    style={{ textAlign: 'center', padding: '8px 4px' }}
                  >
                    📷 Image Only
                  </button>
                  <button 
                    type="button" 
                    className={`btn-tag ${mediaMode === 'video_only' ? 'active' : ''}`}
                    onClick={() => setMediaMode('video_only')}
                    style={{ textAlign: 'center', padding: '8px 4px' }}
                  >
                    📹 Video Only
                  </button>
                  <button 
                    type="button" 
                    className={`btn-tag ${mediaMode === 'both' ? 'active' : ''}`}
                    onClick={() => setMediaMode('both')}
                    style={{ textAlign: 'center', padding: '8px 4px' }}
                  >
                    🎬 Both (Image & Video)
                  </button>
                </div>

                {/* IMAGE INPUTS */}
                {(mediaMode === 'image_only' || mediaMode === 'both') && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <button 
                        type="button" 
                        className={`btn-tag ${mediaType === 'preset' ? 'active' : ''}`}
                        onClick={() => setMediaType('preset')}
                      >
                        ✨ Standard Crop Photo
                      </button>
                      <button 
                        type="button" 
                        className={`btn-tag ${mediaType === 'custom_image' ? 'active' : ''}`}
                        onClick={() => setMediaType('custom_image')}
                      >
                        📷 Upload Custom Photo
                      </button>
                    </div>

                    {mediaType === 'custom_image' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="text-input" style={{ padding: '6px' }} />
                        <input 
                          type="url" 
                          placeholder="Or paste image URL (https://...)" 
                          value={customImageUrl} 
                          onChange={e => setCustomImageUrl(e.target.value)} 
                          className="text-input" 
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* VIDEO INPUTS */}
                {(mediaMode === 'video_only' || mediaMode === 'both') && (
                  <div style={{ marginTop: '8px', paddingTop: mediaMode === 'both' ? '12px' : '0', borderTop: mediaMode === 'both' ? '1px dashed var(--border-color)' : 'none' }}>
                    <label style={{ fontWeight: '700', marginBottom: '6px', display: 'block', fontSize: '0.9rem' }}>
                      🎥 Produce Video Clip (MP4 / WebM)
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="text-input" style={{ padding: '6px' }} />
                      <input 
                        type="url" 
                        placeholder="Or paste video MP4 URL (https://...)" 
                        value={customVideoUrl} 
                        onChange={e => setCustomVideoUrl(e.target.value)} 
                        className="text-input" 
                      />
                    </div>
                  </div>
                )}

                {/* Media Preview Status Indicator */}
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '10px' }}>
                  {mediaMode === 'video_only' ? (
                    <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      📹
                    </div>
                  ) : (
                    <img 
                      src={customImageUrl || selectedCommodity.image} 
                      alt="Preview" 
                      style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                  )}
                  <div style={{ fontSize: '0.82rem', flex: 1 }}>
                    <div style={{ fontWeight: '700' }}>{isCustomCrop ? (customCropName || 'Custom Produce') : selectedCommodity.name}</div>
                    <div style={{ color: 'var(--accent-gain)', marginTop: '2px', fontWeight: '600' }}>
                      {mediaMode === 'image_only' && '📷 Image Only attached'}
                      {mediaMode === 'video_only' && '📹 Video Only attached'}
                      {mediaMode === 'both' && '🎬 Both Photo & Video attached'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>⚖️ Quantity</label>
                  <input type="number" className="text-input" min="1" placeholder="e.g. 25" value={qty} onChange={e => setQty(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>📦 Unit</label>
                  <select
                    className="text-input"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Quintal">⚖️ Quintal (100 kg)</option>
                    <option value="Kg">🏋️ Kilogram (Kg)</option>
                    <option value="Pieces">🔢 Pieces (Pcs)</option>
                    <option value="Dozen">🥚 Dozen (12 Pcs)</option>
                    <option value="Box">📦 Box / Crate</option>
                    <option value="Tonne">🚛 Tonne (1000 kg)</option>
                    <option value="Bunch">🌿 Bunch</option>
                    <option value="Litre">🥛 Litre</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>💰 Price (₹ per {unit})</label>
                  <input type="number" className="text-input" min="1" placeholder="e.g. 3800" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
              </div>

                {/* Cluster Name */}
                <div className="form-group">
                  <label>🗺️ Cluster Name</label>
                  <input type="text" className="text-input" placeholder="e.g. Mandal, Zone" value={clusterName} onChange={e => setClusterName(e.target.value)} />
                </div>
                {/* Place Name */}
                <div className="form-group">
                  <label>📍 Place Name</label>
                  <input type="text" className="text-input" placeholder="e.g. Village, Town" value={placeName} onChange={e => setPlaceName(e.target.value)} />
                </div>
                {/* Farm Location / Mandi */}
                <div className="form-group">
                  <label>📍 Farm Location / Mandi</label>
                  <input type="text" className="text-input" placeholder="Village, District, State" value={location} onChange={e => setLocation(e.target.value)} required />
                </div>

              <div className="form-group">
                <label>📱 Contact Number / WhatsApp</label>
                <input type="tel" className="text-input" placeholder="+91 9XXXXXXXXX" value={contact} onChange={e => setContact(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>📝 Produce Description & Quality Grade</label>
                <textarea className="text-input" rows="2" placeholder="Describe moisture content, organic certification, harvest date, etc." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn-primary btn-full">🚀 Publish Listing to Marketplace</button>
            </form>
          </div>
        </div>
      )}

      {/* LISTINGS GRID WITH RICH MEDIA & RATINGS */}
      <div className="listings-grid">
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1', background: 'var(--card-bg)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌾</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Produce Listed Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>List your farm harvest with photos & videos to sell directly to buyers across India!</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Sell Your Produce</button>
          </div>
        ) : (
          listings.map(l => {
          const com = COMMODITIES.find(c => c.id === l.crop) || COMMODITIES[0];
          const hasImage = Boolean(l.imageUrl && typeof l.imageUrl === 'string' && l.imageUrl.trim() !== '');
          const hasVideo = Boolean(l.videoUrl && typeof l.videoUrl === 'string' && l.videoUrl.trim() !== '');
          const displayImage = hasImage ? l.imageUrl : (!hasVideo ? com.image : null);
          const displayVideo = hasVideo ? l.videoUrl.trim() : null;
          const sellerRating = ratingsMap[l.seller] || { averageRating: 4.9, totalReviews: 8 };
          
          // Check if current user is the owner/seller of this produce
          const isOwner = Boolean(currentUser && (currentUser.name === l.seller || (l.contact && currentUser.phone === l.contact)));

          return (
            <div className="listing-card modern-media-card" key={l.id}>
              {/* Card Media Header */}
              <div className="listing-media-wrapper" style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden', borderTopLeftRadius: '14px', borderTopRightRadius: '14px', background: '#111' }}>
                
                {/* Case 1: Video Only */}
                {hasVideo && !hasImage && (
                  <video 
                    src={displayVideo} 
                    controls 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* Case 2 & 3: Has Image (with or without video button) */}
                {displayImage && (
                  <>
                    <img 
                      src={displayImage} 
                      alt={l.name} 
                      className="listing-hero-img"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onError={(e) => { e.target.src = com.image; }}
                    />
                    {hasVideo && (
                      <button 
                        className="video-preview-badge"
                        onClick={() => setActiveVideo({ title: l.name, videoUrl: displayVideo, seller: l.seller })}
                        style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                      >
                        <span>▶</span> Watch Harvest Video
                      </button>
                    )}
                  </>
                )}

                <div className="listing-emoji-badge" style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '12px', fontSize: '1.2rem', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  {l.emoji || com.emoji}
                </div>
              </div>

              {/* Card Body */}
              <div className="listing-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div className="listing-title" style={{ fontSize: '1.15rem', fontWeight: '700' }}>{getCropName(l.name)}</div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(26, 122, 74, 0.1)', color: 'var(--accent-gain)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                    Fresh Harvest
                  </span>
                </div>

                {/* Farmer & Rating Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', margin: '6px 0 10px' }}>
                  <div className="listing-location" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    📍 {l.location} • <strong style={{ color: 'var(--text-primary)' }}>{l.seller}</strong>
                  </div>

                  {/* Interactive Farmer Rating Badge */}
                  <button 
                    className="farmer-rating-btn"
                    onClick={() => openFarmerReviews(l.seller, l)}
                    title="Click to view ratings and write a review"
                    style={{ background: '#FFF8E1', border: '1px solid #FFE082', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#B78103', fontWeight: '700' }}
                  >
                    <span>⭐ {sellerRating.averageRating.toFixed(1)}</span>
                    <span style={{ color: '#888', fontWeight: '400' }}>({sellerRating.totalReviews})</span>
                  </button>
                </div>

                <div className="listing-desc" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '34px' }}>
                  {l.desc}
                </div>

                {/* Pricing & Stock Details */}
                <div className="listing-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--card-bg-light, rgba(0,0,0,0.02))', borderRadius: '10px', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PRICE PER {(l.unit || 'Quintal').toUpperCase()}</span>
                    <span className="listing-price" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-gain)' }}>₹{l.price.toLocaleString()}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>AVAILABLE STOCK</span>
                    <span className="listing-qty" style={{ fontWeight: '600' }}>{l.qty} {l.unit || 'Quintals'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="listing-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => openFarmerReviews(l.seller, l)}
                    style={{ padding: '8px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    ⭐ Rate Farmer
                  </button>
                  {currentUser && currentUser.name === l.seller ? (
                    <button 
                      className="btn-secondary" 
                      disabled
                      style={{ padding: '8px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: 0.7, cursor: 'not-allowed', background: '#f5f5f5', color: '#666', border: '1px dashed #ccc' }}
                      title="You listed this produce — you cannot order your own listing"
                    >
                      🌾 Your Listing
                    </button>
                  ) : (
                    <button 
                      className="listing-order-btn btn-primary" 
                      onClick={() => handleOrder(l)}
                      style={{ padding: '8px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      {t('marketplace.orderNow', '🛒 Order Now')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {activeVideo && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass" style={{ maxWidth: '720px', width: '90%', padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', color: '#fff' }}>
              <div>
                <h3 style={{ margin: '0', fontSize: '1.1rem' }}>🎥 {activeVideo.title} - Crop Quality Video</h3>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Farmer: {activeVideo.seller}</span>
              </div>
              <button 
                onClick={() => setActiveVideo(null)} 
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            <div style={{ background: '#000', textAlign: 'center' }}>
              <video 
                src={activeVideo.videoUrl} 
                controls 
                autoPlay 
                style={{ width: '100%', maxHeight: '450px', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🔍 High-Definition harvest inspection video provided by the farmer.</span>
              <button className="btn-primary" onClick={() => setActiveVideo(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* FARMER RATINGS & REVIEWS MODAL */}
      {reviewModalData && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass" style={{ maxWidth: '640px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div>
                <h3>⭐ Farmer Reviews & Ratings</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Farmer: <strong>{reviewModalData.farmerName}</strong>
                </p>
              </div>
              <button className="btn-icon modal-close" onClick={() => setReviewModalData(null)}>&times;</button>
            </div>

            {/* Rating Summary Bar */}
            <div style={{ background: 'linear-gradient(135deg, rgba(26,122,74,0.08), rgba(255,179,0,0.08))', padding: '16px', borderRadius: '12px', margin: '14px 0', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-gain)', lineHeight: '1' }}>
                  {ratingsMap[reviewModalData.farmerName]?.averageRating || '4.9'}
                </div>
                <div style={{ color: '#FFB300', fontSize: '1.2rem', margin: '4px 0' }}>★★★★★</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {farmerReviews.length} Verified Reviews
                </div>
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Farmer Trust & Quality Score</div>
                <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: '0.8rem' }}>
                  Buyers rate farmers on produce freshness, accurate weight, safe packaging, and on-time dispatch.
                </p>
              </div>
            </div>

            {/* Rate This Farmer Form (for Buyers) */}
            <form onSubmit={handleSubmitReview} style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: '700' }}>✍️ Give Your Rating to {reviewModalData.farmerName}</h4>
              
              {/* Star Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Rating:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', color: (hoverRating || userRating) >= star ? '#FFB300' : '#ddd', padding: '0' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-gain)', fontWeight: '600' }}>
                  {userRating === 5 ? 'Excellent 🌟' : userRating === 4 ? 'Very Good 👍' : userRating === 3 ? 'Good 🙂' : userRating === 2 ? 'Fair 😐' : 'Poor 👎'}
                </span>
              </div>

              {/* Quick Tag Pills */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Select highlights:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {DEFAULT_REVIEW_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`btn-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                className="text-input" 
                rows="2" 
                placeholder="Share details about crop moisture, quality, transaction experience..." 
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                style={{ marginBottom: '10px' }}
              />

              <button type="submit" className="btn-primary" disabled={submittingReview} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                {submittingReview ? 'Submitting...' : '⭐ Submit Farmer Rating'}
              </button>
            </form>

            {/* List of Verified Reviews */}
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>💬 Buyer Feedback & Ratings ({farmerReviews.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {farmerReviews.map((r, i) => (
                <div key={r.id || i} style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{r.reviewer}</strong>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(21, 101, 192, 0.1)', color: 'var(--accent-info)', padding: '2px 6px', borderRadius: '8px', marginLeft: '6px' }}>
                        Verified Buyer
                      </span>
                    </div>
                    <div style={{ color: '#FFB300', fontSize: '0.9rem' }}>
                      {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 8px', lineHeight: '1.4' }}>
                    {r.comment}
                  </p>

                  {r.tags && r.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {r.tags.map((t, idx) => (
                        <span key={idx} style={{ background: 'rgba(26,122,74,0.08)', color: 'var(--accent-gain)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div id="toast" className="show" style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>{toastMsg}</div>
      )}

      {/* Buyer to Farmer Connection Modal */}
      {connectedOrder && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤝</div>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.4rem', color: 'var(--accent-gain)' }}>Connection Established!</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your order for <strong>{connectedOrder.name}</strong> has been successfully placed. You can now contact the farmer directly to coordinate payment and delivery.
            </p>
            
            <div style={{ background: 'rgba(26,122,74,0.05)', border: '1px solid var(--accent-gain)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Farmer Details</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>{connectedOrder.seller}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                📞 {connectedOrder.contact || connectedOrder.seller}
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setConnectedOrder(null)}
            >
              Close & View My Orders
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Marketplace;
