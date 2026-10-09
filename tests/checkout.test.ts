import assert from "node:assert/strict";
import test from "node:test";
import { readDraft, signDraft, DRAFT_LIFETIME, type Draft } from "../src/lib/checkout/draft";
import { customerSchema, draftInputSchema, purchasePayload, validateSelections } from "../src/lib/checkout/validation";
import { isSameOrigin } from "../src/lib/checkout/origin";
import { previewProducts } from "../src/lib/catalog/preview";
const secret = "test-only-key-".repeat(4);
const now = 1791504000000;
const draft: Draft = { version: 1, preview: true, storeCode: "sample", productCode: "101", selections: ["کرم"], expires: now + DRAFT_LIFETIME * 1000 };
test("signed draft survives reload and rejects tampering, different keys, and expiry", () => {
 const token = signDraft(draft, secret);
 assert.deepEqual(readDraft(token, secret, now), draft);
 const [payload, signature] = token.split(".");
 const modified = Buffer.from(JSON.stringify({ ...draft, productCode: "102" })).toString("base64url");
 assert.equal(readDraft(`${modified}.${signature}`, secret, now), null);
 assert.equal(readDraft(`${payload}.bad`, secret, now), null);
 assert.equal(readDraft(token, "different-key-".repeat(4), now), null);
 assert.equal(readDraft(token, secret, draft.expires), null);
 assert.equal(readDraft(token, secret, now - DRAFT_LIFETIME * 1000), null);
 assert.equal(readDraft(undefined, secret, now), null);
});
test("draft rejects injected customer data and oversized tokens", () => {
 assert.equal(draftInputSchema.safeParse({ ...draft, full_name: "private" }).success, false);
 assert.throws(() => signDraft({ ...draft, selections: Array.from({ length: 20 }, () => "a".repeat(200)) }, secret));
 assert.throws(() => signDraft(draft, "short"));
});
test("options are checked against the product and preserve feature order", () => {
 const product = previewProducts[0];
 assert.equal(validateSelections(product, ["کرم"]), true);
 assert.equal(validateSelections(product, []), false);
 assert.equal(validateSelections(product, ["مقدار ناشناخته"]), false);
 assert.equal(validateSelections(product, ["کرم", "سبز"]), false);
});
test("customer validation normalizes digits and carries the actual comment into purchase payload", () => {
 const customer = customerSchema.parse({ full_name: "خریدار نمونه", mobile: "۰۹۱۲۳۴۵۶۷۸۹", email: "", address: "آدرس نمونه برای تست", description: "لطفاً عصر ارسال شود" });
 assert.equal(customer.mobile, "09123456789");
 const payload = purchasePayload(previewProducts[0], ["کرم"], customer);
 assert.equal(payload.description, "لطفاً عصر ارسال شود");
 assert.equal(payload.product_specs, "کرم=رنگ");
 assert.equal(payload.product_id, "101");
 assert.equal(customerSchema.safeParse({ ...customer, mobile: "123" }).success, false);
 assert.equal(customerSchema.safeParse({ ...customer, email: "invalid" }).success, false);
 assert.equal(customerSchema.safeParse({ ...customer, full_name: "" }).success, false);
 assert.equal(customerSchema.safeParse({ ...customer, address: "" }).success, false);
 assert.throws(() => purchasePayload(previewProducts[0], ["wrong"], customer));
});

test("origin checks accept the incoming host or configured public origin, rejecting forged forwarding and cross-origin requests", () => {
 const request = (origin?: string, host = "127.0.0.1:3100") => new Request("http://localhost:3100/api/checkout", { headers: { Host: host, ...(origin ? { Origin: origin } : {}), "x-forwarded-host": "untrusted.example", "x-forwarded-proto": "https" } });
 assert.equal(isSameOrigin(request("http://127.0.0.1:3100")), true);
 assert.equal(isSameOrigin(request("https://shop.example.com"), "https://shop.example.com"), true);
 assert.equal(isSameOrigin(request("http://127.0.0.1:3100"), "https://shop.example.com"), false);
 for (const origin of [undefined, "null", "https://untrusted.example", "http://127.0.0.1:3100/path", "https://127.0.0.1:3100"]) assert.equal(isSameOrigin(request(origin)), false);
 assert.equal(isSameOrigin(request("http://127.0.0.1:3100", "evil.example/path")), false);
 assert.equal(isSameOrigin(request("https://shop.example.com"), "https://shop.example.com/path"), false);
});
