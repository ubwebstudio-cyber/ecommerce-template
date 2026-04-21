/* =========================================================
   main.js — Shared runtime for all pages
   ========================================================= */

// ── Price formatter ───────────────────────────────────────
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

// ── Input sanitizer ───────────────────────────────────────
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '').trim().slice(0, 255);
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
  var btn  = document.querySelector('.back-to-top');
  if (!btn) return;
  var hero = document.querySelector('.hero');
  function threshold() { return hero ? hero.offsetHeight : 400; }
  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > threshold());
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
  emoji.className   = 'fly-emoji';
  emoji.textContent = '🛍️';
  emoji.style.left  = (src.left + src.width  / 2 - 16) + 'px';
  emoji.style.top   = (src.top  + src.height / 2 - 16) + 'px';
  emoji.style.setProperty('--fly-x', (dst.left + dst.width  / 2 - src.left - src.width  / 2) + 'px');
  emoji.style.setProperty('--fly-y', (dst.top  + dst.height / 2 - src.top  - src.height / 2) + 'px');
  document.body.appendChild(emoji);

  emoji.addEventListener('animationend', function () {
    emoji.remove();
    badge.classList.remove('badge-bounce');
    void badge.offsetWidth;
    badge.classList.add('badge-bounce');
    var iconBtn = document.getElementById('cart-icon-btn');
    if (iconBtn) {
      iconBtn.classList.remove('pulse');
      void iconBtn.offsetWidth;
      iconBtn.classList.add('pulse');
    }
  });
}

