// Shared product card renderer — used by index.html and product.html
// Requires: formatPrice() from main.js

function renderProductCard(p) {
  var badge = p.badge
    ? '<span class="badge badge-' + p.badge.toLowerCase() + ' product-card-badge">' + p.badge + '</span>'
    : '';
  var oldPrice = p.oldPrice
    ? '<span class="product-card-old-price">' + formatPrice(p.oldPrice) + '</span>'
    : '';
  return '<li>' +
    '<a href="product.html?id=' + p.id + '" class="product-card" data-category="' + p.category + '">' +
      '<div class="product-card-img-wrap">' +
        '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" />' +
        badge +
      '</div>' +
      '<div class="product-card-body">' +
        '<span class="product-card-category">' + p.category + '</span>' +
        '<span class="product-card-name">' + p.name + '</span>' +
        '<div class="product-card-prices">' +
          '<span class="product-card-price">' + formatPrice(p.price) + '</span>' +
          oldPrice +
        '</div>' +
      '</div>' +
    '</a>' +
  '</li>';
}
