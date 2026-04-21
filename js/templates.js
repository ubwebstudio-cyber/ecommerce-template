// Shared product card renderer — used by index.html and product.html
// Requires: formatPrice(), escapeHtml() from main.js

function renderProductCard(p) {
  var name     = escapeHtml(p.name);
  var category = escapeHtml(p.category);
  var image    = escapeHtml(p.image);
  var badge    = p.badge
    ? '<span class="badge badge-' + escapeHtml(p.badge.toLowerCase()) + ' product-card-badge">' + escapeHtml(p.badge) + '</span>'
    : '';
  var oldPrice = p.oldPrice
    ? '<span class="product-card-old-price">' + formatPrice(p.oldPrice) + '</span>'
    : '';
  var isFav    = typeof Wishlist !== 'undefined' && Wishlist.has(p.id);
  var favBtn   = '<button type="button" class="wishlist-btn' + (isFav ? ' is-active' : '') +
    '" data-wishlist-id="' + p.id + '" aria-label="' + (isFav ? 'Remove from wishlist' : 'Add to wishlist') + '" aria-pressed="' + (isFav ? 'true' : 'false') + '">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
    '</button>';
  return '<li>' +
    '<a href="product.html?id=' + p.id + '" class="product-card" data-category="' + category + '">' +
      '<div class="product-card-img-wrap">' +
        '<img src="' + image + '" alt="' + name + '" loading="lazy" />' +
        badge +
        favBtn +
      '</div>' +
      '<div class="product-card-body">' +
        '<span class="product-card-category">' + category + '</span>' +
        '<span class="product-card-name">' + name + '</span>' +
        '<div class="product-card-prices">' +
          '<span class="product-card-price">' + formatPrice(p.price) + '</span>' +
          oldPrice +
        '</div>' +
      '</div>' +
    '</a>' +
  '</li>';
}
