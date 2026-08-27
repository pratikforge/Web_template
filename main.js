(function () {
  'use strict';

  /* ==========================================================================
     Stats Count-Up Animation
     ========================================================================== */
  var stats = Array.prototype.slice.call(document.querySelectorAll('.stat-value'));

  var easeOutCubic = function (t) {
    return 1 - Math.pow(1 - t, 3);
  };

  var formatValue = function (el, value) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    el.textContent = value.toFixed(decimals) + suffix;
  };

  var countUp = function (el) {
    var target = parseFloat(el.dataset.target);
    var index = stats.indexOf(el);
    var duration = 1500 + index * 80;
    var offset = 480 + index * 90;
    var start = null;

    var tick = function (now) {
      if (start === null) start = now;
      var elapsed = now - start - offset;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      var p = Math.min(elapsed / duration, 1);
      formatValue(el, target * easeOutCubic(p));
      if (p < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if (stats.length && 'IntersectionObserver' in window) {
    var counted = new Set();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || counted.has(entry.target)) return;
          counted.add(entry.target);
          io.unobserve(entry.target);
          countUp(entry.target);
        });
      },
      { threshold: 0.25 }
    );
    stats.forEach(function (el) {
      io.observe(el);
    });
  } else {
    stats.forEach(function (el) {
      formatValue(el, parseFloat(el.dataset.target));
    });
  }

  /* ==========================================================================
     Mobile Sheet Menu Interaction
     ========================================================================== */
  var burger = document.querySelector('.burger');
  var overlay = document.querySelector('.overlay');
  var menu = document.getElementById('mobile-menu');

  if (burger && overlay && menu) {
    var setMenu = function (open) {
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      overlay.hidden = !open;
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };

    burger.addEventListener('click', function () {
      setMenu(!burger.classList.contains('open'));
    });

    overlay.addEventListener('click', function () {
      setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) setMenu(false);
    });
  }
})();
