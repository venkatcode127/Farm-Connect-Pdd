// ===== FarmConnect AI - Order Tracking System =====

// Admin phone — must match MASTER_PHONE in auth.js
const ADMIN_PHONE = '9347815378';

const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed', labelHi: 'ऑर्डर दिया गया', icon: '📋', color: 'var(--blue)' },
  { key: 'confirmed', label: 'Confirmed', labelHi: 'पुष्टि हो गई', icon: '✅', color: 'var(--green)' },
  { key: 'shipped', label: 'Shipped', labelHi: 'भेज दिया गया', icon: '🚛', color: 'var(--amber)' },
  { key: 'out_for_delivery', label: 'Out for Delivery', labelHi: 'डिलीवरी के लिए निकला', icon: '🚚', color: '#e67e22' },
  { key: 'delivered', label: 'Delivered', labelHi: 'पहुँच गया', icon: '📦', color: 'var(--green)' }
];

let orders = [];
let orderNextId = 5000;
let currentOrderTab = 'all';

// ===== Per-user order storage =====
// Each user's orders are stored under key: fc_orders_<phone>
// A master index of all orders is kept for admin at: fc_orders_all

function getOrderStorageKey(phone) {
  return 'fc_orders_' + phone;
}

function loadOrdersForUser() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  const isAdmin = currentUser.role === 'admin' || currentUser.phone === ADMIN_PHONE;

  if (isAdmin) {
    // Admin sees ALL orders across all users
    return loadAllOrders();
  }

  // Normal user: load only their own orders (as buyer or seller)
  const key = getOrderStorageKey(currentUser.phone);
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return [];
}

function loadAllOrders() {
  const saved = localStorage.getItem('fc_orders_all');
  if (saved) {
    try { return JSON.parse(saved); } catch(e) {}
  }
  return [];
}

function saveOrders() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const isAdmin = currentUser.role === 'admin' || currentUser.phone === ADMIN_PHONE;

  if (isAdmin) {
    // Admin changes apply to the master list and sync back to individual users
    localStorage.setItem('fc_orders_all', JSON.stringify(orders));
    syncOrdersToUsers();
  } else {
    // Save to user's own key
    localStorage.setItem(getOrderStorageKey(currentUser.phone), JSON.stringify(orders));
    // Also update master list
    updateMasterOrders();
  }
}

function syncOrdersToUsers() {
  // After admin changes, update each user's individual order store
  const allOrders = orders;
  const userOrdersMap = {};

  allOrders.forEach(order => {
    // Add to buyer's list
    if (order.buyerPhone) {
      if (!userOrdersMap[order.buyerPhone]) userOrdersMap[order.buyerPhone] = [];
      userOrdersMap[order.buyerPhone].push(order);
    }
    // Add to seller's list
    if (order.sellerPhone && order.sellerPhone !== order.buyerPhone) {
      if (!userOrdersMap[order.sellerPhone]) userOrdersMap[order.sellerPhone] = [];
      userOrdersMap[order.sellerPhone].push(order);
    }
  });

  // Save each user's orders
  Object.keys(userOrdersMap).forEach(phone => {
    localStorage.setItem(getOrderStorageKey(phone), JSON.stringify(userOrdersMap[phone]));
  });
}

function updateMasterOrders() {
  // Rebuild master list from the current user's updated orders
  let allOrders = loadAllOrders();

  // Remove old versions of current user's orders from master
  const currentUser = getCurrentUser();
  const currentUserPhone = currentUser.phone;
  allOrders = allOrders.filter(o => o.buyerPhone !== currentUserPhone && o.sellerPhone !== currentUserPhone);

  // Add current user's orders back
  orders.forEach(order => {
    // Avoid duplicates
    if (!allOrders.find(o => o.id === order.id)) {
      allOrders.push(order);
    }
  });

  // Update master order IDs to avoid conflicts
  const orderIds = new Set();
  const uniqueOrders = [];
  // Use the latest version of each order (from current user's list)
  const currentOrderMap = {};
  orders.forEach(o => { currentOrderMap[o.id] = o; });

  allOrders.forEach(o => {
    if (currentOrderMap[o.id]) {
      if (!orderIds.has(o.id)) {
        uniqueOrders.push(currentOrderMap[o.id]);
        orderIds.add(o.id);
      }
    } else {
      if (!orderIds.has(o.id)) {
        uniqueOrders.push(o);
        orderIds.add(o.id);
      }
    }
  });

  localStorage.setItem('fc_orders_all', JSON.stringify(uniqueOrders));
}

