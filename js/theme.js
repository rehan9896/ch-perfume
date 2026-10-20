/* ==========================================================================
   CHAUDHARY PARFUMS (Chaudhary Parfums Lahore)
   LIVE ATELIER THEME & PALETTE MANAGER
   Supports 4 Haute Parfumerie Aesthetics with Instant Real-Time Switching
   ========================================================================== */

const ThemeManager = {
  THEME_KEY: 'cp_theme_pref',
  PALETTE_KEY: 'cp_palette_pref',

  palettes: {
    'cashmere-amber': {
      id: 'cashmere-amber',
      name: 'Warm Cashmere & Amber',
      tagline: 'Architectural Warm Stone, Burnished Bronze & Tactile Oat',
      inspiration: 'Le Labo / Aesop Aesthetic',
      swatches: ['#141311', '#23201C', '#C88A58']
    },
    'emerald-gold': {
      id: 'emerald-gold',
      name: 'Imperial Emerald & Gold',
      tagline: 'Jewel-Toned Emerald Velvet & Antique Champagne Gold',
      inspiration: 'Roja Parfums / Baccarat Aesthetic',
      swatches: ['#061711', '#102C23', '#D4AF37']
    },
    'midnight-burgundy': {
      id: 'midnight-burgundy',
      name: 'Midnight Burgundy & Rose Gold',
      tagline: 'Velvety Plum-Black, Satin Rose Gold & Pearl Ivory',
      inspiration: 'Tom Ford Private Blend Aesthetic',
      swatches: ['#120914', '#251629', '#E5A89B']
    },
    'modern-noir': {
      id: 'modern-noir',
      name: 'Modern Noir & Silver',
      tagline: 'Obsidian Velvet, Carbon Grey & Liquid Platinum Silver',
      inspiration: 'Byredo / Minimalist Haute Couture',
      swatches: ['#0A0A0C', '#18181D', '#F1F5F9']
    }
  },

  SVGS: {
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    palette: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".7" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".7" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".7" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".7" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
  },

  init() {
    try {
      if (localStorage.getItem('cp_theme_v3') !== 'true') {
        localStorage.setItem(this.PALETTE_KEY, 'modern-noir');
        localStorage.setItem(this.THEME_KEY, 'light');
        localStorage.setItem('cp_theme_v3', 'true');
      }
    } catch (e) {}

    const savedPalette = localStorage.getItem(this.PALETTE_KEY) || 'modern-noir';
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';

    this.setPalette(savedPalette, false);
    this.setTheme(savedTheme, false);

    this.injectPaletteButton();
    this.ensurePaletteModal();
    this.bindEvents();
  },

  setPalette(paletteId, notify = true) {
    if (!this.palettes[paletteId]) paletteId = 'modern-noir';
    document.documentElement.setAttribute('data-palette', paletteId);
    localStorage.setItem(this.PALETTE_KEY, paletteId);

    this.updatePaletteModalUI(paletteId);

    if (notify && window.showToast) {
      window.showToast(`Applied ${this.palettes[paletteId].name}`, 'success');
    }
  },

  setTheme(theme, notify = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateToggleButtons(theme);

    if (notify && window.showToast) {
      window.showToast(`Switched to ${theme === 'dark' ? 'Night' : 'Day'} Mode`, 'info');
    }
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme, true);
  },

  updateToggleButtons(theme) {
    const btns = document.querySelectorAll('.theme-toggle-btn');
    btns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? this.SVGS.sun : this.SVGS.moon;
      btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Day Light' : 'Night Dark'} Mode`);
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Day Light' : 'Night Dark'} Mode`);
    });

    const sidebarSwitch = document.getElementById('mobile-sidebar-theme-switch');
    const sidebarLabel = document.getElementById('mobile-sidebar-theme-name');
    if (sidebarSwitch) {
      if (theme === 'dark') {
        sidebarSwitch.classList.add('is-dark');
        sidebarSwitch.setAttribute('aria-checked', 'true');
      } else {
        sidebarSwitch.classList.remove('is-dark');
        sidebarSwitch.setAttribute('aria-checked', 'false');
      }
    }
    if (sidebarLabel) {
      sidebarLabel.textContent = theme === 'dark' ? 'Night Mode (Obsidian)' : 'Day Mode (Modern Noir)';
    }

    const modalThemeBtn = document.getElementById('modal-theme-toggle-btn');
    if (modalThemeBtn) {
      modalThemeBtn.innerHTML = `${theme === 'dark' ? this.SVGS.sun : this.SVGS.moon} Switch to ${theme === 'dark' ? 'Day Light' : 'Night Dark'} Mode`;
    }
  },

  injectPaletteButton() {
    document.querySelectorAll('.nav-actions').forEach(actions => {
      if (!actions.querySelector('.palette-trigger-btn')) {
        const btn = document.createElement('button');
        btn.className = 'btn-icon palette-trigger-btn';
        btn.setAttribute('title', 'Atelier Theme Palettes');
        btn.setAttribute('aria-label', 'Atelier Theme Palettes');
        btn.innerHTML = this.SVGS.palette;

        const themeBtn = actions.querySelector('.theme-toggle-btn');
        if (themeBtn) {
          actions.insertBefore(btn, themeBtn);
        } else {
          actions.prepend(btn);
        }
      }
    });
  },

  ensurePaletteModal() {
    let overlay = document.querySelector('.palette-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'palette-modal-overlay';
      document.body.appendChild(overlay);
    }

    let drawer = document.querySelector('.palette-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.className = 'palette-drawer';
      document.body.appendChild(drawer);
    }

    const currentPalette = localStorage.getItem(this.PALETTE_KEY) || 'modern-noir';
    const currentTheme = localStorage.getItem(this.THEME_KEY) || 'light';

    drawer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px;">
        <div>
          <span class="badge" style="background:transparent; border:1px solid var(--border-gold); color:var(--brand-gold); margin-bottom:6px;">Atelier Atmosphere</span>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:var(--text-primary); margin:0; font-weight:700;">Aesthetic Palettes</h3>
        </div>
        <button class="close-palette-btn" style="background:none; border:none; color:var(--text-muted); font-size:1.3rem; cursor:pointer;" aria-label="Close Palette Switcher">✕</button>
      </div>

      <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">
        Select an olfactory aesthetic to immerse your viewing experience:
      </p>

      <div class="palette-cards-container">
        ${Object.values(this.palettes).map(p => `
          <div class="palette-card ${p.id === currentPalette ? 'active' : ''}" data-palette-id="${p.id}">
            <div>
              <div style="font-weight:700; font-size:0.92rem; color:var(--text-primary); font-family:var(--font-heading); margin-bottom:2px;">
                ${p.name}
              </div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${p.tagline}</div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
              <div class="palette-swatches">
                ${p.swatches.map(c => `<span class="palette-swatch-dot" style="background:${c};"></span>`).join('')}
              </div>
              <div class="palette-active-indicator" style="color:var(--brand-gold); width:18px; text-align:center;">
                ${p.id === currentPalette ? this.SVGS.check : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
        <button id="modal-theme-toggle-btn" class="btn btn-outline" style="font-size:0.78rem; padding:8px 14px; display:inline-flex; align-items:center; gap:8px;">
          ${currentTheme === 'dark' ? this.SVGS.sun : this.SVGS.moon} Switch to ${currentTheme === 'dark' ? 'Day Light' : 'Night Dark'} Mode
        </button>
        <button class="btn btn-primary close-palette-btn" style="font-size:0.8rem; padding:8px 18px;">Apply Atmosphere</button>
      </div>
    `;
  },

  updatePaletteModalUI(activePaletteId) {
    document.querySelectorAll('.palette-card').forEach(card => {
      const pid = card.getAttribute('data-palette-id');
      const indicator = card.querySelector('.palette-active-indicator');
      if (pid === activePaletteId) {
        card.classList.add('active');
        if (indicator) indicator.innerHTML = this.SVGS.check;
      } else {
        card.classList.remove('active');
        if (indicator) indicator.innerHTML = '';
      }
    });
  },

  openPaletteModal() {
    this.ensurePaletteModal();
    const overlay = document.querySelector('.palette-modal-overlay');
    const drawer = document.querySelector('.palette-drawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
    }
  },

  closePaletteModal() {
    document.querySelector('.palette-modal-overlay')?.classList.remove('active');
    document.querySelector('.palette-drawer')?.classList.remove('active');
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.palette-trigger-btn')) {
        this.openPaletteModal();
      }
      if (e.target.closest('.close-palette-btn') || e.target.classList.contains('palette-modal-overlay')) {
        this.closePaletteModal();
      }
      if (e.target.closest('.theme-toggle-btn') || e.target.closest('#modal-theme-toggle-btn')) {
        this.toggleTheme();
      }

      const card = e.target.closest('.palette-card');
      if (card) {
        const paletteId = card.getAttribute('data-palette-id');
        if (paletteId) {
          this.setPalette(paletteId, true);
        }
      }
    });
  }
};

// Immediate inline theme initialization to prevent refresh flash
(function() {
  try {
    if (localStorage.getItem('cp_theme_v3') !== 'true') {
      localStorage.setItem('cp_palette_pref', 'modern-noir');
      localStorage.setItem('cp_theme_pref', 'light');
      localStorage.setItem('cp_theme_v3', 'true');
    }
    var p = localStorage.getItem('cp_palette_pref') || 'modern-noir';
    var t = localStorage.getItem('cp_theme_pref') || 'light';
    document.documentElement.setAttribute('data-palette', p);
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();

window.ThemeManager = ThemeManager;
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
