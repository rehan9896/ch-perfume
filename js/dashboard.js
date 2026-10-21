/* ==========================================================================
   CHUDHARY PERFUMES - USER DASHBOARD CONTROLLER (HUMAN REALISM)
   ========================================================================== */

const DashboardManager = {
  init() {
    this.bindTabEvents();
    this.renderOrders();
    this.renderWishlist();
  },

  bindTabEvents() {
    const navItems = document.querySelectorAll('.dash-nav-item');
    const panes = document.querySelectorAll('.dash-pane');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetPane = item.getAttribute('data-tab');

        navItems.forEach(n => n.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        item.classList.add('active');
        const activePane = document.getElementById(`pane-${targetPane}`);
        if (activePane) activePane.classList.add('active');
      });
    });
  },

  renderOrders() {
    const ordersBody = document.getElementById('dash-orders-body');
    if (!ordersBody) return;

    const orders = JSON.parse(localStorage.getItem('cp_order_history')) || [
      {
        orderId: 'CH-001',
        date: 'Jul 28, 2026',
        items: [{ name: 'Bold Rush EDP (50ml)', quantity: 1, price: 18500 }],
        total: 18500,
        status: 'Delivered',
        shippingAddress: 'House 42, Block 5, Gulberg III, Lahore'
      },
      {
        orderId: 'CH-002',
        date: 'Jun 15, 2026',
        items: [{ name: 'Black Crown EDP (50ml)', quantity: 1, price: 24000 }],
        total: 24000,
        status: 'Delivered',
        shippingAddress: 'House 42, Block 5, Gulberg III, Lahore'
      }
    ];

    if (orders.length === 0) {
      ordersBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No order history found.</td></tr>`;
      return;
    }

    ordersBody.innerHTML = orders.map(o => {
      const itemsText = Array.isArray(o.items)
        ? o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
        : (o.items || 'Handcrafted Fragrance');
      const orderNum = o.orderId || o.id || 'CH-001';
      const isDelivered = o.status === 'Delivered';
      const hasSS = !!o.paymentProof;

      return `
        <tr>
          <td>
            <a href="javascript:void(0)" onclick="window.openGlobalOrderTracker ? window.openGlobalOrderTracker('${orderNum}') : null" style="font-weight:700; color:var(--accent-gold); text-decoration:underline; cursor:pointer;" title="Click to Track Live Order">
              ${orderNum}
            </a>
          </td>
          <td>${o.date}</td>
          <td>${itemsText}</td>
          <td style="font-weight:600;">
            <div>PKR ${parseFloat(o.total || 0).toLocaleString()}</div>
            ${o.paymentMethod ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">${o.paymentMethod}</div>` : ''}
          </td>
          <td>
            <span class="status-badge ${isDelivered ? 'status-delivered' : 'status-processing'}">${o.status}</span>
            <button type="button" onclick="window.openGlobalOrderTracker ? window.openGlobalOrderTracker('${orderNum}') : null" class="btn btn-outline" style="margin-top:6px; padding:3px 8px; font-size:0.72rem; border-color:var(--brand-gold); color:var(--brand-gold); display:block; cursor:pointer;">
              Track Order
            </button>
            ${hasSS ? `
              <div style="margin-top:4px; font-size:0.72rem; color:#2ecc71; font-weight:700; display:flex; align-items:center; gap:4px;">
                ✓ SS Attached
              </div>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');
  },

  renderWishlist() {
    const wishlistGrid = document.getElementById('dash-wishlist-grid');
    if (!wishlistGrid) return;

    const items = WishlistManager.getItems();
    if (items.length === 0) {
      wishlistGrid.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--text-muted); font-size:0.9rem;">Your Wishlist is currently empty.</div>`;
      return;
    }

    wishlistGrid.innerHTML = items.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-img-wrapper" style="height:220px; object-fit:cover;">
        <div class="product-info">
          <h4 style="font-family:var(--font-heading); font-size:1.2rem;">${p.name}</h4>
          <div style="color:var(--accent-gold); font-weight:600; margin:6px 0;">PKR ${p.price.toLocaleString()}</div>
          <button class="btn btn-primary" style="width:100%; font-size:0.75rem; margin-top:8px;" onclick="CartManager.addItem(${JSON.stringify(p).replace(/"/g, '&quot;')})">Move to Bag</button>
        </div>
      </div>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => DashboardManager.init());
