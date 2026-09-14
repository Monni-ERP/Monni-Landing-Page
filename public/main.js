/* ==========================================================================
   MONNI — main.js (GSAP + Theme Toggle + Soft Organic Motion)
   Animaciones suaves de aparición de cards, slots e imágenes.
   ========================================================================== */

(function () {
  'use strict';

  // 1. Manejo del Modo Claro / Modo Oscuro
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    // Verificar preferencia guardada o sistema
    const savedTheme = localStorage.getItem('monni_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Por requerimiento expreso del usuario: MODO CLARO por defecto
    const currentTheme = savedTheme || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('monni_theme', nextTheme);
    });
  }

  // 2. Animaciones GSAP Suaves y Humanas (Soft Motion)
  function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP o ScrollTrigger no disponibles');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animación de entrada en Hero estilo Clay Global (Title, Visual, Specs)
    gsap.from('.gs-clay-title', {
      opacity: 0,
      y: 35,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.gs-clay-visual', {
      opacity: 0,
      scale: 0.94,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.25
    });

    gsap.from('.clay-spec-item', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.55
    });

    // Micro-animación suave al scrollear (Parallax orgánico no invasivo)
    const sculptureMain = document.getElementById('sculptureMain');
    const codeCard = document.getElementById('codeCard');
    const metricBadge = document.getElementById('metricBadge');

    if (sculptureMain) {
      gsap.to(sculptureMain, {
        scrollTrigger: {
          trigger: '.clay-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: 60,
        rotation: 4,
        ease: 'none'
      });
    }

    if (codeCard) {
      gsap.to(codeCard, {
        scrollTrigger: {
          trigger: '.clay-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        },
        y: -30,
        ease: 'none'
      });
    }

    if (metricBadge) {
      gsap.to(metricBadge, {
        scrollTrigger: {
          trigger: '.clay-hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        },
        y: 25,
        ease: 'none'
      });
    }

    // Interacción suave al pasar el mouse por encima (Tilt 3D sutil)
    const scene = document.getElementById('sculptureScene');
    if (scene && sculptureMain) {
      scene.addEventListener('mousemove', (e) => {
        const rect = scene.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(sculptureMain, {
          rotateY: x * 0.04,
          rotateX: -y * 0.04,
          duration: 0.6,
          ease: 'power1.out'
        });

        if (codeCard) {
          gsap.to(codeCard, {
            x: x * 0.03,
            y: y * 0.03,
            duration: 0.5,
            ease: 'power1.out'
          });
        }
      });

      scene.addEventListener('mouseleave', () => {
        gsap.to(sculptureMain, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'power2.out'
        });

        if (codeCard) {
          gsap.to(codeCard, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    }

    // Stagger para las industrias / social proof
    ScrollTrigger.batch('.gs-stagger .pill-industry', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 15,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Revelado suave de encabezados de sección
    const titles = document.querySelectorAll('.gs-reveal-up');
    titles.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // Animación escalonada (stagger) para las tarjetas de servicios y pasos
    const staggerContainers = document.querySelectorAll('.gs-stagger-cards');
    staggerContainers.forEach((container) => {
      const cards = Array.from(container.children);
      gsap.from(cards, {
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          once: true
        },
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'all',
        onComplete: () => {
          cards.forEach(card => card.removeAttribute('style'));
        }
      });
    });

    // Revelado individual de casos de portfolio
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    portfolioCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true
        },
        opacity: 0,
        y: 30,
        duration: 0.85,
        ease: 'power2.out'
      });
    });
  }

  // 3. Menú Móvil interactivo que se expande directamente desde el logo de Monni
  function initMobileMenu() {
    const brandBtn = document.getElementById('brandLogoBtn');
    const popover = document.getElementById('mobileMenuPopover');
    const overlay = document.getElementById('mobileMenuOverlay');
    const closeBtn = document.getElementById('mobileMenuClose');
    const navLinks = document.querySelectorAll('.mobile-nav-item, .mobile-btn-contact, .mobile-btn-whatsapp');
    const header = document.getElementById('header');

    if (!brandBtn || !popover || !overlay) return;

    function openMenu() {
      popover.classList.add('is-active');
      overlay.classList.add('is-active');
      brandBtn.classList.add('is-active');
      brandBtn.setAttribute('aria-expanded', 'true');
      popover.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      popover.classList.remove('is-active');
      overlay.classList.remove('is-active');
      brandBtn.classList.remove('is-active');
      brandBtn.setAttribute('aria-expanded', 'false');
      popover.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
      const isOpen = popover.classList.contains('is-active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    // Al pulsar el logo de Monni
    brandBtn.addEventListener('click', (e) => {
      // En móvil o tablets (<968px) actúa como lanzador del menú
      if (window.innerWidth <= 968) {
        e.preventDefault();
        toggleMenu();
      }
      // En pantallas de escritorio navega normalmente al inicio (#)
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    overlay.addEventListener('click', () => {
      closeMenu();
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popover.classList.contains('is-active')) {
        closeMenu();
      }
    });

    // Cerrar al pulsar un enlace de navegación
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Si cambia el tamaño de pantalla a escritorio, resetear estado
    window.addEventListener('resize', () => {
      if (window.innerWidth > 968 && popover.classList.contains('is-active')) {
        closeMenu();
      }
    });

    // Detección de scroll para el desenfoque del header
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  }

  // 4. Acordeón Interactivo de Preguntas Frecuentes (FAQ)
  function initFaq() {
    const faqContainer = document.getElementById('faqAccordion');
    if (!faqContainer) return;

    const faqItems = faqContainer.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer-collapse');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Cerrar los demás acordeones para mantener lectura limpia y ordenada
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAns = otherItem.querySelector('.faq-answer-collapse');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.setAttribute('aria-hidden', 'true');
          }
        });

        // Alternar el estado actual
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          answer.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  // 5. Envío y Formateo del Formulario de Cotización directo a WhatsApp
  function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    const successMsg = document.getElementById('formSuccessMsg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim() || '';
      const company = document.getElementById('company')?.value.trim() || '';
      const email = document.getElementById('email')?.value.trim() || '';
      const projectSelect = document.getElementById('project');
      const projectText = projectSelect?.options[projectSelect.selectedIndex]?.text || '';
      const details = document.getElementById('details')?.value.trim() || '';

      // Mensaje comercial estructurado para WhatsApp oficial (+51 906085822)
      let msg = `Hola Monni 👋, quiero cotizar un proyecto web:\n\n`;
      msg += `👤 *Nombre:* ${name}\n`;
      msg += `🏢 *Empresa / Rubro:* ${company}\n`;
      msg += `✉️ *Correo:* ${email}\n`;
      if (projectText && !projectText.includes('Selecciona')) {
        msg += `🎯 *Tipo de Web:* ${projectText}\n`;
      }
      if (details) {
        msg += `📝 *Detalles:* ${details}\n`;
      }

      // Mostrar confirmación
      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Redirigir a WhatsApp oficial con mensaje pre-rellenado
      const waUrl = `https://wa.me/51906085822?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      form.reset();
    });
  }

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initAnimations();
      initMobileMenu();
      initFaq();
      initQuoteForm();
    });
  } else {
    initTheme();
    initAnimations();
    initMobileMenu();
    initFaq();
    initQuoteForm();
  }
})();

