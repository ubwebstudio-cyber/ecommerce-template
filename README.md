# E-Commerce Template

A clean, minimal front-end e-commerce template built with plain HTML, CSS, and JavaScript. No frameworks, no build tools, no backend required.

## Pages

| File | Description |
|---|---|
| `index.html` | Homepage — hero, collections lookbook, product grid, filters, search, sort, wishlist section |
| `product.html` | Product detail — image, description, size selector, quantity, add to cart |
| `checkout.html` | Checkout — 3-step wizard, promo codes, shipping methods, form validation |
| `success.html` | Order confirmation — order number and item recap |

## Features

- **Wishlist (favorites)** — heart icon on each product card, stored in `localStorage`, count badge in the navbar, and a dedicated section on the homepage.
- **Promo codes** — try `SAVE10`, `WELCOME` (15% off), or `FLAT5` ($5 off) on the checkout page.
- **Cart slide-in panel** — click the cart icon to open on any page.
- **Dark mode toggle** — respects system preference; persisted in `localStorage`.
- **Keyboard accessibility** — skip-to-content link, visible focus rings, full keyboard navigation.
- **Reduced motion** — all decorative animations disable when `prefers-reduced-motion: reduce` is set.

## How to Run

No build step needed. Open any `.html` file directly in a browser, or serve the folder with any static file server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

---

## How to Customize

### Swap in Real Products

Edit `js/products.js`. Each product follows this shape:

```js
{
  id: 1,                        // unique number
  name: "Product Name",
  category: "clothing",         // clothing | electronics | accessories | footwear
  price: 29.99,
  oldPrice: 39.99,              // set to null to hide the strikethrough price
  description: "…",
  image: "images/your-photo.jpg",
  badge: "Sale",                // "Sale" | "New" | null
  sizes: ["S", "M", "L", "XL"] // use ["One Size"] for non-sized items
}
```

To add a new category, add products with the new `category` value and add a matching filter button in `index.html`:

```html
<button class="filter-btn" data-category="your-category">Your Category</button>
```

### Change Colors and Fonts

All design tokens live at the top of `css/style.css` inside `:root { … }`. Edit those variables to restyle the entire site without touching HTML.

```css
:root {
  --color-bg:           #ffffff;   /* page background */
  --color-text:         #111111;   /* primary text */
  --color-accent:       #111111;   /* buttons, active states */
  --color-accent-hover: #333333;   /* button hover */
  --color-border:       #e2e2e2;   /* card and input borders */
  --color-surface:      #f7f7f7;   /* image backgrounds, surfaces */
  --color-badge-sale:   #c0392b;   /* Sale badge */
  --color-badge-new:    #1a6bb5;   /* New badge */
  --font-family: -apple-system, …; /* swap in any Google Font here */
}
```

**Example — blue accent:**
```css
--color-accent:       #1a56db;
--color-accent-hover: #1e429f;
```

**Example — custom font (add the `<link>` tag in each HTML `<head>` first):**
```css
--font-family: 'Inter', sans-serif;
```

### Replace Product Images

1. Drop your image files into the `images/` folder.
2. Update the `image` field in `js/products.js` to match the filename:
   ```js
   image: "images/my-product.jpg"
   ```
   Images are displayed at a 1:1 aspect ratio — square crops work best.

### Change the Store Name

Search and replace `SHOP` across all `.html` files with your store name. The logo is a plain text link in the navbar:
```html
<a href="index.html" class="navbar-logo">SHOP</a>
```

### Add More Pages

1. Copy any existing page as a starting point.
2. Keep the navbar and footer markup identical.
3. Link to it from the navbar in every page's `<ul id="navbar-links">`.

---

## How to Deploy to Netlify

**Drag-and-drop (no account required):**

1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag the entire `ecommerce-template/` folder onto the page.
3. Your site is live in seconds with a `*.netlify.app` URL.

**Via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --dir . --prod
```

**Via GitHub:**
1. Push the folder to a GitHub repository.
2. In Netlify → "Add new site" → "Import an existing project" → connect your repo.
3. Set publish directory to `/` (or the folder name). No build command needed.

---

## File Structure

```
ecommerce-template/
├── index.html
├── product.html
├── cart.html
├── checkout.html
├── success.html
├── css/
│   └── style.css        ← all styles; CSS variables at the top
├── js/
│   ├── products.js      ← product data array (mock database)
│   ├── cart.js          ← cart logic + localStorage read/write
│   ├── wishlist.js      ← wishlist (favorites) logic + localStorage
│   ├── templates.js     ← shared product card renderer
│   └── main.js          ← shared UI: navbar, cart badge, toast, escapeHtml
├── images/
│   └── placeholder.svg  ← replace with real product images
└── README.md
```

## Cart Behaviour

- Cart state is stored in `localStorage` under the key `ecommerce_cart`.
- The cart badge in the navbar updates on every page automatically.
- Items are keyed by `productId-size`, so the same product in different sizes appears as separate line items.
- Clearing browser storage resets the cart.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills required.
