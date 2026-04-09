function injectNavbar() {
  const navHTML = `
  <nav class="navbar" id="mainNav">
    <div class="nav-container">
      <a href="/pages/index.html" class="nav-logo">
        <div class="logo-icon">✦</div>
        <span class="logo-text">PixelAI</span>
      </a>

      <div class="nav-links">
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger">
            <span data-i18n="nav_tools">AI Tools</span>
            <i class="fas fa-chevron-down" style="font-size:10px;margin-inline-start:4px"></i>
          </button>
          <div class="dropdown-menu">
            <a href="/pages/enhance.html" class="dropdown-item">
              <i class="fas fa-magic"></i>
              <span data-i18n="nav_image_enhancer">Image Enhancer</span>
            </a>
            <a href="/pages/video.html" class="dropdown-item coming">
              <i class="fas fa-video"></i>
              <span data-i18n="nav_video_enhancer">Video Enhancer</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
            <a href="/pages/background.html" class="dropdown-item coming">
              <i class="fas fa-cut"></i>
              <span data-i18n="nav_bg_remover">Background Remover</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
            <a href="/pages/colorize.html" class="dropdown-item coming">
              <i class="fas fa-palette"></i>
              <span data-i18n="nav_colorize">Colorize Photos</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
            <a href="/pages/restore.html" class="dropdown-item coming">
              <i class="fas fa-history"></i>
              <span data-i18n="nav_restore">Photo Restore</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
            <a href="/pages/generate.html" class="dropdown-item coming">
              <i class="fas fa-robot"></i>
              <span data-i18n="nav_generate">AI Generator</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
            <a href="/pages/batch.html" class="dropdown-item coming">
              <i class="fas fa-layer-group"></i>
              <span data-i18n="nav_batch">Batch Processing</span>
              <span class="badge-soon" data-i18n="nav_coming_soon">Soon</span>
            </a>
          </div>
        </div>
        <a href="/pages/enhance.html" class="nav-link" data-i18n="nav_image_enhancer">Image Enhancer</a>
        <a href="/pages/video.html" class="nav-link nav-link-soon" data-i18n="nav_video_enhancer">Video Enhancer <span class="badge-soon">Soon</span></a>
        <a href="/pages/background.html" class="nav-link nav-link-soon" data-i18n="nav_bg_remover">Background Remover <span class="badge-soon">Soon</span></a>
        <a href="/pages/pricing.html" class="nav-link" data-i18n="nav_pricing">Pricing</a>
      </div>

      <div class="nav-right">
        <div class="lang-selector">
          <button class="nav-icon-btn" onclick="toggleLangMenu()">
            <i class="fas fa-globe"></i>
            <span id="currentLangLabel">عربي</span>
          </button>
          <div class="lang-menu" id="langMenu">
            <button onclick="setLanguage('ar');toggleLangMenu()">🇸🇦 العربية</button>
            <button onclick="setLanguage('en');toggleLangMenu()">🇺🇸 English</button>
            <button onclick="setLanguage('fr');toggleLangMenu()">🇫🇷 Français</button>
          </div>
        </div>
        <button class="nav-icon-btn" onclick="toggleTheme()" title="Toggle theme">
          <i id="themeIcon" class="fas fa-sun"></i>
        </button>
        <a href="/pages/login.html" class="nav-link" data-i18n="nav_login">Log In</a>
        <a href="/pages/register.html" class="btn-primary" data-i18n="nav_get_started">Get Started</a>
      </div>

      <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobileMenu">
      <a href="/pages/enhance.html" data-i18n="nav_image_enhancer">Image Enhancer</a>
      <a href="/pages/video.html" data-i18n="nav_video_enhancer">Video Enhancer <span class="badge-soon">Soon</span></a>
      <a href="/pages/background.html" data-i18n="nav_bg_remover">Background Remover <span class="badge-soon">Soon</span></a>
      <a href="/pages/pricing.html" data-i18n="nav_pricing">Pricing</a>
      <a href="/pages/login.html" data-i18n="nav_login">Log In</a>
      <a href="/pages/register.html" class="btn-primary" data-i18n="nav_get_started">Get Started</a>
    </div>
  </nav>
  `;

  const container = document.getElementById('navbar-container');
  if (container) {
    container.innerHTML = navHTML;
  } else {
    const nav = document.createElement('div');
    nav.innerHTML = navHTML;
    document.body.insertBefore(nav.firstElementChild, document.body.firstChild);
  }

  applyTranslations();
  updateLangLabel();
  updateThemeIcon(localStorage.getItem('pixelai_theme') || 'dark');

  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNav');
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (menu) menu.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}

function toggleLangMenu() {
  const menu = document.getElementById('langMenu');
  if (menu) menu.classList.toggle('open');
}

// Close lang menu on outside click
document.addEventListener('click', (e) => {
  const langSel = document.querySelector('.lang-selector');
  const langMenu = document.getElementById('langMenu');
  if (langSel && langMenu && !langSel.contains(e.target)) {
    langMenu.classList.remove('open');
  }
});
