# storeShop Implementation Plan

Date: 2026-10-09
Status: In progress — storefront, checkout drafts, local shopping features, and CI implemented; live commerce integration pending
Requirements: [RFP.md](./RFP.md)

## Target and mandatory constraints

Migrate the existing React 16/Create React App storefront to the latest supported stable Next.js release verified at implementation kickoff. Preserve existing store, product, guest purchase, payment-result, and tracking flows before adding approved features.

- Next.js App Router with compatible React and a supported Node.js LTS runtime; pin versions and use one package manager and lockfile.
- TypeScript only for application code, API handlers, utilities, and tests, using `.ts`/`.tsx` and strict type checking. Use TypeScript for project-owned scripts and configuration where supported; document unavoidable tooling exceptions.
- Tailwind CSS only for UI styling. Allow one minimal global CSS entry for Tailwind, theme tokens, fonts, and essential base styles. Replace Bootstrap, Emotion, Slick stylesheets, and legacy component styles.
- ESLint is required with Next.js, React Hooks, and TypeScript rules. The explicit lint command must fail on errors or warnings and run separately from the build.
- Preserve Persian/RTL behavior, Jalali date display, and normalization of Persian, Arabic, and Latin digits.
- Keep secrets server-side and private transaction responses out of shared caches.
- Preserve the existing backend unless a separately agreed requirement needs changes.

Checked items are implemented and locally verified where applicable. Proposed features are a backlog, not approved release commitments.

## Phase 1 — Discover and confirm compatibility requirements

- [x] Inventory active components, dependencies, assets, routes, and deployment files.
- [ ] Reproduce the legacy installation/build where feasible; document failures without making legacy build recovery a prerequisite for all migration work.
- [ ] Recover or recreate missing imported styles using Tailwind; verify font and asset usage rights.
- [ ] Record sanitized API request/response fixtures and error cases for stores, products, purchases, invoices, and tracking.
- [ ] Verify endpoint casing, authentication, store isolation, availability, and timeout behavior with the backend owner.
- [ ] Confirm Rial/Toman units, timezone, required checkout fields, stock rules, gateway hosts, and payment sandbox access.
- [ ] Confirm purchase deduplication and tracking authorization contracts; identify backend work required for safe transactions.
- [ ] Decide root-page behavior and reserved store identifiers such as `track` and `result`.
- [ ] Establish representative mobile/desktop screens and performance baselines where the legacy application can run.

Completion: a documented route/API inventory, known limitations, and agreed compatibility behavior. Use labeled fixtures for independent development when backend access is unavailable; record blocked live checks.

## Phase 2 — Build the Next.js foundation

- [x] Verify current stable framework/tool versions against official documentation and record the selected versions and runtime.
- [x] Replace CRA tooling with Next.js development, build, and start commands.
- [x] Configure TypeScript strict mode and Tailwind; create Persian RTL root layout and accessible shared UI primitives.
- [x] Configure ESLint, preferably in `eslint.config.ts` where supported, covering source and tests with zero warnings permitted.
- [x] Add explicit `lint`, `typecheck`, relevant test, and `build` commands.
- [x] Add CI checks for project-owned JavaScript/JSX application files and disallowed styling imports/dependencies.
- [x] Create server-only backend environment configuration and an example environment file without secrets.
- [x] Build a typed API adapter with runtime response validation, explicit errors, bounded timeouts, and a safe-read retry policy.
- [x] Define public catalog caching separately from uncached checkout, payment results, and tracking.
- [x] Configure loading, error, and not-found boundaries plus redacted error reporting.

Suggested source organization:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    [idStore]/page.tsx
    [idStore]/[idProduct]/page.tsx
    result/payment/page.tsx
    result/[invoice_id]/page.tsx
    track/page.tsx
    track/[idPursuit]/page.tsx
    api/checkout/route.ts
  components/
    ui/
    storefront/
    checkout/
    tracking/
  lib/
    api/
    validation/
    localization/
  types/