// ── Theme toggle ──────────────────────────────────────────
function initThemeToggle() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shop-theme', theme);
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title',      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  var current = document.documentElement.getAttribute('data-theme') || 'light';
  btn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  btn.setAttribute('title',      current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  btn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('shop-theme')) applyTheme(e.matches ? 'dark' : 'light');
    });
  }
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

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(function (a) {
    var href = a.getAttribute('href').split('?')[0].split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
}

// ── Filter sliding indicator ──────────────────────────────
function initFilterIndicator() {
  var container = document.getElementById('category-filters');
  if (!container) return;
  var indicator = document.createElement('div');
  indicator.className = 'filter-indicator';
  container.appendChild(indicator);
  function update() {
    var active = container.querySelector('.filter-btn.active');
    if (!active) { indicator.style.opacity = '0'; return; }
    indicator.style.opacity = '1';
    var cRect = container.getBoundingClientRect();
    var bRect = active.getBoundingClientRect();
    indicator.style.left  = (bRect.left - cRect.left) + 'px';
    indicator.style.width = bRect.width + 'px';
  }
  update();
  container.addEventListener('click', function () { requestAnimationFrame(update); });
  window.addEventListener('resize', update);
}

// ── Cart slide-in panel ───────────────────────────────────
function initCartPanel() {
  var panel    = document.getElementById('cart-panel');
  var overlay  = document.getElementById('cart-overlay');
  var closeBtn = document.getElementById('cart-panel-close');
  var iconBtn  = document.getElementById('cart-icon-btn');
  var itemsEl  = document.getElementById('cart-panel-items');
  var emptyEl  = document.getElementById('cart-panel-empty');
  var footerEl = document.getElementById('cart-panel-footer');
  var countEl  = panel ? panel.querySelector('.cart-panel-count') : null;

  if (!panel || !iconBtn) return;

  function open() {
    renderItems();
    panel.classList.add('is-open');
    if (overlay)  overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    panel.classList.remove('is-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderItems() {
    var items = Cart.getCart();
    var count = Cart.getCount();
    if (countEl) countEl.textContent = count > 0 ? '(' + count + ')' : '';

    if (items.length === 0) {
      if (emptyEl)  emptyEl.style.display  = 'flex';
      if (itemsEl)  itemsEl.innerHTML       = '';
      if (footerEl) footerEl.style.display  = 'none';
    } else {
      if (emptyEl)  emptyEl.style.display  = 'none';
      if (footerEl) footerEl.style.display  = 'flex';
      if (itemsEl)  itemsEl.innerHTML = items.map(function (item, i) {
        return '<li class="cart-item" data-key="' + item.key + '" style="animation-delay:' + (i * 0.06) + 's">' +
          '<img class="cart-item-img" src="' + item.image + '" alt="' + item.name + '" />' +
          '<div class="cart-item-info">' +
            '<span class="cart-item-name">' + item.name + '</span>' +
            '<span class="cart-item-meta">Size: ' + item.size + '</span>' +
            '<span class="cart-item-price">' + formatPrice(item.price) + ' each</span>' +
          '</div>' +
          '<div class="cart-item-controls">' +
            '<span class="cart-item-total">' + formatPrice(item.price * item.quantity) + '</span>' +
            '<div class="cart-qty-picker">' +
              '<button class="cart-qty-btn" data-action="minus" data-key="' + item.key + '" aria-label="Decrease">&minus;</button>' +
              '<input type="number" class="cart-qty-input" value="' + item.quantity + '" min="1" max="99" data-key="' + item.key + '" aria-label="Quantity" />' +
              '<button class="cart-qty-btn" data-action="plus" data-key="' + item.key + '" aria-label="Increase">+</button>' +
            '</div>' +
            '<button class="cart-remove-btn" data-key="' + item.key + '">Remove</button>' +
          '</div>' +
        '</li>';
      }).join('');
      updateTotals();
    }
  }

  function updateTotals() {
    var sub  = Cart.getSubtotal();
    var ship = sub >= 75 ? 0 : 7.99;
    var el;
    el = document.getElementById('panel-subtotal'); if (el) el.textContent = formatPrice(sub);
    el = document.getElementById('panel-shipping');  if (el) el.textContent = ship === 0 ? 'Free' : formatPrice(ship);
    el = document.getElementById('panel-total');     if (el) el.textContent = formatPrice(sub + ship);
    var c = Cart.getCount();
    if (countEl) countEl.textContent = c > 0 ? '(' + c + ')' : '';
    Cart.updateCartBadge();
  }

  function updateQty(key, newQty) {
    if (newQty < 1) { removeItem(key); return; }
    Cart.updateQuantity(key, newQty);
    if (!itemsEl) return;
    var li = itemsEl.querySelector('[data-key="' + key + '"]');
    if (!li) return;
    var item = Cart.getCart().find(function (i) { return i.key === key; });
    if (item) {
      var t = li.querySelector('.cart-item-total'); if (t) t.textContent = formatPrice(item.price * newQty);
      var v = li.querySelector('.cart-qty-input');  if (v) v.value        = newQty;
    }
    updateTotals();
  }

  function removeItem(key) {
    var li = itemsEl ? itemsEl.querySelector('[data-key="' + key + '"]') : null;
    if (!li) { Cart.removeItem(key); renderItems(); return; }
    li.classList.add('removing');
    li.addEventListener('animationend', function () {
      Cart.removeItem(key);
      li.remove();
      if (Cart.getCart().length === 0) renderItems();
      else updateTotals();
    }, { once: true });
  }

  if (itemsEl) {
    itemsEl.addEventListener('click', function (e) {
      var key = e.target.dataset.key;
      if (!key) return;
      if (e.target.classList.contains('cart-remove-btn')) { removeItem(key); return; }
      var item = Cart.getCart().find(function (i) { return i.key === key; });
      if (!item) return;
      if (e.target.dataset.action === 'minus') updateQty(key, item.quantity - 1);
      if (e.target.dataset.action === 'plus')  updateQty(key, item.quantity + 1);
    });

    itemsEl.addEventListener('change', function (e) {
      if (!e.target.classList.contains('cart-qty-input')) return;
      updateQty(e.target.dataset.key, parseInt(e.target.value, 10) || 1);
    });
  }

  var checkoutBtn = document.getElementById('panel-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      // If already on checkout page, just close the panel — don't reload and reset the wizard
      if (window.location.pathname.indexOf('checkout.html') !== -1) {
        close();
        return;
      }
      sessionStorage.setItem('shop-checkout-prev', window.location.pathname + window.location.search + window.location.hash);
      close();
      window.location.href = 'checkout.html';
    });
  }

  var continueBtn = document.getElementById('panel-continue-btn');
  if (continueBtn) continueBtn.addEventListener('click', close);

  iconBtn.addEventListener('click', open);
  if (overlay)  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });

  window._openCartPanel = open;
}

// ── Back button ───────────────────────────────────────────
function initBackButton() {
  var btn = document.getElementById('back-btn');
  if (!btn) return;
  var fallback = btn.getAttribute('data-fallback') || 'index.html';
  var stored   = sessionStorage.getItem('shop-prev');
  btn.href = stored || fallback;
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  Cart.updateCartBadge();
  initNavbar();
  initThemeToggle();
  initCartPanel();
  initFilterIndicator();
  initBackButton();
  initBlobCanvas();
  initScrollProgress();
  initBackToTop();
  initPageTransitions();
  initHeroTypewriter();
});
