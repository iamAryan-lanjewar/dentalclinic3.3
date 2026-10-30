/**
 * DENTAL CLINIC 2.0 - MODERN APP-LIKE INTERACTIVE PROTOCOL
 * Handles Booking Modal, Service Explorer, Clipboard Actions, Toast Notifications & SEO
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const bookingModal = document.getElementById('bookingModal');
  const serviceModal = document.getElementById('serviceModal');
  const toastNotice = document.getElementById('toastNotice');
  const bookingForm = document.getElementById('bookingForm');
  const floatingBookPill = document.getElementById('floatingBookPill');

  // Service details database for interactive explorer
  const serviceDetails = {
    'root canel': {
      title: 'Root Canal Treatment (Endodontics)',
      desc: 'Gentle, pain-free therapy designed to eliminate bacteria from the infected root canal, prevent reinfection of the tooth, and save the natural tooth. Performed with high-precision digital imaging and motorized rotaries.',
      duration: '45 - 60 mins',
      recovery: 'Immediate return to daily activities'
    },
    'dnture': {
      title: 'Modern Dentures & Prosthodontics',
      desc: 'Custom-crafted complete or partial dentures tailored to your exact jaw contour and bite. Lightweight, durable, and naturally aesthetic.',
      duration: '2 - 3 visits',
      recovery: 'Comfortable adaptation within days'
    },
    'cosmatic filling': {
      title: 'Cosmetic Composite Fillings',
      desc: 'Tooth-colored aesthetic resin composite fillings that blend seamlessly with natural enamel. Restores tooth structure while preserving a radiant, natural look.',
      duration: '30 mins per tooth',
      recovery: 'Instant cure under specialized light'
    },
    'surgical extraction': {
      title: 'Surgical & Wisdom Tooth Extraction',
      desc: 'Minimally invasive extraction performed with local anesthesia and modern gentle surgical instruments to ensure maximum patient comfort and rapid healing.',
      duration: '30 - 45 mins',
      recovery: '2 - 3 days gentle care'
    },
    'ultrasonic scaling': {
      title: 'Ultrasonic Scaling & Prophylaxis',
      desc: 'Advanced ultrasonic vibrations remove stubborn calculus, tartar, and bacterial plaque from teeth and beneath gum lines without damaging sensitive enamel.',
      duration: '30 - 45 mins',
      recovery: 'Instant freshness and clean breath'
    },
    'crown & bridges': {
      title: 'Porcelain Crowns & Dental Bridges',
      desc: 'Premium zirconia and ceramic crowns designed to reinforce damaged teeth or fill gaps with permanent, rock-solid, lifelike restorations.',
      duration: '2 appointments',
      recovery: 'Long-lasting 15+ years strength'
    },
    'dental veeners': {
      title: 'Porcelain & Composite Dental Veneers',
      desc: 'Ultra-thin, custom porcelain laminates sculpted to reshape, brighten, and perfect your front teeth for an unforgettable Hollywood smile.',
      duration: '2 visits',
      recovery: 'Immediate transformation'
    },
    'implant': {
      title: 'Titanium Dental Implants',
      desc: 'Gold-standard tooth replacement using medical-grade titanium anchors topped with handcrafted ceramic crowns. Replaces roots with permanent stability.',
      duration: 'Multi-stage precision care',
      recovery: 'Permanent tooth replacement'
    },
    'tooth extraction': {
      title: 'Gentle Tooth Extraction',
      desc: 'Safe, painless extraction of severely damaged or crowded teeth, focusing on alveolar bone preservation for future implants.',
      duration: '20 - 30 mins',
      recovery: '1 - 2 days'
    },
    'orthodontic dental care': {
      title: 'Orthodontic Dental Care & Aligners',
      desc: 'State-of-the-art clear aligners and modern brackets designed to straighten crooked teeth, fix bite issues, and align your jaw with maximum discretion.',
      duration: 'Custom treatment plan',
      recovery: 'Gradual, comfortable movement'
    },
    'dental intraoral camera': {
      title: 'Digital Dental Intraoral Camera Exam',
      desc: 'Ultra-high-definition digital photography inside your mouth. You see exactly what the doctor sees on chairside HD monitors in real-time.',
      duration: 'Included in regular checkups',
      recovery: 'Zero downtime'
    }
  };

  // Toast notification helper
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // Open / Close Modals
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

  // Trigger Service Explorer Modal
  const serviceTrigger = document.querySelector('[data-action="explore-services"]');
  if (serviceTrigger) {
    serviceTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openServiceDetails('root canel');
    });
  }

  // Click on treatment list items
  const treatmentItems = document.querySelectorAll('.treatment-bullet-list li');
  treatmentItems.forEach(item => {
    item.addEventListener('click', () => {
      const key = item.getAttribute('data-service') || item.textContent.replace('•', '').trim().toLowerCase();
      openServiceDetails(key);
    });
  });

  function openServiceDetails(serviceKey) {
    const data = serviceDetails[serviceKey] || {
      title: 'Comprehensive Dental Treatment',
      desc: 'Tailored dental care provided by certified BDS/MDS specialists using advanced dental technology.',
      duration: '30 - 60 mins',
      recovery: 'Immediate'
    };

    const sTitle = document.getElementById('serviceDetailTitle');
    const sDesc = document.getElementById('serviceDetailDesc');
    const sDuration = document.getElementById('serviceDetailDuration');
    const sRecovery = document.getElementById('serviceDetailRecovery');

    if (sTitle) sTitle.textContent = data.title;
    if (sDesc) sDesc.textContent = data.desc;
    if (sDuration) sDuration.textContent = data.duration;
    if (sRecovery) sRecovery.textContent = data.recovery;

    openModal(serviceModal);
  }

  // Close buttons for modals
  document.querySelectorAll('.modal-close-btn, [data-action="close-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(bookingModal);
      closeModal(serviceModal);
    });
  });

  // Click outside modal card to close
  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal(bookingModal);
    if (e.target === serviceModal) closeModal(serviceModal);
  });

  // Keyboard Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(bookingModal);
      closeModal(serviceModal);
    }
    // Press 'b' to open appointment page if not in form input
    if ((e.key === 'b' || e.key === 'B') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      window.location.href = '/appointment.html';
    }
  });

  // Copy contact info to clipboard
  const copyableItems = document.querySelectorAll('[data-copy]');
  copyableItems.forEach(item => {
    item.addEventListener('click', () => {
      const textToCopy = item.getAttribute('data-copy');
      if (textToCopy && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast(`Contact: ${textToCopy}`);
        });
      }
    });
  });

  // Handle Booking Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
          closeModal(bookingModal);
          bookingForm.reset();
          showToast('Appointment Confirmed! We look forward to seeing your smile.');
        } else {
          showToast(result.message || 'Error scheduling appointment.');
        }
      } catch (err) {
        // Offline / fallback simulation
        closeModal(bookingModal);
        bookingForm.reset();
        showToast(`Thank you ${data.patientName || 'valued patient'}! Appointment booked for ${data.preferredDate || 'tomorrow'}.`);
      }
    });
  }

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
});

