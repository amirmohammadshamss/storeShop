# Migration status

The active application is now a Next.js foundation. Legacy CRA source is preserved in docs/legacy/storeShop-cra.zip and is absent from the active source/public tree. Storefront and product routes are implemented against inferred legacy schemas; checkout drafts and tracking/invoice screens are implemented; real purchase submission and order authorization remain pending. Do not deploy this foundation as a replacement for an operating store.

## Discovery

- Legacy React/CRA, router, Bootstrap, Emotion, and slider dependencies have been replaced in the active manifest.
- Legacy style imports reference absent assets; use Tailwind replacements.
- API calls are declared against AdminChannel. Endpoint casing and response contracts remain unverified.
- Purchase data relies on router state, contains a fixed description, and customer details are persisted indefinitely.
- Payment creation is single-product; backend idempotency, authorization, and gateway sandbox contracts are unknown.
- Old workers/public templates are archived. Known historical worker URLs now return retirement scripts; real-browser lifecycle acceptance remains pending.

## Route inventory

- `/:idStore`: storefront and catalog.
- `/:idStore/:idProduct`: product and guest checkout.
- `/result/payment/`: legacy purchase initiation; replace with recoverable, explicit submission.
- `/result/:invoice_id`: authoritative payment result.
- `/track`: tracking lookup.
- `/track/:idPursuit`: tracking result.

## Pending owner/backend decisions

Currency units, gateway hosts and sandbox, required fields, draft storage, deduplication, tracking authorization, reserved store identifiers, root-page behavior, asset rights, shipping, and first-release feature selection.

The root provides store-code navigation and a link to an explicitly labeled sample catalog. All API reads default to no-store with a bounded timeout and runtime schema validation; public catalog caching is separately configurable, while checkout/order reads always bypass it. No purchase endpoint is enabled. Sanitized response fixtures must be obtained before defining production response schemas.

## Tooling

PostCSS configuration uses JSON because it is declarative configuration; all owned executable configuration and active source use TypeScript. The source gate covers the whole active source/scripts/tests/public tree and root executable files. npm is the active package manager; the former Yarn lockfile is kept only inside the offline legacy archive.

## Local verification

Production build, strict type checking, active-source gate, ESLint, and two localization tests pass. Production audit reports zero vulnerabilities. Full audit reports five development-only high-severity findings through braces/Next.js lint tooling; latest braces is still 3.0.3, so a patched release is pending. Browser and live backend/payment checks have not been performed.

## Storefront migration

`/[idStore]` and `/[idStore]/[idProduct]` now render server-side using inferred Zod schemas. `/preview/store` and its product pages use labeled synthetic data, never as a fallback for live stores. Response store/product identities must match requested identifiers. Description HTML is displayed as plain text. HTTPS images are unoptimized pending verified host configuration. Live units/stock remain unknown and payment is disabled. Reserved namespaces include preview, track, result, and api. Metadata indexing defaults to disabled; enable only with an exact HTTPS site origin, a public store allowlist, and verified live contracts. Six focused tests cover digits, IDs, schema normalization, and unsafe image schemes.

Invalid dynamic routes can return streamed HTTP 200 with not-found UI and noindex after the root loading boundary starts streaming. This is documented Next.js behavior; non-streamed not-found responses return 404.

## Checkout and order migration

Draft routes use same-origin checks, bounded JSON input, authoritative product-option validation, and signed 30-minute HttpOnly cookies without PII. Configure a server-only CHECKOUT_DRAFT_SECRET in every environment. Customer fields are not persisted. The checkout API prepares a validated legacy-compatible payload but does not call the backend: price, stock, idempotency, and gateway contracts are unverified.

Live order reads are gated by ORDER_LOOKUP_ENABLED=false. This gate is not an authorization implementation; enabling requires verified backend authorization/rate limiting. Preview order pages are separate and clearly labeled. Legacy done=false means unknown. Jalali display uses Intl with Asia/Tehran. Result/tracking and checkout APIs carry private/no-store, noindex, and no-referrer headers. Thirteen unit tests and an HTTP smoke script cover draft integrity and order-state behavior. Browser and real backend checks remain pending.

## Local shopping and release checks

Catalog query parameters support name/code search, integer price bounds, and sorting. Arabic letters/Persian digits normalize for search. Cart and wishlist references use versioned, schema-checked browser storage with store and preview/live isolation. Cart variants remain distinct and quantities are bounded; prices are snapshots, and multi-item payment is disabled. Missing catalog references are flagged without assuming deletion from a possibly incomplete catalog.

Backend failure logs emit only event/category/status/correlation IDs. Public cache TTL is bounded at 300 seconds and defaults to zero; checkout always uses fresh product reads. Production origin checks use Host or explicit APP_ORIGIN and reject forwarded-origin spoofing. Twenty-five focused tests and an isolated production-server smoke check pass; CI includes that check. Browser persistence/accessibility, live backend checks, and service-worker retirement remain pending. Operations and rollback instructions are in OPERATIONS.md.

The clean npm install dry run passes, with upstream Next.js plugin peer ranges still ending at ESLint 9; local ESLint 10 checks pass. Track these peer warnings along with the previously recorded development-only advisories.

## Legacy retirement

The verified archive preserves 41 legacy files and their original-path hashes. Old CRA JavaScript, styles/assets, Express/Handlebars experiments, static hosting configuration, public SPA shell, and old icons are absent from active paths. The new SVG icon is original.

Worker endpoints compile TypeScript source into a generated module before dev/build/checks and serve ordinary JavaScript as required by browsers. No request-time compiler dependency is introduced. No new worker is registered: the client helper updates only known matching same-origin registrations and skips newer unrelated workers. The replacement handles install/activate only, removes default Workbox precaches matching the exact registration scope, and unregisters without forced navigation. Other cache names and scopes are preserved.

The default cache suffix rule was verified against the [Workbox 4.3.1 source](https://raw.githubusercontent.com/GoogleChrome/workbox/v4.3.1/packages/workbox-core/_private/cacheNames.mjs). Keeping the worker URLs stable with uncached responses follows the [service-worker lifecycle guidance](https://developer.chrome.com/docs/workbox/service-worker-lifecycle). Custom historical paths/cache names require confirmation.

Thirty-one tests, source policy, build, and production HTTP smoke checks pass; real browser lifecycle/storage/accessibility acceptance remains incomplete. Native Chrome could show the sample product accessibility tree, but interactive verification was interrupted by browser changes.

## Metadata and contracts

Store/product canonical and social metadata, gated basic Product JSON-LD, robots.txt, and a bounded store/product sitemap are implemented. Default configuration emits no public catalog indexing or sitemap entries. Health/readiness endpoints expose only liveness/configuration status, not upstream availability. All API responses are private/no-store and all responses have nosniff protection.

Synthetic fixture contracts now exercise the real dynamic routes in an isolated production server with order reads pointed exclusively at a loopback backend. No real service is contacted and no backend mutations are permitted. Thirty-five tests and both production smoke suites pass. See BACKEND-CONTRACTS.md for inferred schemas, unverified semantics, and required live acceptance inputs.
