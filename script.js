/* ================================================
   DAIRY ROYAL ICE CREAM – script.js
   Antigravity Animations & Interactive Features
================================================ */

'use strict';

// ===== PARTICLE SYSTEM (ANTIGRAVITY CANVAS) =====
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const emojis = ['🍦', '🍧', '⭐', '✨', '🍓', '🍫', '🍬', '🌸', '💫'];
  const particles = [];
  const COUNT = window.innerWidth < 768 ? 15 : 35;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 60;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = -(Math.random() * 1.2 + 0.4);
      this.size = Math.random() * 18 + 10;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 150;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    }
    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble) * 0.5;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      this.life++;
      if (this.y < -80 || this.life > this.maxLife) this.reset();
    }
    draw() {
      const alpha = Math.min(1, (this.life / 30)) * Math.min(1, (this.maxLife - this.life) / 30);
      ctx.save();
      ctx.globalAlpha = alpha * 0.5;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * H;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, 200);
  });
})();


// ===== NAVBAR SCROLL EFFECT =====
(function initNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
})();


// ===== SMOOTH SCROLL + ACTIVE NAV =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
})();


// ===== SCROLL REVEAL ANIMATIONS =====
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// ===== PARALLAX HERO =====
(function initParallax() {
  const floatItems = document.querySelector('.float-items');
  const heroBg = document.querySelector('.hero-bg-gradient');
  if (!floatItems) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (floatItems) floatItems.style.transform = `translateY(${y * 0.3}px)`;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
})();


// ===== GALLERY LIGHTBOX =====
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const cap = item.getAttribute('data-caption') || '';
      lbImg.src = src;
      lbCap.textContent = cap;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


// ===== ORDER FORM VALIDATION =====
(function initForm() {
  const form = document.getElementById('orderForm');
  const successBox = document.getElementById('formSuccess');
  if (!form) return;

  const rules = {
    fname: { required: true, label: 'Full name' },
    fphone: { required: true, label: 'Phone number', pattern: /^\d{10}$/, patternMsg: 'Please enter a valid 10-digit phone number' },
    fevent: { required: true, label: 'Event type' },
    fdate: { required: true, label: 'Event date', minToday: true },
    fguests: { required: true, label: 'Number of guests', minVal: 10 },
  };

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}Error`);
    if (field) field.classList.add('error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}Error`);
    if (field) field.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  function validate() {
    let valid = true;
    const today = new Date(); today.setHours(0, 0, 0, 0);

    for (const [id, rule] of Object.entries(rules)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const val = el.value.trim();

      clearError(id);

      if (rule.required && !val) {
        showError(id, `${rule.label} is required.`);
        valid = false; continue;
      }
      if (rule.pattern && val && !rule.pattern.test(val)) {
        showError(id, rule.patternMsg || 'Invalid format.');
        valid = false; continue;
      }
      if (rule.minToday && val) {
        const selected = new Date(val);
        if (selected < today) {
          showError(id, 'Please select a future date.');
          valid = false; continue;
        }
      }
      if (rule.minVal && val) {
        if (parseInt(val) < rule.minVal) {
          showError(id, `Minimum ${rule.minVal} guests required.`);
          valid = false; continue;
        }
      }
    }
    return valid;
  }

  // Live field validation
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validate());
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = '⏳ Sending...';

    // Simulate async submission
    setTimeout(() => {
      if (successBox) successBox.removeAttribute('hidden');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = '🍦 Submit Enquiry';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
  });
})();


// ===== BACK TO TOP =====
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ===== COUNTER ANIMATION FOR STATS =====
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;
      const target = parseInt(match[1]);
      const suffix = text.replace(/\d+/, '');
      let start = 0;
      const duration = 1500;
      const startTime = performance.now();

      function count(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(count);
      }
      requestAnimationFrame(count);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ===== FLAVOR CARD TILT EFFECT =====
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch devices

  document.querySelectorAll('.flavor-card:not(.special-card), .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ===== IMAGE ERROR FALLBACK (GitHub Pages deployment fix) =====
(function initImageFallback() {
  // Applies to ALL img elements – covers GitHub Pages 404 path issues
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      // Prevent infinite loop if fallback itself fails
      if (this.dataset.errored) return;
      this.dataset.errored = 'true';
      // Show a styled placeholder instead of a broken icon
      this.style.background = 'linear-gradient(135deg, #e91e8c33, #1a2a6c33)';
      this.style.minHeight = '200px';
      this.style.display = 'block';
      this.removeAttribute('src'); // stop further 404 requests
      this.alt = '🍦 ' + (this.alt || 'Dairy Royal Ice Cream');
    });
  });
})();


// ===== FLOATING NAV DOTS INDICATOR =====
(function initNavDots() {
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-order)');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', () => {
      if (!link.classList.contains('active')) {
        link.style.transform = '';
      }
    });
  });
})();

console.log('%c🍦 Dairy Royal Ice Cream Website Loaded!', 'color:#e91e8c; font-size:16px; font-weight:bold;');