// ===== Migration: move old shared orders to per-user format =====
function migrateOldOrders() {
  const oldOrders = localStorage.getItem('fc_orders');
  if (oldOrders) {
    try {
      const parsed = JSON.parse(oldOrders);
      if (parsed.length > 0) {
        // Save to master list if it doesn't exist yet
        const existing = localStorage.getItem('fc_orders_all');
        if (!existing) {
          localStorage.setItem('fc_orders_all', JSON.stringify(parsed));
        }
      }
    } catch(e) {}
    // Remove old shared key
    localStorage.removeItem('fc_orders');
  }
}

function initOrders() {
  migrateOldOrders();
  orders = loadOrdersForUser();
  orderNextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 5000;
  // Also check master list for next ID
  const allOrders = loadAllOrders();
  if (allOrders.length > 0) {
    const maxMaster = Math.max(...allOrders.map(o => o.id)) + 1;
    if (maxMaster > orderNextId) orderNextId = maxMaster;
  }
  renderOrders();
  setupOrderTabs();
  document.getElementById('closeOrderDetail').onclick = () => {
    document.getElementById('orderDetailModal').style.display = 'none';
  };
}

function setupOrderTabs() {
  document.querySelectorAll('.order-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentOrderTab = tab.dataset.tab;
      renderOrders();
    };
  });
}

function getFilteredOrders() {
  switch (currentOrderTab) {
    case 'active':
      return orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    case 'completed':
      return orders.filter(o => o.status === 'delivered');
    case 'cancelled':
      return orders.filter(o => o.status === 'cancelled');
    default:
      return orders;
  }
}

