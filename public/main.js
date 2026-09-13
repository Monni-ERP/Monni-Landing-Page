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
        y: 25,
        duration: 0.75,
        ease: 'power2.out'
      });
    });

    // Animación escalonada (stagger) para las tarjetas de servicios y pasos
    const staggerContainers = document.querySelectorAll('.gs-stagger-cards');
    staggerContainers.forEach((container) => {
      const cards = container.children;
      gsap.from(cards, {
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          once: true
        },
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out'
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

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initAnimations();
    });
  } else {
    initTheme();
    initAnimations();
  }
})();
