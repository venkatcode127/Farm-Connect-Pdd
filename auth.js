// ===== FarmConnect AI - Authentication & Admin System =====
const MASTER_PHONE = '9347815378'; // Your admin phone number
const MASTER_PASS = 'FARMERuse9347@'; // Your admin password

function getUsers() { return JSON.parse(localStorage.getItem('fc_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('fc_users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('fc_current_user') || 'null'); }
function setCurrentUser(user) { localStorage.setItem('fc_current_user', JSON.stringify(user)); }

// Seed admin account on first load
(function seedAdmin() {
  let users = getUsers();
  if (!users.find(u => u.phone === MASTER_PHONE)) {
    users.push({ name: 'Admin', phone: MASTER_PHONE, password: MASTER_PASS, role: 'admin', location: 'India (All Access)', registered: new Date().toISOString() });
    saveUsers(users);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (user) { loginSuccess(user); } else { showAuthScreen(); }

  // Toggle between login and register forms
  document.getElementById('showRegister').onclick = e => { e.preventDefault(); document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block'; };
  document.getElementById('showLogin').onclick = e => { e.preventDefault(); document.getElementById('registerForm').style.display = 'none'; document.getElementById('loginForm').style.display = 'block'; };

  // Login handler
  document.getElementById('loginBtn').onclick = () => {
    const phone = document.getElementById('loginPhone').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    errEl.style.display = 'none';
    if (phone.length !== 10) { showAuthError(errEl, '⚠️ Enter a valid 10-digit mobile number'); return; }
    if (!pass) { showAuthError(errEl, '⚠️ Please enter your password'); return; }
    const users = getUsers();
    const user = users.find(u => u.phone === phone);
    if (!user) { showAuthError(errEl, '❌ No account found with this number. Please register first.'); return; }
    if (user.password !== pass) { showAuthError(errEl, '❌ Incorrect password. Please try again.'); return; }
    setCurrentUser(user);
    loginSuccess(user);
  };

  // Register handler
  document.getElementById('registerBtn').onclick = () => {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const location = document.getElementById('regLocation').value.trim();
    const errEl = document.getElementById('regError');
    errEl.style.display = 'none';
    
    // Validation
    const nameRegex = /^[a-zA-Z\s]{3,40}$/;
    if (!name || !nameRegex.test(name)) { showAuthError(errEl, '⚠️ Please enter a valid real name (letters only, min 3 chars)'); return; }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) { showAuthError(errEl, '⚠️ Enter a valid 10-digit Indian mobile number'); return; }
    
    if (pass.length < 4) { showAuthError(errEl, '⚠️ Password must be at least 4 characters'); return; }
    if (!location || location.length < 3) { showAuthError(errEl, '⚠️ Please enter a valid location'); return; }
    
    let users = getUsers();
    if (users.find(u => u.phone === phone)) { showAuthError(errEl, '❌ This number is already registered. Please login.'); return; }
    
    // Register
    const isAdmin = phone === MASTER_PHONE;
    const newUser = { 
      name, 
      phone, 
      password: pass, 
      role: isAdmin ? 'admin' : role, 
      location, 
      registered: new Date().toISOString() 
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    loginSuccess(newUser);
    showToast('✅ Account created successfully!');
  };

  // Forgot Password handlers
  document.getElementById('showForgot').onclick = e => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'block';
  };

  document.getElementById('backToLoginFromForgot').onclick = e => {
    e.preventDefault();
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  };

  document.getElementById('resetPasswordBtn').onclick = () => {
    const phone = document.getElementById('forgotPhone').value.trim();
    const newPass = document.getElementById('forgotNewPassword').value;
    const errEl = document.getElementById('forgotError');
    errEl.style.display = 'none';

    if (phone.length !== 10) { showAuthError(errEl, '⚠️ Enter a valid 10-digit mobile number'); return; }
    if (newPass.length < 4) { showAuthError(errEl, '⚠️ Password must be at least 4 characters'); return; }

    let users = getUsers();
    const userIndex = users.findIndex(u => u.phone === phone);
    if (userIndex === -1) {
      showAuthError(errEl, '❌ No account found with this number.');
      return;
    }

    users[userIndex].password = newPass;
    saveUsers(users);
    showToast('✅ Password reset successfully! Please login.');
    
    // Reset forms
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('forgotPhone').value = '';
    document.getElementById('forgotNewPassword').value = '';
  };

  // Change Password Modal handlers
  document.getElementById('changePasswordBtn').onclick = () => {
    document.getElementById('profileDropdown').classList.remove('open');
    document.getElementById('changePasswordModal').style.display = 'flex';
  };

  document.getElementById('closeChangePasswordModal').onclick = () => {
    document.getElementById('changePasswordModal').style.display = 'none';
  };

  document.getElementById('submitChangePasswordBtn').onclick = () => {
    const currentPass = document.getElementById('cpCurrent').value;
    const newPass = document.getElementById('cpNew').value;
    const errEl = document.getElementById('cpError');
    errEl.style.display = 'none';

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (currentUser.password !== currentPass) { showAuthError(errEl, '❌ Current password is incorrect'); return; }
    if (newPass.length < 4) { showAuthError(errEl, '⚠️ New password must be at least 4 characters'); return; }

    let users = getUsers();
    const userIndex = users.findIndex(u => u.phone === currentUser.phone);
    if (userIndex !== -1) {
      users[userIndex].password = newPass;
      saveUsers(users);
      currentUser.password = newPass;
      setCurrentUser(currentUser);
      
      showToast('✅ Password changed successfully!');
      document.getElementById('changePasswordModal').style.display = 'none';
      document.getElementById('cpCurrent').value = '';
      document.getElementById('cpNew').value = '';
    }
  };

  // Logout
  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('fc_current_user');
    location.reload();
  };

  // Profile dropdown toggle
  document.getElementById('userAvatar').onclick = e => {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('open');
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('.user-profile')) document.getElementById('profileDropdown').classList.remove('open');
  });
});

