import assert from "node:assert/strict";
import test from "node:test";
import { productSchema, summarySchema, productImages, plainDescription } from "../src/lib/catalog/schema";
import { normalizeStoreCode, normalizeIdentifier } from "../src/lib/catalog/identifiers";
import { previewProducts } from "../src/lib/catalog/preview";
test("legacy prices normalize to safe integers and invalid prices are rejected", () => {
 const product = { code: 101, title: "محصول", price: "285000", images_url: "https://example.com/image.png" };
 assert.equal(summarySchema.parse(product).price, 285000);
 for (const price of ["", "-1", "12.5", -1, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.equal(summarySchema.safeParse({ ...product, price }).success, false);
});
test("preview fixtures follow the same product contract", () => { for (const product of previewProducts) assert.equal(productSchema.safeParse(product).success, true); });
test("unsafe image schemes are omitted and descriptions remain plain text", () => {
 const product = summarySchema.parse({ code: "1", title: "محصول", price: 1, images_url: ["javascript:alert(1)", "//example.com/a", "/catalog/mug.svg"] });
 assert.deepEqual(productImages(product.images_url), ["/catalog/mug.svg"]);
 assert.equal(plainDescription("<p>توضیحات</p>"), "توضیحات");
});
test("identifiers normalize digits and reject traversal and reserved routes", () => {
 assert.equal(normalizeIdentifier("۱۰۱"), "101");
 assert.equal(normalizeStoreCode(" shop-1 "), "shop-1");
 for (const code of ["../store", "a/b", "https://example.com", "track", "result", "preview", "api"]) assert.equal(normalizeStoreCode(code), null);
});
