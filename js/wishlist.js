/* =========================================================
   wishlist.js — favorites stored in localStorage
   ========================================================= */

const Wishlist = (() => {
  const STORAGE_KEY = 'ecommerce_wishlist';

  function get() {
    try {
      var v = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(v) ? v.map(Number).filter(function (n) { return !isNaN(n); }) : [];
    } catch {
      return [];
    }
  }

  function save(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function has(id) {
    return get().indexOf(Number(id)) !== -1;
  }

  function toggle(id) {
    id = Number(id);
    var ids = get();
    var idx = ids.indexOf(id);
    if (idx === -1) ids.push(id);
    else            ids.splice(idx, 1);
    save(ids);
    updateBadge();
    return idx === -1; // true if added
  }

  function count() {
    return get().length;
  }

  function updateBadge() {
    var badge = document.getElementById('wishlist-count');
    if (!badge) return;
    var c = count();
    badge.textContent = c;
    badge.style.display = c > 0 ? 'flex' : 'none';
  }

  // Delegated click handler for any .wishlist-btn on the page
  function initDelegation() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.wishlist-btn');
      if (!btn) return;
      // Prevent parent <a> navigation
      e.preventDefault();
      e.stopPropagation();
      var id    = btn.getAttribute('data-wishlist-id');
      var added = toggle(id);
      btn.classList.toggle('is-active', added);
      btn.setAttribute('aria-pressed', added ? 'true' : 'false');
      btn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
      if (typeof showToast === 'function') {
        showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
      }
    });
  }

  return {
    get: get,
    has: has,
    toggle: toggle,
    count: count,
    updateBadge: updateBadge,
    initDelegation: initDelegation
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  Wishlist.initDelegation();
  Wishlist.updateBadge();
});
