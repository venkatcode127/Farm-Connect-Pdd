import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed', icon: '📋', color: 'var(--blue)' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', color: 'var(--green)' },
  { key: 'shipped', label: 'Shipped', icon: '🚛', color: 'var(--amber)' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', color: '#e67e22' },
  { key: 'delivered', label: 'Delivered', icon: '📦', color: 'var(--green)' }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const currentUser = useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/orders');
        const allOrders = res.data;
        if (isAdmin) {
          setOrders(allOrders);
        } else {
          setOrders(allOrders.filter(o => o.buyer === currentUser.name || o.seller === currentUser.name));
        }
      } catch (err) {
        console.error("Failed to fetch orders from server");
      }
    };
    
    fetchOrders();
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

  const activeCount = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const totalValue = nonCancelled.reduce((s, o) => s + o.totalPrice, 0);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      const newTimeline = [...order.timeline, { status: 'cancelled', time: new Date().toISOString() }];
      
      try {
        const res = await axios.put(`http://localhost:8000/api/orders/${orderId}`, {
          status: 'cancelled',
          timeline: newTimeline
        });
        
        const updatedOrders = orders.map(o => o.id === orderId ? res.data : o);
        setOrders(updatedOrders);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.data);
        }
      } catch (err) {
        console.error("Failed to cancel order", err);
      }
    }
  };

  const handleAdvanceStatus = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentIndex = ORDER_STATUSES.findIndex(s => s.key === order.status);
    if (currentIndex < ORDER_STATUSES.length - 1) {
      const nextStatus = ORDER_STATUSES[currentIndex + 1].key;
      const newTimeline = [...order.timeline, { status: nextStatus, time: new Date().toISOString() }];
      
      try {
        const res = await axios.put(`http://localhost:8000/api/orders/${orderId}`, {
          status: nextStatus,
          timeline: newTimeline
        });
        
        const updatedOrders = orders.map(o => o.id === orderId ? res.data : o);
        setOrders(updatedOrders);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.data);
        }
      } catch (err) {
        console.error("Failed to update status", err);
      }
    }
  };

  return (
    <section className="section active" id="orders">
      <div className="section-banner banner-orders">
        <div className="section-banner-content">
          <h2 className="section-banner-title">My Orders</h2>
          <p className="section-banner-desc">Track and manage all your orders in one place</p>
        </div>
        <div className="section-banner-icon">📦</div>
      </div>

      <div className="orders-tabs">
        <button className={`order-tab ${currentTab === 'all' ? 'active' : ''}`} onClick={() => setCurrentTab('all')}>📦 All Orders</button>
        <button className={`order-tab ${currentTab === 'active' ? 'active' : ''}`} onClick={() => setCurrentTab('active')}>🚚 Active</button>
        <button className={`order-tab ${currentTab === 'completed' ? 'active' : ''}`} onClick={() => setCurrentTab('completed')}>✅ Completed</button>
        <button className={`order-tab ${currentTab === 'cancelled' ? 'active' : ''}`} onClick={() => setCurrentTab('cancelled')}>❌ Cancelled</button>
      </div>

      <div className="orders-summary-strip">
        <div className="order-summary-item">
          <span className="order-summary-count">{orders.length}</span>
          <span className="order-summary-label">Total</span>
        </div>
        <div className="order-summary-item">
          <span className="order-summary-count" style={{ color: 'var(--blue)' }}>{activeCount}</span>
          <span className="order-summary-label">Active</span>
        </div>
        <div className="order-summary-item">
          <span className="order-summary-count" style={{ color: 'var(--green)' }}>{deliveredCount}</span>
          <span className="order-summary-label">Delivered</span>
        </div>
        <div className="order-summary-item">
          <span className="order-summary-count" style={{ color: 'var(--amber)' }}>₹{totalValue.toLocaleString()}</span>
          <span className="order-summary-label">Total Value</span>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="orders-empty" style={{ display: 'flex' }}>
            <div className="orders-empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Place an order from the Marketplace to get started</p>
            <button className="btn-primary" onClick={() => window.location.href = '/marketplace'}>🛒 Browse Marketplace</button>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusInfo = ORDER_STATUSES.find(s => s.key === order.status) || ORDER_STATUSES[0];
            const isCancelled = order.status === 'cancelled';
            const isDelivered = order.status === 'delivered';
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            
            let statusClass = isCancelled ? 'status-cancelled' : isDelivered ? 'status-delivered' : 'status-active';
            
            let roleTag = null;
            if (currentUser) {
              if (order.buyer === currentUser.name) roleTag = <span className="order-role-tag buyer-tag">🛒 Buyer</span>;
              else if (order.seller === currentUser.name) roleTag = <span className="order-role-tag seller-tag">🌾 Seller</span>;
              
              if (isAdmin && order.buyer !== currentUser.name && order.seller !== currentUser.name) roleTag = <span className="order-role-tag admin-tag">👑 Admin View</span>;
            }

            return (
              <div className="order-card" key={order.id}>
                <div className="amz-order-header">
                  <div className="amz-header-item">
                    <span className="amz-label">ORDER PLACED</span>
                    <span className="amz-value">{dateStr}</span>
                  </div>
                  <div className="amz-header-item">
                    <span className="amz-label">TOTAL</span>
                    <span className="amz-value">₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="amz-header-item">
                    <span className="amz-label">DISPATCH TO</span>
                    <span className="amz-value">{order.buyer}</span>
                  </div>
                  <div className="amz-header-item amz-order-id">
                    <span className="amz-label">ORDER # {order.id}</span>
                    <span className="amz-link" onClick={() => setSelectedOrder(order)}>View order details</span>
                  </div>
                </div>
                
                <div className="amz-order-body">
                  <div className={`amz-order-status ${statusClass}`}>
                     <h3>{statusInfo.icon} {statusInfo.label}</h3>
                     <p>{isCancelled ? 'This order has been cancelled.' : isDelivered ? 'Your package was delivered.' : 'Order is being processed.'}</p>
                  </div>
                  
                  <div className="amz-order-content">
                     <div className="amz-order-image">{order.listingEmoji}</div>
                     
                     <div className="amz-order-details">
                        <a href="#" className="amz-product-link" onClick={(e) => { e.preventDefault(); setSelectedOrder(order); }}>{order.listingName}</a>
                        <div className="amz-seller-info">Sold by: {order.seller}</div>
                        <div className="amz-qty-info">Qty: {order.qty} Qt &nbsp;•&nbsp; ₹{order.listingPrice.toLocaleString()}/Qt</div>
                        <div style={{ marginTop: '8px' }}>{roleTag}</div>
                     </div>
                     
                     <div className="amz-order-actions">
                        <button className="btn-amz-primary" onClick={() => setSelectedOrder(order)}>Track package</button>
                        {!isCancelled && !isDelivered && (
                          <button className="btn-amz-secondary" onClick={() => handleCancelOrder(order.id)}>Cancel items</button>
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
                <span className="order-detail-emoji">{selectedOrder.listingEmoji}</span>
                <div>
                  <div className="order-detail-product-name">{selectedOrder.listingName}</div>
                  <div className="order-detail-seller">Seller: {selectedOrder.seller}</div>
                  <div className="order-detail-buyer">Buyer: {selectedOrder.buyer}</div>
                </div>
              </div>

              <div className="order-detail-grid">
                <div className="order-detail-field">
                  <span className="odf-label">Quantity</span>
                  <span className="odf-value">{selectedOrder.qty} Qt</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Price/Qt</span>
                  <span className="odf-value">₹{selectedOrder.listingPrice.toLocaleString()}</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Total Amount</span>
                  <span className="odf-value" style={{ color: 'var(--primary-glow)', fontSize: '1.2rem' }}>₹{selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
                <div className="order-detail-field">
                  <span className="odf-label">Payment</span>
                  <span className="odf-value">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="order-detail-field" style={{ marginTop: '16px' }}>
                <span className="odf-label">📍 Delivery Address</span>
                <span className="odf-value">{selectedOrder.deliveryAddress}</span>
              </div>

              <h4 style={{ margin: '24px 0 12px', fontFamily: 'var(--font-heading)' }}>📦 Tracking Timeline</h4>
              <div className="order-timeline">
                {selectedOrder.timeline.map((t, i) => {
                  const si = ORDER_STATUSES.find(s => s.key === t.status) || { icon: '❌', label: 'Cancelled', color: 'var(--red)' };
                  const isLast = i === selectedOrder.timeline.length - 1;
                  return (
                    <div className={`timeline-item ${isLast ? 'timeline-current' : ''}`} key={i}>
                      <div className="timeline-dot" style={{ background: si.color }}>{si.icon}</div>
                      <div className="timeline-content">
                        <div className="timeline-label">{si.label}</div>
                        <div className="timeline-time">{new Date(t.time).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</div>
                      </div>
                    </div>
                  );
                })}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && 
                  ORDER_STATUSES.slice(selectedOrder.timeline.length).map((s, i) => (
                    <div className="timeline-item timeline-pending" key={i}>
                      <div className="timeline-dot timeline-dot-pending">{s.icon}</div>
                      <div className="timeline-content">
                        <div className="timeline-label" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                        <div className="timeline-time" style={{ color: 'var(--text-muted)' }}>Pending</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
