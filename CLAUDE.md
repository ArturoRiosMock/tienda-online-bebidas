# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Mr. Brown — Spanish-language **headless Shopify storefront** for premium beverages (MX market, MXN, language `ES`). Vite 6 + React 18 + TypeScript SPA, Tailwind v4 (`@tailwindcss/vite`), Radix/shadcn-style primitives in `src/app/components/ui/`. Animations via `motion`, GraphQL via `graphql-request` against Shopify's Storefront API. Backend is **mostly client-only**: the only server code is `api/newsletter.ts`, a Vercel Function that calls the Shopify Admin API to subscribe customers (Admin token must stay server-side). `vercel.json` rewrites everything **except `/api/*`** to `/index.html`.

## Commands

- `npm run dev` — Vite dev server. Configured port `5174` in `vite.config.ts:8`; falls through if the port is taken.
- `npm run build` — production build to `dist/`.
- No `lint` or `test` scripts are defined.
- Admin-API token helper (Odoo / back-office, **not** the storefront):
  ```
  SHOPIFY_STORE=mrbrown SHOPIFY_CLIENT_ID=xxx SHOPIFY_CLIENT_SECRET=yyy node scripts/get-shopify-admin-token.js
  ```

## Environment

- Copy `.env.example` to `.env` to enable Shopify integration:
  - `VITE_SHOPIFY_STORE_DOMAIN` (e.g. `mrbrownmx.myshopify.com`)
  - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Without these, `isShopifyConfigured()` returns false and the app falls back to an empty catalogue + local in-memory cart (no mock products are bundled).
- Path alias: `@` → `src` (`vite.config.ts:20`).
- Newsletter Vercel Function (`api/newsletter.ts`) needs two **server-only** vars (no `VITE_` prefix, so they don't leak into the browser bundle):
  - `SHOPIFY_ADMIN_STORE_DOMAIN` (e.g. `mrbrownmx.myshopify.com`)
  - `SHOPIFY_ADMIN_API_TOKEN` (Admin API custom-app token with at least `write_customers` scope; obtain via `scripts/get-shopify-admin-token.js`)
  - Set both in the Vercel dashboard for Production + Preview; without them the Function returns 500.

## Two-projects-one-repo rule (critical)

This repo backs **two distinct Vercel projects** on different branches. Crossing them is a deploy incident.

| Branch   | Vercel project           | Production URL                                   |
|----------|--------------------------|--------------------------------------------------|
| `master` | `tienda-online-bebidas`  | `https://www.mrbrown.com.mx` (Mr. Brown)         |
| `bebify` | `bebify-store`           | B2B sister project                               |

Use `git worktree` so each branch lives in its own folder with its own `.vercel/project.json`. **Never** `git checkout` between these branches in the same folder, and **never** cross-deploy. Full procedure in `DEPLOYMENT.md`.

## Architecture

### Entry & routing
- `src/main.tsx` mounts `<App />` from `src/app/App.tsx`.
- `App.tsx` is a `BrowserRouter`. Everything renders inside `MainLayout` except:
  - `/admin/banners` — standalone (no header/footer).
  - `/cart/*` and `/checkouts/*` — `window.location` redirects to `mrbrownmx.myshopify.com` so the native Shopify checkout still works (the public `mrbrown.com.mx` domain points at Vercel, not Shopify).
- Shopify-style URLs `/products/:handle` and `/collections/:handle` are auto-redirected to the internal Spanish routes `/producto/:handle` and `/categorias/:handle` (`src/app/App.tsx:26-35`).
- `ScrollToTop` resets scroll on route change but honors `#anchor` hashes.

### Layout & providers
- `MainLayout` (`src/app/layouts/MainLayout.tsx`) wraps the tree as `AgeVerification > CartProvider > WishlistProvider` and renders `Header`, `<Outlet />`, `Footer`, plus the Cart, Wishlist, and add-to-cart-animation drawers.
- `CartContext` (`src/app/context/CartContext.tsx`) is **dual-mode**: when `isShopifyConfigured() && shopify.isConfigured` it proxies through `useShopifyCart`; otherwise it keeps a local in-memory cart. UI components only call `useCart()` and don't need to branch.

### Shopify layer (`src/shopify/`)
- `config.ts` — env-driven credentials + `isShopifyConfigured()`.
- `queries.ts` — `graphql-request` client + every GraphQL query/mutation string used by the app.
- `products.ts` — services and the canonical Shopify→app shape adapter `convertShopifyProductToAppProduct`. Reuse these instead of fetching directly:
  - `getProductsByCollection(handle, first, { titleFallback })` — if a handle is missing or empty, it resolves the real handle by collection title (helps when an Admin handle drifts from what's in code).
  - `getProductByHandle(handle)` — falls back to a search-based best-match if the handle 404s.
  - `cantidadLabelFromOptions(options)` — pulls the `"Cantidad"` Shopify variant option (e.g. `"1 Botella"`); reused from cart and product views, **don't reimplement**.
- `cart.ts` — cart CRUD + `redirectToCheckout(checkoutUrl)`, which **rewrites whatever host Shopify returned to `mrbrownmx.myshopify.com`** because the custom domain is on Vercel.
- `hooks/` — `useShopifyProducts`, `useShopifyCollections`, `useShopifyCart`.

### Navigation
- Desktop mega-menu structure lives in `src/config/nav-desktop.ts` as `RAW_GROUPS`. `resolveDesktopNav(collections)` filters that against the live Shopify collections so groups/links only render when the handle actually exists. **When adding categories, edit `RAW_GROUPS`, not the JSX**, and make sure the handle matches Admin.
- The legacy `CATEGORY_TO_COLLECTION_MAP` in `src/shopify/products.ts:214` only covers the older "category string" flow. The mega menu is the source of truth now and uses Shopify handles directly.

### Ads / banners
- Slots are defined in `src/data/banners-config.json` and rendered via `src/app/components/AdBanner.tsx`.
- A slot only renders when **both** `enabled: true` in the JSON **and** its id is in the `VISIBLE_AD_SLOT_IDS` whitelist (`AdBanner.tsx:43`). To turn a slot on, both gates must allow it.
- `/admin/banners` is a client-only editor protected by a SHA-256-hashed password (`AdminBannersPage.tsx:6`); it edits the JSON in-memory and exports it.

### Theming & styles
- Brand colors `#0c3c1f` (deep green) and `#FDB93A` (yellow CTA) are used throughout. CSS variables are in `src/styles/theme.css`.
- Global stylesheet entry: `src/styles/index.css` imports `fonts.css`, `tailwind.css`, `theme.css`.

## Conventions

- UI copy and route segments are **Spanish** (`/producto`, `/categorias`, `/cotizar-evento`, …) — keep new routes consistent.
- Components: feature components under `src/app/components/*.tsx`, primitives under `src/app/components/ui/*.tsx`.
- Static long-form content (about, FAQ, policies) lives in `src/content/mrbrown/`.
- This is mostly an SPA. The only server route is `api/newsletter.ts` (Vercel Function, Node runtime). Any new backend behavior should follow that pattern (Vercel Function under `api/`, server-only env vars without `VITE_` prefix) rather than calling Admin API from the browser.

## Reference docs in this repo

- `DEPLOYMENT.md` — worktree + dual-deploy rules. Read before any deploy.
- `SHOPIFY_SETUP.md` — wiring a Shopify store to this app.
- `GUIA_CONECTAR_SHOPIFY.md` — Spanish quick-start for the same.
- `SHOPIFY_ADMIN_OAUTH.md` — Admin API token (Odoo, not the storefront).
- `VERCEL_DEPLOY.md` — first-time Vercel hookup.
