// Dashboard JS
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  setupLogout();
});

function loadDashboardData() {
  // Load user info
  const user = getUser();
  const token = getToken();

  if (user) {
    const nameEl = document.getElementById('welcomeName');
    if (nameEl) nameEl.textContent = user.name || user.email || 'User';
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      const initial = (user.name || user.email || 'U')[0].toUpperCase();
      avatarEl.textContent = initial;
    }
  }

  // Load history from API
  if (token) {
    fetch('/api/user/history', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(r => r.json())
    .then(data => {
      renderHistory(data.images || []);
      if (data.credits !== undefined) updateCredits(data.credits, data.max_credits || 10);
    })
    .catch(() => {
      // Demo data
      renderHistory(getDemoHistory());
      updateCredits(7, 10);
    });
  } else {
    renderHistory(getDemoHistory());
    updateCredits(7, 10);
  }
}

function getDemoHistory() {
  return [
    { id: 1, name: 'landscape.jpg', date: '2024-01-15', scale: '4x', mode: 'General' },
    { id: 2, name: 'portrait.png', date: '2024-01-14', scale: '2x', mode: 'Portrait' },
    { id: 3, name: 'anime_art.jpg', date: '2024-01-13', scale: '4x', mode: 'Anime' },
  ];
}

function renderHistory(images) {
  const grid = document.getElementById('historyGrid');
  if (!grid) return;

  if (!images || images.length === 0) {
    grid.innerHTML = `<div class="history-empty">
      <i class="fas fa-images"></i>
      <p>No enhanced images yet. <a href="/pages/enhance.html">Enhance your first image!</a></p>
    </div>`;
    return;
  }

  grid.innerHTML = images.map(img => `
    <div class="history-card">
      <div class="history-thumb">
        ${img.thumb_url ? `<img src="${img.thumb_url}" alt="${img.name}">` :
          `<div class="history-thumb-placeholder">
            <i class="fas fa-image"></i>
          </div>`
        }
        <div class="history-overlay">
          <span class="history-badge">${img.scale || '4x'}</span>
        </div>
      </div>
      <div class="history-info">
        <p class="history-name">${img.name || 'Image'}</p>
        <p class="history-meta">${img.mode || 'General'} • ${formatDate(img.date)}</p>
      </div>
      <div class="history-actions">
        ${img.result_url ? `<a href="${img.result_url}" download class="btn-icon" title="Download"><i class="fas fa-download"></i></a>` : ''}
        <button class="btn-icon btn-danger" onclick="deleteImage(${img.id})" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function updateCredits(current, max) {
  const credEl = document.getElementById('creditsValue');
  const barEl = document.getElementById('creditsBar');
  if (credEl) credEl.textContent = `${current} / ${max}`;
  if (barEl) {
    const pct = Math.round((current / max) * 100);
    barEl.style.width = pct + '%';
    barEl.style.background = pct > 50 ? 'var(--green)' : pct > 20 ? 'var(--accent)' : 'var(--red)';
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function deleteImage(id) {
  if (!confirm('Delete this image?')) return;
  const token = getToken();
  fetch(`/api/user/history/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(() => loadDashboardData())
  .catch(() => showDashToast('Could not delete image.', 'error'));
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      removeToken();
      window.location.href = '/pages/index.html';
    });
  }
}

function showDashToast(message, type = 'info') {
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

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('pixelai_user') || 'null');
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('pixelai_token');
}

function removeToken() {
  localStorage.removeItem('pixelai_token');
  localStorage.removeItem('pixelai_user');
}
