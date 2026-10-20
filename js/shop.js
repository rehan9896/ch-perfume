/* ==========================================================================
   Chudhary PERFUMES (Chudharyperfumes.pk)
   EXACT CATEGORY FILTERING (PREVENTS "women".includes("men") SUBSTRING MATCHING)
   ========================================================================== */

const ProductCatalog = [
  // Masculine Edit
  {
    id: 'black-crown',
    name: 'Black Crown',
    category: 'Masculine Edit',
    gender: 'Men',
    price: 2200,
    originalPrice: 3100,
    discount: '29% OFF',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 289,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 08',
    longevity: '14+ Hours Wear',
    projection: 'Profound & Enveloping',
    topNotes: 'Black Currant, Crushed Pink Peppercorn',
    heartNotes: 'Damascena Rose, Bourbon Vanilla',
    baseNotes: 'Smoked Amberwood, White Musk, Patchouli',
    notes: 'Black Currant • Damascena Rose • Amberwood',
    scentFamily: 'oriental',
    image: 'assets/images/products/black_crown.png',
    description: 'A sovereign masculine composition balancing sharp nocturnal fruit with opulent warm resins. Opening with piquant pink pepper and dark cassis, Black Crown transitions into a velvety heart of hand-harvested roses, drying down to an aristocratic sillage of smoked amber and aged bourbon vanilla.'
  },
  {
    id: 'elite-touch',
    name: 'Elite Touch',
    category: 'Masculine Edit',
    gender: 'Men',
    price: 1850,
    originalPrice: 2800,
    discount: '34% OFF',
    badge: 'SIGNATURE',
    rating: 5.0,
    reviewsCount: 412,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 12',
    longevity: '16+ Hours Wear',
    projection: 'Smoky & Intense',
    topNotes: 'Black Cardamom, Ceylon Cinnamon',
    heartNotes: 'Tuscan Saddle Leather, Haitian Vetiver',
    baseNotes: 'Smoky Assam Agarwood, Birch Tar',
    notes: 'Black Cardamom • Tuscan Leather • Assam Agarwood',
    scentFamily: 'woody',
    image: 'assets/images/products/elite_touch.png',
    description: 'An authoritative evening statement steeped in heritage woods and full-grain leather. A warming burst of freshly cracked cardamom and dark spices unveils a commanding heart of aged Tuscan leather, grounded permanently by smoky Assam agarwood and dry vetiver roots.'
  },

  // Feminine Edit
  {
    id: 'bold-rush',
    name: 'Bold Rush',
    category: 'Feminine Edit',
    gender: 'Women',
    price: 1900,
    originalPrice: 2800,
    discount: '32% OFF',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 342,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 04',
    longevity: '14+ Hours Wear',
    projection: 'Radiant & Crisp',
    topNotes: 'Amalfi Lemon, Orange Blossom',
    heartNotes: 'French Lavender, Wild Garden Mint',
    baseNotes: 'White Cedarwood, Crystalline Amber',
    notes: 'Amalfi Lemon • French Lavender • White Cedar',
    scentFamily: 'fresh',
    image: 'assets/images/products/bold_rush.png',
    description: 'A radiant symphony of Mediterranean sunlight and serene herbal elegance. Vibrant citrus zest sparkles against calming French lavender and garden-picked mint, settling into a clean, enduring finish of white cedar and soft amber veil.'
  },
  {
    id: 'fresh-aura',
    name: 'Fresh Aura',
    category: 'Feminine Edit',
    gender: 'Women',
    price: 2100,
    originalPrice: 3000,
    discount: '30% OFF',
    badge: 'NEW ARRIVAL',
    rating: 4.8,
    reviewsCount: 195,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 05',
    longevity: '12+ Hours Wear',
    projection: 'Sweet Velvet Sillage',
    topNotes: 'Wild Woodland Berries, White Peach',
    heartNotes: 'Spun Sugar, Sambac Jasmine',
    baseNotes: 'Cashmere Musk, French Vanilla Bean',
    notes: 'Wild Berries • Sambac Jasmine • French Vanilla',
    scentFamily: 'floral',
    image: 'assets/images/products/fresh_aura.png',
    description: 'A mesmerizing gourmand floral created for dusk and romantic evenings. Delectable wild red berries and nectarine harmonize with intoxicating jasmine, cocooned in a whisper of warm spun sugar and creamy cashmere musk.'
  },
  {
    id: 'soft-bloom',
    name: 'Soft Bloom',
    category: 'Feminine Edit',
    gender: 'Women',
    price: 1750,
    originalPrice: 2600,
    discount: '33% OFF',
    badge: 'EXCLUSIVE',
    rating: 4.9,
    reviewsCount: 128,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 09',
    longevity: '12+ Hours Wear',
    projection: 'Intimate & Poetic',
    topNotes: 'Morning Jasmine Petals, White Tea Leaf',
    heartNotes: 'Tea Rose, Lily of the Valley',
    baseNotes: 'Virginia Cedar, Sheer Powder Musk',
    notes: 'Morning Jasmine • Tea Rose • Powder Musk',
    scentFamily: 'floral',
    image: 'assets/images/products/soft_bloom.png',
    description: 'A delicate ode to dew-kissed petals and contemplative morning serenity. Silken white tea leaves and pale tea roses unfold softly upon the skin, leaving a discreet, skin-intimate trace of clean musk and smooth cedarwood.'
  },

  // Shared Edit
  {
    id: 'force-mist',
    name: 'Force Mist',
    category: 'Shared Edit',
    gender: 'Unisex',
    price: 2000,
    originalPrice: 2900,
    discount: '31% OFF',
    badge: 'POPULAR',
    rating: 4.7,
    reviewsCount: 184,
    concentration: '50ml Eau de Parfum • 25% Concentration',
    batch: 'Edition 2026 / Batch 07',
    longevity: '12+ Hours Wear',
    projection: 'Crisp Coastal Trail',
    topNotes: 'Arabian Sea Salt, Sunlit Lime',
    heartNotes: 'Crushed Aromatic Mint, Silver Birch',
    baseNotes: 'French Oakmoss, Clean Linen Musk',
    notes: 'Arabian Sea Salt • Crushed Mint • French Oakmoss',
    scentFamily: 'fresh',
    image: 'assets/images/products/force_mist.png',
    description: 'An invigorating, gender-transcending marine composition evocative of misty shorelines. Bracing sea air and sharp Persian lime awaken the senses, carried on a breeze of fresh garden mint, birch wood, and grounding mineral oakmoss.'
  }
];

