# Request for Proposal: storeShop Modernization

Date: 2026-10-09
Status: Draft for scope and vendor review
Project: Persian storefront modernization and migration to Next.js

## 1. Purpose

Modernize the existing storeShop application into a maintainable, responsive Next.js storefront while preserving store links, product purchases, payment results, and order tracking. Improve the Persian shopping experience and introduce prioritized commerce features.

This document requests implementation proposals. New features below are recommendations, not confirmed business requirements. The repository currently uses Create React App, not Next.js; the work is a framework migration rather than a Next.js version bump. Creating this RFP does not implement the migration.

## 2. Current application and evidence

The following findings are based on repository source inspection, not a successful runtime or live backend audit:

- `package.json`: React `^16.8.6`, React DOM `^16.2.0`, React Scripts `^1.1.0`, React Router 4, Bootstrap 4, Axios 0.18, and legacy Redux/form dependencies. Dependency declarations do not establish which packages are actively used or their installed versions.
- `src/components/App.js`: store pages at `/:idStore`, product pages at `/:idStore/:idProduct`, purchase initiation at `/result/payment/`, invoice results at `/result/:invoice_id`, and tracking at `/track` and `/track/:idPursuit`.
- `src/components/global/api.js` and `ConstApi.js`: browser calls to `https://adminchannel.ir/api/v1/` for store, product, purchase, payment-result, and tracking data. Backend implementation and API documentation are not included.
- `src/components/Products/Product.js`: single-product checkout, product-option selection, customer name/mobile/email/address fields, and customer details stored in local storage. Purchase data travels through router state, which cannot reliably support direct navigation or reloads.
- `src/components/Home/Home.js`: product listings and product-code lookup. General text search, category filters, and sorting were not found in the inspected flow.
- `src/components/TrackResult/TrackResult.js` and `src/tools/SpUtils.js`: Persian number formatting, Jalali purchase dates, RTL presentation, and displayed Toman prices.
- `src/index.js`: imports styles that are absent from the supplied tracked file inventory; the vendor must recover or replace these assets. Service-worker registration is explicitly disabled, despite existing PWA-related files.
- `server.js`: an Express/Handlebars manifest and storefront experiment exists, but its dependencies are not declared in `package.json` and it is not the configured start command.
- API helpers return errors as fulfilled results, weakening error handling. Purchase requests send a fixed description rather than the customer's comment. These behaviors must be corrected during migration.

No backend availability, gateway behavior, production traffic, security posture, or performance baseline has been verified. No automated test files were found in the inspected inventory.

## 3. Objectives

1. Move to the latest stable, supported Next.js release available when implementation begins, with compatible React and a supported Node.js LTS runtime.
2. Preserve existing public URLs and end-to-end purchasing behavior.
3. Deliver a mobile-first Persian interface with consistent RTL, digit handling, dates, and currency labels.
4. Make payment initiation and recovery reliable across refreshes, retries, and gateway returns.
5. Improve discoverability, accessibility, performance, and operational visibility.
6. Provide reproducible installation, CI checks, deployment instructions, and maintainable source code.

## 4. Required scope: first release

### 4.1 Framework and architecture

