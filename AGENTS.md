## Cursor Cloud specific instructions

### Project overview

Headless Shopify storefront for "Mr. Brown" online beverage store. React 18 + TypeScript SPA built with Vite. See `README.md` for basic setup.

### Running the dev server

```
npm run dev
```

Starts Vite on port 5173 by default. Use `--host 0.0.0.0` for remote access.

### Shopify API (optional)

Without `.env` credentials (`VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`), the app falls back to **mock data** and is fully functional for local development. See `.env.example`.

### Lint / Test

No lint or test scripts are configured in `package.json`. The only available scripts are `dev` and `build`.

### Build

```
npm run build
```

Outputs to `dist/`. A chunk-size warning for `index.js` (>500 kB) is expected and non-blocking.

### Key caveats

- The app shows an **age verification modal** on first load; click "Tengo mas de 18 anos" to proceed.
- Node v22+ is required (matches the project's development version).
- Package manager is **npm** (lockfile: `package-lock.json`).
