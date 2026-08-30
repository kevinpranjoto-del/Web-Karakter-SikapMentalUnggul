/**
 * ============================================================================
 * KPPSM F.X. POERWOPOESPITO - MAIN JAVASCRIPT
 * Module: Navbar, Mobile Drawer, Accordions, Tabs, Testimonials, and Animations
 * ============================================================================
 */

(function () {
  'use strict';

  // --- 1. INITIALIZATION ON DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initMobileNavigation();
    initAccordions();
    initTabs();
    initTestimonials();
  });

  // --- 2. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER) ---
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('show');
              }, index * 40);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );

      fadeElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      fadeElements.forEach((el) => el.classList.add('show'));
    }
  }

  // --- 3. NAVBAR BLUR & SHADOW ON SCROLL ---
  function initNavbarScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        nav.classList.add('shadow-xl', 'bg-navy');
        nav.classList.remove('bg-navy/95');
      } else {
        nav.classList.remove('shadow-xl');
        nav.classList.add('bg-navy/95');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 4. MOBILE DRAWER NAVIGATION & SUBMENUS ---
  function initMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const iconOpen = document.getElementById('iconOpen');
    const iconClose = document.getElementById('iconClose');
    let isMenuOpen = false;

    if (!hamburgerBtn || !mobileMenu) return;

    // Toggle Mobile Drawer
    hamburgerBtn.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('open', isMenuOpen);
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', isMenuOpen);
        iconClose.classList.toggle('hidden', !isMenuOpen);
      }
      hamburgerBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
    });

    // Close menu when clicking navigation links
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.remove('open');
        if (iconOpen && iconClose) {
          iconOpen.classList.remove('hidden');
          iconClose.classList.add('hidden');
        }
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Mobile Submenu Accordions
    document.querySelectorAll('.mobile-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        const chev = btn.querySelector('.chev');

        if (target) {
          const isOpen = target.classList.toggle('open');
          if (chev) chev.classList.toggle('rot', isOpen);
        }
      });
    });
  }

  // --- 5. INTERACTIVE ACCORDIONS (METODE & SIFAT PELATIHAN) ---
  function initAccordions() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const body = document.getElementById(targetId);
        const icon = btn.querySelector('.accordion-icon');
        const isCurrentlyOpen = body && body.classList.contains('open');

        if (body) body.classList.toggle('open');
        if (icon) icon.classList.toggle('open');
        btn.setAttribute('aria-expanded', isCurrentlyOpen ? 'false' : 'true');
      });
    });
  }

  // --- 6. TAB SWITCHER (KEUNGGULAN KAMI) ---
  function initTabs() {
    window.switchTab = function (tabName) {
      // 1. Hide all panels, activate selected panel
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.remove('active');
      });
      const targetPanel = document.getElementById(`tab-${tabName}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // 2. Update desktop buttons state
      document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });

      // 3. Sync mobile dropdown
      const select = document.getElementById('tabSelect');
      if (select && select.value !== tabName) {
        select.value = tabName;
      }
    };
  }

  // --- 7. TESTIMONIAL FILTER SWITCHER ---
  function initTestimonials() {
    window.filterTesti = function (category) {
      // 1. Update filter buttons state
      document.querySelectorAll('.testi-filter-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.category === category);
      });

      // 2. Filter testimonial cards
      const cards = document.querySelectorAll('.testi-card');
      cards.forEach((card) => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          card.classList.add('fade-in', 'show');
        } else {
          card.style.display = 'none';
        }
      });
    };
  }
})();
