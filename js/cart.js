/* ==========================================================================
   CHAUDHARY PARFUMS (Chaudhary Parfums Lahore)
   ARTISANAL SHOPPING BAG & CONCIERGE CONTROLLER
   ========================================================================== */

const CartManager = {
  STORAGE_KEY: 'cp_cart_items',
  discountAmount: 0,
  couponCode: '',
  selectedPaymentMethod: 'Cash on Delivery',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch(e) {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateBadge();
    this.renderDrawer();
  },

  addItem(product, qty = 1) {
    let items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size || '50ml',
        quantity: qty
      });
    }

    this.saveItems(items);
    if (window.showToast) {
      window.showToast(`Added ${product.name} to Shopping Bag`, 'success');
    }
    this.openDrawer();
  },

  removeItem(id) {
    let items = this.getItems().filter(item => item.id !== id);
    this.saveItems(items);
    if (window.showToast) {
      window.showToast('Creation removed from Shopping Bag', 'info');
    }
  },

  updateQuantity(id, change) {
    let items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(id);
        return;
      }
      this.saveItems(items);
    }
  },

  clearCart() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.discountAmount = 0;
    this.couponCode = '';
    this.updateBadge();
    this.renderDrawer();
  },

  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    return Math.max(0, subtotal - this.discountAmount);
  },

  updateBadge() {
    const totalCount = this.getItems().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? 'flex' : 'none';
      el.classList.remove('cart-bounce-active');
      void el.offsetWidth;
      if (totalCount > 0) {
        el.classList.add('cart-bounce-active');
      }
    });
  },

  applyCoupon(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SAVE20' || cleanCode === 'CHAUDHARY20' || cleanCode === 'CHUDHARY20' || cleanCode === 'ROYAL20' || cleanCode === 'PAKISTAN20') {
      this.couponCode = cleanCode;
      this.discountAmount = this.getSubtotal() * 0.20;
      if (window.showToast) window.showToast('20% Atelier Privilege Applied', 'success');
    } else {
      if (window.showToast) window.showToast('Invalid Privilege Code. Use SAVE20', 'error');
    }
    this.renderDrawer();
  },

  setPaymentMethod(method) {
    this.selectedPaymentMethod = method;
    this.renderDrawer();
  },

  openDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      this.renderDrawer();
    }
  },

  closeDrawer() {
    document.querySelector('.cart-drawer')?.classList.remove('active');
    document.querySelector('.drawer-overlay')?.classList.remove('active');
  },

  toggleDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (drawer && drawer.classList.contains('active')) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  },

  renderDrawer() {
    const container = document.querySelector('.cart-drawer-items');
    if (!container) return;

    const items = this.getItems();
    const ctaBtn = document.querySelector('.proceed-checkout-btn');

    if (items.length === 0) {
      if (ctaBtn) {
        ctaBtn.innerHTML = 'Discover Collection';
        ctaBtn.onclick = function(e) {
          e.preventDefault();
          window.location.href = 'shop.html';
        };
      }
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; color: var(--text-muted); opacity: 0.6;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <h3 style="font-family:var(--font-heading); font-size: 1.25rem; color:var(--text-primary); margin-bottom: 8px; font-weight:700;">Your Shopping Bag is Empty</h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 24px; max-width: 260px; margin-left: auto; margin-right: auto; line-height: 1.6;">
            Discover our permanent archive of small-batch Eau de Parfum macerations.
          </p>
          <a href="shop.html" class="btn btn-primary" style="font-size:0.82rem; padding: 10px 24px;" onclick="CartManager.closeDrawer()">Explore Archive</a>
        </div>
      `;
    } else {
      if (ctaBtn) {
        ctaBtn.innerHTML = 'Proceed to Checkout';
        ctaBtn.onclick = function(e) {
          e.preventDefault();
          window.location.href = 'checkout.html';
        };
      }
      const pm = this.selectedPaymentMethod;

      container.innerHTML = `
        <!-- Atelier Shipping Assurance -->
        <div style="background: rgba(46, 204, 113, 0.08); border: 1px solid rgba(46, 204, 113, 0.3); padding: 8px 12px; border-radius: 4px; margin-bottom: 14px; font-size: 0.75rem; color: var(--status-success); text-align: center; font-weight: 600; letter-spacing: 0.3px;">
          Complimentary Insured Courier Dispatch Across Pakistan
        </div>

        <!-- Cart Items List -->
        ${items.map(item => `
          <div class="cart-item" style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 52px; height: 52px; object-fit: contain; background: var(--bg-secondary); border-radius: 6px; border: 1px solid var(--border-color); padding: 4px;">
            
            <div class="cart-item-details" style="flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-heading);">${item.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 6px;">50ml Eau de Parfum (EDP)</div>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="quantity-controls" style="display: flex; align-items: center; gap: 8px; background: var(--bg-secondary); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                  <span class="qty-btn" onclick="CartManager.updateQuantity('${item.id}', -1)" style="cursor: pointer; color: var(--brand-gold); font-weight: 700; font-size: 0.9rem;">−</span>
                  <span style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary); min-width: 14px; text-align: center;">${item.quantity}</span>
                  <span class="qty-btn" onclick="CartManager.updateQuantity('${item.id}', 1)" style="cursor: pointer; color: var(--brand-gold); font-weight: 700; font-size: 0.9rem;">+</span>
                </div>

                <div style="font-weight: 700; color: var(--brand-gold); font-size: 0.9rem;">
                  PKR ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>

            <button onclick="CartManager.removeItem('${item.id}')" style="background: none; border: none; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; padding: 4px; text-decoration: underline;" title="Remove Creation">Remove</button>
          </div>
        `).join('')}

        <!-- Payment Method Selection Bar -->
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px;">Settlement Preference:</div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px;">
            <button type="button" onclick="CartManager.setPaymentMethod('Cash on Delivery')" style="padding: 7px 4px; border-radius: 4px; border: 1px solid ${pm === 'Cash on Delivery' ? 'var(--brand-gold)' : 'var(--border-color)'}; background: ${pm === 'Cash on Delivery' ? 'var(--bg-secondary)' : 'transparent'}; color: var(--text-primary); font-size: 0.72rem; font-weight: 600; cursor: pointer; text-align: center;">
              COD
            </button>

            <button type="button" onclick="CartManager.setPaymentMethod('EasyPaisa')" style="padding: 7px 4px; border-radius: 4px; border: 1px solid ${pm === 'EasyPaisa' ? 'var(--brand-gold)' : 'var(--border-color)'}; background: ${pm === 'EasyPaisa' ? 'var(--bg-secondary)' : 'transparent'}; color: var(--text-primary); font-size: 0.72rem; font-weight: 600; cursor: pointer; text-align: center;">
              EasyPaisa
            </button>

            <button type="button" onclick="CartManager.setPaymentMethod('JazzCash')" style="padding: 7px 4px; border-radius: 4px; border: 1px solid ${pm === 'JazzCash' ? 'var(--brand-gold)' : 'var(--border-color)'}; background: ${pm === 'JazzCash' ? 'var(--bg-secondary)' : 'transparent'}; color: var(--text-primary); font-size: 0.72rem; font-weight: 600; cursor: pointer; text-align: center;">
              JazzCash
            </button>
          </div>

          <!-- Account Transfer Detail Info Box -->
          ${pm !== 'Cash on Delivery' ? `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 10px; border-radius: 4px; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5;">
              <strong>${pm} Account:</strong> Title: <strong style="color:var(--text-primary);">${pm === 'JazzCash' ? 'Shazia Ishaq' : 'Atiqa Tayyab'}</strong> • Cell: <strong style="color:var(--brand-gold);">0340-3256108</strong>
            </div>
          ` : ''}
        </div>
      `;
    }

    const subtotal = this.getSubtotal();

    // Recalculate discount if coupon applied
    if (this.couponCode) {
      this.discountAmount = subtotal * 0.20;
    }

    const subtotalEl = document.querySelector('.cart-subtotal-val');
    const totalEl = document.querySelector('.cart-total-val');
    if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `PKR ${this.getTotal().toLocaleString()}`;

    // Render discount row if applicable
    const discountRow = document.getElementById('cart-discount-row');
    if (discountRow) {
      if (this.discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountRow.querySelector('.discount-val').textContent = `- PKR ${this.discountAmount.toLocaleString()}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  },

  proceedToCheckout() {
    const items = this.getItems();
    if (items.length === 0) {
      if (window.showToast) window.showToast('Your Shopping Bag is empty', 'error');
      return;
    }
    window.location.href = 'checkout.html';
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-trigger-btn')) {
        this.toggleDrawer();
      }
      if (e.target.closest('.close-drawer-btn') || e.target.classList.contains('drawer-overlay')) {
        this.closeDrawer();
      }
      if (e.target.closest('.proceed-checkout-btn')) {
        e.preventDefault();
        this.proceedToCheckout();
      }
    });

    this.updateBadge();
  }
};

window.CartManager = CartManager;
document.addEventListener('DOMContentLoaded', () => CartManager.bindEvents());
