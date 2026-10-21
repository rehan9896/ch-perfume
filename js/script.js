/* ==========================================================================
   CHUDHARY PARFUMS (Chudhary Parfums Pakistan)
   GLOBAL CONTROLLER, MOBILE SIDEBAR DRAWER & CLEAN URLS
   ========================================================================== */

const CPApp = {
  init() {
    this.setupFileProtocolLinkFixer();
    this.setupCleanUrls();
    this.setupHeaderScroll();
    this.setupMobileMenu();
    this.highlightActiveNav();
    this.updateGlobalBadges();
    this.applySiteConfig();
    this.bindGlobalTrackers();
    this.setupFloatingCartButton();
  },

  /* ------------------------------------------------------------------------
     1. Local File Protocol Safety Helper (Prevents ERR_FILE_NOT_FOUND)
     ------------------------------------------------------------------------ */
  setupFileProtocolLinkFixer() {
    if (window.location.protocol === 'file:') {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        if (a.target === '_blank') return;

        if (href === '/' || href === '/index' || href === '/index.html') {
          e.preventDefault();
          window.location.href = 'index.html';
          return;
        }

        const [path, query] = href.split('?');
        if (path && !path.includes('.') && !path.endsWith('/')) {
          e.preventDefault();
          const cleanPath = path.startsWith('/') ? path.substring(1) : path;
          window.location.href = cleanPath + '.html' + (query ? '?' + query : '');
        }
      }, true);
    }
  },

  /* ------------------------------------------------------------------------
     2. Clean URLs Engine (Strips .html cleanly when served on HTTP / HTTPS)
     ------------------------------------------------------------------------ */
  setupCleanUrls() {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      const pathname = window.location.pathname;
      if (pathname.endsWith('.html')) {
        let cleanPath = pathname.replace(/\.html$/, '');
        if (cleanPath.endsWith('/index')) {
          cleanPath = cleanPath.slice(0, -5);
          if (cleanPath === '') cleanPath = '/';
        }
        const cleanUrl = cleanPath + window.location.search + window.location.hash;
        try {
          window.history.replaceState(null, '', cleanUrl);
        } catch(e) {}
      }
    }
  },

  applySiteConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem('cp_site_config'));
      if (!cfg) return;

      if (cfg.heroImg) {
        const heroImgEl = document.querySelector('.hero-section img');
        if (heroImgEl) heroImgEl.src = cfg.heroImg;
      }
      if (cfg.storyImg) {
        const storyImgEl = document.querySelector('.story-card img');
        if (storyImgEl) storyImgEl.src = cfg.storyImg;
      }
      if (cfg.heroTitle) {
        const heroTitleEl = document.querySelector('.hero-title');
        if (heroTitleEl) heroTitleEl.innerHTML = cfg.heroTitle;
      }
    } catch(e) {}
  },

  setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  },

  setupFloatingCartButton() {
    let btn = document.querySelector('.floating-cart-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'floating-cart-btn';
      btn.setAttribute('title', 'View Shopping Bag');
      btn.setAttribute('aria-label', 'Shopping Bag');
      btn.onclick = () => {
        if (window.CartManager) window.CartManager.openDrawer();
      };
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span>Shopping Bag</span>
        <span class="floating-cart-badge cart-badge-count">0</span>
      `;
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    if (window.CartManager) window.CartManager.updateBadge();
  },

  /* ------------------------------------------------------------------------
     3. Luxury Mobile Navigation Drop-Down Menu (Haute Parfumerie Dropdown)
     ------------------------------------------------------------------------ */
  setupMobileMenu() {
    // Backdrop overlay element
    let backdrop = document.getElementById('mobile-sidebar-backdrop');
    let drawer = document.getElementById('mobile-sidebar-drawer');

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mobile-sidebar-backdrop';
      backdrop.className = 'mobile-dropdown-backdrop mobile-sidebar-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'mobile-sidebar-drawer';
      drawer.className = 'mobile-nav-dropdown mobile-sidebar-drawer';
      drawer.setAttribute('aria-label', 'Mobile Navigation Dropdown');
      drawer.setAttribute('role', 'region');

      drawer.innerHTML = `
        <!-- Top Atmosphere Mode + Quick Tools Row -->
        <div class="mobile-dropdown-toolbar">
          <div class="mobile-sidebar-theme-toggle-row">
            <div class="theme-toggle-meta">
              <span class="theme-toggle-title">Atmosphere Mode</span>
              <span class="theme-toggle-subtitle" id="mobile-sidebar-theme-name">Day Mode</span>
            </div>
            <button class="theme-switch-slider" id="mobile-sidebar-theme-switch" role="switch" aria-label="Toggle Night and Day Mode" aria-checked="false">
              <span class="theme-switch-icon sun-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              </span>
              <span class="theme-switch-thumb"></span>
              <span class="theme-switch-icon moon-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </span>
            </button>
          </div>

          <div class="mobile-sidebar-quick-actions">
            <button class="mobile-sidebar-action-btn" id="mobile-sidebar-search-btn" aria-label="Search Fragrances">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search Scents</span>
            </button>
            <button class="mobile-sidebar-action-btn" id="mobile-sidebar-palette-btn" aria-label="Atelier Palettes">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".7" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".7" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".7" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".7" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
              <span>Palettes</span>
            </button>
          </div>
        </div>

        <!-- Curated Dropdown Navigation Links -->
        <nav class="mobile-sidebar-nav mobile-dropdown-nav">
          <div class="mobile-sidebar-section-label">CURATED ARCHIVES</div>
          
          <a href="index.html" class="mobile-sidebar-link" data-page="index">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </span>
            <span class="mobile-sidebar-text">Home Sanctuary</span>
          </a>

          <a href="shop.html" class="mobile-sidebar-link" data-page="shop">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 2h6v3H9z"></path>
                <path d="M10 5v2h4V5"></path>
                <rect x="5" y="7" width="14" height="14" rx="3"></rect>
                <circle cx="12" cy="14" r="2.5"></circle>
                <line x1="12" y1="10" x2="12" y2="11.5"></line>
              </svg>
            </span>
            <span class="mobile-sidebar-text">All Fragrances</span>
            <span class="sidebar-pill">6 EdP</span>
          </a>

          <a href="shop.html?cat=men" class="mobile-sidebar-link" data-page="shop-men">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="5"></circle><line x1="19" y1="5" x2="13.6" y2="10.4"></line><line x1="19" y1="5" x2="14" y2="5"></line><line x1="19" y1="5" x2="19" y2="10"></line></svg>
            </span>
            <span class="mobile-sidebar-text">For Him</span>
          </a>

          <a href="shop.html?cat=women" class="mobile-sidebar-link" data-page="shop-women">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"></circle><line x1="12" y1="14" x2="12" y2="21"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>
            </span>
            <span class="mobile-sidebar-text">For Her</span>
          </a>

          <a href="shop.html?cat=unisex" class="mobile-sidebar-link" data-page="shop-unisex">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="12" r="4.5"></circle>
                <circle cx="15" cy="12" r="4.5"></circle>
              </svg>
            </span>
            <span class="mobile-sidebar-text">Unisex</span>
          </a>

          <div class="mobile-sidebar-section-label">CLIENT CONCIERGE & ORDERS</div>

          <a href="checkout.html" class="mobile-sidebar-link" data-page="checkout">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </span>
            <span class="mobile-sidebar-text">Checkout & COD</span>
            <span class="sidebar-pill-gold">Express</span>
          </a>

          <a href="javascript:void(0)" class="mobile-sidebar-link" id="mobile-sidebar-track-link">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </span>
            <span class="mobile-sidebar-text">Track Order</span>
          </a>

          <a href="about-us.html" class="mobile-sidebar-link" data-page="about-us">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </span>
            <span class="mobile-sidebar-text">Our Story</span>
          </a>

          <a href="contact-us.html" class="mobile-sidebar-link" data-page="contact-us">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </span>
            <span class="mobile-sidebar-text">Client Concierge</span>
          </a>

          <a href="dashboard.html" class="mobile-sidebar-link" data-page="dashboard">
            <span class="mobile-sidebar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <span class="mobile-sidebar-text">My Orders</span>
          </a>
        </nav>

        <!-- Dropdown Footer: WhatsApp Direct CTA -->
        <div class="mobile-sidebar-footer mobile-dropdown-footer">
          <a href="https://wa.me/923403256108?text=Hello%20Chudhary%20Parfums%2C%20I%20would%20like%20to%20place%20an%20order%20for%20your%20luxury%20perfumes." target="_blank" rel="noopener noreferrer" class="mobile-sidebar-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            <span>VIP WhatsApp Concierge</span>
          </a>
          <div class="mobile-sidebar-tagline">
            Hand-Poured in Pakistan &bull; Free Insured Delivery
          </div>
        </div>
      `;

      const header = document.querySelector('.header');
      if (header) {
        header.appendChild(drawer);
      } else {
        document.body.appendChild(drawer);
      }
    } else {
      const header = document.querySelector('.header');
      if (header && drawer.parentElement !== header) {
        header.appendChild(drawer);
      }
    }

    const openDrawer = () => {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      });
    };

    const closeDrawer = () => {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
    };

    // Bind triggers & inject animated 3-bar toggler icon
    document.querySelectorAll('.mobile-menu-btn, [data-mobile-menu]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-haspopup', 'true');
      if (!btn.querySelector('.toggler-bars')) {
        btn.innerHTML = `
          <span class="toggler-bars" aria-hidden="true">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
          </span>
        `;
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (drawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    });

    const closeBtn = document.getElementById('mobile-sidebar-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Close dropdown on window resize to desktop viewport
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && drawer.classList.contains('active')) {
        closeDrawer();
      }
    }, { passive: true });

    // Close dropdown when any internal link is clicked
    drawer.querySelectorAll('.mobile-sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (!link.getAttribute('href') || link.getAttribute('href') === 'javascript:void(0)') return;
        closeDrawer();
      });
    });

    // Sync Theme Toggler Switch state
    const syncThemeSwitchState = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('cp_theme_pref') || 'light';
      const switchEl = document.getElementById('mobile-sidebar-theme-switch');
      const labelEl = document.getElementById('mobile-sidebar-theme-name');
      if (switchEl) {
        if (currentTheme === 'dark') {
          switchEl.classList.add('is-dark');
          switchEl.setAttribute('aria-checked', 'true');
        } else {
          switchEl.classList.remove('is-dark');
          switchEl.setAttribute('aria-checked', 'false');
        }
      }
      if (labelEl) {
        labelEl.textContent = currentTheme === 'dark' ? 'Night Mode (Obsidian)' : 'Day Mode (Modern Noir)';
      }
    };

    syncThemeSwitchState();

    // Bind Theme Switch Slider
    const themeSwitchBtn = document.getElementById('mobile-sidebar-theme-switch');
    if (themeSwitchBtn) {
      themeSwitchBtn.addEventListener('click', () => {
        if (window.ThemeManager && window.ThemeManager.toggleTheme) {
          window.ThemeManager.toggleTheme();
        } else {
          const mainThemeBtn = document.querySelector('.theme-toggle-btn');
          if (mainThemeBtn) mainThemeBtn.click();
        }
        syncThemeSwitchState();
      });
    }

    // Bind Search Trigger inside Drawer
    const searchBtn = document.getElementById('mobile-sidebar-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        closeDrawer();
        const mainSearchBtn = document.querySelector('.search-trigger-btn');
        if (mainSearchBtn) {
          mainSearchBtn.click();
        } else if (window.SearchManager && window.SearchManager.openModal) {
          window.SearchManager.openModal();
        }
      });
    }

    // Bind Palettes Modal Trigger inside Drawer
    const paletteBtn = document.getElementById('mobile-sidebar-palette-btn');
    if (paletteBtn) {
      paletteBtn.addEventListener('click', () => {
        closeDrawer();
        if (window.ThemeManager && window.ThemeManager.ensurePaletteModal) {
          window.ThemeManager.ensurePaletteModal();
          const overlay = document.querySelector('.palette-modal-overlay');
          const drawerP = document.querySelector('.palette-drawer');
          if (overlay && drawerP) {
            overlay.classList.add('active');
            drawerP.classList.add('active');
          }
        } else {
          const mainPaletteBtn = document.querySelector('.palette-trigger-btn');
          if (mainPaletteBtn) mainPaletteBtn.click();
        }
      });
    }

    // Bind Track Consignment Link inside Drawer
    const trackLink = document.getElementById('mobile-sidebar-track-link');
    if (trackLink) {
      trackLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        window.openGlobalOrderTracker();
      });
    }

    // Highlight active link in mobile dropdown
    let currentPath = window.location.pathname.split('/').pop().replace(/\.html$/, '');
    if (!currentPath || currentPath === 'index') currentPath = 'index';
    const currentParams = new URLSearchParams(window.location.search);
    const activeCat = (currentParams.get('cat') || currentParams.get('category') || '').toLowerCase();

    drawer.querySelectorAll('.mobile-sidebar-link').forEach(link => {
      const pageKey = link.getAttribute('data-page');
      if (currentPath === 'shop' && activeCat) {
        if (pageKey === `shop-${activeCat}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } else if (pageKey === currentPath && !activeCat) {
        link.classList.add('active');
      } else if (pageKey === currentPath && currentPath !== 'shop') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  highlightActiveNav() {
    let rawPath = window.location.pathname.replace(/\.html$/, '');
    if (rawPath === '' || rawPath === '/index') rawPath = '/';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      let cleanHref = href.split('?')[0].replace(/\.html$/, '');
      if (cleanHref === '' || cleanHref === '/index' || cleanHref === 'index') cleanHref = '/';
      if (cleanHref === rawPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  updateGlobalBadges() {
    if (window.CartManager) window.CartManager.updateBadge();
    if (window.WishlistManager) window.WishlistManager.updateBadge();
  },

  bindGlobalTrackers() {
    document.querySelectorAll('a[href*="dashboard"]').forEach(link => {
      if (link.textContent.includes('Track My Order') || link.textContent.includes('Track Order') || link.textContent.includes('Consignment Tracking')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.openGlobalOrderTracker();
        });
      }
    });
  }
};

