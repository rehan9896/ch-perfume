/* ==========================================================================
   CHUDHARY PARFUMS (Pakistan)
   ATELIER CLIENT CHECKOUT & DIRECT CONCIERGE DISPATCH ENGINE
   ========================================================================== */

const CheckoutManager = {
  appliedDiscount: 0,
  currentPaymentMethod: 'Cash on Delivery',
  attachedSS: null,
  ssFileName: null,

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

  toggleMobileSummary() {
    const content = document.getElementById('chk-mobile-summary-content');
    const arrow = document.getElementById('chk-mobile-summary-arrow');
    if (!content) return;
    const isHidden = content.style.display === 'none' || !content.style.display;
    content.style.display = isHidden ? 'block' : 'none';
    if (arrow) {
      arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  },

  renderCheckoutItems() {
    const listEl = document.getElementById('chk-items-list');
    const mobileListEl = document.getElementById('chk-mobile-items-list');
    const countBadge = document.getElementById('chk-item-count');
    const mobileCountBadge = document.getElementById('chk-mobile-summary-count');

    const items = CartManager.getItems();
    const totalCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    if (countBadge) countBadge.textContent = `${totalCount} ${totalCount === 1 ? 'Flacon' : 'Flacons'}`;
    if (mobileCountBadge) mobileCountBadge.textContent = `${totalCount} ${totalCount === 1 ? 'Flacon' : 'Flacons'}`;

    if (!listEl) return;

    if (items.length === 0) {
      const emptyHtml = `
        <div style="text-align:center; padding:36px 16px; color:var(--text-muted);">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:12px; color:var(--brand-gold);"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <div style="font-size:0.95rem; font-weight:700; color:var(--text-primary); font-family:var(--font-heading);">Your Shopping Bag is Empty</div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Acquire handcrafted formulations from our atelier archive.</p>
          <a href="shop.html" class="btn btn-outline" style="margin-top:16px; font-size:0.8rem; padding:8px 20px; border-color:var(--brand-gold); color:var(--brand-gold);">Explore Archive →</a>
        </div>
      `;
      listEl.innerHTML = emptyHtml;
      if (mobileListEl) mobileListEl.innerHTML = emptyHtml;
      this.updateTotals(0);
      return;
    }

    const itemCardsHtml = items.map(item => `
      <div class="summary-item-card">
        <img src="${item.image}" alt="${item.name}" class="summary-item-thumb">
        <div style="flex:1; min-width:0;">
          <div style="font-weight:700; font-size:0.88rem; color:var(--text-primary); font-family:var(--font-heading); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${item.name}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px; display:flex; align-items:center; gap:6px;">
            <span style="border:1px solid var(--border-color); padding:1px 6px; border-radius:3px; font-size:0.7rem; font-weight:600; color:var(--text-secondary);">50ml EDP</span>
            <span>Qty: <strong style="color:var(--text-primary);">${item.quantity}</strong></span>
          </div>
        </div>
        <div style="font-weight:800; font-size:0.92rem; color:var(--brand-gold); white-space:nowrap;">
          PKR ${(item.price * item.quantity).toLocaleString()}
        </div>
      </div>
    `).join('');

    listEl.innerHTML = itemCardsHtml;
    if (mobileListEl) mobileListEl.innerHTML = itemCardsHtml;

    this.updateTotals(CartManager.getTotal());
  },

  applyCoupon() {
    const input = document.getElementById('chk-coupon-input');
    const msg = document.getElementById('chk-coupon-msg');
    if (!input || !msg) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'SAVE20' || code === 'CHAUDHARY20' || code === 'CHUDHARY20' || code === 'CP20' || code === 'ROYAL20' || code === 'PAKISTAN20') {
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
    const mobileTotalEl = document.getElementById('chk-mobile-summary-total');
    const discRow = document.getElementById('chk-discount-row');
    const discVal = document.getElementById('chk-discount-val');

    if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;

    const finalTotal = Math.max(0, subtotal - this.appliedDiscount);
    if (totalEl) totalEl.textContent = `PKR ${finalTotal.toLocaleString()}`;
    if (mobileTotalEl) mobileTotalEl.textContent = `PKR ${finalTotal.toLocaleString()}`;

    if (discRow && discVal) {
      if (this.appliedDiscount > 0) {
        discRow.style.display = 'flex';
        discVal.textContent = `-PKR ${this.appliedDiscount.toLocaleString()}`;
      } else {
        discRow.style.display = 'none';
      }
    }
  },

  copyAccountNumber(accNo, btnEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accNo).then(() => {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = '✓ Copied!';
        btnEl.style.color = '#2ecc71';
        btnEl.style.borderColor = '#2ecc71';
        if (window.showToast) window.showToast(`Account number ${accNo} copied to clipboard!`, 'success');
        setTimeout(() => {
          btnEl.innerHTML = orig;
          btnEl.style.color = '';
          btnEl.style.borderColor = '';
        }, 2200);
      }).catch(() => {
        if (window.showToast) window.showToast(`Account: ${accNo}`, 'info');
      });
    } else {
      if (window.showToast) window.showToast(`Account: ${accNo}`, 'info');
    }
  },

  handleSSUpload(inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (window.showToast) window.showToast('Please upload a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target.result;
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 900px so it fits reliably in localStorage
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedData = canvas.toDataURL('image/jpeg', 0.78);

        CheckoutManager.attachedSS = compressedData;
        CheckoutManager.ssFileName = file.name || 'payment-ss.jpg';

        const previewContainer = document.getElementById('ss-preview-container');
        const previewImg = document.getElementById('ss-preview-img');
        const previewName = document.getElementById('ss-preview-filename');
        const uploadZone = document.getElementById('ss-upload-zone');

        if (previewContainer && previewImg && previewName) {
          previewImg.src = compressedData;
          previewName.textContent = file.name || 'payment-screenshot.jpg';
          previewContainer.classList.add('active');
          if (uploadZone) uploadZone.style.display = 'none';
        }

        if (window.showToast) window.showToast('Payment screenshot attached successfully!', 'success');
      };
      img.src = rawData;
    };
    reader.readAsDataURL(file);
  },

  removeSS() {
    this.attachedSS = null;
    this.ssFileName = null;
    const fileInput = document.getElementById('chk-payment-ss');
    if (fileInput) fileInput.value = '';

    const previewContainer = document.getElementById('ss-preview-container');
    const uploadZone = document.getElementById('ss-upload-zone');

    if (previewContainer) previewContainer.classList.remove('active');
    if (uploadZone) uploadZone.style.display = 'block';

    if (window.showToast) window.showToast('Screenshot removed', 'info');
  },

  previewFullSS() {
    if (!this.attachedSS) return;
    let modal = document.getElementById('ss-fullview-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ss-fullview-modal';
      modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;';
      modal.onclick = (e) => {
        if (e.target === modal || e.target.classList.contains('ss-modal-close')) modal.style.display = 'none';
      };
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div style="position:relative; max-width:90vw; max-height:90vh; background:var(--bg-card); border:1px solid var(--border-gold); border-radius:12px; padding:16px; box-shadow:0 12px 40px rgba(0,0,0,0.6); display:flex; flex-direction:column; align-items:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid var(--border-color);">
          <strong style="color:var(--brand-gold); font-size:0.9rem;">Attached Payment Proof (SS)</strong>
          <button type="button" class="ss-modal-close" style="background:none; border:none; color:var(--text-primary); font-size:1.4rem; cursor:pointer; line-height:1;">&times;</button>
        </div>
        <img src="${this.attachedSS}" alt="Payment Screenshot Full" style="max-width:100%; max-height:75vh; object-fit:contain; border-radius:6px;">
      </div>
    `;
    modal.style.display = 'flex';
  },

  selectPaymentMethod(radioEl) {
    document.querySelectorAll('.pm-card').forEach(card => {
      card.classList.remove('active');
      card.style.borderColor = '';
      card.style.background = '';
    });

    const label = radioEl.closest('.pm-card');
    if (label) {
      label.classList.add('active');
      label.style.borderColor = 'var(--brand-gold)';
      label.style.background = 'rgba(212,175,55,0.06)';
    }

    this.currentPaymentMethod = radioEl.value;
    const infoBox = document.getElementById('chk-pm-info-box');
    if (!infoBox) return;

    if (radioEl.value === 'EasyPaisa' || radioEl.value === 'JazzCash') {
      const isJazz = radioEl.value === 'JazzCash';
      const titleName = isJazz ? 'Shazia Ishaq' : 'Atiqa Tayyab';
      const brandColor = isJazz ? '#D32F2F' : '#00A651';
      const brandLabel = isJazz ? 'JazzCash Official Account' : 'EasyPaisa Official Account';
      const totalAmt = Math.max(0, CartManager.getTotal() - this.appliedDiscount);

      infoBox.style.display = 'block';
      infoBox.innerHTML = `
        <div style="font-size:0.85rem; line-height:1.6;">
          <!-- Top Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${brandColor}; box-shadow:0 0 8px ${brandColor};"></span>
              <strong style="color:var(--text-primary); font-size:0.95rem;">${brandLabel}</strong>
            </div>
            <span class="badge" style="background:rgba(212,175,55,0.12); color:var(--brand-gold); border:1px solid var(--border-gold); font-size:0.72rem; font-weight:700;">
              Instant Verification
            </span>
          </div>

          <!-- Account Credentials Card -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; background:var(--bg-card); padding:12px 14px; border-radius:8px; border:1px solid var(--border-color);">
            <div>
              <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Account Title</div>
              <div style="font-size:0.92rem; font-weight:800; color:var(--text-primary); margin-top:3px;">
                ${titleName}
              </div>
            </div>

            <div>
              <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Account Number</div>
              <div style="display:flex; align-items:center; gap:8px; margin-top:3px;">
                <span style="font-size:0.96rem; font-weight:800; color:var(--brand-gold); letter-spacing:0.5px;">03403256108</span>
                <button type="button" onclick="CheckoutManager.copyAccountNumber('03403256108', this)" style="padding:2px 8px; font-size:0.7rem; font-weight:700; border-radius:4px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); cursor:pointer; transition:all 0.2s;" title="Copy account number">
                  Copy
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Transfer Guide -->
          <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:12px; background:rgba(212,160,23,0.06); padding:8px 12px; border-radius:6px; border-left:3px solid var(--brand-gold);">
            Transfer exact order total <strong>PKR ${totalAmt.toLocaleString()}</strong> to the mobile account above, then attach your transfer screenshot (SS) below.
          </div>

          <!-- Optional TID / Reference Input -->
          <div style="margin-bottom:12px;">
            <label class="form-label-lux" style="margin-bottom:6px;">
              Transaction ID / Sender Name (Optional)
            </label>
            <input type="text" id="chk-trx-id" class="form-input-lux" placeholder="e.g. 10-digit TID (e.g. 9840218902) or Sender Mobile #" style="padding:10px 14px; font-size:0.86rem;">
          </div>

          <!-- Screenshot (SS) Upload Dropzone -->
          <div>
            <label style="display:block; font-size:0.78rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
              Attach Payment Screenshot (SS):
            </label>

            <div class="ss-upload-zone" id="ss-upload-zone" onclick="document.getElementById('chk-payment-ss').click()" style="${this.attachedSS ? 'display:none;' : 'display:block;'}">
              <input type="file" id="chk-payment-ss" accept="image/*" style="display:none;" onchange="CheckoutManager.handleSSUpload(this)">
              <div class="ss-upload-label">
                <svg class="ss-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="ss-upload-title">Tap to Upload Payment Screenshot (SS)</span>
                <span class="ss-upload-sub">Select image from gallery or camera &bull; PNG, JPG, WebP</span>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="ss-preview-container ${this.attachedSS ? 'active' : ''}" id="ss-preview-container">
              <img id="ss-preview-img" src="${this.attachedSS || ''}" alt="Payment Screenshot Preview" class="ss-preview-thumb" onclick="CheckoutManager.previewFullSS()">
              <div class="ss-preview-info">
                <div class="ss-preview-name" id="ss-preview-filename">${this.ssFileName || 'payment-screenshot.jpg'}</div>
                <div class="ss-preview-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Screenshot Attached &bull; Ready for Verification
                </div>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="ss-remove-btn" onclick="CheckoutManager.removeSS()">Remove</button>
              </div>
            </div>
          </div>
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
    const trxId = document.getElementById('chk-trx-id')?.value.trim() || '';

    const subtotal = CartManager.getTotal();
    const finalTotal = Math.max(0, subtotal - this.appliedDiscount);
    const orderId = 'CP-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNo = 'PEX-' + Math.floor(10000000 + Math.random() * 90000000);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const itemsSummary = items.map(i => `${i.name} (50ml EDP) × ${i.quantity}`).join(', ');

    // 1. Create New Order Object with Payment Screenshot Details
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
      paymentTitle: pm === 'EasyPaisa' ? 'Atiqa Tayyab' : (pm === 'JazzCash' ? 'Shazia Ishaq' : 'Cash on Delivery'),
      trxId: trxId,
      paymentProof: this.attachedSS || '',
      ssFileName: this.ssFileName || '',
      hasScreenshot: !!this.attachedSS,
      date: dateStr,
      status: (pm === 'Cash on Delivery') ? 'Pending COD' : (this.attachedSS ? 'Payment Verified (SS Attached)' : 'Awaiting Payment SS'),
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

    // 5. Construct Clear, Easy & Detailed WhatsApp Order Message
    const itemsFormatted = items.map((i, idx) => 
      `${idx + 1}. *${i.name}* (50ml Bottle)\n   • Quantity: ${i.quantity}\n   • Price: PKR ${(i.price * i.quantity).toLocaleString()}`
    ).join('\n\n');

    const discountNotice = this.appliedDiscount > 0 ? `\n• Discount Applied: -PKR ${this.appliedDiscount.toLocaleString()}` : '';
    const notesNotice = notes ? `\n• Delivery Note / Instructions: ${notes}` : '';

    let paymentMethodText = pm;
    if (pm === 'Cash on Delivery') {
      paymentMethodText = 'Cash on Delivery (Pay cash when parcel arrives at your door)';
    } else if (pm === 'EasyPaisa') {
      paymentMethodText = 'EasyPaisa (Sent to Account: Atiqa Tayyab - 03403256108)';
    } else if (pm === 'JazzCash') {
      paymentMethodText = 'JazzCash (Sent to Account: Shazia Ishaq - 03403256108)';
    }

    let paymentExtraDetails = '';
    if (trxId) {
      paymentExtraDetails += `\n• Transaction / Trx ID: ${trxId}`;
    }
    if (this.attachedSS) {
      paymentExtraDetails += `\n• Payment Screenshot: Uploaded with order ✓`;
    } else if (pm !== 'Cash on Delivery') {
      paymentExtraDetails += `\n• Payment Screenshot: Sending screenshot here in WhatsApp`;
    }

    const waMessage = 
`✨ *NEW ORDER - CHUDHARY PERFUMES* ✨

Hello! I have placed an order on your website. Here are my complete order details:

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *ORDER INFORMATION*
• *Order Number:* ${orderId}
• *Date:* ${dateStr}

👤 *CUSTOMER DETAILS*
• *Customer Name:* ${name}
• *Phone Number:* ${phone}
• *City:* ${city}
• *Delivery Address:* ${address}${notesNotice}

🛍️ *ITEMS ORDERED*
${itemsFormatted}

💰 *PAYMENT & BILL DETAILS*
• Items Total: PKR ${subtotal.toLocaleString()}${discountNotice}
• Delivery Charges: FREE (Free Home Delivery Across Pakistan)
• *Total Bill to Pay: PKR ${finalTotal.toLocaleString()}*
• *Payment Method:* ${paymentMethodText}${paymentExtraDetails}

🚚 *DELIVERY DETAILS*
• Courier Service: PostEx Express Courier
• Estimated Delivery: 2 to 4 Working Days
━━━━━━━━━━━━━━━━━━━━━━━━━━

Please confirm my order and let me know when it will be delivered. Thank you!`;

    const waUrl = `https://api.whatsapp.com/send?phone=923403256108&text=${encodeURIComponent(waMessage)}`;

    // 6. Clear Cart & Reset SS state
    CartManager.clearCart();
    this.attachedSS = null;
    this.ssFileName = null;

    if (window.showToast) {
      window.showToast(`Order ${orderId} Placed Successfully! Opening WhatsApp to confirm...`, 'success');
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
