// PixelAI Enhance JS — All enhancement logic

let originalFile = null;
let resultDataURL = null;
let sliderDragging = false;
let heartbeatTimer = null;

// Color/filter state
const filterState = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  shadows: 0,
  highlights: 0
};

// DOM refs (populated after load)
let uploadZone, fileInput, goBtn, progBar, progText, resultSection,
    sliderEl, beforeImg, afterImg, sliderLine, dlBtn, infoZoom, infoRes, infoTime;

document.addEventListener('DOMContentLoaded', () => {
  uploadZone  = document.getElementById('upz');
  fileInput   = document.getElementById('fi');
  goBtn       = document.getElementById('goBtn');
  progBar     = document.getElementById('progFill');
  progText    = document.getElementById('progText');
  resultSection = document.getElementById('res');
  sliderEl    = document.getElementById('sldr');
  beforeImg   = document.getElementById('fgImg');
  afterImg    = document.getElementById('slBg');
  sliderLine  = document.getElementById('sln');
  dlBtn       = document.getElementById('dlBtn');
  infoZoom    = document.getElementById('infoZoom');
  infoRes     = document.getElementById('infoRes');
  infoTime    = document.getElementById('infoTime');

  setupUploadZone();
  setupSlider();
  setupColorSliders();
  startHeartbeat();
});

// ── Upload Zone ─────────────────────────────────────────────────────────────
function setupUploadZone() {
  if (!uploadZone) return;

  uploadZone.addEventListener('click', () => fileInput && fileInput.click());

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });
  }
}

function handleFile(file) {
  // Client-side validation
  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED.includes(file.type)) {
    showToastMsg('Only JPG, PNG, and WEBP files are allowed.', 'error');
    return;
  }
  if (file.size > MAX_SIZE) {
    showToastMsg('File is too large. Maximum size is 10MB.', 'error');
    return;
  }

  originalFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    // Show preview in upload zone
    uploadZone.style.backgroundImage = `url(${src})`;
    uploadZone.style.backgroundSize = 'cover';
    uploadZone.style.backgroundPosition = 'center';
    uploadZone.querySelector('.upload-inner').style.opacity = '0';

    if (beforeImg) beforeImg.src = src;
    if (afterImg) afterImg.src = src;

    if (goBtn) goBtn.disabled = false;
    showToastMsg('Image loaded! Adjust settings and click Enhance.', 'info');
  };
  reader.readAsDataURL(file);
}

// ── Enhance API Call ─────────────────────────────────────────────────────────
if (document.getElementById('goBtn')) {
  document.addEventListener('click', e => {
    if (e.target.closest('#goBtn') && !document.getElementById('goBtn').disabled) {
      startEnhancement();
    }
  });
}

