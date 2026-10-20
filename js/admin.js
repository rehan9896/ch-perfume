/* ==========================================================================
   Chudhary PERFUMES (Chudharyperfumes.pk)
   EXECUTIVE ADMIN OPERATIONS & POSTEX COURIER INTEGRATION SYSTEM
   ========================================================================== */

const AdminManager = {
  ORDERS_KEY: 'cp_placed_orders',
  INVENTORY_KEY: 'cp_inventory',
  COURIER_KEY: 'cp_courier_config',
  AUTH_KEY: 'cp_admin_authenticated',

  // Admin Credentials
  ADMIN_USER: 'Atiqach',
  ADMIN_PASS: 'atiqachaimen08',

  currentSearchQuery: '',
  currentStatusFilter: 'all',

  // Initial Sample Orders with PostEx Courier Consignment Tracking
  defaultOrders: [
    {
      id: 'CP-9842',
      customerName: 'Hamza Malik',
      phone: '03001234567',
      city: 'Lahore',
      address: 'Gulberg III, Main Boulevard, Lahore',
      items: 'Black Crown (100ml) × 1',
      total: 1990,
      paymentMethod: 'Cash on Delivery',
      date: '2026-08-01 18:30',
      status: 'Pending COD',
      trackingNo: 'PEX-98420192',
      courierPartner: 'PostEx Courier'
    },
    {
      id: 'CP-9843',
      customerName: 'Ayesha Khan',
      phone: '03219876543',
      city: 'Karachi',
      address: 'DHA Phase 6, Khayaban-e-Shahbaz, Karachi',
      items: 'Bold Rush (100ml) × 1, Fresh Aura (100ml) × 1',
      total: 3580,
      paymentMethod: 'Cash on Delivery',
      date: '2026-08-01 19:15',
      status: 'Dispatched',
      trackingNo: 'PEX-74829102',
      courierPartner: 'PostEx Courier'
    },
    {
      id: 'CP-9844',
      customerName: 'Usman Ali',
      phone: '03335557788',
      city: 'Islamabad',
      address: 'Sector F-8/2, Margalla Road, Islamabad',
      items: 'Elite Touch (100ml) × 1',
      total: 2150,
      paymentMethod: 'Cash on Delivery',
      date: '2026-08-01 20:00',
      status: 'Delivered',
      trackingNo: 'PEX-63910284',
      courierPartner: 'PostEx Courier'
    }
  ],

  // Initial Inventory for all 5 Active Fragrances
  defaultInventory: [
    { id: 'black-crown', name: 'Black Crown', category: 'Men Perfumes', price: 2200, stock: 150 },
    { id: 'elite-touch', name: 'Elite Touch', category: 'Men Perfumes', price: 1850, stock: 85 },
    { id: 'bold-rush', name: 'Bold Rush', category: 'Women Perfumes', price: 1900, stock: 120 },
    { id: 'fresh-aura', name: 'Fresh Aura', category: 'Women Perfumes', price: 2100, stock: 95 },
    { id: 'soft-bloom', name: 'Soft Bloom', category: 'Women Perfumes', price: 1750, stock: 100 },
    { id: 'force-mist', name: 'Force Mist', category: 'Unisex Perfumes', price: 2000, stock: 110 }
  ],

  // Default PostEx Courier Integration Setup
  defaultCourierConfig: {
    partner: 'PostEx Courier',
    accountNo: 'PEX-CP-PK-9896',
    apiKey: 'POSTEX_LIVE_KEY_84920',
    status: 'Connected',
    latency: '24ms'
  },

  init() {
    this.ensureData();
    if (!this.checkAuth()) {
      this.showLoginPortal();
    } else {
      this.showAdminDashboard();
    }
  },

  checkAuth() {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  },

  login(user, pass) {
    const u = (user || '').trim().toLowerCase();
    const p = (pass || '').trim();

    if ((u === 'atiqach' || u === 'atiqa' || u === 'admin') && p === 'atiqachaimen08') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      if (window.showToast) window.showToast('Welcome back, Admin!', 'success');
      this.showAdminDashboard();
      return true;
    } else {
      if (window.showToast) window.showToast('Invalid Username or Password!', 'error');
      const errEl = document.getElementById('login-error-msg');
      if (errEl) {
        errEl.textContent = 'Access Denied: Incorrect Username or Password.';
        errEl.style.display = 'block';
      }
      return false;
    }
  },

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    if (window.showToast) window.showToast('Logged out of Admin Portal.', 'info');
    location.reload();
  },

  showLoginPortal() {
    const adminContent = document.getElementById('admin-main-content');
    if (adminContent) adminContent.style.display = 'none';

    let loginModal = document.getElementById('admin-login-modal');
    if (!loginModal) {
      loginModal = document.createElement('div');
      loginModal.id = 'admin-login-modal';
      loginModal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,15,15,0.94); backdrop-filter:blur(16px); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px;';
      document.body.appendChild(loginModal);
    }

    loginModal.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border-gold); padding:40px; border-radius:12px; max-width:440px; width:100%; box-shadow:var(--shadow-lg); text-align:center;">
        <div class="logo-mark" style="width:52px; height:52px; font-size:1.5rem; margin:0 auto 16px auto; border-color:var(--brand-gold); color:var(--brand-gold);">C</div>
        
        <h2 style="font-family:var(--font-heading); font-size:1.7rem; color:var(--text-primary); margin-bottom:6px; font-weight:700; letter-spacing:0.5px;">Atelier Operations Portal</h2>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:24px;">Chudhary Parfums Pakistan • Executive Console</p>

        <div id="login-error-msg" style="display:none; padding:10px; background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#ef4444; border-radius:8px; font-size:0.82rem; font-weight:600; margin-bottom:16px;"></div>

        <form onsubmit="event.preventDefault(); AdminManager.login(document.getElementById('adm-user').value, document.getElementById('adm-pass').value);" style="display:flex; flex-direction:column; gap:16px; text-align:left;">
          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Administrator ID:</label>
            <input type="text" id="adm-user" placeholder="Enter Administrator ID" required style="width:100%; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.92rem; outline:none;">
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Security Key / Password:</label>
            <input type="password" id="adm-pass" placeholder="Enter Password" required style="width:100%; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.92rem; outline:none;">
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; padding:14px; font-weight:700; font-size:0.92rem; margin-top:8px;">Authenticate & Access Console</button>
        </form>

        <div style="margin-top:20px; font-size:0.75rem; color:var(--text-muted); letter-spacing:0.5px;">
          Confidential Atelier Console • Authorized Personnel Only
        </div>
      </div>
    `;
    loginModal.style.display = 'flex';
  },

  SITE_CONFIG_KEY: 'cp_site_config',

  showAdminDashboard() {
    const loginModal = document.getElementById('admin-login-modal');
    if (loginModal) loginModal.style.display = 'none';

    const adminContent = document.getElementById('admin-main-content');
    if (adminContent) adminContent.style.display = 'block';

    this.renderMetrics();
    this.renderCourierCard();
    this.renderOrdersTable();
    this.renderInventoryTable();
    this.loadSiteConfig();
    this.bindEvents();
  },

  loadSiteConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem(this.SITE_CONFIG_KEY)) || {};
      const heroImg = document.getElementById('adm-hero-img');
      const storyImg = document.getElementById('adm-story-img');
      const heroTitle = document.getElementById('adm-hero-title');

      if (heroImg && cfg.heroImg) heroImg.value = cfg.heroImg;
      if (storyImg && cfg.storyImg) storyImg.value = cfg.storyImg;
      if (heroTitle && cfg.heroTitle) heroTitle.value = cfg.heroTitle;
    } catch(e) {}
  },

  saveSiteConfig() {
    const heroImg = document.getElementById('adm-hero-img')?.value.trim() || '';
    const storyImg = document.getElementById('adm-story-img')?.value.trim() || '';
    const heroTitle = document.getElementById('adm-hero-title')?.value.trim() || '';

    const cfg = { heroImg, storyImg, heroTitle };
    localStorage.setItem(this.SITE_CONFIG_KEY, JSON.stringify(cfg));
    if (window.showToast) window.showToast('Website Images & Content updated live!', 'success');
  },

  openAddPerfumeModal() {
    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div style="padding:10px;">
        <h3 style="font-family:var(--font-heading); font-size:1.5rem; color:var(--text-primary); margin-bottom:6px;">Add New Fragrance Flacon</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">Introduce a new handcrafted creation to the online atelier archive.</p>

        <form onsubmit="AdminManager.saveNewPerfume(event)" style="display:flex; flex-direction:column; gap:14px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Perfume Name:</label>
              <input type="text" id="add-p-name" placeholder="e.g. Royal Oud" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Gender Category:</label>
              <select id="add-p-gender" style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Price (PKR):</label>
              <input type="number" id="add-p-price" placeholder="1990" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Stock Count:</label>
              <input type="number" id="add-p-stock" value="100" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Image URL / Path:</label>
            <input type="text" id="add-p-image" placeholder="assets/images/products/black_crown.png or https://..." required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Scent Notes & Description:</label>
            <input type="text" id="add-p-notes" placeholder="Sweet Vanilla • Amber Wood • Damask Rose" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
          </div>

          <div style="display:flex; gap:12px; margin-top:10px;">
            <button type="submit" class="btn btn-primary" style="flex:1; padding:12px;">+ Save Perfume to Store</button>
            <button type="button" class="btn btn-outline" onclick="ShopManager.closeQuickView()" style="padding:12px 20px;">Cancel</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  saveNewPerfume(e) {
    e.preventDefault();
    const name = document.getElementById('add-p-name').value.trim();
    const gender = document.getElementById('add-p-gender').value;
    const price = parseInt(document.getElementById('add-p-price').value, 10) || 1990;
    const stock = parseInt(document.getElementById('add-p-stock').value, 10) || 100;
    const image = document.getElementById('add-p-image').value.trim();
    const notes = document.getElementById('add-p-notes').value.trim();

    const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const category = `${gender} Perfumes`;

    const newItem = {
      id: newId,
      name: name,
      gender: gender,
      category: category,
      price: price,
      originalPrice: price + 900,
      stock: stock,
      image: image,
      notes: notes,
      scentFamily: 'Woody & Floral',
      rating: 4.9,
      reviewsCount: 150
    };

    const inv = this.getInventory();
    inv.unshift(newItem);
    this.saveInventory(inv);

    if (window.ProductCatalog) {
      window.ProductCatalog.unshift(newItem);
    }

    ShopManager.closeQuickView();
    if (window.showToast) window.showToast(`Successfully added ${name} to store!`, 'success');
  },

  openEditPerfumeModal(productId) {
    const inv = this.getInventory();
    const p = inv.find(item => item.id === productId);
    if (!p) return;

    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div style="padding:10px;">
        <h3 style="font-family:var(--font-heading); font-size:1.5rem; color:var(--text-primary); margin-bottom:6px;">Edit Fragrance: ${p.name}</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">Update formulation pricing, flacon stock, and visual assets.</p>

        <form onsubmit="AdminManager.saveEditPerfume(event, '${p.id}')" style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Perfume Name:</label>
            <input type="text" id="edit-p-name" value="${p.name}" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Price (PKR):</label>
              <input type="number" id="edit-p-price" value="${p.price}" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
            </div>

            <div>
              <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Stock Count:</label>
              <input type="number" id="edit-p-stock" value="${p.stock || 100}" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
            </div>
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Image URL / Path:</label>
            <input type="text" id="edit-p-image" value="${p.image || ''}" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">Scent Notes:</label>
            <input type="text" id="edit-p-notes" value="${p.notes || ''}" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.88rem;">
          </div>

          <div style="display:flex; gap:12px; margin-top:10px;">
            <button type="submit" class="btn btn-primary" style="flex:1; padding:12px;">Save Changes</button>
            <button type="button" class="btn btn-outline" onclick="AdminManager.deletePerfume('${p.id}')" style="border-color:#ef4444; color:#ef4444; padding:12px 16px;">Delete Creation</button>
            <button type="button" class="btn btn-outline" onclick="ShopManager.closeQuickView()" style="padding:12px 16px;">Cancel</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  saveEditPerfume(e, productId) {
    e.preventDefault();
    const inv = this.getInventory();
    const p = inv.find(item => item.id === productId);
    if (!p) return;

    p.name = document.getElementById('edit-p-name').value.trim();
    p.price = parseInt(document.getElementById('edit-p-price').value, 10) || p.price;
    p.stock = parseInt(document.getElementById('edit-p-stock').value, 10) || p.stock;
    p.image = document.getElementById('edit-p-image').value.trim();
    p.notes = document.getElementById('edit-p-notes').value.trim();

    this.saveInventory(inv);
    ShopManager.closeQuickView();
    if (window.showToast) window.showToast(`Updated ${p.name} successfully!`, 'success');
  },

  deletePerfume(productId) {
    if (confirm(`Are you sure you want to delete this perfume from the catalog?`)) {
      const inv = this.getInventory().filter(p => p.id !== productId);
      this.saveInventory(inv);
      ShopManager.closeQuickView();
      if (window.showToast) window.showToast(`Perfume deleted`, 'info');
    }
  },

  renderInventoryTable() {
    const tbody = document.getElementById('admin-inventory-tbody');
    if (!tbody) return;

    const inv = this.getInventory();

    tbody.innerHTML = inv.map(p => {
      const maxStock = 150;
      const pct = Math.min(100, Math.round(((p.stock || 0) / maxStock) * 100));
      let barColor = '#2ecc71';
      let statusLabel = 'Healthy Stock';
      if (p.stock < 20) {
        barColor = '#ef4444';
        statusLabel = 'Low Stock Alert!';
      } else if (p.stock < 50) {
        barColor = '#f39c12';
        statusLabel = 'Medium Stock';
      }

      return `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 12px; font-weight: 700; color: var(--brand-gold);">${p.id}</td>
        <td style="padding: 12px; font-weight: 700; color: var(--text-primary);">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${p.image || 'assets/images/products/black_crown.png'}" alt="${p.name}" style="width:36px; height:36px; object-fit:cover; border-radius:6px;">
            <div>
              <div>${p.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">${p.notes || '100ml EDP'}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; color: var(--text-secondary);">${p.category || 'Perfumes'}</td>
        <td style="padding: 12px; font-weight: 700; color: var(--text-primary);">PKR ${(p.price || 0).toLocaleString()}</td>
        <td style="padding: 12px; min-width:180px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:0.78rem;">
            <span style="font-weight:700; color:var(--text-primary);">${p.stock || 0} Units</span>
            <span style="color:${barColor}; font-weight:600; font-size:0.72rem;">${statusLabel}</span>
          </div>
          <div style="width:100%; height:6px; background:var(--bg-secondary); border-radius:3px; overflow:hidden; border:1px solid var(--border-color);">
            <div style="width:${pct}%; height:100%; background:${barColor}; border-radius:3px; transition:width 0.3s ease;"></div>
          </div>
        </td>
        <td style="padding: 12px; text-align: right;">
          <div style="display: flex; justify-content: flex-end; gap: 6px;">
            <button class="btn btn-outline" onclick="AdminManager.openEditPerfumeModal('${p.id}')" style="padding: 4px 10px; font-size: 0.76rem;">✏️ Edit</button>
            <button class="btn btn-outline" onclick="AdminManager.adjustStock('${p.id}', 50)" style="padding: 4px 8px; font-size: 0.76rem;">+50</button>
            <button class="btn btn-outline" onclick="AdminManager.adjustStock('${p.id}', -10)" style="padding: 4px 8px; font-size: 0.76rem;">-10</button>
          </div>
        </td>
      </tr>
    `}).join('');
  },

  bindEvents() {
    const searchInput = document.getElementById('admin-order-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value;
        this.renderOrdersTable();
      });
    }

    const filterSelect = document.getElementById('admin-status-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderOrdersTable();
      });
    }
  },

  ensureData() {
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this.defaultOrders));
    }
    if (!localStorage.getItem(this.INVENTORY_KEY)) {
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(this.defaultInventory));
    }
    if (!localStorage.getItem(this.COURIER_KEY)) {
      localStorage.setItem(this.COURIER_KEY, JSON.stringify(this.defaultCourierConfig));
    }
  },

  getCourierConfig() {
    try {
      return JSON.parse(localStorage.getItem(this.COURIER_KEY)) || this.defaultCourierConfig;
    } catch(e) {
      return this.defaultCourierConfig;
    }
  },

  saveCourierConfig(cfg) {
    localStorage.setItem(this.COURIER_KEY, JSON.stringify(cfg));
    this.renderCourierCard();
  },

  renderCourierCard() {
    const cardEl = document.getElementById('admin-courier-card');
    if (!cardEl) return;

    const cfg = this.getCourierConfig();
    cardEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:var(--bg-secondary); border-radius:8px; border:1px solid var(--border-color); color:var(--brand-gold);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0;">${cfg.partner} Live Logistics API</h4>
              <span class="badge" style="background:rgba(46, 204, 113, 0.15); color:#2ecc71; border:1px solid #2ecc71; font-size:0.75rem;">Connected (${cfg.latency})</span>
            </div>
            <div style="font-size:0.84rem; color:var(--text-muted); margin-top:4px;">Merchant Account: <strong>${cfg.accountNo}</strong> &nbsp;•&nbsp; Active Partner for Nationwide COD</div>
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn btn-outline" onclick="AdminManager.openCourierSetupModal()" style="font-size:0.82rem; padding:8px 16px;">Configure Logistics API</button>
        </div>
      </div>
    `;
  },

  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.ORDERS_KEY)) || [];
    } catch(e) {
      return this.defaultOrders;
    }
  },

  saveOrders(orders) {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    this.renderMetrics();
    this.renderOrdersTable();
  },

  getInventory() {
    try {
      return JSON.parse(localStorage.getItem(this.INVENTORY_KEY)) || [];
    } catch(e) {
      return this.defaultInventory;
    }
  },

  saveInventory(inv) {
    localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inv));
    this.renderMetrics();
    this.renderInventoryTable();
  },

  pollingInterval: null,

  showAdminDashboard() {
    const loginModal = document.getElementById('admin-login-modal');
    if (loginModal) loginModal.style.display = 'none';

    const adminContent = document.getElementById('admin-main-content');
    if (adminContent) adminContent.style.display = 'block';

    this.renderMetrics();
    this.renderCourierCard();
    this.renderOrdersTable();
    this.renderInventoryTable();
    this.loadSiteConfig();
    this.bindEvents();

    // Start 2.5-second Real-Time Live Polling Loop
    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => {
        this.renderMetrics();
        this.renderOrdersTable();
        this.renderInventoryTable();
      }, 2500);
    }
  },

  renderMetrics() {
    const orders = this.getOrders();
    const inv = this.getInventory();

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const goingOrders = orders.filter(o => o.status === 'Dispatched' || o.status === 'Processing');
    const goingCount = goingOrders.length;
    const goingAmount = goingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'Pending COD');
    const pendingCount = pendingOrders.length;
    const pendingAmount = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const totalUnits = inv.reduce((sum, i) => sum + (i.stock || 0), 0);

    const salesEl = document.getElementById('admin-total-sales');
    if (salesEl) salesEl.textContent = `PKR ${totalSales.toLocaleString()}`;

    const clearedEl = document.getElementById('admin-cleared-payments');
    if (clearedEl) clearedEl.textContent = `✓ PKR ${totalSales.toLocaleString()} Placed Total`;

    const goingEl = document.getElementById('admin-going-orders');
    if (goingEl) goingEl.textContent = `${goingCount} Going`;

    const goingAmtEl = document.getElementById('admin-going-amount');
    if (goingAmtEl) goingAmtEl.textContent = `PKR ${goingAmount.toLocaleString()} In Transit`;

    const pendingEl = document.getElementById('admin-pending-orders');
    if (pendingEl) pendingEl.textContent = `${pendingCount} Pending`;

    const pendingCashEl = document.getElementById('admin-pending-cash');
    if (pendingCashEl) pendingCashEl.textContent = `PKR ${pendingAmount.toLocaleString()} Awaiting Pickup`;

    const invEl = document.getElementById('admin-total-fragrances');
    if (invEl) invEl.textContent = `${totalUnits} Units`;

    const stockSumEl = document.getElementById('admin-stock-summary');
    if (stockSumEl) stockSumEl.textContent = `${inv.length} Fragrances Active`;
  },

  getFilteredOrders() {
    const orders = this.getOrders();
    const query = this.currentSearchQuery.toLowerCase().trim();
    const filter = this.currentStatusFilter.toLowerCase().trim();

    return orders.filter(o => {
      const matchesSearch = !query || 
        o.id.toLowerCase().includes(query) || 
        o.customerName.toLowerCase().includes(query) || 
        (o.phone && o.phone.toLowerCase().includes(query)) ||
        (o.trackingNo && o.trackingNo.toLowerCase().includes(query)) ||
        (o.city && o.city.toLowerCase().includes(query));

      const matchesStatus = filter === 'all' || o.status.toLowerCase().includes(filter);

      return matchesSearch && matchesStatus;
    });
  },

  renderOrdersTable() {
    const tbody = document.getElementById('admin-orders-tbody');
    if (!tbody) return;

    const filtered = this.getFilteredOrders();

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="padding: 32px; text-align: center; color: var(--text-muted);">
            No orders match your search criteria. Click "+ Simulate New Order" to create a PostEx order.
          </td>
        </tr>
      `;
      return;
    }

    const cfg = this.getCourierConfig();

    tbody.innerHTML = filtered.map(o => {
      const cleanPhone = (o.phone || '').replace(/[^0-9]/g, '');
      const waPhone = cleanPhone.startsWith('03') ? '92' + cleanPhone.substring(1) : cleanPhone;
      const trackingCN = o.trackingNo || ('PEX-' + Math.floor(10000000 + Math.random()*90000000));
      const pmLabel = o.paymentMethod || 'Cash on Delivery';
      const hasSS = !!o.paymentProof;
      const paymentNote = pmLabel === 'Cash on Delivery' ? `Total PKR ${o.total.toLocaleString()} (Cash on Delivery)` : `Total PKR ${o.total.toLocaleString()} (Paid via ${pmLabel})`;
      const waMsg = encodeURIComponent(`Hello ${o.customerName}! Your order #${o.id} from Chudhary Perfumes is currently [${o.status}]. Tracking Number: ${trackingCN} via PostEx Courier to ${o.city}. ${paymentNote}. Thank you for shopping with Chudhary Perfumes!`);

      return `
        <tr style="border-bottom: 1px solid var(--border-color);">
          <td style="padding: 14px 12px; font-weight: 700; color: var(--brand-gold);">${o.id}</td>
          <td style="padding: 14px 12px;">
            <div style="font-weight: 700; color: var(--text-primary);">${o.customerName}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${o.phone || '03403256108'} • <strong style="color:var(--text-primary);">${o.city || 'Pakistan'}</strong></div>
            <div style="font-size: 0.74rem; color: var(--text-muted);">${o.address || ''}</div>
          </td>
          <td style="padding: 14px 12px; font-size:0.85rem; color: var(--text-secondary);">${o.items}</td>
          <td style="padding: 14px 12px;">
            <div style="font-weight: 800; color: var(--brand-gold);">PKR ${o.total.toLocaleString()}</div>
            <div style="font-size: 0.73rem; color: var(--text-muted); margin-top: 2px;">${pmLabel}</div>
            ${hasSS ? `
              <button type="button" onclick="AdminManager.viewPaymentProof('${o.id}')" style="margin-top:5px; display:inline-flex; align-items:center; gap:4px; padding:3px 8px; font-size:0.72rem; font-weight:700; background:rgba(46,204,113,0.12); border:1px solid #2ecc71; color:#2ecc71; border-radius:4px; cursor:pointer;" title="View Attached Payment Screenshot">
                📸 View SS
              </button>
            ` : (pmLabel !== 'Cash on Delivery' ? `
              <span style="font-size:0.68rem; color:#e67e22; display:block; margin-top:4px;">No SS Attached</span>
            ` : '')}
          </td>
          <td style="padding: 14px 12px;">
            <div style="font-size: 0.8rem; font-weight:700; color:var(--text-primary);">${trackingCN}</div>
            <div style="font-size: 0.72rem; color:var(--text-muted);">${o.courierPartner || cfg.partner}</div>
          </td>
          <td style="padding: 14px 12px;">
            <select onchange="AdminManager.updateOrderStatus('${o.id}', this.value)" style="padding: 6px 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); font-size: 0.8rem; font-weight: 600;">
              <option value="Pending COD" ${o.status === 'Pending COD' ? 'selected' : ''}>Pending COD</option>
              <option value="Payment Verified (SS Attached)" ${o.status === 'Payment Verified (SS Attached)' ? 'selected' : ''}>Payment Verified (SS Attached)</option>
              <option value="Awaiting Payment SS" ${o.status === 'Awaiting Payment SS' ? 'selected' : ''}>Awaiting Payment SS</option>
              <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched (PostEx)</option>
              <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
          <td style="padding: 14px 12px; text-align: right; white-space: nowrap;">
            ${hasSS ? `<button onclick="AdminManager.viewPaymentProof('${o.id}')" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem; border-color: #2ecc71; color: #2ecc71; margin-right: 4px;" title="View Attached Payment Screenshot">📸 SS</button>` : ''}
            <button onclick="AdminManager.openLiveTrackingModal('${o.id}')" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-color: var(--brand-gold); color: var(--brand-gold); margin-right: 4px;" title="Track Consignment">Track</button>
            <a href="https://api.whatsapp.com/send?phone=${waPhone}&text=${waMsg}" target="_blank" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem; border-color: #25D366; color: #25D366; margin-right: 4px;" title="Send WhatsApp Update">WhatsApp</a>
            <button onclick="AdminManager.deleteOrder('${o.id}')" style="background: none; border: none; color: #ef4444; font-size: 0.8rem; cursor: pointer; text-decoration: underline;" title="Delete Order">Remove</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderInventoryTable() {
    const tbody = document.getElementById('admin-inventory-tbody');
    if (!tbody) return;

    const inv = this.getInventory();

    tbody.innerHTML = inv.map(p => `
      <tr style="border-bottom: 1px solid var(--border-color);">
        <td style="padding: 14px 12px; font-weight: 700;">${p.id}</td>
        <td style="padding: 14px 12px; font-weight: 700; color: var(--text-primary);">${p.name}</td>
        <td style="padding: 14px 12px; color: var(--text-secondary);">${p.category}</td>
        <td style="padding: 14px 12px; font-weight: 800; color: var(--brand-gold);">PKR ${p.price.toLocaleString()}</td>
        <td style="padding: 14px 12px;">
          <span class="badge" style="background: ${p.stock > 50 ? 'rgba(46, 204, 113, 0.15)' : 'rgba(241, 196, 15, 0.15)'}; color: ${p.stock > 50 ? '#2ecc71' : '#f1c40f'}; border: 1px solid ${p.stock > 50 ? '#2ecc71' : '#f1c40f'}; font-weight: 700;">
            ${p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'}
          </span>
        </td>
        <td style="padding: 14px 12px; text-align: right; white-space: nowrap;">
          <button onclick="AdminManager.adjustStock('${p.id}', 50)" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.72rem; margin-right: 4px;">+50 Bulk</button>
          <button onclick="AdminManager.adjustStock('${p.id}', 10)" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.72rem; margin-right: 4px;">+10</button>
          <button onclick="AdminManager.adjustStock('${p.id}', -10)" class="btn btn-outline" style="padding: 4px 8px; font-size: 0.72rem; border-color: #ef4444; color: #ef4444;">-10</button>
        </td>
      </tr>
    `).join('');
  },

  openCourierSetupModal() {
    const cfg = this.getCourierConfig();
    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div style="padding:10px;">
        <h3 style="font-family:var(--font-heading); font-size:1.5rem; color:var(--text-primary); margin-bottom:8px;">Connect Logistics API</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:20px;">Integrate PostEx API merchant credentials for automated Cash on Delivery booking & nationwide consignment tracking.</p>

        <form id="admin-courier-form" onsubmit="AdminManager.handleCourierSetupSubmit(event)" style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="display:block; font-size:0.82rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Courier API Partner:</label>
            <select id="courier-partner-select" style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.9rem;">
              <option value="PostEx Courier" selected>PostEx Courier (PostEx COD API v2)</option>
              <option value="TCS Express">TCS Express (TCS Connect API)</option>
              <option value="Leopards Courier">Leopards Courier (Leopards COD API)</option>
              <option value="M&P Express Courier">M&P Express Courier API</option>
            </select>
          </div>

          <div>
            <label style="display:block; font-size:0.82rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">PostEx Merchant Token / Token ID:</label>
            <input type="text" id="courier-acc-input" value="${cfg.accountNo || 'PEX-CP-PK-9896'}" placeholder="e.g. PEX-CP-PK-9896" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.9rem;">
          </div>

          <div>
            <label style="display:block; font-size:0.82rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">PostEx Operational Secret Key:</label>
            <input type="password" id="courier-key-input" value="${cfg.apiKey || 'POSTEX_LIVE_KEY_84920'}" placeholder="e.g. POSTEX_LIVE_KEY_84920" required style="width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:8px; color:var(--text-primary); font-size:0.9rem;">
          </div>

          <div style="display:flex; gap:12px; margin-top:10px;">
            <button type="submit" class="btn btn-primary" style="flex:1;">Save & Verify PostEx API</button>
            <button type="button" class="btn btn-outline" onclick="ShopManager.closeQuickView()" style="padding:10px 20px;">Cancel</button>
          </div>
        </form>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  handleCourierSetupSubmit(e) {
    e.preventDefault();
    const partner = document.getElementById('courier-partner-select').value;
    const acc = document.getElementById('courier-acc-input').value;
    const key = document.getElementById('courier-key-input').value;

    const newCfg = {
      partner: partner,
      accountNo: acc,
      apiKey: key,
      status: 'Connected',
      latency: Math.floor(18 + Math.random()*15) + 'ms'
    };

    this.saveCourierConfig(newCfg);
    ShopManager.closeQuickView();
    if (window.showToast) window.showToast(`Successfully connected to ${partner} API!`, 'success');
  },

  openLiveTrackingModal(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const cfg = this.getCourierConfig();
    const trackingCN = order.trackingNo || ('PEX-' + Math.floor(10000000 + Math.random()*90000000));

    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    const isDelivered = order.status === 'Delivered';
    const isDispatched = order.status === 'Dispatched' || isDelivered;
    const isProcessing = order.status === 'Processing' || isDispatched;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span class="badge" style="background:#2563eb; color:#fff; font-weight:700;">POSTEX COURIER LIVE TRACKING</span>
            <h2 style="font-size:1.6rem; font-family:var(--font-heading); color:var(--text-primary); margin-top:4px; font-weight:800;">CN #${trackingCN}</h2>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.82rem; color:var(--text-muted);">Partner: <strong style="color:var(--brand-gold);">PostEx Courier</strong></div>
            <div style="font-size:0.82rem; color:var(--text-muted);">Est. Delivery: <strong>24 Hours Fast Delivery</strong></div>
          </div>
        </div>

        <div style="background:var(--bg-secondary); padding:16px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:24px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">
            <div><strong>Customer:</strong> ${order.customerName} (${order.phone})</div>
            <div><strong>Destination City:</strong> <span style="color:var(--brand-gold); font-weight:700;">${order.city}</span></div>
            <div><strong>Fragrance Items:</strong> ${order.items}</div>
            <div><strong>PostEx COD Total:</strong> <strong style="color:var(--text-primary);">PKR ${order.total.toLocaleString()}</strong></div>
          </div>
        </div>

        <!-- Logistics Timeline Stepper -->
        <div style="display:flex; flex-direction:column; gap:20px; position:relative; padding-left:24px; border-left:2px solid var(--border-color);">
          
          <div style="position:relative;">
            <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:var(--status-success); border:3px solid var(--bg-card);"></div>
            <div style="font-weight:700; color:var(--text-primary); font-size:0.92rem;">Digital Consignment Booking Generated</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${order.date} • Automatic COD Receipt Printed</div>
          </div>

          <div style="position:relative;">
            <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isProcessing ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
            <div style="font-weight:700; color:${isProcessing ? 'var(--text-primary)' : 'var(--text-muted)'}; font-size:0.92rem;">Macerated Flacon Sealed at Atelier</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${isProcessing ? 'Inspected & Sealed in Fragrance Safeguard Box' : 'Awaiting fulfillment queue'}</div>
          </div>

          <div style="position:relative;">
            <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isDispatched ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
            <div style="font-weight:700; color:${isDispatched ? 'var(--text-primary)' : 'var(--text-muted)'}; font-size:0.92rem;">Transferred to PostEx Courier Logistics</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${isDispatched ? `In Transit at PostEx ${order.city} Regional Hub` : 'Awaiting PostEx pickup courier'}</div>
          </div>

          <div style="position:relative;">
            <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isDelivered ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
            <div style="font-weight:700; color:${isDelivered ? 'var(--status-success)' : 'var(--text-muted)'}; font-size:0.92rem;">Delivered & Remittance Settled</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${isDelivered ? 'Successfully delivered to customer doorstep' : `Assigned to PostEx Courier for delivery in ${order.city}`}</div>
          </div>

        </div>

        <div style="margin-top:28px; text-align:right;">
          <button class="btn btn-primary" onclick="ShopManager.closeQuickView()">Close Tracking Window</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  viewPaymentProof(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (!order.paymentProof) {
      if (window.showToast) window.showToast('No payment screenshot attached for this order.', 'info');
      return;
    }

    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border-color); padding-bottom:10px; flex-wrap:wrap; gap:8px;">
          <div>
            <span class="badge" style="background:rgba(46,204,113,0.15); color:#2ecc71; border:1px solid #2ecc71; font-size:0.75rem; font-weight:700;">
              ✓ DIGITAL PAYMENT SCREENSHOT (SS)
            </span>
            <h2 style="font-size:1.35rem; font-family:var(--font-heading); color:var(--text-primary); margin-top:6px; font-weight:800;">
              Order ${order.id} • ${order.paymentMethod || 'Digital Transfer'}
            </h2>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Amount Settled</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--brand-gold);">PKR ${(order.total || 0).toLocaleString()}</div>
          </div>
        </div>

        <!-- Metadata Card -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:10px; background:var(--bg-secondary); padding:12px 16px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:16px; font-size:0.84rem;">
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Patron Name</div>
            <strong style="color:var(--text-primary);">${order.customerName}</strong>
          </div>
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Phone Number</div>
            <strong style="color:var(--text-primary);">${order.phone || 'N/A'}</strong>
          </div>
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Account Destination</div>
            <strong style="color:var(--text-primary);">${order.paymentTitle || (order.paymentMethod === 'EasyPaisa' ? 'Atiqa Tayyab' : 'Shazia Ishaq')}</strong>
          </div>
          <div>
            <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Transaction ID / TID</div>
            <strong style="color:var(--brand-gold);">${order.trxId || 'Not specified by patron'}</strong>
          </div>
        </div>

        <!-- High Resolution Screenshot Image Preview -->
        <div style="background:#0a0a0a; border:1px solid var(--border-color); border-radius:10px; padding:12px; text-align:center; max-height:480px; overflow-y:auto; margin-bottom:16px;">
          <img src="${order.paymentProof}" alt="Payment Screenshot Receipt" style="max-width:100%; height:auto; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.5); display:inline-block;">
        </div>

        <!-- Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <a href="${order.paymentProof}" download="Payment-Proof-${order.id}.jpg" class="btn btn-outline" style="font-size:0.82rem; padding:8px 16px; border-color:var(--brand-gold); color:var(--brand-gold); text-decoration:none;">
            📥 Download Screenshot
          </a>
          <button type="button" class="btn btn-primary" onclick="ShopManager.closeQuickView()" style="font-size:0.85rem; padding:8px 20px;">
            Done / Close
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);

      // Sync real-time with customer order history
      try {
        const hist = JSON.parse(localStorage.getItem('cp_order_history')) || [];
        const foundHist = hist.find(h => (h.id || h.orderId) === orderId);
        if (foundHist) {
          foundHist.status = newStatus;
          localStorage.setItem('cp_order_history', JSON.stringify(hist));
        }
      } catch(e) {}

      if (window.showToast) window.showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
    }
  },

  deleteOrder(orderId) {
    if (confirm(`Are you sure you want to delete Order ${orderId}?`)) {
      const orders = this.getOrders().filter(o => o.id !== orderId);
      this.saveOrders(orders);
      if (window.showToast) window.showToast(`Order ${orderId} deleted`, 'info');
    }
  },

  adjustStock(productId, amount) {
    const inv = this.getInventory();
    const item = inv.find(p => p.id === productId);
    if (item) {
      item.stock = Math.max(0, item.stock + amount);
      this.saveInventory(inv);
      if (window.showToast) window.showToast(`Stock updated for ${item.name}: ${item.stock} units`, 'success');
    }
  },

  simulateNewOrder() {
    const cfg = this.getCourierConfig();
    const sampleNames = ['Bilal Ahmed', 'Zainab Bibi', 'Farhan Saeed', 'Sara Tariq', 'Omer Chaudhry'];
    const sampleCities = ['Lahore', 'Faisalabad', 'Multan', 'Rawalpindi', 'Peshawar', 'Sialkot'];
    const samplePerfumes = [
      { name: 'Black Crown', price: 2200 },
      { name: 'Elite Touch', price: 1850 },
      { name: 'Bold Rush', price: 1900 },
      { name: 'Fresh Aura', price: 2100 },
      { name: 'Force Mist', price: 2000 }
    ];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
    const randomPerfume = samplePerfumes[Math.floor(Math.random() * samplePerfumes.length)];
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCN = 'PEX-' + Math.floor(10000000 + Math.random()*90000000);

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newOrder = {
      id: `CP-${orderNum}`,
      customerName: randomName,
      phone: `032${Math.floor(1000000 + Math.random() * 9000000)}`,
      city: randomCity,
      address: `House #${Math.floor(1 + Math.random()*200)}, Street #${Math.floor(1 + Math.random()*15)}, ${randomCity}`,
      items: `${randomPerfume.name} (100ml) × 1`,
      total: randomPerfume.price,
      paymentMethod: 'Cash on Delivery',
      date: timeStr,
      status: 'Pending COD',
      trackingNo: trackingCN,
      courierPartner: 'PostEx Courier'
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);
    if (window.showToast) window.showToast(`New Live Order ${newOrder.id} (${trackingCN}) booked via PostEx Courier!`, 'success');
  },

  bindEvents() {
    const searchInput = document.getElementById('admin-order-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchQuery = e.target.value;
        this.renderOrdersTable();
      });
    }

    const filterSelect = document.getElementById('admin-status-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentStatusFilter = e.target.value;
        this.renderOrdersTable();
      });
    }
  }
};

window.AdminManager = AdminManager;
document.addEventListener('DOMContentLoaded', () => AdminManager.init());
