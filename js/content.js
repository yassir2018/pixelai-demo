// PixelAI Content Loader — fetches site-content.json and applies to DOM

(async function () {
  let content = null;

  try {
    const res = await fetch('/content/site-content.json');
    if (res.ok) content = await res.json();
  } catch (e) {
    console.warn('Content unavailable.');
    return;
  }

  if (!content) return;

  // Store globally so setLanguage() can re-apply after language switch
  window.__pixelContent = content;
  window.__applyPixelContent = () => applyContent(window.__pixelContent);

  applyContent(content);

  function applyContent(c) {
    if (!c) return;

    // ── Hero ──────────────────────────────────────────────────────
    const h = c.hero;
    if (h) {
      // New homepage — target by actual element selectors
      setEl('.hero-eyebrow span',                              h.badge);
      setEl('.home-hero-title span[data-i18n]',                h.title_line1);
      setEl('.home-hero-title .brand-shimmer',                 h.title_line2);
      setEl('.home-hero-sub',                                  h.subtitle);
      setEl('.hero-note-small span[data-i18n]',                h.note);
      setEl('span[data-i18n="home_cta_try"]',                  h.btn_trial);
      setEl('span[data-i18n="home_cta_pricing"]',              h.btn_buy);
      // Old homepage — data-content attributes
      setEl('[data-content="hero_badge"]',                     h.badge);
      setEl('[data-content="hero_title_line1"]',               h.title_line1);
      setEl('[data-content="hero_title_line2"]',               h.title_line2);
      setEl('[data-content="hero_brand"]',                     h.brand);
      setEl('[data-content="hero_subtitle"]',                  h.subtitle);
      setEl('[data-content="hero_btn_trial"]',                 h.btn_trial);
      setEl('[data-content="hero_btn_buy"]',                   h.btn_buy);
      setEl('[data-content="hero_note"]',                      h.note);

      // Background slides
      if (h.bg_images && h.bg_images.length) {
        const slides = document.querySelectorAll('.home-hero-slide, .hero-bg-slide');
        slides.forEach((slide, i) => {
          if (h.bg_images[i]) slide.style.backgroundImage = `url('${h.bg_images[i]}')`;
        });
      }

      // Slider images
      if (h.slider_before) {
        const el = document.getElementById('demoBefore');
        if (el) el.style.backgroundImage = `url('${h.slider_before}')`;
      }
      if (h.slider_after) {
        const el = document.getElementById('demoAfter') || document.querySelector('.demo-after');
        if (el) el.style.backgroundImage = `url('${h.slider_after}')`;
      }
    }

    // ── Stats ──────────────────────────────────────────────────────
    if (c.stats) {
      const newStats = document.querySelectorAll('.home-stat');
      if (newStats.length) {
        c.stats.forEach((s, i) => {
          if (!newStats[i]) return;
          const numEl   = newStats[i].querySelector('.home-stat-num');
          const labelEl = newStats[i].querySelector('.home-stat-lbl');
          if (numEl) numEl.textContent = s.number;
          // Labels have data-i18n — don't overwrite (translations win)
          if (labelEl && !labelEl.hasAttribute('data-i18n')) labelEl.textContent = s.label;
        });
      }
      const oldStats = document.querySelectorAll('.stat-item');
      oldStats.forEach((item, i) => {
        if (!c.stats[i]) return;
        const numEl   = item.querySelector('.stat-number');
        const labelEl = item.querySelector('.stat-label');
        if (numEl)   numEl.textContent = c.stats[i].number;
        if (labelEl && !labelEl.hasAttribute('data-i18n')) labelEl.textContent = c.stats[i].label;
      });
    }

    // ── Features ──────────────────────────────────────────────────
    if (c.features) {
      const newCells = document.querySelectorAll('.feat-cell');
      if (newCells.length) {
        c.features.forEach((f, i) => {
          if (!newCells[i]) return;
          const titleEl = newCells[i].querySelector('.feat-cell-title');
          const descEl  = newCells[i].querySelector('.feat-cell-desc');
          const iconEl  = newCells[i].querySelector('.feat-icon-wrap i');
          if (titleEl && !titleEl.hasAttribute('data-i18n')) titleEl.textContent = f.title;
          if (descEl  && !descEl.hasAttribute('data-i18n'))  descEl.textContent  = f.desc;
          if (iconEl && f.icon) iconEl.className = `fas ${f.icon}`;
        });
      }
      const oldCards = document.querySelectorAll('.feature-card');
      oldCards.forEach((card, i) => {
        if (!c.features[i]) return;
        const f       = c.features[i];
        const titleEl = card.querySelector('.feature-title');
        const descEl  = card.querySelector('.feature-desc');
        const iconEl  = card.querySelector('.feature-icon i');
        if (titleEl) titleEl.textContent = f.title;
        if (descEl)  descEl.textContent  = f.desc;
        if (iconEl && f.icon) iconEl.className = `fas ${f.icon}`;
      });
    }

    // ── Gallery / Use Cases ────────────────────────────────────────
    if (c.usecases) {
      const newCards = document.querySelectorAll('.gallery-card');
      if (newCards.length) {
        c.usecases.forEach((u, i) => {
          if (!newCards[i]) return;
          const img     = newCards[i].querySelector('img');
          const tagEl   = newCards[i].querySelector('.gallery-tag-badge');
          const labelEl = newCards[i].querySelector('.gallery-lbl');
          if (img && u.image) { img.src = u.image; img.alt = u.label || ''; }
          if (tagEl   && !tagEl.hasAttribute('data-i18n'))   tagEl.textContent   = u.tag;
          if (labelEl && !labelEl.hasAttribute('data-i18n')) labelEl.textContent = u.label;
        });
      }
      const oldCards = document.querySelectorAll('.usecase-card');
      oldCards.forEach((card, i) => {
        if (!c.usecases[i]) return;
        const u     = c.usecases[i];
        const img   = card.querySelector('img');
        const tag   = card.querySelector('.usecase-tag');
        const label = card.querySelector('.usecase-label');
        if (img && u.image) { img.src = u.image; img.alt = u.label || ''; }
        if (tag   && !tag.hasAttribute('data-i18n'))   tag.textContent   = u.tag;
        if (label && !label.hasAttribute('data-i18n')) label.textContent = u.label;
      });
    }

    // ── CTA ───────────────────────────────────────────────────────
    if (c.cta) {
      setEl('.final-cta-title', c.cta.title);
      setEl('.final-cta-sub',   c.cta.subtitle);
      setEl('.cta-title',       c.cta.title);
      setEl('.cta-sub',         c.cta.subtitle);
    }

    // ── Testimonials ──────────────────────────────────────────────
    if (c.testimonials) {
      const newCards = document.querySelectorAll('.tcard');
      if (newCards.length) {
        c.testimonials.forEach((t, i) => {
          if (!newCards[i]) return;
          const textEl   = newCards[i].querySelector('.tcard-text');
          const nameEl   = newCards[i].querySelector('.tcard-name');
          const roleEl   = newCards[i].querySelector('.tcard-role');
          const avatarEl = newCards[i].querySelector('.tcard-avatar');
          const starsEl  = newCards[i].querySelector('.tcard-stars');
          if (textEl)   textEl.textContent   = `"${t.text}"`;
          if (nameEl)   nameEl.textContent   = t.name;
          if (roleEl)   roleEl.textContent   = t.role;
          if (avatarEl) avatarEl.textContent = t.name ? t.name[0] : '?';
          if (starsEl)  starsEl.textContent  = '★'.repeat(t.stars || 5);
        });
      }
      const oldCards = document.querySelectorAll('.testimonial-card');
      oldCards.forEach((card, i) => {
        if (!c.testimonials[i]) return;
        const t        = c.testimonials[i];
        const textEl   = card.querySelector('.testimonial-text');
        const nameEl   = card.querySelector('.author-name');
        const roleEl   = card.querySelector('.author-role');
        const avatarEl = card.querySelector('.author-avatar');
        const starsEl  = card.querySelector('.testimonial-stars');
        if (textEl)   textEl.textContent   = `"${t.text}"`;
        if (nameEl)   nameEl.textContent   = t.name;
        if (roleEl)   roleEl.textContent   = t.role;
        if (avatarEl) avatarEl.textContent = t.name ? t.name[0] : '?';
        if (starsEl)  starsEl.textContent  = '★'.repeat(t.stars || 5);
      });
    }

    // ── Pricing ───────────────────────────────────────────────────
    if (c.pricing) {
      const newCards = document.querySelectorAll('.pcard');
      if (newCards.length) {
        c.pricing.forEach((p, i) => {
          if (!newCards[i]) return;
          const nameEl   = newCards[i].querySelector('.pcard-name');
          const amountEl = newCards[i].querySelector('.pcard-amount');
          const periodEl = newCards[i].querySelector('.pcard-period');
          const descEl   = newCards[i].querySelector('.pcard-desc');
          const badge    = newCards[i].querySelector('.pcard-badge');
          const btn      = newCards[i].querySelector('a[class*="pcard-btn"]');
          if (nameEl   && !nameEl.hasAttribute('data-i18n'))   nameEl.textContent   = p.name;
          if (amountEl && !amountEl.hasAttribute('data-i18n')) amountEl.textContent = p.price;
          if (periodEl && !periodEl.hasAttribute('data-i18n')) periodEl.textContent = p.period || '';
          if (descEl   && !descEl.hasAttribute('data-i18n'))   descEl.textContent   = p.desc;
          if (badge    && !badge.hasAttribute('data-i18n'))    badge.textContent    = p.badge || '';
          const featItems = newCards[i].querySelectorAll('.pcard-features li span');
          if (p.features) {
            p.features.forEach((feat, fi) => {
              if (featItems[fi] && !featItems[fi].hasAttribute('data-i18n'))
                featItems[fi].textContent = feat;
            });
          }
          if (btn && p.btn_text) {
            btn.textContent = p.btn_text;
            if (p.btn_href) btn.href = p.btn_href;
          }
        });
      }
      const oldCards = document.querySelectorAll('.pricing-card');
      oldCards.forEach((card, i) => {
        if (!c.pricing[i]) return;
        const p = c.pricing[i];
        setEl(card.querySelector('.plan-name'),    p.name);
        setEl(card.querySelector('.price-amount'), p.price);
        const periodEl = card.querySelector('.price-period');
        if (periodEl) periodEl.textContent = p.period || '';
        const descEl = card.querySelector('.plan-desc');
        if (descEl) descEl.textContent = p.desc;
        const featItems = card.querySelectorAll('.plan-features li span');
        if (p.features) {
          p.features.forEach((feat, fi) => {
            if (featItems[fi]) featItems[fi].textContent = feat;
          });
        }
        const btn = card.querySelector('a[class*="btn"]');
        if (btn) {
          btn.textContent = p.btn_text;
          btn.href = p.btn_href || '#';
          btn.className = p.btn_style + ' plan-cta-btn';
          btn.style.width = '100%';
          btn.style.textAlign = 'center';
          btn.style.display = 'block';
        }
        const badge = card.querySelector('.pricing-badge');
        if (badge) badge.textContent = p.badge || '';
      });
    }
  }

  function setEl(selectorOrEl, text) {
    if (!text) return;
    const el = typeof selectorOrEl === 'string'
      ? document.querySelector(selectorOrEl)
      : selectorOrEl;
    if (el) el.textContent = text;
  }
})();