async function startEnhancement() {
  if (!originalFile) return;

  const mode = document.getElementById('modeSelect')?.value || 'auto';
  const scale = document.querySelector('input[name="scale"]:checked')?.value || '2';
  const sharpness = document.querySelector('.sharp-btn.active')?.dataset.val || 'medium';
  const hdr = document.getElementById('hdrToggle')?.checked ? '1' : '0';
  const denoise = document.getElementById('denoiseToggle')?.checked ? '1' : '0';
  const faceEnhance = document.getElementById('faceToggle')?.checked ? '1' : '0';

  const formData = new FormData();
  formData.append('image', originalFile);
  formData.append('mode', mode);
  formData.append('scale', scale);
  formData.append('sharpness', sharpness);
  formData.append('hdr', hdr);
  formData.append('denoise', denoise);
  formData.append('face_enhance', faceEnhance);
  formData.append('exposure', filterState.exposure);
  formData.append('contrast', filterState.contrast);
  formData.append('saturation', filterState.saturation);
  formData.append('warmth', filterState.warmth);
  formData.append('shadows', filterState.shadows);
  formData.append('highlights', filterState.highlights);

  // Show progress
  setProcessing(true);
  animateProgress();

  const startTime = Date.now();

  try {
    const res = await fetch('/enhance', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Server error ' + res.status);

    const blob = await res.blob();
    resultDataURL = URL.createObjectURL(blob);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    showResult(resultDataURL, elapsed, scale);
    setProcessing(false);
  } catch (err) {
    // Demo mode: apply CSS filter to simulate enhancement
    console.warn('API not available, using demo mode:', err.message);
    await demoEnhance(startTime, scale);
  }
}

async function demoEnhance(startTime, scale) {
  await sleep(1500 + Math.random() * 1000);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Use the original image with enhanced CSS filter as "result"
  if (beforeImg && beforeImg.src) {
    resultDataURL = beforeImg.src;
    showResult(resultDataURL, elapsed, scale);
  }
  setProcessing(false);
  showToastMsg('Demo mode: Showing simulated enhancement result.', 'info');
}

function showResult(src, elapsed, scale) {
  if (afterImg) afterImg.src = src;
  applyLiveFilter(afterImg);

  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (infoZoom) infoZoom.textContent = scale + '×';
  if (infoTime) infoTime.textContent = elapsed + 's';

  // Get actual result dimensions
  const img = new Image();
  img.onload = () => {
    if (infoRes) infoRes.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
  };
  img.src = src;

  // Setup download
  if (dlBtn) {
    dlBtn.style.display = 'flex';
    const baseName = originalFile ? originalFile.name.replace(/\.[^.]+$/, '') : 'image';
    dlBtn.onclick = () => downloadWithFilter(src, `pixelai_enhanced_${baseName}.jpg`);
  }

  // Init slider at 50%
  setSliderPosition(50);
  showToastMsg('Enhancement complete! Drag the slider to compare.', 'success');
}

// ── Progress ─────────────────────────────────────────────────────────────────
let progressInterval = null;

function animateProgress() {
  let val = 0;
  if (progBar) progBar.style.width = '0%';
  const labelEl = document.querySelector('#prog .prog-label span:first-child');
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (val < 30) {
      // Phase 1: Upload (fast, 0–30%)
      val += Math.random() * 6 + 2;
      if (val > 30) val = 30;
      if (labelEl) labelEl.textContent = 'Uploading...';
    } else {
      // Phase 2: Processing (slow, 30–90%)
      val += Math.random() * 2.5 + 0.5;
      if (val > 90) val = 90;
      if (labelEl) labelEl.textContent = 'Processing...';
    }
    if (progBar) progBar.style.width = val + '%';
  }, 200);
}

function setProcessing(on) {
  if (on) {
    if (goBtn) {
      goBtn.disabled = true;
      const span = goBtn.querySelector('span[data-i18n]');
      if (span) span.textContent = t('processing');
    }
    const progEl = document.getElementById('prog');
    if (progEl) progEl.style.display = 'block';
  } else {
    clearInterval(progressInterval);
    if (progBar) progBar.style.width = '100%';
    setTimeout(() => {
      const progEl = document.getElementById('prog');
      if (progEl) progEl.style.display = 'none';
      if (progBar) progBar.style.width = '0%';
    }, 500);
    if (goBtn) {
      goBtn.disabled = false;
      const span = goBtn.querySelector('span[data-i18n]');
      if (span) span.textContent = t('enhance_btn');
    }
  }
}

// ── Before/After Slider ──────────────────────────────────────────────────────
function setupSlider() {
  if (!sliderEl || !sliderLine) return;

  setSliderPosition(50);

  sliderLine.addEventListener('mousedown', startDrag);
  sliderLine.addEventListener('touchstart', startDrag, { passive: true });

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('touchmove', onDrag, { passive: true });
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
  sliderDragging = true;
  e.preventDefault && e.preventDefault();
}

function onDrag(e) {
  if (!sliderDragging || !sliderEl) return;
  const rect = sliderEl.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(2, Math.min(98, pct));
  setSliderPosition(pct);
}

function stopDrag() {
  sliderDragging = false;
}

