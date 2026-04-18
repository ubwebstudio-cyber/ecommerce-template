/* =========================================================
   main.js — Shared runtime for all pages
   ========================================================= */

// ── Blob canvas ───────────────────────────────────────────
function initBlobCanvas() {
  var canvas = document.getElementById('blob-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var paused = false;

  var blobs = [
    { x: 0.22, y: 0.28, r: 0.30, dx:  0.00030, dy:  0.00022, color: [167, 139, 250] },
    { x: 0.72, y: 0.22, r: 0.24, dx: -0.00024, dy:  0.00019, color: [244, 114, 182] },
    { x: 0.55, y: 0.72, r: 0.28, dx:  0.00019, dy: -0.00027, color:  [52, 211, 153] },
    { x: 0.18, y: 0.78, r: 0.21, dx:  0.00032, dy:  0.00016, color:  [96, 165, 250] },
    { x: 0.82, y: 0.60, r: 0.19, dx: -0.00016, dy: -0.00021, color: [251, 207, 232] },
    { x: 0.45, y: 0.44, r: 0.16, dx:  0.00021, dy:  0.00030, color: [167, 243, 208] },
  ];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(function (b) {
      var cx = b.x * canvas.width;
      var cy = b.y * canvas.height;
      var r  = b.r * Math.min(canvas.width, canvas.height);
      var g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + b.color.join(',') + ',0.78)');
      g.addColorStop(1, 'rgba(' + b.color.join(',') + ',0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      b.x += b.dx;
      b.y += b.dy;
      if (b.x < 0 || b.x > 1) b.dx *= -1;
      if (b.y < 0 || b.y > 1) b.dy *= -1;
    });
  }

  function loop() {
    if (!paused) draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
  });
  loop();
}

// ── Scroll progress bar ───────────────────────────────────
function initScrollProgress() {
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  function update() {
    var scrolled = window.scrollY;
    var total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── Back-to-top button ────────────────────────────────────
function initBackToTop() {
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Page transitions ──────────────────────────────────────
function initPageTransitions() {
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('javascript') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        a.hasAttribute('download') ||
        a.getAttribute('target') === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-transition-out');
    setTimeout(function () { window.location.href = href; }, 220);
  });
}

// ── Hero typewriter ───────────────────────────────────────
function initHeroTypewriter() {
  var el = document.getElementById('hero-typewriter');
  if (!el) return;
  var phrases = [
    'for Every Day.',
    'Built to Last.',
    'Designed to Impress.',
    'Worth Every Penny.',
    'Simply Essential.',
  ];
  var phraseIdx = 0;
  var charIdx   = 0;
  var deleting  = false;
  var hold      = 0;

  function tick() {
    var phrase = phrases[phraseIdx];
    if (hold > 0) { hold--; setTimeout(tick, 80); return; }

    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) { deleting = true; hold = 22; }
      setTimeout(tick, 65);
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        hold = 6;
      }
      setTimeout(tick, 38);
    }
  }

  setTimeout(tick, 900);
}

// ── Fly-to-cart animation ─────────────────────────────────
function flyToCart(sourceEl) {
  var badge = document.getElementById('cart-count');
  if (!badge || !sourceEl) return;

  var src = sourceEl.getBoundingClientRect();
  var dst = badge.getBoundingClientRect();

  var emoji = document.createElement('div');
  emoji.className    = 'fly-emoji';
  emoji.textContent  = '🛍️';
  emoji.style.left   = (src.left + src.width  / 2 - 16) + 'px';
  emoji.style.top    = (src.top  + src.height / 2 - 16) + 'px';
  emoji.style.setProperty('--fly-x', (dst.left + dst.width  / 2 - src.left - src.width  / 2) + 'px');
  emoji.style.setProperty('--fly-y', (dst.top  + dst.height / 2 - src.top  - src.height / 2) + 'px');
  document.body.appendChild(emoji);

  emoji.addEventListener('animationend', function () {
    emoji.remove();
    badge.classList.remove('badge-bounce');
    void badge.offsetWidth; // force reflow
    badge.classList.add('badge-bounce');
  });
}

// ── Navbar ────────────────────────────────────────────────
function initNavbar() {
  var toggle = document.getElementById('navbar-toggle');
  var links  = document.getElementById('navbar-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active page highlight
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href').split('?')[0].split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll shadow on navbar
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
}

// ── Price formatter ───────────────────────────────────────
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

// ── Toast notification ────────────────────────────────────
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast-visible');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function () {
    toast.classList.remove('toast-visible');
  }, 2500);
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  Cart.updateCartBadge();
  initNavbar();
  initBlobCanvas();
  initScrollProgress();
  initBackToTop();
  initPageTransitions();
  initHeroTypewriter();
});
