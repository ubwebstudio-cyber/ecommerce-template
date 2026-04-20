const Cart = (() => {
  const STORAGE_KEY = 'ecommerce_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addItem(product, selectedSize, quantity) {
    quantity = quantity || 1;
    const cart = getCart();
    const key = product.id + '-' + selectedSize;
    const existing = cart.find(function(item) { return item.key === key; });
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        key: key,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: quantity
      });
    }
    saveCart(cart);
    updateCartBadge();
  }

  function removeItem(key) {
    const cart = getCart().filter(function(item) { return item.key !== key; });
    saveCart(cart);
    updateCartBadge();
  }

  function updateQuantity(key, quantity) {
    const cart = getCart();
    const item = cart.find(function(i) { return i.key === key; });
    if (item) {
      item.quantity = Math.max(1, parseInt(quantity, 10) || 1);
      saveCart(cart);
      updateCartBadge();
    }
  }

  function getCount() {
    return getCart().reduce(function(sum, item) { return sum + item.quantity; }, 0);
  }

  function getSubtotal() {
    return getCart().reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);
  }

  function clearCart() {
    saveCart([]);
    updateCartBadge();
  }

  function updateCartBadge() {
    const count = getCount();
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    const btn = document.getElementById('cart-icon-btn');
    if (btn) {
      btn.setAttribute('aria-label', 'Open cart (' + count + ' item' + (count !== 1 ? 's' : '') + ')');
    }
  }

  return {
    getCart: getCart,
    addItem: addItem,
    removeItem: removeItem,
    updateQuantity: updateQuantity,
    getCount: getCount,
    getSubtotal: getSubtotal,
    clearCart: clearCart,
    updateCartBadge: updateCartBadge
  };
})();