/* --------------------------------------------------------------------------
   Global Toast Notification System
   -------------------------------------------------------------------------- */
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container') || document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : '✦';
  toast.innerHTML = `<span class="toast-icon" style="font-weight:700;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
};

/* --------------------------------------------------------------------------
   PostEx Courier Logistics Status Tracking Modal System
   -------------------------------------------------------------------------- */
const POSTEX_STATUS_CODES = {
  '0001': { code: '0001', name: "At Merchant Warehouse", color: '#38bdf8' },
  '0002': { code: '0002', name: "Returned to Origin", color: '#ef4444' },
  '0003': { code: '0003', name: "At PostEx Logistics Hub", color: '#f59e0b' },
  '0004': { code: '0004', name: "Out For Delivery", color: '#e67e22' },
  '0005': { code: '0005', name: "Delivered & COD Collected", color: '#10b981' },
  '0006': { code: '0006', name: "Returned to Origin", color: '#ef4444' },
  '0007': { code: '0007', name: "Returned & Settled", color: '#ef4444' },
  '0008': { code: '0008', name: "Delivery Under Review", color: '#8b5cf6' },
  '0013': { code: '0013', name: "Attempt Made", color: '#f59e0b' },
  '0015': { code: '0015', name: "Picked By Courier Logistics", color: '#38bdf8' },
  '0016': { code: '0016', name: "Out For Return", color: '#ef4444' },
  '0017': { code: '0017', name: "Attempted Delivery", color: '#f59e0b' },
  '0018': { code: '0018', name: "En-Route to Logistics Hub", color: '#38bdf8' }
};

window.openGlobalOrderTracker = function(prefillId = '') {
  let modalOverlay = document.querySelector('.global-tracker-overlay');
  let modalContainer = document.querySelector('.global-tracker-modal');

  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'global-tracker-overlay';
    modalOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(10,10,12,0.85); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); z-index:99998; display:none;';
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener('click', () => window.closeGlobalOrderTracker());
  }

  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.className = 'global-tracker-modal';
    modalContainer.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:var(--bg-card); border:1px solid var(--border-color); padding:32px 24px; border-radius:12px; width:92%; max-width:580px; z-index:99999; box-shadow:var(--shadow-lg); display:none; max-height:90vh; overflow-y:auto;';
    document.body.appendChild(modalContainer);
  }

  modalOverlay.style.display = 'block';
  modalContainer.style.display = 'block';
  renderTrackerPrompt(prefillId);
};

window.closeGlobalOrderTracker = function() {
  const modalOverlay = document.querySelector('.global-tracker-overlay');
  const modalContainer = document.querySelector('.global-tracker-modal');
  if (modalOverlay) modalOverlay.style.display = 'none';
  if (modalContainer) modalContainer.style.display = 'none';
};

function renderTrackerPrompt(prefillId = '') {
  const modalContainer = document.querySelector('.global-tracker-modal');
  if (!modalContainer) return;

  // Retrieve any real orders from localStorage
  let recentOrders = [];
  try {
    const placed = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
    const history = JSON.parse(localStorage.getItem('cp_order_history')) || [];
    const combined = [...placed, ...history];
    const seen = new Set();
    recentOrders = combined.filter(o => {
      const id = o.id || o.orderId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    }).slice(0, 3);
  } catch(e) {}

  const recentHtml = recentOrders.length > 0 
    ? `
      <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:8px; border:1px solid var(--border-color); font-size:0.82rem; color:var(--text-secondary); line-height:1.6;">
        <strong style="color:var(--text-primary);">Your Recent Placed Orders:</strong><br>
        ${recentOrders.map(o => `
          <button type="button" onclick="window.executeOrderTracking('${o.id || o.orderId}')" style="background:transparent; border:none; padding:0; color:var(--brand-gold); font-weight:700; cursor:pointer; text-decoration:underline; margin-right:12px; font-size:0.84rem;">
            ${o.id || o.orderId} (${o.status || 'Pending'})
          </button>
        `).join('')}
      </div>
    `
    : `
      <div style="background:var(--bg-secondary); padding:12px 16px; border-radius:8px; border:1px solid var(--border-color); font-size:0.82rem; color:var(--text-muted); line-height:1.5;">
        💡 <em>Your Order Number was provided upon checkout and sent to your WhatsApp (e.g. <code>CH-001</code>).</em>
      </div>
    `;

  modalContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <span class="badge" style="background:transparent; border:1px solid var(--border-gold); color:var(--brand-gold); margin-bottom:6px;">Chudhary Perfumes</span>
        <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-primary); margin:0; font-weight:700;">Track Your Order</h3>
      </div>
      <button onclick="window.closeGlobalOrderTracker()" style="background:none; border:none; color:var(--text-muted); font-size:1.3rem; cursor:pointer;" aria-label="Close">✕</button>
    </div>

    <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.6;">
      Enter your <strong>Order Number</strong> to track the real-time status of your order:
    </p>

    <form onsubmit="event.preventDefault(); window.executeOrderTracking(document.getElementById('track-input-id').value);" style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <label style="display:block; font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">Order Number:</label>
        <div style="display:flex; gap:10px;">
          <input type="text" id="track-input-id" value="${prefillId}" placeholder="e.g. CH-001 or 001" required style="flex:1; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:6px; color:var(--text-primary); font-size:16px; outline:none;">
          <button type="submit" class="btn btn-primary" style="padding:12px 20px; font-weight:700;">Track Order</button>
        </div>
      </div>

      ${recentHtml}
    </form>
  `;
}

