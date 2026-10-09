import assert from "node:assert/strict";
import test from "node:test";
import { invoiceSchema, legacyPaymentState, trackingSchema } from "../src/lib/orders/schema";
import { formatJalaliDate } from "../src/lib/localization/dates";
test("a legacy false payment flag is unknown rather than a fabricated failure", () => {
 const invoice = invoiceSchema.parse({ invoice_id: "101", done: false, create_date_unix_time: 1791504000, amount: "285000" });
 assert.equal(legacyPaymentState(invoice), "unknown");
 assert.equal(legacyPaymentState({ ...invoice, done: true }), "success");
 assert.equal(invoiceSchema.safeParse({ ...invoice, done: "false" }).success, false);
});
test("tracking schema discards customer information and validates amounts", () => {
 const result = trackingSchema.parse({ record_date_unix_time: "1791504000", status_desc: "در حال آماده‌سازی", store_title: "نمونه", price: "285000", address: "private", mobile: "private" });
 assert.equal("address" in result, false); assert.equal("mobile" in result, false);
 assert.equal(trackingSchema.safeParse({ ...result, price: -1 }).success, false);
});
test("dates use Persian calendar and Tehran timezone without runtime locale defaults", () => {
 assert.equal(formatJalaliDate(Date.UTC(2024, 2, 20, 12) / 1000), "۱ فروردین ۱۴۰۳");
 assert.equal(formatJalaliDate(NaN), "تاریخ نامعتبر");
});
