# storeShop

Migration from React 16/Create React App to Next.js App Router is in progress. The application includes a Persian/RTL landing page, storefront/product routes, and a clearly labeled sample catalog with search, price filters, sorting, and local cart/wishlist. Checkout drafts, a guest information form, and gated tracking/invoice routes are implemented; real payment and order access still require backend validation. See [PLAN.md](PLAN.md), [RFP.md](RFP.md), [migration status](docs/MIGRATION.md), and [operations instructions](docs/OPERATIONS.md).

## Development

Use Node.js 24 and npm. Install with `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. The backend URL is server-only. Open `/preview/store` for the sample catalog, or enter a real store code on the homepage. Set a random server-only `CHECKOUT_DRAFT_SECRET` (at least 32 characters) to enable drafts. No live payment integration is enabled. Keep `ORDER_LOOKUP_ENABLED=false` until authorization, rate limits, and backend contracts are verified.

## Verification

- `npm run check:source`: enforce TypeScript and Tailwind constraints across the whole active project.
- `npm run lint`: ESLint with zero warnings permitted.
- `npm run typecheck`: strict TypeScript checks.
- `npm test`: focused API, localization, checkout, order, search, and shopping-state tests.
- `npm run smoke`: HTTP integration checks against the running dev server (defaults to port 3001; override `SMOKE_BASE_URL`). Uses only sample checkout data and creates no real purchases.
- `npm run build`: production build.
- `npm run verify:production`: run isolated preview and real-route contract checks on port 3100 against a loopback fixture backend, then stop both servers. No live service or real purchase is used.
- `npm start`: serve the production build on a Node-capable host.

All active application source uses TypeScript and Tailwind. Former CRA files are preserved in a verified offline archive under `docs/legacy/`; store/product adapters still need live backend validation, and payment submission/order authorization still need integration. Do not deploy this intermediate foundation over an operating storefront.

## Try the new flow

Open `/preview/store/101`, choose a color, and continue to checkout. The product/options draft survives refresh for 30 minutes; customer details do not persist. The form validates information locally, and payment stays disabled. Open `/preview/track` and enter `12345` for sample tracking, or `/preview/result/success` to inspect payment-result states. All preview data is synthetic.

## Search and saved products

The catalog search form stores name/code, minimum/maximum price, and sort order in the URL. Results cover the current returned catalog, not a separately indexed full backend catalog. On product pages, select options and add to the cart; matching variants merge quantities while different options remain separate. Open the store's cart or wishlist panel to manage saved items. References persist only in this browser, isolated by store and preview/live mode, without customer details. Cached cart amounts are estimates; multi-item payment is disabled.

Public catalog caching defaults to zero; configure BACKEND_CATALOG_TTL_SECONDS only after verifying public data. Checkout/order reads always bypass that cache. Set APP_ORIGIN to the exact public origin behind a proxy.

## Legacy worker cleanup

Former CRA source/assets/configuration are archived in `docs/legacy/storeShop-cra.zip` with a hash manifest. They are not imported or publicly served. Known legacy worker URLs serve a fetch-less retirement worker compiled from `src/workers/retirement.ts`. npm dev/build/test/typecheck/lint/source-check hooks generate its module automatically; do not edit or commit `src/generated/retirement-worker.ts`. Existing matching registrations are updated without registering a new worker or forcing a reload. Browser verification of existing-client retirement remains a release requirement.

## Metadata and deployment checks

Indexing defaults to off. After verifying public catalog data, set SITE_ORIGIN to an exact HTTPS origin, CATALOG_INDEXING_ENABLED=true, and PUBLIC_STORE_CODES to a comma-separated store allowlist (maximum 20). Metadata, basic Product JSON-LD, robots.txt, and sitemap.xml follow that configuration; no price/stock offers are invented.

`/api/health` checks web-process liveness. `/api/ready` reports configuration readiness without exposing secrets or URLs; it does not probe the backend or certify payment availability. See [backend contracts](docs/BACKEND-CONTRACTS.md) for fixtures and missing live integration requirements.

## Source organization

UI view files compose focused components under `src/app/ui/catalog`, `shopping`, `checkout`, `product`, and `orders`. Checkout and product hooks own interaction state; view components render the existing layout. Shopping schemas, storage, cart mutations, and wishlist mutations live in separate modules under `src/lib/shopping`, with existing imports preserved through `state.ts`. Smoke checks are organized by flow under `scripts/smoke`; the production runner delegates server lifecycle handling to `scripts/production-server.ts`.
