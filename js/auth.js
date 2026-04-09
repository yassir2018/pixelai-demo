// Auth utilities — DEMO MODE
function getToken() { return 'demo-token'; }
function setToken() {}
function removeToken() {}
function getUser() { return { name: 'Demo User', email: 'demo@pixelai.com' }; }
function setUser() {}
function isLoggedIn() { return true; }

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Login form — auto redirect in demo mode
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Demo mode — redirecting...', 'success');
    setTimeout(() => { window.location.href = '/pages/dashboard.html'; }, 800);
  });
}

// Register form — auto redirect in demo mode
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Demo mode — redirecting...', 'success');
    setTimeout(() => { window.location.href = '/pages/dashboard.html'; }, 800);
  });
}

// Google OAuth placeholder
const googleBtn = document.getElementById('googleAuthBtn');
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    showToast('Demo mode — Google OAuth not available', 'info');
  });
}
