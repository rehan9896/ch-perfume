/* ==========================================================================
   CHUDHARY PERFUMES - LIVE SEARCH MODAL MANAGER (PKR CURRENCY)
   ========================================================================== */

const SearchManager = {
  init() {
    this.bindEvents();
  },

  toggleSearchModal() {
    const modal = document.querySelector('.search-modal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
      modal.classList.toggle('active');
      overlay.classList.toggle('active');
      if (modal.classList.contains('active')) {
        document.querySelector('.search-input')?.focus();
      }
    }
  },

  handleSearch(query) {
    const resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) return;

    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) {
      resultsContainer.innerHTML = '<div style="color:var(--text-muted); padding:12px; text-align:center;">Type perfume name, note, or scent family...</div>';
      return;
    }

    const allProducts = window.ProductCatalog || [];
    const filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      p.notes.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center;">No matching luxury fragrances found.</div>';
    } else {
      resultsContainer.innerHTML = filtered.map(p => `
        <div class="cart-item" style="cursor:pointer;" onclick="window.location.href='shop.html?id=${p.id}'">
          <img src="${p.image}" alt="${p.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${p.name}</div>
            <div style="font-size:0.75rem; color:var(--accent-gold);">${p.category}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${p.notes}</div>
          </div>
          <div style="font-weight:700; color:var(--accent-gold);">PKR ${p.price.toLocaleString()}</div>
        </div>
      `).join('');
    }
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.search-trigger-btn')) {
        this.toggleSearchModal();
      }
      if (e.target.closest('.close-search-btn') || e.target.classList.contains('modal-overlay')) {
        document.querySelector('.search-modal')?.classList.remove('active');
        document.querySelector('.modal-overlay')?.classList.remove('active');
      }
    });

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    }
  }
};

window.SearchManager = SearchManager;
document.addEventListener('DOMContentLoaded', () => SearchManager.init());