window.ProductCatalog = ProductCatalog;

const ShopManager = {
  currentCategory: 'all',
  currentFamily: 'all',
  maxPrice: 100000,
  currentSort: 'featured',
  viewMode: 'grid',
  currentPage: 1,
  itemsPerPage: 12,

  init() {
    // Check URL parameters for category filter (e.g. ?cat=men, ?cat=women, ?cat=unisex)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = (urlParams.get('cat') || urlParams.get('category') || 'all').toLowerCase().trim();
    if (['men', 'women', 'unisex'].includes(catParam)) {
      this.currentCategory = catParam;
    } else {
      this.currentCategory = 'all';
    }
    this.currentPage = 1;
    this.updateCategoryPills();
    this.renderProducts();
    this.bindEvents();
  },

  updateCategoryPills() {
    const cat = (this.currentCategory || 'all').toLowerCase().trim();
    document.querySelectorAll('.shop-cat-pill').forEach(el => {
      const onclickAttr = el.getAttribute('onclick') || '';
      if (onclickAttr.toLowerCase().includes(`'${cat}'`) || (cat === 'all' && onclickAttr.toLowerCase().includes("'all'"))) {
        el.className = 'btn btn-primary shop-cat-pill';
      } else {
        el.className = 'btn btn-outline shop-cat-pill';
      }
    });
  },

  filterCategory(catName, btnEl) {
    this.currentCategory = catName;
    this.currentPage = 1;
    this.updateCategoryPills();
    if (btnEl) {
      document.querySelectorAll('.shop-cat-pill').forEach(el => el.className = 'btn btn-outline shop-cat-pill');
      btnEl.className = 'btn btn-primary shop-cat-pill';
    }
    this.renderProducts();
  },

  getFilteredProducts() {
    let catalog = [...ProductCatalog];
    try {
      const inv = JSON.parse(localStorage.getItem('cp_inventory')) || [];
      if (inv.length > 0) {
        inv.forEach(item => {
          const existing = catalog.find(c => c.id === item.id);
          if (existing) {
            if (item.price && item.price >= 1500) existing.price = item.price;
            if (item.stock !== undefined) existing.stock = item.stock;
            if (item.image) existing.image = item.image;
            if (item.notes) existing.notes = item.notes;
          } else {
            catalog.unshift({
              id: item.id || item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              name: item.name,
              category: item.category || 'Perfumes',
              gender: item.gender || 'Unisex',
              price: item.price || 1990,
              originalPrice: (item.price || 1990) + 900,
              discount: '30% OFF',
              badge: 'NEW',
              rating: 5.0,
              reviewsCount: 50,
              notes: item.notes || 'Luxury Fragrance Oils',
              scentFamily: 'fresh',
              image: item.image || 'assets/images/products/black_crown.png',
              description: item.notes || 'Handcrafted Eau de Parfum Made in Pakistan.'
            });
          }
        });
      }
    } catch(e) {}

    const filterCat = (this.currentCategory || 'all').toLowerCase().trim();
    
    return catalog.filter(p => {
      let categoryMatch = false;
      if (filterCat === 'all') {
        categoryMatch = true;
      } else if (filterCat === 'men' || filterCat === 'male') {
        categoryMatch = (p.gender || '').toLowerCase() === 'men';
      } else if (filterCat === 'women' || filterCat === 'female') {
        categoryMatch = (p.gender || '').toLowerCase() === 'women';
      } else if (filterCat === 'unisex') {
        categoryMatch = (p.gender || '').toLowerCase() === 'unisex';
      } else {
        categoryMatch = (p.category || '').toLowerCase().includes(filterCat);
      }

      const familyMatch = this.currentFamily === 'all' || p.scentFamily === this.currentFamily;
      const priceMatch = (p.price || 0) <= this.maxPrice;
      return categoryMatch && familyMatch && priceMatch;
    }).sort((a, b) => {
      if (this.currentSort === 'price-low') return a.price - b.price;
      if (this.currentSort === 'price-high') return b.price - a.price;
      if (this.currentSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  },

  setPage(pageNum) {
    this.currentPage = pageNum;
    this.renderProducts();
    const grid = document.querySelector('.product-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  renderProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    const filtered = this.getFilteredProducts();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
    
    if (this.currentPage > totalPages) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pageItems = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    const countEl = document.querySelector('.results-count');
    if (countEl) {
      countEl.textContent = `Showing Page ${this.currentPage} of ${totalPages} (${totalItems} Perfumes Total)`;
    }

    if (totalItems === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; margin-bottom:12px;">No perfumes match your filter</h3>
          <button class="btn btn-outline" onclick="ShopManager.resetFilters()">Show All Perfumes</button>
        </div>
      `;
      this.renderPagination(0);
      return;
    }

    grid.className = `product-grid ${this.viewMode === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = pageItems.map(p => {
      const genderLabel = p.gender === 'Men' ? 'Pour Homme' : p.gender === 'Women' ? 'Pour Femme' : 'Genderless';
      return `
      <div class="product-card reveal-on-scroll visible">
        <div class="product-img-wrapper">
          <img src="${p.image}" alt="${p.name} - Chaudhary Parfums" class="product-img" loading="lazy">
          <div class="product-badge-overlay">
            <span class="badge ${p.badge === 'BESTSELLER' ? 'badge-featured' : ''}">${genderLabel}</span>
          </div>
          <div class="product-actions">
            <button class="btn-icon wishlist-btn" data-product-id="${p.id}" onclick="WishlistManager.toggleItem(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to Wishlist" aria-label="Add to Wishlist">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="btn-icon" onclick="ShopManager.openQuickView('${p.id}')" title="Inspect Notes" aria-label="Quick View">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <h3 class="product-title"><a href="javascript:void(0)" onclick="ShopManager.openQuickView('${p.id}')">${p.name}</a></h3>
          <div class="product-notes">${p.notes}</div>
          <div class="rating-stars" style="margin-bottom:12px;">★★★★★ <span style="color:var(--text-muted); font-size:0.75rem; font-family:var(--font-body); font-weight:500;">${p.rating} (${p.reviewsCount})</span></div>
          <div class="product-footer">
            <div>
              <div class="product-price">PKR ${p.price.toLocaleString()}</div>
              ${p.originalPrice ? `<div style="font-size:0.75rem; color:var(--text-muted); text-decoration:line-through;">PKR ${p.originalPrice.toLocaleString()}</div>` : ''}
            </div>
            <button class="add-cart-btn" onclick="CartManager.addItem(${JSON.stringify(p).replace(/"/g, '&quot;')})">Add to Bag</button>
          </div>
        </div>
      </div>
    }).join('');

    if (window.AnimationManager && typeof window.AnimationManager.refresh === 'function') {
      window.AnimationManager.refresh();
    }

    this.renderPagination(totalPages);
  },

  renderPagination(totalPages) {
    const pagContainer = document.querySelector('.pagination-wrapper');
    if (!pagContainer) return;

    if (totalPages <= 1) {
      pagContainer.innerHTML = '';
      return;
    }

    let buttonsHtml = `
      <div style="display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; background: var(--bg-card); padding: 8px 16px; border-radius: 30px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <span style="font-size: 0.84rem; font-weight: 700; color: var(--text-secondary); margin-right: 6px;">Catalog Page:</span>
    `;

    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === this.currentPage;
      buttonsHtml += `
        <button onclick="ShopManager.setPage(${i})" style="padding: 8px 16px; border-radius: 20px; border: 1px solid ${isActive ? 'var(--brand-gold)' : 'var(--border-color)'}; background: ${isActive ? 'var(--brand-gold)' : 'var(--bg-secondary)'}; color: ${isActive ? '#0F0F0F' : 'var(--text-primary)'}; font-size: 0.88rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
          Page ${i}
        </button>
      `;
    }

    buttonsHtml += `</div>`;
    pagContainer.innerHTML = buttonsHtml;
  },

  openQuickView(productId) {
    const product = ProductCatalog.find(p => p.id === productId);
    if (!product) return;

    const modal = document.querySelector('.quick-view-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (!modal || !overlay) return;

    modal.querySelector('.quick-view-body').innerHTML = `
      <div class="quick-view-grid">
        <img src="${product.image}" alt="${product.name}" class="quick-view-img">
        <div>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <span class="badge" style="background:var(--bg-secondary); color:var(--text-primary); border:1px solid var(--border-color); font-weight:700;">${product.gender === 'Men' ? 'Pour Homme' : product.gender === 'Women' ? 'Pour Femme' : 'Genderless'}</span>
            <span class="badge" style="border:1px solid var(--border-gold); color:var(--brand-gold); background:transparent; font-weight:700;">${product.batch}</span>
          </div>
          <h2 style="font-size: 2.2rem; font-family: var(--font-heading); margin-bottom: 6px; font-weight:700; color:var(--text-primary); letter-spacing:0.5px;">${product.name}</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-weight:500; margin-bottom: 14px;">${product.concentration}</div>
          
          <div style="display:flex; align-items:baseline; gap:12px; margin-bottom:16px;">
            <div style="font-size: 1.8rem; color: var(--text-primary); font-weight: 800;">PKR ${product.price.toLocaleString()}</div>
            ${product.originalPrice ? `<div style="font-size:1.05rem; color:var(--text-muted); text-decoration:line-through;">PKR ${product.originalPrice.toLocaleString()}</div>` : ''}
          </div>
          
          <p style="color: var(--text-secondary); margin-bottom: 18px; line-height: 1.7; font-size:0.92rem;">${product.description}</p>

          <!-- Authentic Olfactory Pyramid -->
          <div class="olfactory-pyramid">
            <div class="pyramid-tier">
              <span class="tier-label">TOP NOTES</span>
              <span class="tier-notes">${product.topNotes}</span>
            </div>
            <div class="pyramid-tier">
              <span class="tier-label">HEART NOTES</span>
              <span class="tier-notes">${product.heartNotes}</span>
            </div>
            <div class="pyramid-tier">
              <span class="tier-label">BASE NOTES</span>
              <span class="tier-notes">${product.baseNotes}</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.8rem; margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-color); color:var(--text-muted);">
              <div>Longevity: <strong style="color:var(--text-primary);">${product.longevity}</strong></div>
              <div>Sillage: <strong style="color:var(--text-primary);">${product.projection}</strong></div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap:wrap; margin-top:18px;">
            <button class="add-cart-btn" style="padding:13px 28px; font-size:0.9rem;" onclick="CartManager.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')}); ShopManager.closeQuickView();">Add to Bag</button>
            <a href="https://api.whatsapp.com/send?phone=923403256108&text=Hello%20Chaudhary%20Parfums,%20I%20would%20like%20to%20order%20${encodeURIComponent(product.name)}" target="_blank" class="btn btn-outline" style="font-weight:600; padding:13px 22px; display:inline-flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.9 11.9 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.21-1.63a11.93 11.93 0 0 0 5.8 1.49h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.21-3.48-8.4zM12.02 21.84h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.75.98 1-3.65-.24-.38a9.92 9.92 0 0 1-1.52-5.22c0-5.48 4.46-9.94 9.94-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.93-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    overlay.classList.add('active');
  },

  closeQuickView() {
    document.querySelector('.quick-view-modal')?.classList.remove('active');
    document.querySelector('.modal-overlay')?.classList.remove('active');
  },

  resetFilters() {
    this.currentCategory = 'all';
    this.currentFamily = 'all';
    this.maxPrice = 2200;
    const priceSlider = document.getElementById('price-range-slider');
    if (priceSlider) priceSlider.value = 2200;
    const valEl = document.getElementById('price-val');
    if (valEl) valEl.textContent = `PKR 2,200`;
    document.querySelectorAll('.scent-chip').forEach(c => c.classList.remove('active'));
    this.renderProducts();
  },

  bindEvents() {
    const priceSlider = document.getElementById('price-range-slider');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.maxPrice = parseFloat(e.target.value);
        const valEl = document.getElementById('price-val');
        if (valEl) valEl.textContent = `PKR ${this.maxPrice.toLocaleString()}`;
        this.renderProducts();
      });
    }

    const sortSelect = document.getElementById('sort-products-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderProducts();
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.scent-chip')) {
        const chip = e.target.closest('.scent-chip');
        document.querySelectorAll('.scent-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFamily = chip.getAttribute('data-family');
        this.renderProducts();
      }

      if (e.target.closest('.close-quickview-btn') || (e.target.classList.contains('modal-overlay') && document.querySelector('.quick-view-modal.active'))) {
        this.closeQuickView();
      }
    });
  }
};

window.ShopManager = ShopManager;
document.addEventListener('DOMContentLoaded', () => ShopManager.init());
