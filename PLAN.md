# storeShop Implementation Plan

Date: 2026-10-09
Status: In progress — Next.js foundation implemented; commerce migration pending
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
- [ ] Define public catalog caching separately from uncached checkout, payment results, and tracking.
- [ ] Configure loading, error, and not-found boundaries plus redacted error reporting.

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
- [ ] Add metadata, canonical URLs, and social previews; add sitemap and product structured data only for valid available data.
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

- [ ] Search, filters, and sorting with shareable URL parameters. Document whether results cover the full catalog or only loaded products.
- [ ] Persistent store-specific cart with quantities and distinct variants, reload recovery, and unavailable-item handling.
- [ ] Multi-item checkout only after the backend supports cart purchase creation, authoritative totals, and deduplication.
- [ ] Local wishlist with reload persistence and deleted-product handling.
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

- [ ] Run ESLint with zero errors/warnings, TypeScript checks, focused tests, and production build as separate required CI steps.
- [ ] Confirm no retained project-owned JavaScript/JSX application source or disallowed styling dependencies/imports remain.
- [ ] Test number normalization, currency rules, API failures, malformed responses, cross-store isolation, and transaction deduplication.
- [ ] Run browser checks for storefront lookup, option selection, checkout recovery, payment outcomes, repeated gateway returns, and tracking.
- [ ] Verify approved feature scenarios such as cart restoration, variant identity, and changed-price confirmation.
- [ ] Review accessibility against the RFP's WCAG 2.2 AA target on representative screens.
- [ ] Measure agreed mobile performance; report lab results separately from field Core Web Vitals and disclose backend constraints.
- [ ] Review dependencies, secret handling, log redaction, caching, and gateway redirect restrictions.
- [ ] Prepare a Node-capable staging deployment; replace legacy static SPA hosting configuration.
- [ ] Define legacy service-worker/cache retirement, deployment health checks, monitoring, and rollback steps.
- [ ] Update README with installation, environment setup, commands, API assumptions, and deployment instructions.
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