- Use Next.js App Router and TypeScript. Pin the selected stable versions in one lockfile and document runtime requirements.
- TypeScript is mandatory for all new and migrated application code, API handlers, utilities, tests, and project-owned executable scripts/configuration where the tool supports TypeScript. Use `.ts` and `.tsx` files with strict type checking; do not deliver project-owned JavaScript or JSX application files. Convert retained legacy code before release. JSON, Markdown, and static assets remain permitted; generated output and third-party dependencies are outside this source-language requirement.
- ESLint is mandatory. Use a supported version compatible with the selected Next.js and TypeScript versions, with Next.js, React Hooks, and TypeScript rules. Provide an explicit `lint` command that checks all project-owned TypeScript source and tests, fails on errors or warnings, and runs independently of the production build. Keep the ESLint configuration in TypeScript where supported; document any required tooling exception.
- Tailwind CSS is the only permitted UI styling framework. Replace Bootstrap and legacy custom styles with Tailwind utilities. Do not introduce other CSS frameworks, CSS-in-JS libraries, Sass, CSS Modules, or standalone custom component stylesheets. Permit a minimal global CSS entry for Tailwind imports, theme tokens, font declarations, and essential base styles. Use Tailwind utilities for RTL, responsive layouts, focus states, and component styling; any third-party UI component must work without a separate styling system.
- Use server-rendered storefront and product content where appropriate; isolate forms, sliders, cart interactions, and browser storage in client components.
- Replace React Router with Next.js routing, links, and navigation. Migrate class components to function components as pages are ported.
- Preserve the existing routes. Static `/track` and `/result` routes must take precedence over dynamic store identifiers; document reserved store identifiers and collision handling.
- Define intentional behavior for `/`, which currently has no dedicated home route. A neutral landing page or configured default store is an owner decision.
- Create a typed API adapter with environment-specific backend configuration, input validation, timeouts, and explicit error responses.
- Use server Route Handlers or an equivalent backend boundary for sensitive operations. Keep credentials and privileged requests off the client.
- Define caching separately for public catalog data and private transactions. Checkout, payment results, and tracking must bypass shared caches.
- Replace unsupported dependencies and remove unused packages after usage verification. Recover or recreate missing styles; confirm font and asset usage rights.
- Use a Node-capable deployment target for server behavior; the current static SPA hosting configuration cannot be reused unchanged.

### 4.2 Store and product pages

- Preserve store identity, product listings, code lookup, galleries, descriptions, product options, pricing, and store navigation where supported by the API.
- Add consistent loading, empty, unavailable-product, missing-store, and API-failure states with useful recovery actions.
- Make layouts responsive and usable with keyboards and touch input.
- Generate per-store and per-product titles, descriptions, canonical URLs, and social previews. Include sitemap entries and product structured data only when valid source data is available.
- Make currency units explicit. Confirm whether API amounts are Rial or Toman before any conversion; use integer amounts with documented conversion rules.

### 4.3 Checkout and payments

- Preserve guest single-product checkout as the initial compatibility flow.
- Normalize Persian, Arabic, and Latin digits before validating mobile numbers and numeric identifiers. Define required customer fields with the owner and backend team.
- Send the entered order comment instead of the existing fixed description.
- Replace transient router-state checkout data with a recoverable draft or server order reference. Missing or expired drafts must show a recovery screen.
- Validate product ownership, options, current price, and availability on the authoritative backend before purchase creation.
- Disable repeated submissions while pending. Require backend idempotency or an equivalent purchase-deduplication mechanism; frontend button disabling alone is insufficient.
- Validate gateway redirect URLs against approved hosts. Determine payment status from the backend, never solely from return URL parameters.
- Support successful, failed, cancelled, pending, and unknown payment outcomes, with invoice and tracking details when provided.
- Distinguish retrying a status lookup from creating a new purchase. Define timeout and gateway-return recovery behavior with the payment provider.
- Replace automatic indefinite storage of customer details with a reviewed remember-details policy. Do not include customer data in analytics or debug logs.

### 4.4 Order tracking

- Preserve tracking-code lookup and direct tracking links.
- Show localized status, purchase date, store identity, amount, and tracking code when authorized and supplied by the API.
- Provide helpful invalid-code and unavailable-service messages without exposing another customer's details.
- Confirm the backend's tracking authorization model. Where codes alone are insufficient, require phone verification or another agreed mechanism and rate limiting.

## 5. Proposed new features

Vendors must quote each feature separately and identify API changes. These are proposed priorities and may be adjusted before implementation.

### Priority 1: product discovery and shopping convenience

- **Text search, filters, and sorting:** Search by product name and code; filter by supported attributes, category, price, and availability; sort by price and supported ordering fields. Persist selections in shareable URL parameters. If the API has no search endpoint, disclose the limitations of searching only loaded products.
- **Persistent store-specific cart:** Add, remove, and change quantities; distinguish product variants; restore the cart after reload. Prevent mixed-store checkout unless the backend explicitly supports it. Revalidate totals and availability before purchase. Multi-item checkout requires a separately agreed backend contract because the current request contains one `product_id`.
- **Wishlist:** Save product references locally and restore them after reload; clearly handle deleted or unavailable products. Account synchronization is outside the local-only version.
- **Improved checkout:** Show an order summary and supported shipping methods, costs, and delivery estimates. Shipping calculations require authoritative backend support; quotes must separate UI work from backend work.

