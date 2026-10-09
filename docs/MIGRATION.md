# Migration status

The active application is now a Next.js foundation. Legacy CRA source remains for reference and is not imported by the new application. Storefront and product routes are implemented against inferred legacy schemas; checkout drafts and tracking/invoice screens are implemented; real purchase submission and order authorization remain pending. Do not deploy this foundation as a replacement for an operating store.

## Discovery

- Legacy React/CRA, router, Bootstrap, Emotion, and slider dependencies have been replaced in the active manifest.
- Legacy style imports reference absent assets; use Tailwind replacements.
- API calls are declared against AdminChannel. Endpoint casing and response contracts remain unverified.
- Purchase data relies on router state, contains a fixed description, and customer details are persisted indefinitely.
- Payment creation is single-product; backend idempotency, authorization, and gateway sandbox contracts are unknown.
- Legacy service-worker registration is disabled. Existing public workers remain pending an explicit retirement plan.

## Route inventory

- `/:idStore`: storefront and catalog.
- `/:idStore/:idProduct`: product and guest checkout.
- `/result/payment/`: legacy purchase initiation; replace with recoverable, explicit submission.
- `/result/:invoice_id`: authoritative payment result.
- `/track`: tracking lookup.
- `/track/:idPursuit`: tracking result.

## Pending owner/backend decisions

Currency units, gateway hosts and sandbox, required fields, draft storage, deduplication, tracking authorization, reserved store identifiers, root-page behavior, asset rights, shipping, and first-release feature selection.

The root provides store-code navigation and a link to an explicitly labeled sample catalog. All API reads default to no-store with a bounded timeout and runtime schema validation. No purchase endpoint is enabled. Sanitized response fixtures must be obtained before defining production response schemas.

## Tooling

PostCSS configuration uses JSON because it is declarative configuration; all owned executable configuration and active source use TypeScript. The source gate currently covers the new application directories, not retained legacy reference files. Expand it to all source when legacy migration is complete. npm is the active package manager; the old Yarn lockfile is retained temporarily for legacy investigation and is not used by CI.

## Local verification

Production build, strict type checking, active-source gate, ESLint, and two localization tests pass. Production audit reports zero vulnerabilities. Full audit reports five development-only high-severity findings through braces/Next.js lint tooling; latest braces is still 3.0.3, so a patched release is pending. Browser and live backend/payment checks have not been performed.

## Storefront migration

`/[idStore]` and `/[idStore]/[idProduct]` now render server-side using inferred Zod schemas. `/preview/store` and its product pages use labeled synthetic data, never as a fallback for live stores. Response store/product identities must match requested identifiers. Description HTML is displayed as plain text. HTTPS images are unoptimized pending verified host configuration. Live units/stock remain unknown and payment is disabled. Reserved namespaces include preview, track, result, and api. Metadata indexing stays disabled until live contracts and the production domain are confirmed. Six focused tests cover digits, IDs, schema normalization, and unsafe image schemes.

Invalid dynamic routes can return streamed HTTP 200 with not-found UI and noindex after the root loading boundary starts streaming. This is documented Next.js behavior; non-streamed not-found responses return 404.

## Checkout and order migration

Draft routes use same-origin checks, bounded JSON input, authoritative product-option validation, and signed 30-minute HttpOnly cookies without PII. Configure a server-only CHECKOUT_DRAFT_SECRET in every environment. Customer fields are not persisted. The checkout API prepares a validated legacy-compatible payload but does not call the backend: price, stock, idempotency, and gateway contracts are unverified.

Live order reads are gated by ORDER_LOOKUP_ENABLED=false. This gate is not an authorization implementation; enabling requires verified backend authorization/rate limiting. Preview order pages are separate and clearly labeled. Legacy done=false means unknown. Jalali display uses Intl with Asia/Tehran. Result/tracking and checkout APIs carry private/no-store, noindex, and no-referrer headers. Thirteen unit tests and an HTTP smoke script cover draft integrity and order-state behavior. Browser and real backend checks remain pending.
