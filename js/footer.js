function injectFooter() {
  const footerHTML = `
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-col footer-brand">
        <a href="/pages/index.html" class="footer-logo">
          <div class="logo-icon">✦</div>
          <span class="logo-text">PixelAI</span>
        </a>
        <p class="footer-desc" data-i18n="footer_desc">AI-powered image enhancement platform. Fast, accurate, private.</p>
        <div class="footer-social">
          <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-github"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>
        </div>
      </div>

      <div class="footer-col">
        <h4 data-i18n="footer_tools">Tools</h4>
        <ul>
          <li><a href="/pages/enhance.html" data-i18n="nav_image_enhancer">Image Enhancer</a></li>
          <li><a href="/pages/video.html" data-i18n="nav_video_enhancer">Video Enhancer</a></li>
          <li><a href="/pages/background.html" data-i18n="nav_bg_remover">Background Remover</a></li>
          <li><a href="/pages/colorize.html" data-i18n="nav_colorize">Colorize Photos</a></li>
          <li><a href="/pages/restore.html" data-i18n="nav_restore">Photo Restore</a></li>
          <li><a href="/pages/batch.html" data-i18n="nav_batch">Batch Processing</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 data-i18n="footer_company">Company</h4>
        <ul>
          <li><a href="#" data-i18n="footer_about">About Us</a></li>
          <li><a href="#" data-i18n="footer_blog">Blog</a></li>
          <li><a href="/pages/pricing.html" data-i18n="nav_pricing">Pricing</a></li>
          <li><a href="#" data-i18n="footer_contact">Contact</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 data-i18n="footer_support">Support</h4>
        <ul>
          <li><a href="#" data-i18n="footer_faq">FAQ</a></li>
          <li><a href="#" data-i18n="footer_guide">User Guide</a></li>
          <li><a href="/pages/login.html" data-i18n="nav_login">Log In</a></li>
          <li><a href="/pages/register.html" data-i18n="nav_get_started">Get Started</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p data-i18n="footer_copyright">© 2024 PixelAI. All rights reserved.</p>
      <div class="footer-bottom-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Policy</a>
      </div>
    </div>
  </footer>
  `;

  const container = document.getElementById('footer-container');
  if (container) {
    container.innerHTML = footerHTML;
  } else {
    const div = document.createElement('div');
    div.innerHTML = footerHTML;
    document.body.appendChild(div.firstElementChild);
  }

  applyTranslations();
}
