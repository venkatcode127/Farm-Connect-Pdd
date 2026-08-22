import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { getReviews, createReview } from '../api';
import { useLanguage } from '../context/LanguageContext';

const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed', icon: '📋', color: 'var(--blue)' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', color: 'var(--green)' },
  { key: 'shipped', label: 'Shipped', icon: '🚛', color: 'var(--amber)' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', color: '#e67e22' },
  { key: 'delivered', label: 'Delivered', icon: '📦', color: 'var(--green)' },
  { key: 'cancelled', label: 'Cancelled', icon: '❌', color: 'var(--red)' }
];

const FARMER_REVIEW_TAGS = [
  '🌱 Fresh & High Quality Produce',
  '⚖️ Accurate Weight & Grade',
  '📦 Sturdy Farm Packaging',
  '⚡ Quick Dispatch',
  '🤝 Cooperative Seller'
];

const BUYER_REVIEW_TAGS = [
  '💰 On-Time Payment',
  '📞 Excellent Communication',
  '🤝 Clear Delivery Instructions',
  '⭐ Reliable Business Partner',
  '⚡ Instant Acceptance'
];

const Orders = () => {
  const { t, getCropName } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratedOrdersMap, setRatedOrdersMap] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const [ratingModal, setRatingModal] = useState(null);
  const [starRating, setStarRating] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const fetchOrdersAndReviews = async () => {
    if (!currentUser) return;
    
    try {
      const res = await axios.get('http://localhost:8000/api/orders');
      const allOrders = res.data || [];
      if (isAdmin) {
        setOrders(allOrders);
      } else {
        setOrders(allOrders.filter(o => o.buyer === currentUser.name || o.seller === currentUser.name));
      }
    } catch (err) {
      console.error('Failed to fetch orders from database', err);
      setOrders([]);
    }

    try {
      const revRes = await getReviews({ reviewer: currentUser.name });
      const map = {};
      (revRes.data || []).forEach(r => {
        if (r.orderId) map[`${r.orderId}_${r.reviewer}`] = r;
      });
      setRatedOrdersMap(map);
    } catch (e) {
      setRatedOrdersMap({});
    }
  };

  useEffect(() => {
    fetchOrdersAndReviews();
  }, [currentUser, isAdmin]);

  const filteredOrders = useMemo(() => {
    switch (currentTab) {
      case 'active':
        return orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
      case 'completed':
        return orders.filter(o => o.status === 'delivered');
      case 'cancelled':
        return orders.filter(o => o.status === 'cancelled');
      default:
        return orders;
    }
  }, [orders, currentTab]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  const activeCount = activeOrders.length;
  const deliveredCount = deliveredOrders.length;
  
  const activeValue = activeOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const deliveredValue = deliveredOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const totalValue = activeValue + deliveredValue;

  const sellerDeliveredSales = orders
    .filter(o => o.seller === currentUser?.name && o.status === 'delivered')
    .reduce((s, o) => s + (o.totalPrice || 0), 0);

  const totalIncomeEarned = isAdmin 
    ? deliveredValue 
    : (currentUser?.role === 'farmer' || sellerDeliveredSales > 0)
    ? sellerDeliveredSales
    : deliveredValue;

  // Compute Buyer Reputation (Flagged as 'Not a Good Dealer' if >5 cancellations in last 30 days)
  const getBuyerReputation = (buyerName) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const buyerCancelled = orders.filter(o => 
      o.buyer === buyerName && 
      o.status === 'cancelled' &&
      (!o.createdAt || new Date(o.createdAt) >= oneMonthAgo)
    );
    const count = buyerCancelled.length;
    const isNotGoodDealer = count > 5;
    return {
      count,
      isNotGoodDealer,
      badgeText: isNotGoodDealer ? '⚠️ Not a Good Dealer' : (count >= 3 ? '⚡ Risky Dealer' : '✅ Reliable Dealer'),
      warningLabel: isNotGoodDealer ? `⚠️ Not a Good Dealer (${count} Cancellations this Month)` : null
    };
  };

  const myBuyerReputation = currentUser ? getBuyerReputation(currentUser.name) : { count: 0, isNotGoodDealer: false };

  const handleCancelOrder = async (orderId) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const currentBuyerCancelled = orders.filter(o => 
      o.buyer === currentUser?.name && 
      o.status === 'cancelled' &&
      (!o.createdAt || new Date(o.createdAt) >= oneMonthAgo)
    ).length;

    let confirmMsg = 'Are you sure you want to cancel this order?';
    if (currentBuyerCancelled >= 5) {
      confirmMsg = `⚠️ Warning: You have already cancelled ${currentBuyerCancelled} orders this month. Your account is flagged as "⚠️ Not a Good Dealer" to all farmers. Do you still want to cancel this order?`;
    } else if (currentBuyerCancelled === 5) {
      confirmMsg = `⚠️ Critical Notice: You have cancelled 5 orders this month. Cancelling this order will exceed 5 cancellations and will AUTOMATICALLY mark your profile as "⚠️ Not a Good Dealer" visible to all farmers. Proceed with cancellation?`;
    } else {
      confirmMsg = `Are you sure you want to cancel this order? (You have used ${currentBuyerCancelled}/5 allowable monthly cancellations before your dealer rating degrades).`;
    }

    if (window.confirm(confirmMsg)) {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Optimistically mark as cancelled
      const cancelledObj = { ...order, status: 'cancelled' };
      const updatedOrders = orders.map(o => o.id === orderId ? cancelledObj : o);
      setOrders(updatedOrders);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(cancelledObj);
      }

      try {
        const res = await axios.put(`http://localhost:8000/api/orders/${orderId}`, {
          status: 'cancelled'
        });
        // Use server response if available
        if (res.data && res.data.id) {
          const finalOrders = orders.map(o => o.id === orderId ? res.data : o);
          setOrders(finalOrders);
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(res.data);
          }
        }
        showToast('❌ Order cancelled successfully');
      } catch (err) {
        console.error('Failed to cancel order on server', err);
        showToast('❌ Order marked as cancelled (offline)');
      }
    }
  };

  const handleAdvanceStatus = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentIndex = ORDER_STATUSES.findIndex(s => s.key === order.status);
    if (currentIndex < ORDER_STATUSES.length - 1) {
      const nextStatus = ORDER_STATUSES[currentIndex + 1].key;
      const advancedObj = { ...order, status: nextStatus };
      const updatedOrders = orders.map(o => o.id === orderId ? advancedObj : o);
      setOrders(updatedOrders);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(advancedObj);
      }
      
      try {
        const res = await axios.put(`http://localhost:8000/api/orders/${orderId}`, {
          status: nextStatus
        });
        if (res.data && res.data.id) {
          const finalOrders = orders.map(o => o.id === orderId ? res.data : o);
          setOrders(finalOrders);
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(res.data);
          }
        }
        showToast(`🚚 Order updated to: ${ORDER_STATUSES[currentIndex + 1].label}`);
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
  };

  const handleCall = (num) => {
    if (num) {
      window.location.href = `tel:${num}`;
    }
  };

  const openRatingDialog = (order, targetType) => {
    const isRatingFarmer = targetType === 'farmer';
    const targetUser = isRatingFarmer ? order.seller : order.buyer;
    setRatingModal({
      order,
      targetUser,
      targetType,
      reviewerRole: isRatingFarmer ? 'buyer' : 'farmer'
    });
    setStarRating(5);
    setFeedbackComment('');
    setSelectedTags([]);
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitMutualRating = async (e) => {
    e.preventDefault();
    if (!ratingModal || !currentUser) return;

    setIsSubmittingRating(true);
    const reviewData = {
      targetUser: ratingModal.targetUser,
      targetType: ratingModal.targetType,
      reviewer: currentUser.name,
      reviewerRole: ratingModal.reviewerRole,
      rating: starRating,
      title: `${starRating} Star review for ${ratingModal.targetType}`,
      comment: feedbackComment.trim() || `Verified order review on ${ratingModal.order.listingName}`,
      tags: selectedTags,
      orderId: String(ratingModal.order.id),
      listingId: String(ratingModal.order.listingId),
      createdAt: new Date().toISOString()
    };

    try {
      await createReview(reviewData);
      showToast(`⭐ Rating submitted for ${ratingModal.targetUser}!`);
    } catch (err) {
      showToast(`⭐ Rating submitted for ${ratingModal.targetUser}!`);
    }

    setRatedOrdersMap({
      ...ratedOrdersMap,
      [`${ratingModal.order.id}_${currentUser.name}`]: reviewData
    });
    setIsSubmittingRating(false);
    setRatingModal(null);
  };

  return (
    <section className="section active" id="orders">
      <div className="section-banner banner-orders">
        <div className="section-banner-content">
          <h2 className="section-banner-title">{t('orders.title', 'My Orders & Direct Farmer Connect')}</h2>
          <p className="section-banner-desc">{t('orders.subtitle', 'Track your orders, connect directly with farmers, and manage receipts')}</p>
        </div>
        <div className="section-banner-icon">📦</div>
      </div>

      {/* Warning Banner if Current Buyer has >5 Cancellations this month */}
      {currentUser && myBuyerReputation.isNotGoodDealer && (
        <div style={{
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
          border: '2px solid #EF4444',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          color: '#991B1B',
          boxShadow: '0 4px 14px rgba(239,68,68,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: '800' }}>
              Account Standing Warning: Flagged as "Not a Good Dealer"
            </h4>
            <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.4' }}>
              You have cancelled <strong>{myBuyerReputation.count} orders</strong> in the last 30 days. System rules automatically mark accounts with more than 5 monthly cancellations as <strong>"⚠️ Not a Good Dealer"</strong> to protect farmers. Complete upcoming orders reliably to restore your rating.
            </p>
          </div>
        </div>
      )}

      <div className="orders-tabs">
        <button className={`order-tab ${currentTab === 'all' ? 'active' : ''}`} onClick={() => setCurrentTab('all')}>📦 {t('common.all', 'All Orders')}</button>
        <button className={`order-tab ${currentTab === 'active' ? 'active' : ''}`} onClick={() => setCurrentTab('active')}>🚚 {t('orders.placed', 'Active')}</button>
        <button className={`order-tab ${currentTab === 'completed' ? 'active' : ''}`} onClick={() => setCurrentTab('completed')}>✅ {t('orders.delivered', 'Completed')}</button>
        <button className={`order-tab ${currentTab === 'cancelled' ? 'active' : ''}`} onClick={() => setCurrentTab('cancelled')}>❌ {t('orders.cancelled', 'Cancelled')}</button>
      </div>

      <div className="orders-summary-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '16px 0' }}>
        <div className="order-summary-item" style={{ padding: '14px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span className="order-summary-count" style={{ fontSize: '1.6rem', fontWeight: '800', display: 'block' }}>{orders.length}</span>
          <span className="order-summary-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Orders</span>
        </div>

        <div className="order-summary-item" style={{ padding: '14px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span className="order-summary-count" style={{ color: 'var(--blue)', fontSize: '1.6rem', fontWeight: '800', display: 'block' }}>{activeCount}</span>
          <span className="order-summary-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🚚 Active Orders</span>
        </div>

        <div className="order-summary-item" style={{ padding: '14px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <span className="order-summary-count" style={{ color: 'var(--green)', fontSize: '1.6rem', fontWeight: '800', display: 'block' }}>{deliveredCount}</span>
          <span className="order-summary-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✅ Delivered Orders</span>
        </div>

        <div className="order-summary-item" style={{ padding: '14px', background: 'rgba(21, 101, 192, 0.05)', borderRadius: '12px', border: '1px solid rgba(21, 101, 192, 0.2)', textAlign: 'center' }}>
          <span className="order-summary-count" style={{ color: 'var(--blue)', fontSize: '1.4rem', fontWeight: '800', display: 'block' }}>₹{activeValue.toLocaleString()}</span>
          <span className="order-summary-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📦 In-Transit Value</span>
        </div>

        <div className="order-summary-item" style={{ padding: '14px', background: 'rgba(26, 122, 74, 0.06)', borderRadius: '12px', border: '1px solid rgba(26, 122, 74, 0.2)', textAlign: 'center' }}>
          <span className="order-summary-count" style={{ color: 'var(--accent-gain)', fontSize: '1.4rem', fontWeight: '800', display: 'block' }}>₹{deliveredValue.toLocaleString()}</span>
          <span className="order-summary-label" style={{ fontSize: '0.8rem', color: 'var(--accent-gain)', fontWeight: '600' }}>✨ Delivered Value</span>
        </div>

        <div className="order-summary-item" style={{ padding: '14px', background: 'linear-gradient(135deg, rgba(26, 122, 74, 0.15), rgba(255, 179, 0, 0.15))', borderRadius: '12px', border: '2px solid var(--accent-gain)', textAlign: 'center', gridColumn: 'span 1' }}>
          <span className="order-summary-count" style={{ color: '#1B5E20', fontSize: '1.5rem', fontWeight: '900', display: 'block' }}>💰 ₹{totalIncomeEarned.toLocaleString()}</span>
          <span className="order-summary-label" style={{ fontSize: '0.82rem', color: '#1B5E20', fontWeight: '700' }}>
            {currentUser?.role === 'farmer' ? 'Total Income Earned Till Now' : 'Total Settled / Earned'}
          </span>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty" style={{ display: 'flex' }}>
            <div className="orders-empty-icon">📦</div>
            <h3>{t('orders.noOrders', 'No orders found')}</h3>
            <p>Browse the Farmer Marketplace to buy high-quality produce</p>
            <button className="btn-primary" onClick={() => window.location.href = '/marketplace'}>🛒 {t('marketplace.title', 'Browse Marketplace')}</button>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusInfo = ORDER_STATUSES.find(s => s.key === order.status) || ORDER_STATUSES[0];
            const isCancelled = order.status === 'cancelled';
            const isDelivered = order.status === 'delivered';
            const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently';
            
            let statusClass = isCancelled ? 'status-cancelled' : isDelivered ? 'status-delivered' : 'status-active';
            
            const isBuyer = currentUser && order.buyer === currentUser.name;
            const isSeller = currentUser && order.seller === currentUser.name;
            const buyerReputation = getBuyerReputation(order.buyer);

            let roleTag = null;
            if (isBuyer) roleTag = <span className="order-role-tag buyer-tag">🛒 You are Buyer</span>;
            else if (isSeller) roleTag = <span className="order-role-tag seller-tag">🌾 You are Seller/Farmer</span>;
            else if (isAdmin) roleTag = <span className="order-role-tag admin-tag">👑 Admin View</span>;

            const existingRating = currentUser ? ratedOrdersMap[`${order.id}_${currentUser.name}`] : null;
            const sellerPhone = order.sellerContact || order.contact;

            return (
              <div className="order-card" key={order.id}>
                <div className="amz-order-header">
                  <div className="amz-header-item">
                    <span className="amz-label">{t('orders.placed', 'ORDER PLACED')}</span>
                    <span className="amz-value">{dateStr}</span>
                  </div>
                  <div className="amz-header-item">
                    <span className="amz-label">{t('orders.totalPrice', 'TOTAL')}</span>
                    <span className="amz-value">₹{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="amz-header-item">
                    <span className="amz-label">{t('orders.seller', 'SHIP TO')}</span>
                    <span className="amz-value">{order.deliveryAddress || 'Standard Delivery Point'}</span>
                  </div>
                  <div className="amz-header-item" style={{ textAlign: 'right' }}>
                    <span className="amz-label">ORDER # {order.id}</span>
                  </div>
                </div>
                
                <div className="amz-order-body">
                  <div className={`amz-order-status ${statusClass}`}>
                     <h3>{statusInfo.icon} {statusInfo.label}</h3>
                     <p>{isCancelled ? 'This order has been cancelled.' : isDelivered ? 'Produce was successfully delivered.' : 'Order has been placed and is being processed.'}</p>
                  </div>
                  
                  <div className="amz-order-content">
                     <div className="amz-order-image">{order.listingEmoji || '🌾'}</div>
                     
                     <div className="amz-order-details">
                        <div className="amz-product-link" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{getCropName(order.listingName)}</div>
                        <div className="amz-seller-info">Farmer/Seller: <strong>{order.seller}</strong></div>
                        
                        <div className="amz-seller-info" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                          <span>Buyer: <strong>{order.buyer}</strong></span>
                          {buyerReputation.isNotGoodDealer && (
                            <span 
                              title="Buyer has cancelled more than 5 orders in the past 30 days"
                              style={{ 
                                background: '#FEE2E2', 
                                border: '1px solid #EF4444', 
                                color: '#B91C1C', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '0.74rem', 
                                fontWeight: '700',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              ⚠️ Not a Good Dealer ({buyerReputation.count} Cancellations this Month)
                            </span>
                          )}
                        </div>

                        {/* Farmer Caution Notice if buyer is flagged */}
                        {isSeller && buyerReputation.isNotGoodDealer && (
                          <div style={{
                            marginTop: '6px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px dashed #EF4444',
                            color: '#B91C1C',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                            <div>
                              <strong>Farmer Caution Notice:</strong> This buyer has cancelled <strong>{buyerReputation.count} orders</strong> this month and is flagged as <em>"Not a Good Dealer"</em>. Please call the buyer to confirm payment before dispatching your produce.
                            </div>
                          </div>
                        )}

                        <div className="amz-qty-info">Qty: {order.qty} Qt &nbsp;•&nbsp; ₹{(order.listingPrice || 0).toLocaleString()}/Qt</div>
                        <div style={{ marginTop: '8px' }}>{roleTag}</div>


                        {/* Contact Info: Buyer sees Farmer number, Farmer sees Buyer number */}
                        {isBuyer && sellerPhone && (
                           <div className="order-contact-box farmer-box">
                             <div className="order-contact-header">🤝 {t('orders.farmerContact', 'Farmer Contact (Direct Line)')}</div>
                             <div className="order-contact-row">
                               <span className="order-contact-name">👨‍🌾 {order.seller}</span>
                               <button 
                                 type="button"
                                 className="btn-call-compact call-farmer" 
                                 onClick={() => handleCall(sellerPhone)}
                                 title={`Call Farmer: ${sellerPhone}`}
                               >
                                 📞 {t('orders.callFarmer', 'Call Farmer')}
                               </button>
                             </div>
                             <div className="order-contact-subtext">{t('orders.contactHint', 'Call or WhatsApp to coordinate payment & delivery')}</div>
                           </div>
                         )}
                         {isSeller && order.buyerContact && (
                           <div className="order-contact-box buyer-box">
                             <div className="order-contact-header">🛒 {t('orders.buyerContact', 'Buyer Contact')}</div>
                             <div className="order-contact-row">
                               <span className="order-contact-name">🛒 {order.buyer}</span>
                               <button 
                                 type="button"
                                 className="btn-call-compact call-buyer" 
                                 onClick={() => handleCall(order.buyerContact)}
                                 title={`Call Buyer: ${order.buyerContact}`}
                               >
                                 📞 {t('orders.callBuyer', 'Call Buyer')}
                               </button>
                             </div>
                             <div className="order-contact-subtext">{t('orders.buyerHint', 'Contact buyer to confirm order, payment & delivery location')}</div>
                           </div>
                         )}
                         {(isAdmin) && (
                           <div className="order-contact-box" style={{ marginTop: '10px' }}>
                             <div className="order-contact-header">🛡️ Admin Directory — Direct Contacts</div>
                             <div className="order-contact-row" style={{ gap: '16px' }}>
                               {sellerPhone && (
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Farmer:</span>
                                   <button 
                                     type="button"
                                     className="btn-call-compact call-farmer" 
                                     onClick={() => handleCall(sellerPhone)}
                                     title={`Call Farmer: ${sellerPhone}`}
                                   >
                                     📞 {sellerPhone}
                                   </button>
                                 </div>
                               )}
                               {order.buyerContact && (
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Buyer:</span>
                                   <button 
                                     type="button"
                                     className="btn-call-compact call-buyer" 
                                     onClick={() => handleCall(order.buyerContact)}
                                     title={`Call Buyer: ${order.buyerContact}`}
                                   >
                                     📞 {order.buyerContact}
                                   </button>
                                 </div>
                               )}
                             </div>
                           </div>
                         )}
                     </div>
                     
                     <div className="amz-order-actions">
                        <button className="btn-amz-primary" onClick={() => setSelectedOrder(order)}>Order Details</button>
                        
                        {isBuyer && sellerPhone && (
                           <a 
                             href={`tel:${sellerPhone}`} 
                             className="btn-amz-call call-farmer"
                             title={`Call Farmer: ${sellerPhone}`}
                           >
                             📞 {t('orders.callFarmer', 'Call Farmer')}
                           </a>
                         )}
                         {isSeller && order.buyerContact && (
                           <a 
                             href={`tel:${order.buyerContact}`} 
                             className="btn-amz-call call-buyer"
                             title={`Call Buyer: ${order.buyerContact}`}
                           >
                             📞 {t('orders.callBuyer', 'Call Buyer')}
                           </a>
                         )}

                        {isDelivered && (
                          <>
                            {existingRating ? (
                              <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#2E7D32', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center' }}>
                                ⭐ You Rated ({existingRating.rating}/5 Stars)
                              </div>
                            ) : isBuyer ? (
                              <button 
                                className="btn-amz-secondary" 
                                style={{ background: '#FFF8E1', border: '1px solid #FFD54F', color: '#B78103', fontWeight: '700' }}
                                onClick={() => openRatingDialog(order, 'farmer')}
                              >
                                ⭐ Rate Farmer & Produce
                              </button>
                            ) : isSeller ? (
                              <button 
                                className="btn-amz-secondary" 
                                style={{ background: '#E3F2FD', border: '1px solid #90CAF9', color: '#1565C0', fontWeight: '700' }}
                                onClick={() => openRatingDialog(order, 'buyer')}
                              >
                                ⭐ Rate Buyer
                              </button>
                            ) : null}
                          </>
                        )}

                        {!isCancelled && !isDelivered && (
                          <button className="btn-amz-secondary" onClick={() => handleCancelOrder(order.id)}>{t('orders.cancelOrder', 'Cancel items')}</button>
                        )}
                        {isAdmin && !isCancelled && !isDelivered && (
                          <button className="btn-amz-secondary" style={{ color: 'var(--green)' }} onClick={() => handleAdvanceStatus(order.id)}>Advance Status</button>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RATING MODAL */}
      {ratingModal && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass" style={{ maxWidth: '540px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <h3>⭐ {ratingModal.targetType === 'farmer' ? 'Rate Farmer & Produce Quality' : 'Rate Buyer Payment & Reliability'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Rating for: <strong>{ratingModal.targetUser}</strong> • Order #{ratingModal.order.id}
                </p>
              </div>
              <button className="btn-icon modal-close" onClick={() => setRatingModal(null)}>&times;</button>
            </div>

            <form onSubmit={handleSubmitMutualRating} style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.8rem' }}>{ratingModal.order.listingEmoji || '🌾'}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{ratingModal.order.listingName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {ratingModal.order.qty} Quintals • ₹{(ratingModal.order.totalPrice || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ textAlign: 'center', marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Overall Score</label>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2.2rem', color: (hoverStar || starRating) >= star ? '#FFB300' : '#ddd', padding: '0' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div style={{ fontWeight: '700', color: 'var(--accent-gain)', marginTop: '4px' }}>
                  {starRating === 5 ? '5 Stars - Outstanding Experience ⭐⭐⭐⭐⭐' : starRating === 4 ? '4 Stars - Very Good ⭐⭐⭐⭐' : starRating === 3 ? '3 Stars - Satisfactory ⭐⭐⭐' : starRating === 2 ? '2 Stars - Needs Improvement ⭐⭐' : '1 Star - Unsatisfactory ⭐'}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                  {ratingModal.targetType === 'farmer' ? 'What went well with the crop & delivery?' : 'Buyer Feedback Highlights:'}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(ratingModal.targetType === 'farmer' ? FARMER_REVIEW_TAGS : BUYER_REVIEW_TAGS).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`btn-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => handleToggleTag(tag)}
                      style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Detailed Comments (Optional)</label>
                <textarea 
                  className="text-input" 
                  rows="3" 
                  placeholder={ratingModal.targetType === 'farmer' ? 'Write your thoughts on crop freshness, weight accuracy, packaging...' : 'Write about payment speed, communication, and pickup coordination...'} 
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary btn-full" disabled={isSubmittingRating}>
                {isSubmittingRating ? 'Saving...' : `⭐ Submit Rating for ${ratingModal.targetUser}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL (WITHOUT TRACKING TIMELINE) */}
      {selectedOrder && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal glass order-detail-modal">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="btn-icon modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>
            <div id="orderDetailContent">
              <div className="order-detail-header-info">
                <div>
                  <span className="order-detail-id">Order #{selectedOrder.id}</span>
                  <span className={`order-status-badge ${selectedOrder.status === 'cancelled' ? 'status-cancelled' : selectedOrder.status === 'delivered' ? 'status-delivered' : 'status-active'}`}>
                    {(ORDER_STATUSES.find(s => s.key === selectedOrder.status) || ORDER_STATUSES[0]).icon} 
                    {(ORDER_STATUSES.find(s => s.key === selectedOrder.status) || ORDER_STATUSES[0]).label}
                  </span>
                </div>
                <span className="order-detail-date">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="order-detail-product">
                <span className="order-detail-emoji">{selectedOrder.listingEmoji || '🌾'}</span>
                <div>
                  <div className="order-detail-product-name">{getCropName(selectedOrder.listingName)}</div>
                  <div className="order-detail-seller">
                    Farmer / Seller: <strong>{selectedOrder.seller}</strong>
                    {(selectedOrder.sellerContact || selectedOrder.contact) && (
                      <div style={{ marginTop: '4px', fontSize: '0.9rem' }}>
                        📞 Direct Phone: <a href={`tel:${selectedOrder.sellerContact || selectedOrder.contact}`} style={{ color: 'var(--accent-gain)', fontWeight: '700', textDecoration: 'underline' }}>{selectedOrder.sellerContact || selectedOrder.contact}</a>
                      </div>
                    )}
                  </div>
                  <div className="order-detail-buyer">Buyer: <strong>{selectedOrder.buyer}</strong></div>
                </div>
              </div>

              <div className="order-detail-grid">
                <div className="order-detail-field">
                  <span className="odf-label">Quantity</span>
                  <span className="odf-value">{selectedOrder.qty} Qt</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Price/Qt</span>
                  <span className="odf-value">₹{(selectedOrder.listingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Total Amount</span>
                  <span className="odf-value" style={{ color: 'var(--primary-glow)', fontSize: '1.2rem' }}>₹{(selectedOrder.totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Payment</span>
                  <span className="odf-value">{selectedOrder.paymentMethod || 'Direct Mandi Transfer / COD'}</span>
                </div>
              </div>

              <div className="order-detail-field" style={{ marginTop: '16px' }}>
                <span className="odf-label">📍 Delivery Address</span>
                <span className="odf-value">{selectedOrder.deliveryAddress || 'Standard Delivery Point'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div id="toast" className="show">{toastMsg}</div>
      )}
    </section>
  );
};

export default Orders;

