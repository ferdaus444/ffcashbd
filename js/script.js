document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Toast helper ---------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2600);
  }

  /* ---------- Match join buttons ---------- */

  document.querySelectorAll('.join').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.match-card');
      var name = card ? card.querySelector('.match-card__name').textContent : 'ম্যাচ';
      showToast(name + '-এ জয়েন করতে অ্যাপ ওপেন করুন!');
    });
  });

  /* ---------- Animated stat counters ---------- */
  var stats = document.querySelectorAll('.stat');

  function animateStat(statEl) {
    var target = parseInt(statEl.getAttribute('data-count'), 10) || 0;
    var prefix = statEl.getAttribute('data-prefix') || '';
    var suffix = statEl.getAttribute('data-suffix') || '';
    var numEl = statEl.querySelector('.stat__num');
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      numEl.textContent = prefix + current.toLocaleString('en-US') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = prefix + target.toLocaleString('en-US') + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll reveal + stat trigger ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var statsContainer = document.getElementById('stats');
  var statsAnimated = false;

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    if (statsContainer) {
      var statsObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            stats.forEach(animateStat);
            obs.disconnect();
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(statsContainer);
    }
  } else {
    /* Fallback: no IntersectionObserver support */
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    stats.forEach(animateStat);
  }

  /* ---------- Topbar shadow on scroll ---------- */
  var topbar = document.getElementById('topbar');
  if (topbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 8) {
        topbar.style.boxShadow = '0 4px 18px rgba(28,27,31,0.06)';
      } else {
        topbar.style.boxShadow = 'none';
      }
    });
  }

});