function showAuthError(el, msg) { el.textContent = msg; el.style.display = 'block'; }

function showAuthScreen() {
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('navbar').style.display = 'none';
  document.querySelector('.main-content').style.display = 'none';
  const footer = document.querySelector('.footer');
  if (footer) footer.style.display = 'none';
}

function loginSuccess(user) {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('navbar').style.display = '';
  document.querySelector('.main-content').style.display = '';
  const footer = document.querySelector('.footer');
  if (footer) footer.style.display = '';

  // Show user profile in navbar
  document.getElementById('userProfile').style.display = 'block';
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  document.getElementById('profilePhone').textContent = '+91 ' + user.phone;

  // Admin access control
  const isAdmin = user.role === 'admin' || user.phone === MASTER_PHONE;
  document.querySelectorAll('.admin-only').forEach(el => el.style.display = isAdmin ? '' : 'none');

  if (isAdmin) {
    initAdminPanel();
    showToast('👑 Welcome Admin! Full access granted.');
  } else {
    showToast('👋 Welcome, ' + user.name + '!');
  }

  // Reload orders for the logged-in user
  if (typeof initOrders === 'function') {
    initOrders();
  }
}

// ===== ADMIN PANEL =====
function initAdminPanel() {
  const users = getUsers();
  const nonAdminUsers = users.filter(u => u.role !== 'admin');
  document.getElementById('adminUserCount').textContent = nonAdminUsers.length;
  document.getElementById('adminListingCount').textContent = listings.length;
  renderAdminUsers();
  renderAdminListings();
  renderAdminOrders();
}

function renderAdminUsers() {
  const users = getUsers();
  // Hide admin accounts from the users table — admin is only in admin section
  const visibleUsers = users.filter(u => u.role !== 'admin');
  const tbody = document.getElementById('adminUsersBody');
  if (visibleUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No registered users yet</td></tr>';
    return;
  }
  tbody.innerHTML = visibleUsers.map(u => `<tr>
    <td><strong>${u.name}</strong></td>
    <td>+91 ${u.phone}</td>
    <td><span class="role-badge role-${u.role}">${u.role.toUpperCase()}</span></td>
    <td>${u.location}</td>
    <td>${new Date(u.registered).toLocaleDateString('en-IN')}</td>
    <td>
      <button class="btn-small btn-danger" onclick="deleteUser('${u.phone}')">🗑️ Remove</button>
      <button class="btn-small btn-warn" onclick="makeAdmin('${u.phone}')">👑 Make Admin</button>
    </td>
  </tr>`).join('');
}

