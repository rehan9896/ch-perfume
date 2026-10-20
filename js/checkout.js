/* ==========================================================================
   CHAUDHARY PARFUMS (Lahore, Pakistan)
   ATELIER CLIENT CHECKOUT & DIRECT CONCIERGE DISPATCH ENGINE
   ========================================================================== */

const CheckoutManager = {
  appliedDiscount: 0,
  currentPaymentMethod: 'Cash on Delivery',

  cities: [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Sialkot',
    'Gujranwala', 'Quetta', 'Hyderabad', 'Abbottabad', 'Ahmedpur East', 'Ali Pur Chatta', 'Attock',
    'Badin', 'Bagh (AJK)', 'Bahawalnagar', 'Bahawalpur', 'Bannu', 'Batkhela', 'Bhai Pheru', 'Bhakkar',
    'Bhalwal', 'Bhimber (AJK)', 'Burewala', 'Chakwal', 'Chaman', 'Charsadda', 'Chichawatni', 'Chiniot',
    'Chishtian', 'Chitral', 'Chunian', 'Dadu', 'Daska', 'Dera Ghazi Khan', 'Dera Ismail Khan', 'Dina',
    'Gojra', 'Gujar Khan', 'Gujrat', 'Hafizabad', 'Hangu', 'Haripur', 'Hasilpur', 'Hassan Abdal',
    'Haveli Lakha', 'Jacobabad', 'Jhelum', 'Jhang', 'Kamoke', 'Kandhkot', 'Karak', 'Kasur', 'Khairpur',
    'Khanewal', 'Khanpur', 'Kharian', 'Khushab', 'Kohat', 'Kot Addu', 'Kotli (AJK)', 'Larkana', 'Layyah',
    'Liaquatpur', 'Lalamusa', 'Mardan', 'Mian Channu', 'Mianwali', 'Mingora (Swat)', 'Mirpur (AJK)',
    'Mirpur Khas', 'Muridke', 'Muzaffargarh', 'Muzaffarabad (AJK)', 'Narowal', 'Nawabshah (Shaheed Benazirabad)',
    'Nowshera', 'Okara', 'Pakpattan', 'Pattoki', 'Pishin', 'Rahim Yar Khan', 'Sadiqabad', 'Sahiwal',
    'Sambrial', 'Samundri', 'Sargodha', 'Sheikhupura', 'Shikarpur', 'Shorkot', 'Sukkur', 'Swabi',
    'Tando Adam', 'Tando Allahyar', 'Taxila', 'Toba Tek Singh', 'Vehari', 'Wah Cantt', 'Wazirabad',
    'Zhob', 'Other City (Insured Express Dispatch)'
  ],

  init() {
    this.renderCheckoutItems();
    this.bindCartRedirect();
    this.renderCityOptions();
    this.bindDocumentClick();
  },

  bindDocumentClick() {
    document.addEventListener('click', (e) => {
      const box = document.getElementById('city-selector-box');
      const menu = document.getElementById('city-dropdown-menu');
      if (menu && box && !box.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  },

  toggleCityDropdown(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('city-dropdown-menu');
    if (!menu) return;
    const isHidden = menu.style.display === 'none' || !menu.style.display;
    menu.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      const searchInput = document.getElementById('city-search-input');
      if (searchInput) {
        searchInput.value = '';
        this.filterCities('');
        setTimeout(() => searchInput.focus(), 50);
      }
    }
  },

  renderCityOptions(filterStr = '') {
    const listEl = document.getElementById('city-options-list');
    if (!listEl) return;
    const query = filterStr.toLowerCase().trim();
    const filtered = this.cities.filter(c => c.toLowerCase().includes(query));

    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="padding:12px; text-align:center; color:var(--text-muted); font-size:0.82rem;">No matching city found</div>`;
      return;
    }

    listEl.innerHTML = filtered.map(city => `
      <div onclick="CheckoutManager.selectCity('${city.replace(/'/g, "\\'")}')" style="padding:10px 16px; font-size:0.88rem; font-weight:500; color:var(--text-primary); cursor:pointer; transition:background 0.15s ease;" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
        ${city}
      </div>
    `).join('');
  },

  filterCities(val) {
    this.renderCityOptions(val);
  },

  selectCity(cityName) {
    const hiddenInput = document.getElementById('chk-city');
    const textSpan = document.getElementById('city-selected-text');
    const menu = document.getElementById('city-dropdown-menu');

    if (hiddenInput) hiddenInput.value = cityName;
    if (textSpan) textSpan.textContent = cityName;
    if (menu) menu.style.display = 'none';
  },

  bindCartRedirect() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.proceed-checkout-btn')) {
        e.preventDefault();
        window.location.href = 'checkout.html';
      }
    });
  },

  renderCheckoutItems() {
    const listEl = document.getElementById('chk-items-list');
    if (!listEl) return;

    const items = CartManager.getItems();
    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:36px 12px; color:var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:12px; opacity:0.6;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p style="font-size:0.9rem; font-weight:600; color:var(--text-primary);">Your shopping bag is empty</p>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Select creations from our archive to proceed.</p>
          <a href="shop.html" class="btn btn-outline" style="margin-top:16px; font-size:0.8rem; padding:8px 18px;">Explore Archive</a>
        </div>
      `;
      this.updateTotals(0);
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div style="display:flex; gap:14px; align-items:center; padding-bottom:14px; border-bottom:1px solid var(--border-color);">
        <img src="${item.image}" alt="${item.name}" style="width:54px; height:54px; object-fit:cover; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-secondary);">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary); font-family:var(--font-heading);">${item.name}</div>
          <div style="font-size:0.76rem; color:var(--text-muted); margin-top:2px;">50ml EDP &bull; Qty: ${item.quantity} &times; PKR ${item.price.toLocaleString()}</div>
        </div>
        <div style="font-weight:700; font-size:0.9rem; color:var(--brand-gold);">
          PKR ${(item.price * item.quantity).toLocaleString()}
        </div>
      </div>
    `).join('');

    this.updateTotals(CartManager.getTotal());
  },

  applyCoupon() {
    const input = document.getElementById('chk-coupon-input');
    const msg = document.getElementById('chk-coupon-msg');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'SAVE20' || code === 'CHUDHARY20' || code === 'CP20') {
      const subtotal = CartManager.getTotal();
      this.appliedDiscount = Math.round(subtotal * 0.20);
      msg.style.display = 'block';
      msg.style.color = 'var(--status-success)';
      msg.textContent = '20% Private Patron Privilege Applied';
      this.updateTotals(subtotal);
    } else {
      msg.style.display = 'block';
      msg.style.color = '#e74c3c';
      msg.textContent = 'Unrecognized invitation code. Use "SAVE20".';
    }
  },

  updateTotals(subtotal) {
    const subtotalEl = document.getElementById('chk-subtotal-val');
    const totalEl = document.getElementById('chk-total-val');
    const discRow = document.getElementById('chk-discount-row');
    const discVal = document.getElementById('chk-discount-val');

    if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;

    const finalTotal = Math.max(0, subtotal - this.appliedDiscount);
    if (totalEl) totalEl.textContent = `PKR ${finalTotal.toLocaleString()}`;

    if (discRow && discVal) {
      if (this.appliedDiscount > 0) {
        discRow.style.display = 'flex';
        discVal.textContent = `-PKR ${this.appliedDiscount.toLocaleString()}`;
      } else {
        discRow.style.display = 'none';
      }
    }
  },

  selectPaymentMethod(radioEl) {
    document.querySelectorAll('.pm-card').forEach(card => {
      card.style.borderColor = 'var(--border-color)';
      card.style.background = 'var(--bg-secondary)';
      card.classList.remove('active');
    });

    const label = radioEl.closest('.pm-card');
    if (label) {
      label.style.borderColor = 'var(--brand-gold)';
      label.style.background = 'rgba(212,175,55,0.06)';
      label.classList.add('active');
    }

    this.currentPaymentMethod = radioEl.value;
    const infoBox = document.getElementById('chk-pm-info-box');
    if (!infoBox) return;

    if (radioEl.value === 'EasyPaisa') {
      infoBox.style.display = 'block';
      infoBox.innerHTML = `
        <div style="font-size:0.85rem; line-height:1.7;">
          <div style="font-weight:700; color:var(--brand-gold); margin-bottom:4px;">EasyPaisa Atelier Account</div>
          <div>Account Title: <strong>Atiqa Tayyab</strong></div>
          <div>Account Number: <strong>03403256108</strong></div>
          <div style="font-size:0.76rem; color:var(--text-muted); margin-top:6px;">Please submit payment confirmation snapshot to our WhatsApp concierge after placing order.</div>
        </div>
      `;
    } else if (radioEl.value === 'JazzCash') {
      infoBox.style.display = 'block';
      infoBox.innerHTML = `
        <div style="font-size:0.85rem; line-height:1.7;">
          <div style="font-weight:700; color:var(--brand-gold); margin-bottom:4px;">JazzCash Atelier Account</div>
          <div>Account Title: <strong>Shazia Ishaq</strong></div>
          <div>Account Number: <strong>03403256108</strong></div>
          <div style="font-size:0.76rem; color:var(--text-muted); margin-top:6px;">Please submit payment confirmation snapshot to our WhatsApp concierge after placing order.</div>
        </div>
      `;
    } else {
      infoBox.style.display = 'none';
    }
  },

  handleFormSubmit(e) {
    e.preventDefault();

    const items = CartManager.getItems();
    if (items.length === 0) {
      if (window.showToast) window.showToast('Your shopping bag is empty!', 'error');
      return;
    }

    const name = document.getElementById('chk-name')?.value.trim() || 'Valued Patron';
    const phone = document.getElementById('chk-phone')?.value.trim() || '03403256108';
    const email = document.getElementById('chk-email')?.value.trim() || '';
    const city = document.getElementById('chk-city')?.value || 'Lahore';
    const address = document.getElementById('chk-address')?.value.trim() || '';
    const notes = document.getElementById('chk-notes')?.value.trim() || '';
    const pm = this.currentPaymentMethod;

    const subtotal = CartManager.getTotal();
    const finalTotal = Math.max(0, subtotal - this.appliedDiscount);
    const orderId = 'CP-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNo = 'PEX-' + Math.floor(10000000 + Math.random() * 90000000);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const itemsSummary = items.map(i => `${i.name} (50ml EDP) × ${i.quantity}`).join(', ');

    // 1. Create New Order Object for Live Admin Dashboard
    const newOrder = {
      id: orderId,
      orderId: orderId,
      customerName: name,
      phone: phone,
      email: email,
      city: city,
      address: address,
      notes: notes,
      items: itemsSummary,
      total: finalTotal,
      paymentMethod: pm,
      date: dateStr,
      status: 'Pending COD',
      trackingNo: trackingNo,
      courierPartner: 'PostEx Courier'
    };

    // 2. Save Live Order to Admin Tracking (cp_placed_orders)
    try {
      const placedOrders = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
      placedOrders.unshift(newOrder);
      localStorage.setItem('cp_placed_orders', JSON.stringify(placedOrders));
    } catch(err) {}

    // 3. Deduct Stock Live from Inventory (cp_inventory)
    try {
      const inv = JSON.parse(localStorage.getItem('cp_inventory')) || [];
      items.forEach(item => {
        const found = inv.find(p => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
        if (found && found.stock !== undefined) {
          found.stock = Math.max(0, found.stock - item.quantity);
        }
      });
      localStorage.setItem('cp_inventory', JSON.stringify(inv));
    } catch(err) {}

    // 4. Save to Customer History (cp_order_history)
    try {
      const history = JSON.parse(localStorage.getItem('cp_order_history')) || [];
      history.unshift(newOrder);
      localStorage.setItem('cp_order_history', JSON.stringify(history));
    } catch(err) {}

    // 5. Construct Formal Atelier WhatsApp Message
    const itemsFormatted = items.map(i => `• ${i.name} (50ml EDP) × ${i.quantity} — PKR ${(i.price * i.quantity).toLocaleString()}`).join('\n');
    const discountNotice = this.appliedDiscount > 0 ? `\nPatron Privilege: -PKR ${this.appliedDiscount.toLocaleString()}` : '';
    const notesNotice = notes ? `\nSpecial Instructions: ${notes}` : '';

    let pmDetails = pm;
    if (pm === 'EasyPaisa') pmDetails += ' (Atiqa Tayyab)';
    if (pm === 'JazzCash') pmDetails += ' (Shazia Ishaq)';

    const waMessage = 
`CHAUDHARY PARFUMS • ORDER ACQUISITION
Docket: ${orderId}
----------------------------------------
Patron: ${name}
Phone: ${phone}
City: ${city}
Destination: ${address}${notesNotice}
----------------------------------------
CREATIONS ORDERED:
${itemsFormatted}

Subtotal: PKR ${subtotal.toLocaleString()}${discountNotice}
Total Due: PKR ${finalTotal.toLocaleString()}
Settlement Method: ${pmDetails}
Dispatch Service: Insured PostEx Courier
----------------------------------------
Kindly confirm dispatch docket. Thank you.`;

    const waUrl = `https://api.whatsapp.com/send?phone=923403256108&text=${encodeURIComponent(waMessage)}`;

    // 6. Clear Cart
    CartManager.clearCart();

    if (window.showToast) {
      window.showToast(`Order ${orderId} Submitted! Connecting to WhatsApp Concierge...`, 'success');
    }

    // 7. Redirect to WhatsApp
    setTimeout(() => {
      try {
        window.open(waUrl, '_blank') || (window.location.href = waUrl);
      } catch(err) {
        window.location.href = waUrl;
      }
    }, 600);
  }
};

window.CheckoutManager = CheckoutManager;
document.addEventListener('DOMContentLoaded', () => CheckoutManager.init());
