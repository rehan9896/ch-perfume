/* ==========================================================================
   CHAUDHARY PARFUMS (Chaudhary Parfums Lahore)
   ARTISANAL OLFACTORY WISHLIST CONTROLLER
   ========================================================================== */

const WishlistManager = {
  STORAGE_KEY: 'cp_wishlist_items',

  HEART_ACTIVE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  HEART_INACTIVE: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,

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
  },

  toggleItem(product) {
    let items = this.getItems();
    const index = items.findIndex(item => item.id === product.id);

    if (index > -1) {
      items.splice(index, 1);
      if (window.showToast) window.showToast(`Removed ${product.name} from Wishlist`, 'info');
    } else {
      items.push(product);
      if (window.showToast) window.showToast(`Added ${product.name} to Wishlist`, 'success');
    }

    this.saveItems(items);
    this.updateHeartIcons();
  },

  isInWishlist(productId) {
    return this.getItems().some(item => item.id === productId);
  },

  updateBadge() {
    const count = this.getItems().length;
    document.querySelectorAll('.wishlist-badge-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  updateHeartIcons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productId = btn.getAttribute('data-product-id');
      if (productId && this.isInWishlist(productId)) {
        btn.classList.add('active');
        btn.innerHTML = this.HEART_ACTIVE;
        btn.style.color = 'var(--brand-gold)';
      } else if (productId) {
        btn.classList.remove('active');
        btn.innerHTML = this.HEART_INACTIVE;
        btn.style.color = 'var(--text-muted)';
      }
    });
  }
};

window.WishlistManager = WishlistManager;
document.addEventListener('DOMContentLoaded', () => {
  WishlistManager.updateBadge();
  WishlistManager.updateHeartIcons();
});