tests/
```

The API handler path is proposed; finalize it after purchase and draft contracts are known. Preserve legacy trailing-slash behavior or configure intentional redirects without disrupting gateway callbacks.

Completion: the foundation passes lint, type checks, and production build; no secrets appear in client bundles.

## Phase 3 — Migrate storefront and product pages

- [x] Implement `/:idStore` with store identity, product listings, product-code lookup, and navigation.
- [ ] Implement `/:idStore/:idProduct` with gallery, details, options, pricing, and availability.
- [x] Server-render public content where appropriate; isolate interactive controls and browser storage in client components.
- [x] Replace legacy sliders with accessible controls styled entirely through Tailwind.
- [x] Add loading, empty, unavailable, invalid-identifier, and backend-failure states.
- [ ] Implement shared digit normalization, Persian formatting, Jalali dates, and integer currency rules after units are confirmed.
- [x] Add metadata, canonical URLs, and social previews; add sitemap and product structured data only for valid available data.
- [ ] Verify RTL layout, mixed-direction identifiers, keyboard navigation, and touch behavior.

Completion: existing storefront/product URLs work through direct navigation and reload, with preserved product-code and option behavior.

## Phase 4 — Migrate guest checkout and payment results

- [ ] Preserve single-product guest checkout and validate required fields after digit normalization.
- [ ] Send customer comments and selected options correctly.
- [ ] Replace transient router-state purchase data with an agreed recoverable draft or server order reference, including expiry and missing-draft recovery.
- [ ] Implement server-side purchase initiation and authoritative product/store, option, price, and availability validation.
- [ ] Integrate backend idempotency or equivalent deduplication; disable submission while pending without relying on that as the only protection.
- [ ] Restrict gateway redirects to approved hosts.
- [x] Implement `/result/payment/` recovery and initiation behavior without creating a purchase merely because a page is visited or refreshed.
- [ ] Implement `/result/:invoice_id` using authoritative backend status with success, failure, cancellation, pending, and unknown states.
- [ ] Separate safe status retries from new purchase creation and define gateway timeout/return recovery.
- [ ] Apply the agreed remember-details and retention policy; redact customer data from logs and analytics.

Completion: sandbox checks demonstrate correct payloads, recovery, status handling, and duplicate prevention. If backend contracts are missing, mark integration incomplete rather than claiming payment acceptance.

## Phase 5 — Migrate order tracking

- [x] Implement `/track` lookup and `/track/:idPursuit` direct links.
- [ ] Show authorized status, date, store, amount, and tracking identifiers with Persian formatting.
- [x] Normalize numeric input and distinguish invalid codes from service failures.
- [ ] Integrate agreed verification, authorization, and rate limiting where required by the tracking contract.
- [x] Ensure tracking and invoice data bypass shared caches and sensitive metadata is not indexed.

Completion: direct links and lookups work after reload; unauthorized order access is denied under the agreed backend model.

## Phase 6 — Add approved features

Confirm the first-release subset before implementation. Quote and track backend changes separately.

### Priority 1 backlog

- [x] Search, filters, and sorting with shareable URL parameters. Document whether results cover the full catalog or only loaded products.
- [x] Persistent store-specific cart with quantities and distinct variants, reload recovery, and unavailable-item handling.
- [ ] Multi-item checkout only after the backend supports cart purchase creation, authoritative totals, and deduplication.
- [x] Local wishlist with reload persistence and deleted-product handling.
- [ ] Order summary and backend-supported shipping methods, costs, and delivery estimates.

### Later backlog

- [ ] OTP accounts, saved addresses, and private order history.
- [ ] Backend-validated discount codes.
- [ ] SMS/email order notifications through an agreed provider.
- [ ] Inventory-aware variants.
- [ ] Moderated reviews and related products.
- [ ] Optional PWA with safe cache/update behavior and no offline transactions or private-data caching.

Completion: each approved feature passes its agreed scenarios. Accounts, shipping, promotions, notifications, and multi-item payments must not be treated as frontend-only work.

## Phase 7 — Validate, release, and hand over

- [x] Run ESLint with zero errors/warnings, TypeScript checks, focused tests, and production build as separate required CI steps.
- [x] Confirm no retained project-owned JavaScript/JSX application source or disallowed styling dependencies/imports remain.
- [ ] Test number normalization, currency rules, API failures, malformed responses, cross-store isolation, and transaction deduplication.
- [ ] Run browser checks for storefront lookup, option selection, checkout recovery, payment outcomes, repeated gateway returns, and tracking.
- [ ] Verify approved feature scenarios such as cart restoration, variant identity, and changed-price confirmation.
- [ ] Review accessibility against the RFP's WCAG 2.2 AA target on representative screens.
- [ ] Measure agreed mobile performance; report lab results separately from field Core Web Vitals and disclose backend constraints.
- [ ] Review dependencies, secret handling, log redaction, caching, and gateway redirect restrictions.
- [ ] Prepare a Node-capable staging deployment; replace legacy static SPA hosting configuration.
- [ ] Define legacy service-worker/cache retirement, deployment health checks, monitoring, and rollback steps.
- [x] Update README with installation, environment setup, commands, API assumptions, and deployment instructions.
- [ ] Obtain staging/business acceptance and complete real integration checks before production launch.

Completion: all mandatory RFP acceptance criteria and approved feature criteria pass; remaining limitations and support ownership are documented.

## Dependencies and decisions to track

- Backend documentation, staging access, payment sandbox, and approved gateway hosts.
- Currency units, stock/shipping rules, checkout fields, draft recovery, and purchase idempotency.
- Tracking authorization and customer-data retention policy.
- Root-page behavior, reserved store IDs, branding, and asset/font rights.
- Approved feature subset, backend ownership, hosting target, budget, and delivery dates.

Independent foundation and UI work can proceed with sanitized fixtures. Production transaction acceptance depends on verified backend and gateway contracts.

## Implementation update — 2026-10-09

Next.js 16.4.0, React 19.3.0, TypeScript 6.0.3, Tailwind 4.3.3, and ESLint 10.12.0 are pinned. The RTL landing screen, error/loading boundaries, server-only API reader, digit normalization, focused tests, and CI foundation are implemented. Safe reads currently have no automatic retries; all reads use no-store until endpoint-specific caching is defined. Source enforcement covers active directories while legacy source remains for migration reference. The old Yarn lockfile remains for discovery only.

Store/product/checkout/tracking routes and proposed features are still pending. API contracts, live payment checks, staging, and browser/accessibility checks remain unverified. Production dependency audit reports zero vulnerabilities; five development-only findings stem from the braces dependency chain in Next.js ESLint tooling. No patched braces release was available during verification; do not apply the suggested framework downgrade as an automatic fix.

## Storefront update — 2026-10-09

The landing page now links to an explicitly labeled sample storefront at `/preview/store`. Its three sample products use original SVG illustrations. Product pages, keyboard-accessible gallery buttons, option selectors, and Persian/Arabic product-code normalization are implemented. Real store/product routes use server-only AdminChannel reads and return explicit errors without substituting sample data. Store/product identifiers are checked against response identities. Reserved namespaces include `track`, `result`, `preview`, and `api`.

Schemas reflect fields observed in legacy source, not confirmed live contracts. Currency on live pages is labeled `واحد API` until units are confirmed; sample prices explicitly use Toman. Availability is not inferred from missing API fields. HTML descriptions are rendered as plain text, and remote HTTPS images currently bypass optimization until trusted image hosts are confirmed. Per-page titles are implemented; indexing, canonical/social metadata, and sitemap remain pending an agreed public domain and verified live data. Payment is disabled.

Local ESLint, strict type checks, six focused tests, source gate, and production build pass. Live store code was requested; backend validation is pending. Browser UI verification was unavailable because no connected browser was exposed. HTTP checks pass for home and sample catalog/product. An invalid preview product renders not-found UI with noindex; its HTTP status is 200 because the root loading boundary starts streaming before notFound resolves, as documented by Next.js. Full RTL/accessibility verification remains pending.

## Checkout and order-screen update — 2026-10-09

Product option selection now creates a server-validated draft and opens `/result/payment`. Drafts contain only product/store references, option selections, a version, and a 30-minute expiry; an HMAC signature protects them against modification. They are stored in HttpOnly, SameSite cookies (Secure in production) with no customer details. A server-only signing key is configured locally and must be supplied separately for other environments. Draft creation/deletion checks Origin and accepts bounded JSON bodies. Opening or refreshing checkout never creates a purchase. Product data and option validity are checked again when displaying checkout.

The guest form validates names, normalized Iranian mobile numbers, optional email, address, and comments. Customer values are held only in form inputs and are not automatically stored or submitted. Payload preparation preserves the entered comment and legacy option serialization. `/api/checkout` validates draft/customer data but always returns a disabled-payment response without calling the purchase backend. Price/stock authority, deduplication, gateway allowlists, sandbox, and final submission remain blocked on verified backend contracts. Draft retention is an interim development policy, pending owner review; the recovery mechanism does not persist customer data.

Tracking lookup and invoice routes now exist. Live order reads default to disabled via `ORDER_LOOKUP_ENABLED`; enable only after authorization, rate limiting, and API contracts are verified. Labeled preview tracking is at `/preview/track` (sample code `12345`), with payment success/failure/cancelled/pending/unknown states under `/preview/result/[status]`. A legacy `done: false` maps to unknown, not an assumed failure. Jalali dates use the Persian calendar and Asia/Tehran timezone. Private routes/API responses use no-store, noindex, and no-referrer protections.

Verification: ESLint, strict type checks, 13 focused tests, active-source gate, and production build pass. The running-server smoke check verifies draft creation, refresh recovery, tampering, cross-origin rejection, invalid options/IDs, missing-draft recovery, disabled real purchases, private-cache/indexing headers, preview tracking, all five payment states, and draft deletion. No live backend payment or browser UI checks were performed.

## Local shopping and verification update — 2026-10-09

Catalog name/code search, integer price ranges, and default/price/name sorting now use shareable URL query parameters. Search normalizes Persian/Arabic digits and letter variants and is explicitly limited to the products returned in the current catalog. Category and availability filters remain dependent on verified API fields. Invalid bounds show an error; empty searches have a recovery state.

Wishlist and cart references persist in localStorage under separate store and preview/live keys. Variants use ordered option selections as distinct identities; repeat adds merge quantities, which are limited to 1–99. Stored data is schema-checked, capped, and contains no customer details. Corrupt/cross-store state is discarded. Items missing from the currently returned catalog are flagged for inspection rather than assumed deleted. Cart prices are labeled snapshots/estimates and multi-item payment remains disabled. Browser storage events synchronize open tabs. Serialization, variants, isolation, limits, removal, and wishlist behavior are unit-tested; actual browser storage/UI verification remains pending.

Public catalog cache policy is explicitly configurable (0 by default, maximum 300 seconds); sensitive reads and checkout product revalidation always bypass it. Backend errors now emit allowlisted, redacted events with correlation IDs. The production smoke check caught and fixed an internal-host Origin mismatch: checkout validation uses the incoming host, or an exact APP_ORIGIN for proxy deployments, and rejects untrusted forwarded-host values.

Verification: lint, strict type checking, 25 tests, active-source checks, production build, and isolated production HTTP smoke checks pass. CI now runs the production smoke checks with an ephemeral signing key and live order reads disabled. A clean-install dry run passes with existing upstream ESLint-plugin peer-range warnings. Operations instructions are in docs/OPERATIONS.md. No live payment, order authorization, deployment, worker-retirement, or browser checks have been completed.

## Legacy cleanup and worker retirement update — 2026-10-09

Forty-one former CRA source/configuration, template, worker, font/image, icon, and Yarn-lock files are preserved in docs/legacy/storeShop-cra.zip. The manifest records original paths and SHA-256 hashes, and archive contents were verified before removal from active source/public paths. The release uses npm's lockfile only. No former JavaScript/JSX application source or old SPA shell remains in the active tree; historical files are offline reference material only. The app now has an original SVG icon and uses system fonts.

The source gate now scans all src/scripts/tests/public paths and root executable files, parses TypeScript imports/JSX, and rejects JavaScript, extra stylesheets, unsupported styling libraries, and inline JSX styles. This removes the former legacy-source exemption and avoids interpreting test strings as executable imports.

Retirement handlers now serve /sw.js, /service-worker.js, and /js/serviceworker.js with no-store JavaScript responses. Their source is TypeScript, compiled into an ignored generated TypeScript module by dev/build/test/check hooks; deploys do not require the TypeScript compiler at request time. The generated worker has no fetch handler. It skips waiting, cleans only default Workbox precaches whose suffix matches its registration scope, claims existing clients, and unregisters. Failures do not prevent the fetch-less replacement from activating. A client helper updates only known same-origin registrations, preserving unrelated/newer worker paths; it never registers a new worker or forces a reload. Custom historical worker paths/cache names require separate verification.

Verification: lint, strict type checks, 31 tests, whole-project source checks, production build, production HTTP smoke checks, and all 41 archive hashes pass. Worker lifecycle tests execute the compiled script and cover owned-cache selection, failure handling, unregistration, and unrelated registrations. Production checks verify headers/script content at every worker URL and that /index.html renders the new not-found screen rather than the old SPA shell.

Native Chrome inspection exposed the preview's expected product/gallery/option/cart/wishlist labels, but the browser changed during interaction checks. Browser storage, responsive layout, keyboard interaction, actual worker lifecycle, and WCAG acceptance remain unverified. The release checklist for worker retirement stays open until these browser checks and existing-client behavior are confirmed. Live backend/payment contracts and deployment acceptance also remain pending.

## Metadata, health checks, and fixture contract update — 2026-10-09

Public store/product metadata now includes canonical URLs and social previews only when SITE_ORIGIN is an exact HTTPS origin, CATALOG_INDEXING_ENABLED is true, and the store is listed in PUBLIC_STORE_CODES. Indexing defaults to disabled. robots.txt blocks crawling by default, and the sitemap is empty until explicitly configured; enabled sitemaps contain only validated configured stores/products and exclude preview/private routes. Sitemap generation is bounded to 20 configured stores, four concurrent reads, and 500 returned products per store. Store failures are omitted rather than replaced by preview data. Product JSON-LD escapes script boundaries and emits basic validated identity/content only; unconfirmed offers, currency, availability, reviews, and ratings are omitted. Live SEO acceptance and domain/data confirmation remain pending.

/api/health reports web-process liveness. /api/ready checks backend URL configuration, draft-signing configuration, and production public origin; it reveals only booleans and never secrets or URLs. These are configuration checks, not live backend/payment health claims. Production requires an explicit HTTPS public origin (loopback HTTP is permitted for isolated tests). API/private responses remain no-store/noindex, and all responses now have nosniff protection. Backend base URLs with query strings, fragments, or embedded credentials are rejected.

A synthetic loopback backend now tests the real dynamic store/product/tracking/invoice routes in an isolated production instance, including returned identity checks, numeric-string schema handling, private-field stripping, malformed/cross-store responses, blocked redirects, and checkout drafts. It serves no real data, rejects mutations, and verification requires zero backend mutation attempts. Live order reads are enabled only in that fixture instance; the user's app remains gated off. Contract notes and missing live acceptance inputs are documented in docs/BACKEND-CONTRACTS.md.

Verification: lint, strict type checks, 35 tests, whole-project source checks, production build, preview production smoke checks, and real-route fixture contract checks pass. Actual backend schemas, units, stock, order authorization, gateway/idempotency contracts, browser acceptance, and staging/business approval remain unresolved. A public store reference and backend/payment documentation were requested for the next integration step.

## Text, types, environment, and constants refactor — 2026-10-09

- [x] Move application Persian labels, notices, validation messages, metadata text, sample descriptions, and payment-state copy into dedicated content files.
- [x] Move shared domain, route, component, environment, and worker types into `src/types`, retaining Zod-derived inference and compatible library exports.
- [x] Centralize application environment reads in the request-time, server-only `src/config/env.server.ts` getter; preserve existing validation, defaults, and secret handling.
- [x] Separate business limits, API paths, locale settings, input classes, worker paths, checkout field definitions, and sample catalog records into `src/constants`.

Verification: ESLint with zero warnings, strict TypeScript checking, all 35 existing tests, the TypeScript/Tailwind source gate, production build, and isolated preview/backend-fixture HTTP checks pass. This refactor preserves the existing checkout and indexing gates and does not enable payments or change environment values.