Acceptance examples: a shopper can share a filtered catalog URL; two variants remain distinct cart items; a price change is shown before payment; wishlist items survive refresh.

### Priority 2: customer retention and account features

- Mobile OTP sign-in, account settings, saved addresses, and private order history.
- Backend-validated discount codes with eligibility, expiry, and usage limits.
- Order-status notifications through an agreed SMS or email provider.
- Stock-aware variants and availability messaging backed by authoritative inventory data.

These features require authentication, authorization, provider integration, or backend changes. They must not be estimated as frontend-only work.

### Priority 3: optional enhancements

- Moderated product reviews with verified-purchase rules.
- Related products based on a defined backend or merchandising rule.
- Installable PWA and an offline informational screen. Never cache customer records or allow offline payment submission; define service-worker retirement and update behavior.
- A store administration interface, multilingual content, and reporting dashboards as separately scoped projects.

## 6. Quality and operational requirements

- **Accessibility:** Target WCAG 2.2 AA for delivered screens; review focus handling, labels, errors, contrast, keyboard navigation, and RTL reading order.
- **Performance:** Establish a baseline and agreed mobile test conditions. Target field p75 LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 where sufficient traffic exists. Prelaunch lab results must be reported separately; backend latency must be disclosed.
- **Security and privacy:** Validate mutations server-side, enforce store isolation, protect sensitive endpoints, restrict redirects, redact logs, and document data retention. Protect cookie-authenticated mutations against CSRF where applicable. No secrets in public environment variables or source control.
- **Reliability:** Use bounded timeouts and useful failures; retry safe reads only under a defined policy. Prevent shared-cache leakage of order data.
- **Localization:** Set Persian language and RTL direction; support mixed-direction identifiers, Latin and Persian input, Jalali display, and documented timezone behavior.
- **Observability:** Capture redacted application errors and payment failures with correlation identifiers. Define events for product view, checkout start, payment outcome, and tracking lookup; minimize collected personal data.
- **CI:** Run ESLint with zero warnings permitted, TypeScript type checks, relevant automated tests, and production build as separate required steps. Review dependency risks and resolve or document material findings before release.
- **Source and styling enforcement:** Enable TypeScript strict mode and reject project-owned `.js`/`.jsx` application files in CI. Verify that Bootstrap, Emotion, Slick stylesheets, and other legacy styling dependencies/imports have been removed from the delivered application. Document any unavoidable tool configuration format that cannot use TypeScript.

## 7. Backend discovery and integration deliverables

The vendor must document existing endpoints, HTTP methods, schemas, error responses, authentication, store isolation, and rate limits using sanitized fixtures. Verify inconsistent endpoint casing rather than silently correcting it.

Required contract areas include store/catalog responses, product options and availability, purchase creation, gateway redirects, invoice status, and tracking. For proposed features, specify additional contracts for carts, quantities, shipping, discounts, customer accounts, and notifications.

Do not replace the existing backend or introduce a new database without a separately agreed need. When backend access is unavailable, use clearly labeled fixtures for development and list blocked integration checks; mocks do not constitute production payment acceptance.

## 8. Delivery phases

1. **Discovery:** Reproduce or document legacy build failures, recover assets, inventory API contracts and routes, confirm payment sandbox and business rules, and establish a baseline. Deliver a confirmed scope and risk register.
2. **Foundation:** Set up Next.js, TypeScript, environment configuration, shared UI, API adapter, CI, and staging. Deliver a buildable application skeleton and route plan.
3. **Compatibility migration:** Port storefront, product, guest checkout, payment results, and tracking. Demonstrate preserved URLs and localized behavior against fixtures and available staging services.
4. **Feature delivery:** Implement approved Priority 1 items and separately contracted backend changes. Demonstrate feature-specific acceptance scenarios.
5. **Release and handover:** Complete regression, accessibility, and payment-sandbox checks; deliver deployment and rollback procedures; obtain business acceptance and launch.

Vendors must propose phase durations, staffing, dependencies, and costs. No fixed schedule or budget is assumed before discovery.

## 9. Release acceptance criteria

