# storeShop

Migration from React 16/Create React App to Next.js App Router is in progress. The application includes a Persian/RTL landing page, storefront/product routes, and a clearly labeled sample catalog. Checkout drafts, a guest information form, and gated tracking/invoice routes are implemented; real payment and order access still require backend validation. See [PLAN.md](PLAN.md), [RFP.md](RFP.md), and [migration status](docs/MIGRATION.md).

## Development

Use Node.js 24 and npm. Install with `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. The backend URL is server-only. Open `/preview/store` for the sample catalog, or enter a real store code on the homepage. Set a random server-only `CHECKOUT_DRAFT_SECRET` (at least 32 characters) to enable drafts. No live payment integration is enabled. Keep `ORDER_LOOKUP_ENABLED=false` until authorization, rate limits, and backend contracts are verified.

## Verification

- `npm run check:source`: enforce active TypeScript and styling constraints.
- `npm run lint`: ESLint with zero warnings permitted.
- `npm run typecheck`: strict TypeScript checks.
- `npm test`: focused localization tests.
- `npm run smoke`: HTTP integration checks against the running dev server (defaults to port 3001; override `SMOKE_BASE_URL`). Uses only sample checkout data and creates no real purchases.
- `npm run build`: production build.
- `npm start`: serve the production build on a Node-capable host.

All new source uses TypeScript and Tailwind. Legacy JavaScript files are retained as migration reference and excluded from the active application; store/product adapters still need live backend validation, and payment submission/order authorization still need integration. Do not deploy this intermediate foundation over an operating storefront.

## Try the new flow

Open `/preview/store/101`, choose a color, and continue to checkout. The product/options draft survives refresh for 30 minutes; customer details do not persist. The form validates information locally, and payment stays disabled. Open `/preview/track` and enter `12345` for sample tracking, or `/preview/result/success` to inspect payment-result states. All preview data is synthetic.
