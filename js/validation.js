/* ==========================================================================
   CHUDHARY PERFUMES - FORM VALIDATION UTILITIES
   ========================================================================== */

const ValidationManager = {
  init() {
    this.setupRealtimePasswordMeter();
  },

  sanitizeHTML(str) {
    if (typeof str !== 'string') return str || '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  calculatePasswordStrength(password) {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  },

  setupRealtimePasswordMeter() {
    const pwdInput = document.getElementById('reg-password');
    const bar = document.querySelector('.strength-bar');

    if (pwdInput && bar) {
      pwdInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const score = this.calculatePasswordStrength(val);
        
        bar.className = 'strength-bar';
        if (score === 0) {
          bar.style.width = '0%';
        } else if (score <= 2) {
          bar.classList.add('strength-weak');
        } else if (score === 3) {
          bar.classList.add('strength-medium');
        } else {
          bar.classList.add('strength-strong');
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => ValidationManager.init());