function setSliderPosition(pct) {
  if (!sliderLine || !beforeImg) return;
  const dir = document.documentElement.getAttribute('dir');
  if (dir === 'rtl') {
    sliderLine.style.right = pct + '%';
    sliderLine.style.left = 'auto';
    if (beforeImg) beforeImg.style.clipPath = `inset(0 0 0 ${100 - pct}%)`;
  } else {
    sliderLine.style.left = pct + '%';
    sliderLine.style.right = 'auto';
    if (beforeImg) beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }
}

// ── Color Sliders ─────────────────────────────────────────────────────────────
function setupColorSliders() {
  const sliders = [
    'exposure', 'contrast', 'saturation', 'warmth', 'shadows', 'highlights'
  ];

  sliders.forEach(name => {
    const el = document.getElementById(name + 'Slider');
    const valEl = document.getElementById(name + 'Val');
    if (!el) return;

    el.addEventListener('input', () => {
      filterState[name] = parseInt(el.value);
      if (valEl) valEl.textContent = (filterState[name] > 0 ? '+' : '') + filterState[name];
      livePreview();
    });
  });

  // Sharpness buttons
  document.querySelectorAll('.sharp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sharp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Reset button
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetSettings);
  }
}

function livePreview() {
  // Apply filter to the preview image (before img in upload zone)
  const previewImgs = document.querySelectorAll('.preview-apply');
  previewImgs.forEach(img => applyLiveFilter(img));
  // Also apply to after image if result is shown
  if (afterImg && resultDataURL) applyLiveFilter(afterImg);
}

function applyLiveFilter(img) {
  if (!img) return;
  const { exposure, contrast, saturation, warmth } = filterState;

  const brightness = 1 + exposure / 100;
  const cont = 1 + contrast / 100;
  const sat = 1 + saturation / 100;
  const warm = warmth > 0
    ? `sepia(${warmth / 200})`
    : warmth < 0 ? `hue-rotate(${Math.abs(warmth) * 0.5}deg)` : '';

  img.style.filter = [
    `brightness(${brightness})`,
    `contrast(${cont})`,
    `saturate(${sat})`,
    warm
  ].filter(Boolean).join(' ');
}

function resetSettings() {
  Object.keys(filterState).forEach(k => filterState[k] = 0);

  ['exposure', 'contrast', 'saturation', 'warmth', 'shadows', 'highlights'].forEach(name => {
    const el = document.getElementById(name + 'Slider');
    const valEl = document.getElementById(name + 'Val');
    if (el) el.value = 0;
    if (valEl) valEl.textContent = '0';
  });

  if (afterImg) afterImg.style.filter = '';
  livePreview();
}

// ── Download with Filter ──────────────────────────────────────────────────────
async function downloadWithFilter(src, filename) {
  filename = filename || 'pixelai_enhanced.jpg';
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    const { exposure, contrast, saturation } = filterState;
    const brightness = 1 + exposure / 100;
    const cont = 1 + contrast / 100;
    const sat = 1 + saturation / 100;

    ctx.filter = `brightness(${brightness}) contrast(${cont}) saturate(${sat})`;
    ctx.drawImage(img, 0, 0);

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  } catch (err) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = src;
    link.click();
  }
}

// ── Sample Image ──────────────────────────────────────────────────────────────
function loadSampleImage(e) {
  if (e) e.stopPropagation();
  const SAMPLE_URL = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80';
  const btn = document.getElementById('sampleBtn');
  if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Loading...'; }

  fetch(SAMPLE_URL)
    .then(r => r.blob())
    .then(blob => {
      const file = new File([blob], 'sample-portrait.jpg', { type: 'image/jpeg' });
      handleFile(file);
    })
    .catch(() => showToastMsg('Could not load sample image. Check your connection.', 'error'))
    .finally(() => {
      if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'جرب مثال / Try a sample'; }
    });
}

// ── Heartbeat ─────────────────────────────────────────────────────────────────
function startHeartbeat() {
  heartbeatTimer = setInterval(async () => {
    try {
      await fetch('/api/ping', { signal: AbortSignal.timeout(3000) });
    } catch { /* silent */ }
  }, 30000);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function showToastMsg(message, type = 'info') {
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
  }, 4000);
}
