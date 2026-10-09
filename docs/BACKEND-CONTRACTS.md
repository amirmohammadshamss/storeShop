# Backend integration contracts

Status: inferred from archived CRA source; not verified against a live AdminChannel service. All fixtures in tests/fixtures/adminchannel.ts are synthetic. The isolated backend in scripts/fixture-backend.ts serves only loopback test data and rejects mutations. It must never be deployed or used as a live-store fallback.

## Read contracts currently implemented

- GET `AdminChannel/store/get_store/{storeCode}`: store code/title, optional description and logo URL. Returned store identity must match the normalized requested code.
- GET `Adminchannel/product/get_products/{storeCode}`: an object with a Products array containing code, title, integer price, and optional image URL(s). The different casing is preserved from the old source and requires owner verification.
- GET `AdminChannel/product/get_product/{storeCode}/{productCode}`: product ID/code/title/price, optional primary price/description/images, store identity, and features represented by 0 or an array of name/desc objects. Feature options currently use comma-separated strings. Both store and product identity must match the request.
- GET `AdminChannel/purchase/track_order/{trackingCode}`: Unix purchase time, status description, store title, and integer price. Unknown customer fields are discarded; live reads remain gated pending authorization and rate-limit confirmation.
- GET `AdminChannel/purchase/get_payment_result/{invoiceId}`: invoice identity, boolean done, Unix creation time, integer amount, optional tracking/store references. The invoice identity must match. done=false means unknown until richer provider states are documented.

Prices accept safe nonnegative integer numbers or ASCII digit strings. Image URLs are limited to local paths or HTTPS. Response schema mismatches fail explicitly. No Rial/Toman conversion or stock interpretation is enabled until units and availability fields are confirmed. Checkout reads always bypass public catalog caching.

## Purchase contract still needed

Legacy payload fields are product_id, full_name, mobile, email, address, description, and product_specs. The current adapter preserves the entered comment and serializes options in legacy value=name order. It validates data but does not send a purchase request.

Before enabling purchase submission, confirm authoritative price/stock validation, customer-field requirements, option identifiers/serialization, gateway hosts and redirect response shape, callback parameters, idempotency key semantics and retention, pending/failed/cancelled status representations, sandbox procedures, and safe retries. Multi-item orders require a separate contract with quantities, store ownership, totals, shipping, discounts, and deduplication.

## Authorization and privacy still needed

Confirm whether invoice/tracking codes are unguessable authorization capabilities or require phone/account verification. Document how authorization is forwarded to the backend and how rate limits apply across instances. The ORDER_LOOKUP_ENABLED flag is a deployment gate, not an authorization mechanism. Keep it false outside isolated fixture tests until this contract is accepted.

## Verified test behavior

The production runner starts a loopback fixture backend and two isolated app instances in sequence. The first tests preview flows with live reads disabled; the second enables order reads only against the fixture service and tests the real dynamic store/product/tracking/invoice routes. It covers numeric-string responses, identity matching, metadata, sitemap exclusions, malformed prices, cross-store responses, blocked redirects, customer-field stripping, and live-mode draft creation. Backend mutation count must remain zero.

These checks validate the adapter's chosen contract and error behavior. They do not prove live API availability, live response casing/schema, authorization, payment settlement, stock behavior, or provider idempotency.

## Inputs for live acceptance

Provide a known public store URL/code, backend documentation and ownership, a staging base URL, currency/stock/shipping rules, order authorization details, gateway hosts/status docs, and a payment sandbox through the agreed secret-management channel. Capture sanitized real responses separately from the synthetic fixtures before changing contracts.
