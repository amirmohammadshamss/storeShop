import assert from "node:assert/strict";
import test from "node:test";
import { readDraft, signDraft, DRAFT_LIFETIME, type Draft } from "../src/lib/checkout/draft";
import { customerSchema, draftInputSchema, purchasePayload, validateSelections } from "../src/lib/checkout/validation";
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