function renderOrders() {
  const hi = lang === 'hi';
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.phone === ADMIN_PHONE);
  const filtered = getFilteredOrders();
  const container = document.getElementById('ordersList');
  const emptyEl = document.getElementById('ordersEmpty');

  // Update summary
  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const delivered = orders.filter(o => o.status === 'delivered');
  const nonCancelled = orders.filter(o => o.status !== 'cancelled');
  const totalValue = nonCancelled.reduce((s, o) => s + o.totalPrice, 0);
  document.getElementById('orderTotalCount').textContent = orders.length;
  document.getElementById('orderActiveCount').textContent = active.length;
  document.getElementById('orderDeliveredCount').textContent = delivered.length;
  document.getElementById('orderTotalSpent').textContent = '₹' + totalValue.toLocaleString();

  if (filtered.length === 0) {
    emptyEl.style.display = 'flex';
    container.querySelectorAll('.order-card').forEach(c => c.remove());
    return;
  }

  emptyEl.style.display = 'none';
  const cardsHtml = filtered.map(order => {
    const statusInfo = ORDER_STATUSES.find(s => s.key === order.status) || ORDER_STATUSES[0];
    const statusIndex = ORDER_STATUSES.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';
    const isDelivered = order.status === 'delivered';
    const listing = order.listing;
    const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Show role context (are you the buyer or seller for this order?)
    let roleTag = '';
    if (currentUser) {
      if (order.buyerPhone === currentUser.phone) {
        roleTag = `<span class="order-role-tag buyer-tag">${hi ? '🛒 खरीदार' : '🛒 Buyer'}</span>`;
      } else if (order.sellerPhone === currentUser.phone) {
        roleTag = `<span class="order-role-tag seller-tag">${hi ? '🌾 विक्रेता' : '🌾 Seller'}</span>`;
      }
      if (isAdmin && !order.buyerPhone) {
        roleTag = `<span class="order-role-tag admin-tag">👑 Admin View</span>`;
      }
    }

    // Progress bar
    const totalSteps = ORDER_STATUSES.length;
    const progressPct = isCancelled ? 0 : ((statusIndex + 1) / totalSteps * 100);

    // Show buyer/seller info
    const buyerInfo = order.buyer ? `<div class="order-item-buyer">${hi ? 'खरीदार' : 'Buyer'}: ${order.buyer}</div>` : '';
    const sellerInfo = `<div class="order-item-seller">${hi ? 'विक्रेता' : 'Seller'}: ${order.seller}</div>`;

    // Mask order ID (hide middle digits)
    const orderIdStr = String(order.id);
    const maskedId = orderIdStr.length > 4 ? orderIdStr.substring(0, 2) + '-' + '*'.repeat(orderIdStr.length - 4) + '-' + orderIdStr.substring(orderIdStr.length - 2) : orderIdStr;

    // Status styling
    let statusClass = isCancelled ? 'status-cancelled' : isDelivered ? 'status-delivered' : 'status-active';
    let statusDesc = '';
    if (isDelivered) statusDesc = hi ? 'आपका पैकेज डिलीवर हो गया है।' : 'Your package was delivered.';
    else if (isCancelled) statusDesc = hi ? 'यह ऑर्डर रद्द कर दिया गया है।' : 'This order has been cancelled.';
    else statusDesc = hi ? 'ऑर्डर प्रोसेस किया जा रहा है।' : 'Order is being processed.';

    return `<div class="order-card" data-order-id="${order.id}">
      <div class="amz-order-header">
        <div class="amz-header-item">
          <span class="amz-label">${hi ? 'ऑर्डर दिया गया' : 'ORDER PLACED'}</span>
          <span class="amz-value">${dateStr}</span>
        </div>
        <div class="amz-header-item">
          <span class="amz-label">${hi ? 'कुल' : 'TOTAL'}</span>
          <span class="amz-value">₹${order.totalPrice.toLocaleString()}</span>
        </div>
        <div class="amz-header-item">
          <span class="amz-label">${hi ? 'भेजा गया' : 'DISPATCH TO'}</span>
          <span class="amz-value">${order.buyer}</span>
        </div>
        <div class="amz-header-item amz-order-id">
          <span class="amz-label">${hi ? 'ऑर्डर #' : 'ORDER #'} ${maskedId}</span>
          <span class="amz-link" onclick="viewOrderDetail(${order.id})">${hi ? 'ऑर्डर विवरण देखें' : 'View order details'}</span>
        </div>
      </div>
      
      <div class="amz-order-body">
        
        <div class="amz-order-content">
           <div class="amz-order-image">${listing.emoji}</div>
           
           <div class="amz-order-details">
              <a href="#" class="amz-product-link" onclick="viewOrderDetail(${order.id}); return false;">${hi ? listing.nameHi : listing.name}</a>
              <div class="amz-seller-info">${hi ? 'विक्रेता' : 'Sold by'}: ${order.seller}</div>
              <div class="amz-qty-info">Qty: ${order.qty} Qt &nbsp;•&nbsp; ₹${listing.price.toLocaleString()}/Qt</div>
              <div style="margin-top: 8px;">${roleTag}</div>
           </div>
           
           <div class="amz-order-actions">
              <button class="btn-amz-primary" onclick="viewOrderDetail(${order.id})">${hi ? 'पैकेज ट्रैक करें' : 'Track package'}</button>
              ${!isCancelled && !isDelivered ? `<button class="btn-amz-secondary" onclick="cancelOrder(${order.id})">${hi ? 'आइटम रद्द करें' : 'Cancel items'}</button>` : ''}
              ${isAdmin && !isCancelled && !isDelivered ? `<button class="btn-amz-secondary" style="color: var(--green)" onclick="advanceOrderStatus(${order.id})">${hi ? 'स्टेटस अपडेट' : 'Advance Status'}</button>` : ''}
           </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const existingCards = container.querySelectorAll('.order-card');
  existingCards.forEach(c => c.remove());
  container.insertAdjacentHTML('afterbegin', cardsHtml);
}

function placeOrder(listingId) {
  const listing = listings.find(l => l.id === listingId);
  if (!listing) { showToast('❌ Listing not found'); return; }

  const currentUser = getCurrentUser();
  if (!currentUser) { showToast('❌ Please login first'); return; }

  const hi = lang === 'hi';

  // Check if user is trying to buy their own listing
  if (listing.seller === currentUser.name) {
    showToast(hi ? '❌ आप अपनी खुद की लिस्टिंग नहीं खरीद सकते' : '❌ You cannot buy your own listing');
    return;
  }

  const qtyStr = prompt(hi ? `${listing.nameHi} - कितने क्विंटल चाहिए? (उपलब्ध: ${listing.qty})` : `${listing.name} - How many quintals? (Available: ${listing.qty})`, '5');
  if (!qtyStr || isNaN(qtyStr) || +qtyStr <= 0) return;
  const qty = Math.min(+qtyStr, listing.qty);

  const addressPrompt = prompt(hi ? 'डिलीवरी पता दर्ज करें:' : 'Enter delivery address:', currentUser.location || '');
  if (!addressPrompt) return;

  const buyer = currentUser.name;

  // Find seller phone from users list
  const users = getUsers();
  const sellerUser = users.find(u => u.name === listing.seller);
  const sellerPhone = sellerUser ? sellerUser.phone : '';

  const order = {
    id: orderNextId++,
    listing: { ...listing },
    qty,
    totalPrice: qty * listing.price,
    status: 'placed',
    buyer,
    buyerPhone: currentUser.phone,
    seller: listing.seller,
    sellerPhone: sellerPhone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [{ status: 'placed', time: new Date().toISOString() }],
    deliveryAddress: addressPrompt,
    paymentMethod: 'Cash on Delivery'
  };

  // Add to current user's orders
  orders.unshift(order);
  saveOrders();

  // Also add to seller's orders if seller is a different user
  if (sellerPhone && sellerPhone !== currentUser.phone) {
    const sellerKey = getOrderStorageKey(sellerPhone);
    let sellerOrders = [];
    const saved = localStorage.getItem(sellerKey);
    if (saved) { try { sellerOrders = JSON.parse(saved); } catch(e) {} }
    sellerOrders.unshift(order);
    localStorage.setItem(sellerKey, JSON.stringify(sellerOrders));
  }

  // Update master list
  let allOrders = loadAllOrders();
  allOrders.unshift(order);
  localStorage.setItem('fc_orders_all', JSON.stringify(allOrders));

  renderOrders();
  showToast(hi ? `✅ ऑर्डर #${order.id} सफलतापूर्वक दिया गया!` : `✅ Order #${order.id} placed successfully!`);

  // Navigate to orders section
  document.querySelector('[data-section="orders"]').click();
}

function viewOrderDetail(orderId) {
  const hi = lang === 'hi';
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const currentUser = getCurrentUser();
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.phone === ADMIN_PHONE);

  const statusInfo = ORDER_STATUSES.find(s => s.key === order.status) || ORDER_STATUSES[0];
  const isCancelled = order.status === 'cancelled';

  // Determine user's role in this order
  let roleLabel = '';
  if (currentUser) {
    if (order.buyerPhone === currentUser.phone) roleLabel = hi ? '(आप खरीदार हैं)' : '(You are the Buyer)';
    else if (order.sellerPhone === currentUser.phone) roleLabel = hi ? '(आप विक्रेता हैं)' : '(You are the Seller)';
    else if (isAdmin) roleLabel = hi ? '(एडमिन व्यू)' : '(Admin View)';
  }

  const content = document.getElementById('orderDetailContent');
  content.innerHTML = `
    <div class="order-detail-header-info">
      <div>
        <span class="order-detail-id">${hi ? 'ऑर्डर' : 'Order'} #${order.id}</span>
        ${roleLabel ? `<span style="font-size:0.8rem;color:var(--text-muted);margin-left:8px">${roleLabel}</span>` : ''}
      </div>
      <span class="order-detail-date">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
    </div>

    <div class="order-detail-product">
      <span class="order-detail-emoji">${order.listing.emoji}</span>
      <div>
        <div class="order-detail-product-name">${hi ? order.listing.nameHi : order.listing.name}</div>
        <div class="order-detail-seller">${hi ? 'विक्रेता' : 'Seller'}: ${order.seller}</div>
        <div class="order-detail-buyer">${hi ? 'खरीदार' : 'Buyer'}: ${order.buyer}</div>
      </div>
    </div>

    <div class="order-detail-grid">
      <div class="order-detail-field">
        <span class="odf-label">${hi ? 'मात्रा' : 'Quantity'}</span>
        <span class="odf-value">${order.qty} Qt</span>
      </div>
      <div class="order-detail-field">
        <span class="odf-label">${hi ? 'मूल्य प्रति क्विंटल' : 'Price/Qt'}</span>
        <span class="odf-value">₹${order.listing.price.toLocaleString()}</span>
      </div>
      <div class="order-detail-field">
        <span class="odf-label">${hi ? 'कुल राशि' : 'Total Amount'}</span>
        <span class="odf-value" style="color:var(--primary-glow);font-size:1.2rem">₹${order.totalPrice.toLocaleString()}</span>
      </div>
    </div>

    <div class="order-detail-field" style="margin-top:16px">
      <span class="odf-label">📍 ${hi ? 'डिलीवरी पता' : 'Delivery Address'}</span>
      <span class="odf-value">${order.deliveryAddress}</span>
    </div>

    <h4 style="margin:24px 0 12px;font-family:var(--font-heading)">${hi ? '📦 ट्रैकिंग टाइमलाइन' : '📦 Tracking Timeline'}</h4>
    <div class="order-timeline">
      ${order.timeline.map((t, i) => {
        const si = ORDER_STATUSES.find(s => s.key === t.status) || { icon: '❌', label: 'Cancelled', labelHi: 'रद्द', color: 'var(--red)' };
        const isLast = i === order.timeline.length - 1;
        return `<div class="timeline-item ${isLast ? 'timeline-current' : ''}">
          <div class="timeline-dot" style="background:${si.color}">${si.icon}</div>
          <div class="timeline-content">
            <div class="timeline-label">${hi ? si.labelHi : si.label}</div>
            <div class="timeline-time">${new Date(t.time).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</div>
          </div>
        </div>`;
      }).join('')}
      ${!isCancelled && order.status !== 'delivered' ? ORDER_STATUSES.slice(order.timeline.length).map(s => `<div class="timeline-item timeline-pending">
        <div class="timeline-dot timeline-dot-pending">${s.icon}</div>
        <div class="timeline-content">
          <div class="timeline-label" style="color:var(--text-muted)">${hi ? s.labelHi : s.label}</div>
          <div class="timeline-time" style="color:var(--text-muted)">${hi ? 'लंबित' : 'Pending'}</div>
        </div>
      </div>`).join('') : ''}
    </div>
    
    ${(['shipped', 'out_for_delivery'].includes(order.status) && !isCancelled) ? `
      <div style="margin-top: 24px; padding: 16px; background: rgba(52,152,219,0.05); border: 1px solid rgba(52,152,219,0.2); border-radius: var(--radius-sm);">
        <h4 style="margin: 0 0 12px; font-family: var(--font-heading); color: var(--blue);">🛰️ ${hi ? 'लाइव जीपीएस ट्रैकिंग' : 'Live GPS Tracking'}</h4>
        ${order.trackingNumber ? `
          <div style="font-size: 0.9rem; margin-bottom: 12px;">
            <strong>${hi ? 'कूरियर' : 'Courier'}:</strong> ${order.courierName} | <strong>AWB:</strong> ${order.trackingNumber}
            <a href="https://www.google.com/search?q=track+${order.courierName}+${order.trackingNumber}" target="_blank" style="margin-left: 12px; color: var(--blue); font-weight: 600; text-decoration: underline;">${hi ? 'बाहरी ट्रैक करें' : 'Track Externally'}</a>
          </div>
        ` : ''}
        <div id="trackingMap" style="height: 220px; width: 100%; border-radius: 8px; z-index: 1;"></div>
      </div>
    ` : ''}
  `;

  document.getElementById('orderDetailModal').style.display = 'flex';
  
  // Initialize Leaflet map if applicable
  if (['shipped', 'out_for_delivery'].includes(order.status) && !isCancelled && typeof L !== 'undefined') {
    setTimeout(() => {
      // Clear previous map instance if exists
      const container = L.DomUtil.get('trackingMap');
      if(container != null){ container._leaflet_id = null; }
      
      const map = L.map('trackingMap').setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      // Simulated coordinates
      const sellerPos = [28.6139, 77.2090]; // Delhi
      const buyerPos = [19.0760, 72.8777]; // Mumbai
      // If shipped, middle of the route. If out for delivery, near destination.
      const curPos = order.status === 'shipped' ? [23.2599, 77.4126] : [19.2, 72.9]; 
      
      L.marker(sellerPos).addTo(map).bindPopup('Seller Location');
      L.marker(buyerPos).addTo(map).bindPopup('Delivery Address');
      
      const truckIcon = L.divIcon({ html: '<div style="font-size:24px; text-shadow:0 2px 4px rgba(0,0,0,0.4);">🚛</div>', className: 'truck-icon', iconSize: [30, 30] });
      L.marker(curPos, { icon: truckIcon }).addTo(map).bindPopup('Current Location').openPopup();
      
      L.polyline([sellerPos, curPos, buyerPos], {color: '#3498db', weight: 4, dashArray: '5, 10'}).addTo(map);
      map.fitBounds([sellerPos, buyerPos], { padding: [30, 30] });
    }, 400);
  }
}

function cancelOrder(orderId) {
  const hi = lang === 'hi';
  if (!confirm(hi ? 'क्या आप यह ऑर्डर रद्द करना चाहते हैं?' : 'Are you sure you want to cancel this order?')) return;

  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();
  order.timeline.push({ status: 'cancelled', time: new Date().toISOString() });
  saveOrders();

  // Also update the other party's order list
  syncOrderToOtherParty(order);

  renderOrders();
  showToast(hi ? `❌ ऑर्डर #${orderId} रद्द कर दिया गया` : `❌ Order #${orderId} has been cancelled`);
}

function advanceOrderStatus(orderId) {
  const hi = lang === 'hi';
  const order = orders.find(o => o.id === orderId);
  if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

  const currentIdx = ORDER_STATUSES.findIndex(s => s.key === order.status);
  if (currentIdx < ORDER_STATUSES.length - 1) {
    const next = ORDER_STATUSES[currentIdx + 1];
    
    // Prompt for real tracking data if advancing to Shipped
    if (next.key === 'shipped') {
      const courier = prompt(hi ? 'कूरियर कंपनी का नाम दर्ज करें (उदा: Delhivery, BlueDart):' : 'Enter Courier Name (e.g. Delhivery, BlueDart):');
      const awb = prompt(hi ? 'ट्रैकिंग नंबर (AWB) दर्ज करें:' : 'Enter Tracking Number (AWB):');
      if (courier) order.courierName = courier;
      if (awb) order.trackingNumber = awb;
    }
    
    order.status = next.key;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({ status: next.key, time: new Date().toISOString() });
    saveOrders();

    // Also update the other party's order list
    syncOrderToOtherParty(order);

    renderOrders();
    showToast(`${next.icon} ${hi ? 'ऑर्डर स्टेटस अपडेट:' : 'Order status updated:'} ${hi ? next.labelHi : next.label}`);
  }
}


// Sync an updated order to the other party (buyer/seller)
function syncOrderToOtherParty(order) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const otherPhones = [];
  if (order.buyerPhone && order.buyerPhone !== currentUser.phone) otherPhones.push(order.buyerPhone);
  if (order.sellerPhone && order.sellerPhone !== currentUser.phone) otherPhones.push(order.sellerPhone);

  otherPhones.forEach(phone => {
    const key = getOrderStorageKey(phone);
    let otherOrders = [];
    const saved = localStorage.getItem(key);
    if (saved) { try { otherOrders = JSON.parse(saved); } catch(e) {} }

    const idx = otherOrders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      otherOrders[idx] = { ...order };
    } else {
      otherOrders.unshift(order);
    }
    localStorage.setItem(key, JSON.stringify(otherOrders));
  });

  // Also update master list
  let allOrders = loadAllOrders();
  const masterIdx = allOrders.findIndex(o => o.id === order.id);
  if (masterIdx >= 0) {
    allOrders[masterIdx] = { ...order };
  } else {
    allOrders.unshift(order);
  }
  localStorage.setItem('fc_orders_all', JSON.stringify(allOrders));
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initOrders);