- Fresh checkout installs reproducibly and passes lint, TypeScript checks, relevant tests, and production build with documented environment settings.
- The explicit ESLint command passes with zero errors and zero warnings across project-owned TypeScript source and tests, and CI blocks changes that fail this check.
- All delivered application code and tests use TypeScript with strict checking. No legacy JavaScript/JSX application source remains in the release.
- All delivered UI styling uses Tailwind CSS, with only the minimal global CSS entry described above. No Bootstrap, CSS-in-JS, or separate component stylesheet dependency remains.
- All existing route patterns support direct navigation and reload; invalid identifiers produce appropriate errors without route collisions.
- Store/product rendering and product-code lookup preserve agreed legacy behavior.
- Persian, Arabic, and Latin numeric input works in the agreed checkout and tracking fields; RTL screens work on representative mobile and desktop browsers.
- Product options and customer comments reach the backend correctly.
- Checkout survives refresh or offers explicit draft recovery. Repeated submissions and callback processing do not create duplicate purchases under the agreed backend contract.
- Gateway sandbox scenarios cover success, failure, cancellation, pending status, timeout, and repeated return visits. Production launch requires real integration acceptance, not fixture-only tests.
- Unauthorized cross-store/order access is denied; private responses do not appear in shared caches or logs.
- Approved feature scenarios pass, including cart restoration and server-side total validation if cart checkout is included.
- Agreed accessibility and performance checks are documented with limitations and unresolved issues.
- Staging approval, deployment runbook, rollback procedure, and handover documentation are complete.

Use focused integration tests for API normalization and transaction behavior, plus browser tests for purchasing and tracking. Cover Persian number normalization, currency rules, unavailable stock, price changes, API errors, and malformed responses.

## 10. Required handover

- Complete source code, version lockfile, environment-variable template without secrets, and updated README.
- Route inventory, architecture notes, sanitized API contracts, and approved UI designs.
- Automated tests, CI configuration, and verification results.
- Staging deployment and agreed production deployment configuration.
- Release, rollback, cache/service-worker cleanup, monitoring, and incident-response instructions.
- Dependency replacement notes, known limitations, ownership information, and proposed post-launch support terms.

## 11. Proposal response requirements

Each proposal must include:

1. Understanding of the current project and migration approach.
2. Exact proposed framework/runtime versions and maintenance strategy, including compliance with TypeScript-only application source, Tailwind-only UI styling, and mandatory ESLint checks.
3. Included requirements, exclusions, assumptions, and backend dependencies.
4. Separate estimates for discovery, compatibility migration, each new feature, backend work, and support.
5. Milestones, staffing, delivery dates, and acceptance checkpoints.
6. Payment reliability, privacy, testing, deployment, and rollback approach.
7. Relevant commerce and Persian/RTL experience.
8. Warranty, ongoing support, source ownership, and third-party operating costs.

Evaluate proposals on project understanding, payment correctness, migration feasibility, quality evidence, maintainability, transparent pricing, and delivery/support capability. Agree evaluation weights before procurement.

## 12. Decisions needed before final scope

- Is the intended product guest-only, or should accounts be included?
- Which proposed features belong in the first release?
- Who owns the AdminChannel backend, and are API documentation and a staging environment available?
- Which gateway/provider is used, and are sandbox credentials available through an approved secret channel?
- Are amounts returned in Rial or Toman? What are shipping, stock, discount, and refund rules?
- Must purchases remain single-product, or will the backend support multi-item orders?
- What should `/` display, and can stores use reserved identifiers such as `track` or `result`?
- Is the existing branding to be preserved or redesigned? Can the missing styles and font licenses be supplied or recovered?
- What hosting environment, budget, deadline, traffic expectations, and support commitments apply?
- Does tracking require additional customer verification, and what data may be retained?

## 13. Framework references

Official documentation checked while drafting identifies Next.js 16 as the current documented stable upgrade family and a minimum Node.js version of 20.9. Select the latest supported stable release and compatible React versions again at implementation kickoff; do not assume a particular patch version from this document.

- [Next.js installation and runtime requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js upgrade guidance](https://nextjs.org/docs/app/getting-started/upgrading)
- [Next.js 16 migration requirements](https://nextjs.org/docs/app/guides/upgrading/version-16)

The existing application requires manual CRA-to-Next.js migration planning. Next.js version-upgrade codemods alone do not migrate this repository.