function renderAdminListings() {
  const tbody = document.getElementById('adminListingsBody');
  tbody.innerHTML = listings.map(l => `<tr>
    <td>${l.emoji} ${l.name}</td>
    <td>${l.seller}</td>
    <td>${l.qty}</td>
    <td>₹${l.price.toLocaleString()}</td>
    <td>${l.location}</td>
    <td>${l.contact || 'N/A'}</td>
    <td>
      <button class="btn-small btn-danger" onclick="deleteListing(${l.id})">🗑️ Delete</button>
      <button class="btn-small btn-edit" onclick="editListingPrice(${l.id})">✏️ Edit Price</button>
    </td>
  </tr>`).join('');
}

function renderAdminOrders() {
  const tbody = document.getElementById('adminOrdersBody');
  if (!tbody) return; // Element not in DOM yet

  const allOrders = loadAllOrders();
  if (allOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:24px">No orders yet</td></tr>';
    return;
  }

  // Update admin order count
  const adminOrderCountEl = document.getElementById('adminOrderCount');
  if (adminOrderCountEl) adminOrderCountEl.textContent = allOrders.length;

  tbody.innerHTML = allOrders.map(o => {
    const statusInfo = ORDER_STATUSES.find(s => s.key === o.status) || { icon: '❓', label: o.status };
    const isCancelled = o.status === 'cancelled';
    const isDelivered = o.status === 'delivered';
    const statusClass = isCancelled ? 'status-cancelled' : isDelivered ? 'status-delivered' : 'status-active';

    return `<tr>
      <td><strong>#${o.id}</strong></td>
      <td>${o.listing.emoji} ${o.listing.name}</td>
      <td>${o.buyer || 'N/A'}</td>
      <td>${o.seller || 'N/A'}</td>
      <td>₹${o.totalPrice.toLocaleString()}</td>
      <td><span class="order-status-badge-sm ${statusClass}">${statusInfo.icon} ${statusInfo.label}</span></td>
      <td>
        ${!isCancelled && !isDelivered ? `<button class="btn-small" style="background:rgba(46,204,113,0.12);color:var(--green)" onclick="adminAdvanceOrder(${o.id})">⏩ Advance</button>` : ''}
        ${!isCancelled && !isDelivered ? `<button class="btn-small btn-danger" onclick="adminCancelOrder(${o.id})">❌ Cancel</button>` : ''}
        <button class="btn-small btn-edit" onclick="viewOrderDetail(${o.id})">📋 Details</button>
      </td>
    </tr>`;
  }).join('');
}

function adminAdvanceOrder(orderId) {
  // Load all orders, find and advance
  let allOrders = loadAllOrders();
  const order = allOrders.find(o => o.id === orderId);
  if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

  const currentIdx = ORDER_STATUSES.findIndex(s => s.key === order.status);
  if (currentIdx < ORDER_STATUSES.length - 1) {
    const next = ORDER_STATUSES[currentIdx + 1];
    order.status = next.key;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({ status: next.key, time: new Date().toISOString() });

    // Save to master
    localStorage.setItem('fc_orders_all', JSON.stringify(allOrders));

    // Sync to buyer and seller
    syncOrderToParties(order);

    // Reload current view
    orders = loadOrdersForUser();
    renderOrders();
    renderAdminOrders();
    showToast(`${next.icon} Order #${orderId} status: ${next.label}`);
  }
}

function adminCancelOrder(orderId) {
  if (!confirm('Cancel this order?')) return;

  let allOrders = loadAllOrders();
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();
  order.timeline.push({ status: 'cancelled', time: new Date().toISOString() });

  localStorage.setItem('fc_orders_all', JSON.stringify(allOrders));
  syncOrderToParties(order);

  orders = loadOrdersForUser();
  renderOrders();
  renderAdminOrders();
  showToast(`❌ Order #${orderId} has been cancelled`);
}

function syncOrderToParties(order) {
  const phones = [order.buyerPhone, order.sellerPhone].filter(Boolean);
  phones.forEach(phone => {
    const key = getOrderStorageKey(phone);
    let userOrders = [];
    const saved = localStorage.getItem(key);
    if (saved) { try { userOrders = JSON.parse(saved); } catch(e) {} }

    const idx = userOrders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      userOrders[idx] = { ...order };
    } else {
      userOrders.unshift(order);
    }
    localStorage.setItem(key, JSON.stringify(userOrders));
  });
}

function deleteUser(phone) {
  if (phone === MASTER_PHONE) { showToast('❌ Cannot remove the primary admin'); return; }
  if (!confirm('Remove this user?')) return;
  let users = getUsers();
  users = users.filter(u => u.phone !== phone);
  saveUsers(users);
  initAdminPanel();
  showToast('✅ User removed successfully');
}

