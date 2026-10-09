import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDigits, normalizeIranianMobile } from "../src/lib/localization/numbers";
test("normalizes mixed digits without altering text", () => { assert.equal(normalizeDigits("کد ۱۲٣4"), "کد 1234"); });
test("accepts equivalent mobile input and rejects incomplete numbers", () => {
 assert.equal(normalizeIranianMobile("۰۹۱۲ ۳۴۵ ۶۷۸۹"), "09123456789");
 assert.equal(normalizeIranianMobile("٠٩١٢٣٤٥٦٧٨٩"), "09123456789");
 assert.equal(normalizeIranianMobile("0912345678"), null);
 assert.equal(normalizeIranianMobile("08123456789"), null);
});
