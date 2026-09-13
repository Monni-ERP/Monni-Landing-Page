/* ============================================
   MONNI — main.js (v2 fixed)
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ============================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     1. LENIS SMOOTH SCROLL
  ---------------------------------------- */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.08,
      smooth: true,
      smoothTouch: false,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ----------------------------------------
     2. GSAP REGISTRATION
  ---------------------------------------- */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallback(); return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------
     3. CUSTOM CURSOR
  ---------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.innerWidth > 768) {
    const dotX = gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'none' });
    const dotY = gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'none' });
    const ringX = gsap.quickTo(cursorRing, 'x', { duration: 0.25, ease: 'power2.out' });
    const ringY = gsap.quickTo(cursorRing, 'y', { duration: 0.25, ease: 'power2.out' });
    window.addEventListener('mousemove', (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });
    document.querySelectorAll('a, button, .tilt-card, .sbadge').forEach((el) => {
      el.addEventListener('mouseenter', () => gsap.to(cursorRing, { scale: 1.6, duration: 0.2 }));
      el.addEventListener('mouseleave', () => gsap.to(cursorRing, { scale: 1, duration: 0.2 }));
    });
  }

  /* ----------------------------------------
     4. NAVBAR SCROLL EFFECT
  ---------------------------------------- */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60',
    onEnter: () => navbar && navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar && navbar.classList.remove('scrolled'),
  });

  /* ----------------------------------------
     5. MOBILE MENU
  ---------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  let menuOpen = false;
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuToggle.classList.toggle('active', menuOpen);
      mobileNav.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('.mobile-link, .mobile-cta').forEach((link) => {
      link.addEventListener('click', () => {
        menuOpen = false; menuToggle.classList.remove('active');
        mobileNav.classList.remove('open'); document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------
     6. WORD SPLIT — FIXED VERSION
     Strategy: wrap each word in a clip span, 
     add a non-breaking space AFTER each word-wrap 
     as a separate text node so spaces are preserved.
  ---------------------------------------- */
  function splitWords(el) {
    if (!el) return [];
    // Save original content
    const fragment = document.createDocumentFragment();
    const clone = el.cloneNode(true);
    const words = [];

    // Walk child nodes and split text nodes into words
    function processNode(node, target) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (/^\s+$/.test(part)) {
            // whitespace: preserve as text node
            target.appendChild(document.createTextNode(part));
          } else if (part.length > 0) {
            const wrap = document.createElement('span');
            wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
            const inner = document.createElement('span');
            inner.style.cssText = 'display:inline-block;';
            inner.textContent = part;
            wrap.appendChild(inner);
            target.appendChild(wrap);
            words.push(inner);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagWrap = document.createElement('span');
        tagWrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
        // Clone the element and put it inside
        const clonedEl = node.cloneNode(true);
        clonedEl.style.display = 'inline-block';
        tagWrap.appendChild(clonedEl);
        target.appendChild(tagWrap);
        words.push(clonedEl);
        // Add space after
        target.appendChild(document.createTextNode(' '));
      }
    }

    clone.childNodes.forEach((node) => processNode(node, fragment));
    el.innerHTML = '';
    el.appendChild(fragment);
    return words;
  }

  /* ----------------------------------------
     7. HERO ANIMATIONS
  ---------------------------------------- */
  const heroTL = gsap.timeline({ delay: 0.15 });

  heroTL.from('#heroBadge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' });

  // Title — use simple approach: animate whole title then words
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const words = splitWords(heroTitle);
    if (words.length > 0) {
      gsap.set(words, { yPercent: 110, opacity: 0 });
      heroTL.to(words, {
        yPercent: 0, opacity: 1,
        duration: 0.65, stagger: 0.05, ease: 'power3.out',
      }, '-=0.2');
    }
  }

  heroTL.from('#heroDesc', { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
  heroTL.from('#heroCTAs .btn', { y: 20, opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, '-=0.35');
  heroTL.from('#heroStats .stat-item, #heroStats .stat-divider', { y: 16, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
  heroTL.from('#heroVisual', { x: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.3);
  heroTL.from(['#floatCode', '#floatMetric', '#floatScore'], { y: 25, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.8);
  heroTL.from(['#floatTag1', '#floatTag2', '#floatTag3'], { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, 1.0);

  /* ----------------------------------------
     8. COUNTER ANIMATION (fires on enter viewport)
  ---------------------------------------- */
  document.querySelectorAll('.stat-num').forEach((el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let fired = false;

    const trigger = ScrollTrigger.create({
      trigger: el.closest('.hero-stats') || el,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        if (fired) return;
        fired = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val); },
        });
      },
    });

    // If already in viewport on load (hero stats), fire immediately after hero anim
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && !fired) {
        fired = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out', delay: 1.2,
          onUpdate: () => { el.textContent = Math.round(obj.val); },
        });
      }
    }, 500);
  });

  /* ----------------------------------------
     9. FLOATING CARD ANIMATIONS (Hero)
  ---------------------------------------- */
  [
    { id: '#floatCode', y: -14, dur: 2.8 },
    { id: '#floatMetric', y: -10, dur: 3.2 },
    { id: '#floatScore', y: -12, dur: 2.5 },
  ].forEach(({ id, y, dur }) => {
    const el = document.querySelector(id);
    if (el) gsap.to(el, { y, duration: dur, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });

  [
    { id: '#floatTag1', y: -8, x: 3, dur: 2.2 },
    { id: '#floatTag2', y: -6, x: -3, dur: 2.7 },
    { id: '#floatTag3', y: -10, x: 2, dur: 3.1 },
  ].forEach(({ id, y, x, dur }) => {
    const el = document.querySelector(id);
    if (el) gsap.to(el, { y, x, duration: dur, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });

  /* ----------------------------------------
     10. MASCOT PARALLAX (scroll scrub)
  ---------------------------------------- */
  const mascotLayer = document.getElementById('mascotLayer');
  if (mascotLayer) {
    gsap.to(mascotLayer, {
      y: -80, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
  }

  /* ----------------------------------------
     11. SECTION TITLE REVEALS (split-title class)
  ---------------------------------------- */
  document.querySelectorAll('.split-title').forEach((el) => {
    const words = splitWords(el);
    if (words.length > 0) {
      gsap.set(words, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: el, start: 'top 82%', once: true,
        onEnter: () => {
          gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.05, ease: 'power3.out' });
        },
      });
    }
  });

  /* ----------------------------------------
     12. SECTION BADGE + DESC REVEALS
  ---------------------------------------- */
  document.querySelectorAll('.section-header').forEach((el) => {
    const badge = el.querySelector('.section-badge');
    const desc = el.querySelector('.section-desc');
    const items = [badge, desc].filter(Boolean);
    if (items.length) {
      gsap.from(items, {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      });
    }
  });

  /* ----------------------------------------
     13. BENTO CARDS — SCROLL ENTRANCE
  ---------------------------------------- */
  gsap.from('.bento-card', {
    y: 48, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.bento-grid', start: 'top 80%', once: true },
  });

  /* ----------------------------------------
     14. TILT EFFECT — BENTO + PORTFOLIO + GCARD
  ---------------------------------------- */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      const rotXTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      const rotYTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        rotXTo(-dy * 5); rotYTo(dx * 5);
      });
      card.addEventListener('mouseleave', () => { rotXTo(0); rotYTo(0); });
    });
  }

  /* ----------------------------------------
     15. PORTFOLIO CARDS
  ---------------------------------------- */
  document.querySelectorAll('.pcard').forEach((card, i) => {
    gsap.from(card, {
      y: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
      delay: (i % 2) * 0.15,
      scrollTrigger: { trigger: card, start: 'top 84%', once: true },
    });
  });

  /* ----------------------------------------
     16. PROCESS STEPS + PROGRESS LINE
  ---------------------------------------- */
  document.querySelectorAll('.pstep').forEach((step, i) => {
    gsap.from(step, {
      y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.1,
      scrollTrigger: { trigger: step, start: 'top 86%', once: true },
    });
  });
  const processProgress = document.getElementById('processProgress');
  if (processProgress) {
    gsap.to(processProgress, {
      width: '100%', ease: 'none',
      scrollTrigger: { trigger: '.process-wrap', start: 'top 70%', end: 'bottom 50%', scrub: 1 },
    });
  }

  /* ----------------------------------------
     17. TECH STACK BADGES
  ---------------------------------------- */
  gsap.from('.sbadge', {
    y: 18, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out',
    scrollTrigger: { trigger: '#stackCats', start: 'top 82%', once: true },
  });
  gsap.from('.gcard', {
    x: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '#guarantees', start: 'top 82%', once: true },
  });

  /* ----------------------------------------
     18. SCORE BARS ANIMATION
  ---------------------------------------- */
  document.querySelectorAll('.sbr-fill').forEach((bar) => {
    const targetW = parseFloat(bar.style.getPropertyValue('--w') || '0');
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar.closest('.bento-card') || bar, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to({ v: 0 }, {
          v: targetW, duration: 1.4, ease: 'power2.out',
          onUpdate: function () { bar.style.width = this.targets()[0].v + '%'; },
        });
      },
    });
  });

  /* ----------------------------------------
     19. CTA SECTION
  ---------------------------------------- */
  gsap.from('#ctaLeft > *', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '#ctaLeft', start: 'top 80%', once: true },
  });
  gsap.from('#ctaFormWrap', {
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '#ctaFormWrap', start: 'top 80%', once: true },
  });

  /* ----------------------------------------
     20. MAGNETIC BUTTONS
  ---------------------------------------- */
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 80) { xTo(dx * 0.4); yTo(dy * 0.4); }
      });
      btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ----------------------------------------
     21. SMOOTH ANCHOR SCROLL
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ----------------------------------------
     22. CONTACT FORM
  ---------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmit = document.getElementById('formSubmit');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fName').value.trim();
      const email = document.getElementById('fEmail').value.trim();
      const project = document.getElementById('fProject').value.trim();
      if (!name || !email || !project) return;
      if (formSubmit) { formSubmit.textContent = 'Enviando...'; formSubmit.disabled = true; }
      setTimeout(() => {
        gsap.to(contactForm, {
          opacity: 0, y: -20, duration: 0.4,
          onComplete: () => {
            contactForm.style.display = 'none';
            if (formSuccess) {
              formSuccess.style.display = 'block';
              gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
            }
          },
        });
      }, 1200);
    });
  }

  /* ----------------------------------------
     23. FOOTER
  ---------------------------------------- */
  gsap.from('.footer-brand', {
    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 88%', once: true },
  });
  gsap.from('.footer-col', {
    y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer-links', start: 'top 88%', once: true },
  });

  /* ----------------------------------------
     FALLBACK
  ---------------------------------------- */
  function initFallback() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.bento-card,.pcard,.gcard,.pstep-body').forEach((el) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease,transform 0.6s ease';
      observer.observe(el);
    });
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  console.log('%cMonni ✓ Animations v2 initialized', 'color:#2E6BE6;font-weight:bold;font-size:13px');

})();
