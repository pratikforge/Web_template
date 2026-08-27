(function () {
  'use strict';

  /* ==========================================================================
     Category Pills Interactivity
     ========================================================================== */
  const pills = document.querySelectorAll('.pill-chip');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ==========================================================================
     Showcase Mini Chart Interactivity
     ========================================================================== */
  const bars = document.querySelectorAll('.mini-chart .chart-bar');
  bars.forEach((bar) => {
    bar.addEventListener('mouseenter', () => {
      bars.forEach((b) => b.classList.remove('active'));
      bar.classList.add('active');
    });
  });

  /* ==========================================================================
     Mobile Drawer Navigation
     ========================================================================== */
  const toggleBtn = document.querySelector('.mobile-toggle');
  const overlay = document.querySelector('.mobile-overlay');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && overlay && drawer) {
    const setDrawer = (open) => {
      toggleBtn.setAttribute('aria-expanded', String(open));
      overlay.hidden = !open;
      drawer.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      setDrawer(!isOpen);
    });

    overlay.addEventListener('click', () => setDrawer(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setDrawer(false);
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setDrawer(false));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setDrawer(false);
    });
  }

  /* ==========================================================================
     Smooth Scroll for In-Page Anchor Links
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