function makeAdmin(phone) {
  if (!confirm('Grant admin rights to this user?')) return;
  let users = getUsers();
  const u = users.find(u => u.phone === phone);
  if (u) { u.role = 'admin'; saveUsers(users); }
  initAdminPanel();
  showToast('👑 User promoted to admin');
}

function deleteListing(id) {
  if (!confirm('Delete this listing?')) return;
  listings = listings.filter(l => l.id !== id);
  saveListings();
  renderListings();
  initAdminPanel();
  showToast('✅ Listing deleted');
}

function editListingPrice(id) {
  const item = listings.find(l => l.id === id);
  if (!item) return;
  const newPrice = prompt('Enter new price (₹/Quintal) for ' + item.name + ':', item.price);
  if (newPrice && !isNaN(newPrice) && +newPrice > 0) {
    item.price = +newPrice;
    saveListings();
    renderListings();
    initAdminPanel();
    showToast('✅ Price updated to ₹' + (+newPrice).toLocaleString());
  }
}

function exportData() {
  const data = {
    users: getUsers(),
    listings: listings,
    orders: loadAllOrders(),
    exportDate: new Date().toISOString(),
    platform: 'FarmConnect AI'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'farmconnect_data_' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Data exported successfully!');
}

// ===== Admin Add New Product — Full Modal with proper initialization =====
function adminAddNewProduct() {
  const hi = (typeof lang !== 'undefined') ? lang === 'hi' : false;

  // Ensure the sell crop dropdown is populated
  const sel = document.getElementById('sellCrop');
  if (sel) {
    sel.innerHTML = COMMODITIES.map(c => `<option value="${c.id}">${hi ? c.nameHi : c.name}</option>`).join('');
  }

  // Pre-fill admin details
  const currentUser = getCurrentUser();
  if (currentUser) {
    const contactEl = document.getElementById('sellContact');
    const locationEl = document.getElementById('sellLocation');
    if (contactEl) contactEl.value = '+91 ' + currentUser.phone;
    if (locationEl) locationEl.value = currentUser.location || '';
  }

  // Make sure the form submission handler is attached
  const sellForm = document.getElementById('sellForm');
  if (sellForm) {
    // Remove old handler and set new one
    sellForm.onsubmit = function(e) {
      e.preventDefault();
      const cid = document.getElementById('sellCrop').value;
      const com = COMMODITIES.find(c => c.id === cid);
      if (!com) { showToast('❌ Please select a commodity'); return; }

      const qtyVal = document.getElementById('sellQty').value;
      const priceVal = document.getElementById('sellPrice').value;
      const locationVal = document.getElementById('sellLocation').value.trim();
      const contactVal = document.getElementById('sellContact').value.trim();
      const descVal = document.getElementById('sellDesc').value.trim();

      if (!qtyVal || +qtyVal <= 0) { showToast('⚠️ Please enter a valid quantity'); return; }
      if (!priceVal || +priceVal <= 0) { showToast('⚠️ Please enter a valid price'); return; }
      if (!locationVal) { showToast('⚠️ Please enter a location'); return; }
      if (!contactVal) { showToast('⚠️ Please enter a contact number'); return; }

      const user = getCurrentUser();
      const sellerName = user ? user.name : 'Admin';

      listings.unshift({
        id: nextId++,
        crop: cid,
        emoji: com.emoji,
        name: com.name,
        nameHi: com.nameHi || com.name,
        nameTe: com.nameTe || com.name,
        nameTa: com.nameTa || com.name,
        qty: +qtyVal,
        price: +priceVal,
        location: locationVal,
        locationHi: locationVal,
        contact: contactVal,
        desc: descVal || 'Listed by Admin',
        descHi: descVal || 'एडमिन द्वारा लिस्ट',
        seller: sellerName
      });

      saveListings();
      document.getElementById('sellModal').style.display = 'none';
      sellForm.reset();
      document.getElementById('listingCount').textContent = listings.length + ' Items';
      renderListings();
      initAdminPanel();
      showToast(hi ? '✅ नया उत्पाद सफलतापूर्वक जोड़ा गया!' : '✅ New product added successfully!');
    };
  }

  // Open the sell modal
  document.getElementById('sellModal').style.display = 'flex';
}
