/**
 * DENTAL CLINIC 2.0 - MODERN APP-LIKE INTERACTIVE PROTOCOL
 * Handles Booking Modal, Service Explorer, Clipboard Actions, Toast Notifications & SEO
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const toastNotice = document.getElementById('toastNotice');
  const floatingBookPill = document.getElementById('floatingBookPill');

  // Toast notification helper
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // Generic Open / Close Modal helpers
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea, button');
    if (firstInput) firstInput.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger Booking Page Navigation
  const appointmentTriggers = document.querySelectorAll('[data-action="book-appointment"]');
  appointmentTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName !== 'A') {
        e.preventDefault();
        window.location.href = '/appointment.html';
      }
    });
  });

  // Navigate to Dedicated Service Page
  const serviceTrigger = document.querySelector('[data-action="explore-services"]');
  if (serviceTrigger) {
    serviceTrigger.addEventListener('click', (e) => {
      // Let standard link navigation work, or smoothly redirect
      window.location.href = '/service.html';
    });
  }

  // Click on treatment list items -> Navigate directly to that treatment section on service.html
  const treatmentItems = document.querySelectorAll('.treatment-bullet-list li');
  treatmentItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const link = item.querySelector('a');
      const href = link ? link.getAttribute('href') : null;
      const target = item.getAttribute('data-target') || item.getAttribute('data-service');
      if (href) {
        window.location.href = href;
      } else if (target) {
        window.location.href = `/service.html#${target}`;
      }
    });
  });

  // Kinetic "Tip-Tap" Motion Engine for 'What We Serve' (PC Cursor & Mobile Touch Tracking)
  const treatmentListEl = document.querySelector('.treatment-bullet-list');
  if (treatmentListEl) {
    let currentPopItem = null;
    let settleTimer = null;

    function activateTipTap(item) {
      if (currentPopItem === item) return;

      if (currentPopItem) {
        const departing = currentPopItem;
        departing.classList.remove('tip-tap-active', 'touch-pop');
        departing.classList.add('tip-tap-settle');
        setTimeout(() => {
          departing.classList.remove('tip-tap-settle');
        }, 300);
      }

      currentPopItem = item;
      if (currentPopItem) {
        currentPopItem.classList.remove('tip-tap-settle');
        currentPopItem.classList.add('tip-tap-active');
      }
    }

    function clearTipTap() {
      if (currentPopItem) {
        const departing = currentPopItem;
        departing.classList.remove('tip-tap-active', 'touch-pop');
        departing.classList.add('tip-tap-settle');
        setTimeout(() => {
          departing.classList.remove('tip-tap-settle');
        }, 300);
        currentPopItem = null;
      }
    }

    // PC: Cursor tracking over options
    treatmentListEl.addEventListener('mousemove', (e) => {
      const li = e.target.closest('.treatment-bullet-list li');
      if (li) {
        activateTipTap(li);
      } else {
        clearTipTap();
      }
    });

    treatmentListEl.addEventListener('mouseleave', () => {
      clearTipTap();
    });

    // Mobile: Finger tracking over options
    treatmentListEl.addEventListener('touchstart', (e) => {
      clearTimeout(settleTimer);
      const touch = e.touches[0];
      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const li = targetEl ? targetEl.closest('.treatment-bullet-list li') : null;
      if (li) activateTipTap(li);
    }, { passive: true });

    treatmentListEl.addEventListener('touchmove', (e) => {
      clearTimeout(settleTimer);
      const touch = e.touches[0];
      const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
      const li = targetEl ? targetEl.closest('.treatment-bullet-list li') : null;
      if (li) {
        activateTipTap(li);
      } else {
        clearTipTap();
      }
    }, { passive: true });

    treatmentListEl.addEventListener('touchend', () => {
      settleTimer = setTimeout(clearTipTap, 320);
    }, { passive: true });

    treatmentListEl.addEventListener('touchcancel', clearTipTap, { passive: true });
  }

  // Keyboard shortcut: Press 'b' to open appointment page if not in form input
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'b' || e.key === 'B') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      window.location.href = '/appointment.html';
    }
  });

  // Mobile navigation menu toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (mobileNavToggle && primaryNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('nav-open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    primaryNav.querySelectorAll('.nav-btn').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('nav-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================================================
  // SLIDING ORANGE PILL ANIMATION (Button-to-Button Glide)
  // ==========================================================================
  const navMenu = document.getElementById('primaryNav');
  const slidingPill = document.getElementById('navSlidingPill');
  const navButtons = navMenu ? Array.from(navMenu.querySelectorAll('.nav-btn')) : [];

  function movePillTo(element, animate = true) {
    if (!element || !slidingPill || !navMenu) return;

    // Don't show pill on mobile dropdown
    if (window.innerWidth <= 980) {
      slidingPill.style.opacity = '0';
      return;
    }

    const menuRect = navMenu.getBoundingClientRect();
    const btnRect = element.getBoundingClientRect();

    const left = btnRect.left - menuRect.left;
    const width = btnRect.width;

    if (!animate) {
      slidingPill.style.transition = 'none';
    } else {
      slidingPill.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.85, 0.25, 1), width 0.32s cubic-bezier(0.2, 0.85, 0.25, 1), opacity 0.2s ease';
    }

    slidingPill.style.transform = `translateX(${left}px)`;
    slidingPill.style.width = `${width}px`;
    slidingPill.style.opacity = '1';

    if (!animate) {
      // Force repaint then re-enable transition
      void slidingPill.offsetHeight;
      slidingPill.style.transition = '';
    }
  }

  function getActiveButton() {
    if (!navMenu) return null;
    return navMenu.querySelector('.nav-btn.active') || navButtons[0];
  }

  if (navButtons.length > 0 && slidingPill) {
    // Initial position on DOM ready and window load
    setTimeout(() => {
      movePillTo(getActiveButton(), false);
    }, 60);

    window.addEventListener('load', () => {
      movePillTo(getActiveButton(), false);
    });

    // Hover animation: glide smoothly button to button
    navButtons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        movePillTo(btn, true);
      });
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            movePillTo(btn, true);

            const headerOffset = 70;
            const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = Math.max(0, elementPosition - headerOffset);

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Mouse leave: glide back to the current active button
    if (navMenu) {
      navMenu.addEventListener('mouseleave', () => {
        movePillTo(getActiveButton(), true);
      });
    }

    // Recompute on resize
    window.addEventListener('resize', () => {
      movePillTo(getActiveButton(), false);
    });
  }

  // Active section indicator on scroll: dynamically moves active state + sticks orange pill to current page
  const sections = [
    { id: 'hero', el: document.getElementById('hero') },
    { id: 'specialist', el: document.getElementById('specialist') },
    { id: 'services', el: document.getElementById('services') },
    { id: 'about', el: document.getElementById('about') },
    { id: 'testimonials', el: document.getElementById('testimonials') },
    { id: 'contact', el: document.getElementById('contact') }
  ].filter(s => s.el !== null);

  if (navButtons.length > 0 && sections.length > 0) {
    let isUserHoveringNav = false;
    if (navMenu) {
      navMenu.addEventListener('mouseenter', () => { isUserHoveringNav = true; });
      navMenu.addEventListener('mouseleave', () => {
        isUserHoveringNav = false;
        movePillTo(getActiveButton(), true);
      });
    }

    function onScrollUpdate() {
      const scrollY = window.scrollY;
      const probe = scrollY + 120; // 72px header + probe buffer

      let currentSectionId = sections[0].id;

      // Check each section in order; the last section whose top is above probe wins
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i].el;
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (probe >= top) {
          currentSectionId = sections[i].id;
        }
      }

      // If scrolled to bottom of page, highlight Contact
      const isBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);
      if (isBottom) {
        currentSectionId = 'contact';
      }

      navButtons.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSectionId) {
          if (!link.classList.contains('active')) {
            navButtons.forEach(b => b.classList.remove('active'));
            link.classList.add('active');
            if (!isUserHoveringNav) {
              movePillTo(link, true);
            }
          }
        }
      });
    }

    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    // Initial check
    setTimeout(onScrollUpdate, 100);
  }

  // Default date input to tomorrow
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // ==========================================================================
  // TAP / CLICK TO HIDE & SHOW NAVIGATION STRIP (IMPROVED UI/UX)
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  let isNavHidden = false;
  let lastScrollY = window.scrollY;

  function showNavbar() {
    if (!siteHeader) return;
    siteHeader.classList.remove('nav-hidden');
    isNavHidden = false;
    setTimeout(() => {
      if (typeof movePillTo === 'function' && typeof getActiveButton === 'function') {
        movePillTo(getActiveButton(), false);
      }
    }, 60);
  }

  function hideNavbar() {
    if (!siteHeader) return;
    siteHeader.classList.add('nav-hidden');
    isNavHidden = true;
  }

  // Handle tap / click on the screen to toggle hide/show
  document.addEventListener('click', (e) => {
    // 1. If clicking inside the navbar itself, don't hide
    if (e.target.closest('.site-header')) {
      return;
    }

    // 2. If clicking on active modal dialogs, inputs, forms, don't toggle
    if (e.target.closest('.modal-overlay.active, form, input, textarea, select, .skip-link')) {
      return;
    }

    // 3. If currently hidden: tap on the screen immediately restores the strip!
    if (isNavHidden) {
      showNavbar();
      return;
    }

    // 4. If clicking on an action button/link on the page (e.g. "Get Appointment"), let it perform action
    if (e.target.closest('button, a')) {
      return;
    }

    // 5. Tapping on the screen / page background hides the strip for clean immersive view
    hideNavbar();
  });

  // Mobile Hero Header visibility handler
  function syncMobileHeroHeader() {
    if (!siteHeader) return;
    if (window.innerWidth <= 768) {
      if (window.scrollY < 40) {
        siteHeader.classList.add('mobile-hero-hidden');
      } else {
        siteHeader.classList.remove('mobile-hero-hidden');
      }
    } else {
      siteHeader.classList.remove('mobile-hero-hidden');
    }
  }

  // Reveal when scrolling upwards significantly
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    syncMobileHeroHeader();
    if (isNavHidden && currentScrollY < lastScrollY - 15) {
      showNavbar();
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  window.addEventListener('resize', syncMobileHeroHeader, { passive: true });
  syncMobileHeroHeader();

  // Smooth scroll landing for incoming hash (e.g. from service.html 'back' button to #values)
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }
});

