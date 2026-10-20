/* ==========================================================================
   CHUDHARY PERFUMES - ANIMATIONS & TOAST NOTIFICATION SYSTEM (HUMAN DESIGNED)
   ========================================================================== */

// Global Toast Notification Helper
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: '✦'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon" style="font-weight:700;">${icons[type] || '✦'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Scroll Reveal Observer & Auto-Stagger Animation Engine
const AnimationManager = {
  observer: null,
  mutationObserver: null,
  debounceTimer: null,

  init() {
    this.setupObserver();
    this.autoTagElements();
    this.setupMutationObserver();
  },

  setupObserver() {
    if (this.observer) return;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => this.observer.observe(el));
  },

  setupMutationObserver() {
    if (!window.MutationObserver || this.mutationObserver) return;
    this.mutationObserver = new MutationObserver(() => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.refresh();
      }, 80);
    });
    this.mutationObserver.observe(document.body, { childList: true, subtree: true });
  },

  autoTagElements() {
    const selectors = [
      '.product-card',
      '.story-card',
      '.atelier-card',
      '.review-card',
      '.feature-item',
      '.stat-card',
      '.fragrance-card',
      '.checkout-card',
      '.guarantee-item',
      '.step-card',
      '.pak-trust-card',
      '.pak-trust-item'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach((el, index) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
        const stagger = (index % 4) + 1;
        el.classList.add(`reveal-stagger-${stagger}`);
        if (this.observer) this.observer.observe(el);
      }
    });
  },

  refresh() {
    if (!this.observer) this.setupObserver();
    this.autoTagElements();
    document.querySelectorAll('.reveal-on-scroll:not(.visible)').forEach(el => {
      this.observer.observe(el);
    });
  }
};

window.AnimationManager = AnimationManager;
document.addEventListener('DOMContentLoaded', () => AnimationManager.init());