window.executeOrderTracking = async function(queryId) {
  const cleanInput = (queryId || '').trim();
  if (!cleanInput) return;

  const modalContainer = document.querySelector('.global-tracker-modal');
  if (!modalContainer) return;

  const cleanId = cleanInput.toUpperCase().replace(/\s+/g, '-');
  const numericOnly = cleanInput.replace(/[^0-9]/g, '');
  const withoutPrefix = cleanInput.toUpperCase().replace(/^#?(CP|CH)[- ]?/, '');

  let orders = [];
  try {
    const placed = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
    const history = JSON.parse(localStorage.getItem('cp_order_history')) || [];
    orders = [...placed, ...history];
  } catch(e) {}

  // Fetch real-time cloud orders if Supabase is connected
  if (window.CloudDB && window.CloudDB.isConnected()) {
    try {
      const cloudOrders = await window.CloudDB.getOrders();
      orders = [...orders, ...cloudOrders];
    } catch(e) {}
  }

  // Deduplicate orders
  const seen = new Set();
  orders = orders.filter(o => {
    const id = o.id || o.orderId;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  // Find matching real-time order
  const order = orders.find(o => {
    const rawOid = ((o.id || o.orderId || '') + '').toUpperCase();
    if (!rawOid) return false;
    const oid = rawOid.replace(/\s+/g, '-');
    const oNum = oid.replace(/[^0-9]/g, '');
    const cleanOid = oid.replace(/^#?(CP|CH)[- ]?/, '');

    return oid === cleanId || 
           oid === `CH-${cleanId}` ||
           oid === `CP-${cleanId}` ||
           cleanOid === withoutPrefix ||
           (numericOnly && parseInt(oNum, 10) === parseInt(numericOnly, 10));
  });

  // If order NOT FOUND: Display clear, real-time message without generating fake mockup data
  if (!order) {
    modalContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <span class="badge" style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid #ef4444; font-weight:700;">Order Not Found</span>
          <h3 style="font-size:1.35rem; font-family:var(--font-heading); color:var(--text-primary); margin-top:4px; font-weight:700;">Order #${cleanInput}</h3>
        </div>
        <button onclick="window.closeGlobalOrderTracker()" style="background:none; border:none; color:var(--text-muted); font-size:1.3rem; cursor:pointer;" aria-label="Close">✕</button>
      </div>

      <div style="background:var(--bg-secondary); padding:24px 20px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:20px; text-align:center;">
        <div style="font-size:2.4rem; margin-bottom:12px;">🔎</div>
        <h4 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:8px; font-weight:700;">No Real-Time Order Found</h4>
        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.6; max-width:440px; margin:0 auto 18px;">
          We could not find an active order matching <strong>"${cleanInput}"</strong>. Please verify your Order Number from your confirmation message or order history.
        </p>
        <a href="https://api.whatsapp.com/send?phone=923403256108&text=${encodeURIComponent(`Hello Chudhary Perfumes, I need help checking the status of my order ${cleanInput}`)}" target="_blank" class="btn btn-outline" style="display:inline-flex; align-items:center; gap:8px; font-size:0.84rem; padding:10px 18px; border-color:#25D366; color:#25D366; text-decoration:none; font-weight:600;">
          💬 Inquire on WhatsApp (+92 340 3256108)
        </a>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button onclick="renderTrackerPrompt('${cleanInput}')" class="btn btn-outline" style="font-size:0.82rem; padding:8px 16px;">← Search Another Order</button>
        <button onclick="window.closeGlobalOrderTracker()" class="btn btn-primary" style="font-size:0.82rem; padding:8px 16px;">Close</button>
      </div>
    `;
    return;
  }

  // Real-time order status tracking
  const currentStatus = order.status || 'Pending COD';
  const isDelivered = currentStatus === 'Delivered';
  const isDispatched = currentStatus === 'Dispatched' || isDelivered;
  const isProcessing = currentStatus === 'Processing' || currentStatus === 'Payment Verified (SS Attached)' || isDispatched;

  let statusBadgeColor = '#f59e0b';
  let statusText = currentStatus;
  if (isDelivered) {
    statusBadgeColor = '#10b981';
  } else if (isDispatched) {
    statusBadgeColor = '#38bdf8';
  } else if (isProcessing) {
    statusBadgeColor = '#3b82f6';
  }

  const itemsText = Array.isArray(order.items)
    ? order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
    : (order.items || 'Chudhary Perfumes Fragrance');

  const orderNum = order.orderId || order.id || cleanInput;

  modalContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div>
        <span class="badge" style="background:transparent; border:1px solid var(--border-gold); color:var(--brand-gold);">Real-Time Order Status</span>
        <h3 style="font-size:1.4rem; font-family:var(--font-heading); color:var(--text-primary); margin-top:4px; font-weight:700;">Order #${orderNum}</h3>
      </div>
      <button onclick="window.closeGlobalOrderTracker()" style="background:none; border:none; color:var(--text-muted); font-size:1.3rem; cursor:pointer;" aria-label="Close">✕</button>
    </div>

    <!-- Live Order Details Card -->
    <div style="background:var(--bg-secondary); padding:16px; border-radius:8px; border:1px solid var(--border-color); margin-bottom:20px; font-size:0.85rem; line-height:1.7;">
      <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
        <div><strong>Order Placed:</strong> <span style="color:var(--text-muted);">${order.date || 'Recent'}</span></div>
        <div><strong>Status:</strong> <span class="badge" style="background:${statusBadgeColor}; color:#fff; font-weight:600;">${statusText}</span></div>
      </div>
      <div><strong>Customer:</strong> ${order.customerName || 'Valued Customer'} ${order.phone ? `(${order.phone})` : ''}</div>
      <div><strong>Delivery City:</strong> <strong style="color:var(--text-primary);">${order.city || 'Pakistan'}</strong></div>
      ${order.address ? `<div style="font-size:0.8rem; color:var(--text-muted);"><strong>Address:</strong> ${order.address}</div>` : ''}
      <div style="margin-top:4px;"><strong>Items:</strong> ${itemsText}</div>
      <div style="margin-top:4px;"><strong>Total Bill:</strong> <strong style="color:var(--brand-gold); font-size:1rem;">PKR ${parseFloat(order.total || 0).toLocaleString()}</strong> (${order.paymentMethod || 'Cash on Delivery'})</div>
    </div>

    <!-- Real-Time Timeline Progress Stepper -->
    <div style="display:flex; flex-direction:column; gap:18px; position:relative; padding-left:24px; border-left:2px solid var(--border-color); margin-bottom:24px;">
      
      <!-- Step 1 -->
      <div style="position:relative;">
        <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:var(--status-success); border:3px solid var(--bg-card);"></div>
        <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem;">1. Order Placed & Confirmed</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${order.date || 'Just now'} • Order logged in system</div>
      </div>

      <!-- Step 2 -->
      <div style="position:relative;">
        <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isProcessing ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
        <div style="font-weight:700; color:${isProcessing ? 'var(--text-primary)' : 'var(--text-muted)'}; font-size:0.88rem;">2. Packaging & Quality Inspection</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${isProcessing ? 'Fragrance flacons packed, bubble-wrapped & sealed' : 'Awaiting packaging & fulfillment verification'}</div>
      </div>

      <!-- Step 3 -->
      <div style="position:relative;">
        <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isDispatched ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
        <div style="font-weight:700; color:${isDispatched ? 'var(--text-primary)' : 'var(--text-muted)'}; font-size:0.88rem;">3. Dispatched for Delivery</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${isDispatched ? `In transit with PostEx Courier to ${order.city || 'your city'}` : 'Handed over to courier service once dispatched'}</div>
      </div>

      <!-- Step 4 -->
      <div style="position:relative;">
        <div style="position:absolute; left:-33px; top:0; width:16px; height:16px; border-radius:50%; background:${isDelivered ? 'var(--status-success)' : 'var(--border-color)'}; border:3px solid var(--bg-card);"></div>
        <div style="font-weight:700; color:${isDelivered ? 'var(--text-primary)' : 'var(--text-muted)'}; font-size:0.88rem;">4. Delivered to Doorstep</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${isDelivered ? 'Delivered successfully' : 'Delivered within 2 to 4 working days'}</div>
      </div>

    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <button onclick="renderTrackerPrompt('${orderNum}')" class="btn btn-outline" style="font-size:0.82rem; padding:8px 16px;">Track Another Order</button>
      <button onclick="window.closeGlobalOrderTracker()" class="btn btn-primary" style="font-size:0.82rem; padding:8px 16px;">Close</button>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  CPApp.init();

  // Local file:// protocol compatibility helper (Appends .html dynamically ONLY when running locally in Windows Explorer)
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('https') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        const cleanPath = href.split('?')[0].split('#')[0];
        const queryHash = href.substring(cleanPath.length);
        if (cleanPath === '/' || cleanPath === '') {
          link.setAttribute('href', 'index.html' + queryHash);
        } else if (!cleanPath.endsWith('.html')) {
          link.setAttribute('href', cleanPath + '.html' + queryHash);
        }
      }
    });
  }
});
