# Deployment and operations

The current application is suitable for a development/staging review of the migration. Real purchases and live order access require the unresolved backend acceptance items in PLAN.md. These instructions do not authorize a production replacement of an operating storefront.

## Runtime and installation

Use Node.js 24 and npm with the committed package-lock.json. Install with `npm ci`. The old Yarn lockfile is preserved inside docs/legacy/storeShop-cra.zip; CI and deployments use npm exclusively. Do not reuse the legacy static SPA hosting rules: the application needs a Node-capable Next.js server.

The clean-install dry run passes. Current Next.js ESLint plugins still declare peer ranges ending at ESLint 9 even though the local ESLint 10 checks pass. Preserve the pinned dependency versions and track those upstream peer warnings alongside the development-only advisories documented in MIGRATION.md.

## Environment

- `BACKEND_API_URL`: server-only AdminChannel API base URL, including its version path. Embedded URL credentials are rejected.
- `CHECKOUT_DRAFT_SECRET`: a cryptographically random signing key, at least 32 characters, shared across instances. Provision through the host's secret store. Rotating it invalidates existing drafts, which then show the recovery screen.
- `APP_ORIGIN`: exact external origin, such as `https://shop.example.com`, with no path or trailing slash. Set this behind a reverse proxy so valid checkout requests are compared with the public origin. Requests from other origins are rejected; forwarded-host headers are not accepted as an allowlist.
- `ORDER_LOOKUP_ENABLED`: keep `false` until order authorization, rate limiting, and API response contracts are verified. This setting is a deployment gate, not an authorization mechanism.
- `SITE_ORIGIN`, `CATALOG_INDEXING_ENABLED`, `PUBLIC_STORE_CODES`: configure an exact HTTPS origin, explicit indexing opt-in, and at most 20 public store codes after live data verification. Leave indexing disabled in staging; preview/private routes remain excluded. Sitemaps include at most 500 returned products per store and omit unavailable stores.
- `BACKEND_CATALOG_TTL_SECONDS`: defaults to `0`; accepts integer values from 0 through 300. Enable public catalog caching only after confirming catalog responses are public. Checkout product reads, invoice reads, and tracking always use no-store regardless of this setting.

Never put signing keys or privileged configuration in NEXT_PUBLIC variables. Local `.env.local` is ignored by Git. Production cookies are Secure, HttpOnly, and SameSite=Lax. Customer form fields are not persisted.

## Verification and staging

Run `npm run check:source`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Then run `npm run verify:production`: it starts a loopback fixture backend and the built app on port 3100 with an ephemeral signing key. It runs preview checks with order reads off, then a second isolated app instance with order reads enabled exclusively against synthetic fixture data to test the real routes. It verifies zero backend mutation attempts and stops its servers. It does not contact the live backend or purchase service. The same command runs in CI after the production build.

Use `npm start` on the host after a successful build. Confirm the homepage responds, the labeled preview catalog filters/sorts correctly, product options create a draft, checkout survives refresh, a missing/expired draft recovers, and sample order states render. The HTTP checks cover server behavior; they do not replace browser accessibility, layout, or storage verification.

Before live acceptance, obtain sanitized API fixtures and a known store code, verify units and inventory, agree purchase idempotency and gateway hosts, confirm order authorization, and exercise provider sandbox outcomes. Multi-item payment must remain disabled until its backend contract exists.

## Monitoring

Backend read failures emit structured events containing only event type, correlation ID, safe failure category, and HTTP status when available. They exclude URLs, request bodies, response bodies, customer values, and secrets. Group failures by category/status; distinguish invalid configuration, network errors, upstream HTTP errors, and malformed schemas. Do not add customer data to application logs.

All result/tracking routes and checkout API responses have private/no-store, noindex, and no-referrer protections. Catalog cache lifetime is bounded independently. Local cart/wishlist references and variant choices are browser-only snapshots; displayed cart totals are estimates, never authoritative prices.

## Rollback and legacy caches

Keep the previous deploy artifact, its environment configuration, and the migration commit reference before changing a live deployment. Restore that artifact through the host's normal release mechanism, then check routes and transactions against its own acceptance criteria. Preserve compatible secrets where appropriate; rotating a draft key requires the recovery behavior described above. No database migration is introduced by this frontend work.

Known legacy worker URLs `/sw.js`, `/js/serviceworker.js`, and `/service-worker.js` now serve uncached retirement scripts compiled from TypeScript. Existing matching registrations are updated by a client helper; no new registrations are created. The replacement is fetch-less, clears only default Workbox precache keys matching its exact scope, claims clients, and unregisters. Other registrations/cache names/scopes are preserved, and pages are not forcibly reloaded.

Before production replacement, verify an actual existing worker installation in Chrome/Safari: revisit the app, observe the replacement lifecycle/unregistration, confirm owned precaches are cleared, and refresh/navigate to the new UI. Preserve unsaved form input during this review. Test any custom historical worker paths or cache names separately. Keep retirement endpoints deployed so returning clients can update. Worker lifecycle is unit/HTTP-tested but not browser-accepted; keep that release item open until existing-client checks pass.

The generated module under src/generated is ignored by Git and rebuilt automatically by npm lifecycle hooks. Install dev dependencies in the build stage; request-time worker serving uses the built module and does not compile TypeScript. The archived legacy files/font assets are reference only and must not be extracted into active/public paths.

## Health and metadata acceptance

Use `/api/health` for process liveness and `/api/ready` for configuration readiness. Readiness returns HTTP 503 for invalid backend/signing/public-origin configuration and HTTP 200 when those checks pass; it never probes the upstream service or certifies purchase readiness. A production APP_ORIGIN must use HTTPS unless it is loopback for tests. Test the live API separately using the acceptance inputs in BACKEND-CONTRACTS.md.

Keep catalog indexing off in staging. Before enabling it, validate public data and the configured store allowlist, inspect canonical/social/JSON-LD output, and verify sitemap contents. JSON-LD intentionally excludes offers/stock until their units/contracts are confirmed. Private and preview pages retain noindex even when catalog indexing is enabled.
