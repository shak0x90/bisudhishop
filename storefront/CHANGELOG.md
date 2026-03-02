# Changelog

All notable changes to the BisudhiShop storefront are documented here.

---

## [Unreleased] — 2026-03-02

### ✨ Features & Improvements
- **Guest Checkout:** Unauthenticated users can now proceed directly to checkout without being redirected to the login page (`summary.tsx`).
- **Cash on Delivery (COD):** Relabeled the built-in `pp_system_default` manual payment provider to "Cash on Delivery (COD)" with a 💵 icon in `constants.tsx`.
- **Admin Auto-Logout Extension:** Increased the Admin panel auto-logout timer from 1 day to 2 hours by adding `jwtExpiresIn: "2h"` to `medusa-config.ts`.

### 🐛 Mobile & UI Fixes
- **Mobile Account Overview:** Fixed an issue where the `Overview` dashboard (profile completion, saved addresses, recent orders) was hidden on mobile screens due to a `hidden small:block` wrapper.
- **Account Navigation:** Refactored the mobile `AccountNav` to be a clean dropdown list across all subpages instead of awkwardly mimicking the dashboard homepage.
- **Checkout Branding:** Replaced "Medusa Store" text with "Bisudhishop" in the checkout header, and changed the "Powered by Medusa & Next.js" logos in the footer to a simple "© Bisudhishop. All rights reserved." text.
- **Messenger Button Match:** Added a matching blue border (`#0084FF`) and hover effect to the "Order via Messenger" button on product pages so it perfectly aligns with the WhatsApp button styling.


### 🎨 Design System
- Updated brand color palette in `tailwind.config.js`: deep forest green `#2D6A4F`, warm cream, sage accent
- Added reusable component utility classes to `globals.css` for buttons, cards, sections, and trust lines

### 🖼️ Trust Fixes (Phase 1)
- Added branded fallback food image (`/public/images/fallback-food.png`) for products with no thumbnail
- Updated `Thumbnail` component to use fallback and corrected alt text
- `ProductInfoTab` now hides empty fields (Material, Dimensions, Weight) for grocery products

### 🏠 Homepage Redesign (Phase 3)
- Restructured homepage to ideal 6-section flow:
  1. Hero (emotional)
  2. Meet the Farmers (community story)
  3. Fresh This Week (8 products, curated)
  4. Why Families Trust Us
  5. Browse Categories (with `#categories` anchor)
  6. Final CTA — *"Your weekly basket, delivered fresh."*
- Hero rewritten: mobile-first, `py-10 md:py-20`, max 80vh on mobile, subtitle `line-clamp-2`, "Browse Categories ↓" anchor link
- Created new `meet-farmers/index.tsx` section with farmer stats and "Learn our story" link
- `AllProducts` renamed to `FreshThisWeek`, capped at 8 products

### 🛍️ Product Cards (Phase 4)
- Consistent card height using `paddingBottom: 100%` trick — no more uneven rows
- Extracted inline `<img>` with `onError` into `ProductImage` client component (fixes Server Component error)
- Added standalone `WishlistButton` client component placed inside image container
- Mobile: always-visible "Add to Cart" button below price (`QuickAddToCart` inline variant)
- Desktop: hover-reveal overlay bar with Add to Cart + wishlist + view details (`QuickAddToCart` overlay variant)
- Added sage-green trust line under every product title (e.g. *"Freshly packed in Dhaka"*)

### 📦 Product Detail Page — PDP (Phase 5)
- CTA hierarchy: "Add to Cart" primary solid → WhatsApp subtle outline → Messenger muted text link
- Added 3 trust badges below CTA: Chemical-free · Direct from farmers · Hygienically packed

### 🌍 Internationalisation (Phase 7)
- Added new i18n keys for hero section, trust badges, and cart reassurance to `en.json`
- Updated `bn.json` with natural, conversational Bengali translations

### 🛒 Cart & Checkout (Phase 8)
- Added cart reassurance line: *"Packed hygienically and delivered safely within Dhaka."*
- Fixed `IntlProvider` missing in checkout layout

### ℹ️ About Page (Phase 6)
- Fully rewritten with story-driven tone: Why We Started · How We Source · What You Can Expect

### 🗂️ Header & Mobile Menu
- Header height: `h-24` → `h-16 md:h-20` (tighter, premium feel)
- Icon spacing: `gap-6` desktop (24px) / `gap-4` mobile (16px)
- Search, Wishlist, Account hidden on mobile; all 3 icons visible on desktop
- Cart always visible on all screen sizes
- Mobile menu fully redesigned: deep forest `#153526` overlay, minimal text nav, WhatsApp/Messenger quick-order pills, "Shipping: Bangladesh" footer line

### ⚙️ Config
- Added `127.0.0.1` and `*.amazonaws.com` to `next.config.js` image `remotePatterns`
