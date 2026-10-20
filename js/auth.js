/* ==========================================================================
   CHUDHARY PERFUMES - AUTHENTICATION MANAGER
   ========================================================================== */

const AuthManager = {
  init() {
    this.bindTabEvents();
    this.bindFormEvents();
    this.setupPasswordToggle();
  },

  bindTabEvents() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetForm = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));

        tab.classList.add('active');
        const formEl = document.getElementById(`form-${targetForm}`);
        if (formEl) formEl.classList.add('active');
      });
    });
  },

  setupPasswordToggle() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-password')) {
        const icon = e.target.closest('.toggle-password');
        const input = icon.parentElement.querySelector('input');
        if (input) {
          const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
          input.setAttribute('type', type);
          icon.textContent = type === 'password' ? '👁️' : '🙈';
        }
      }
    });
  },

  bindFormEvents() {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const forgotForm = document.getElementById('form-forgot');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const user = { name: 'Eleanor Vance', email: email };
        localStorage.setItem('cp_current_user', JSON.stringify(user));
        
        if (window.showToast) window.showToast('Welcome back, Eleanor!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const user = { name: name, email: email };
        localStorage.setItem('cp_current_user', JSON.stringify(user));

        if (window.showToast) window.showToast('Account Created Successfully!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      });
    }

    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.showToast) window.showToast('Password reset link sent to your email', 'info');
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AuthManager.init());
