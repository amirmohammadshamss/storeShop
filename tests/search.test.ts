import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSearch, parseCatalogSearch, searchCatalog } from "../src/lib/catalog/search";
import { previewProducts } from "../src/lib/catalog/preview";
test("search accepts Persian codes and normalizes Arabic letter variants", () => {
 assert.equal(searchCatalog(previewProducts, parseCatalogSearch({ q: "۱۰۱" }))[0].code, "101");
 assert.equal(searchCatalog(previewProducts, parseCatalogSearch({ q: "كيف" }))[0].code, "102");
 assert.equal(normalizeSearch("  كیف\u200cروزمره  "), "کیف روزمره");
 assert.equal(searchCatalog(previewProducts, parseCatalogSearch({ q: "not found" })).length, 0);
});
test("price filters include boundaries and sort without mutating the catalog", () => {
 const original = previewProducts.map(product => product.code);
 assert.deepEqual(searchCatalog(previewProducts, parseCatalogSearch({ min: "۲۸۵۰۰۰", max: "۶۴۰۰۰۰", sort: "price-desc" })).map(product => product.code), ["102", "101"]);
 assert.deepEqual(searchCatalog(previewProducts, parseCatalogSearch({ sort: "price-asc" })).map(product => product.code), ["101", "102", "103"]);
 assert.deepEqual(previewProducts.map(product => product.code), original);
});
test("invalid ranges show errors and query parsing is bounded and deterministic", () => {
 for (const params of [{ min: "100", max: "1" }, { min: "-1" }, { max: "1.5" }, { min: "9007199254740992" }]) {
  const search = parseCatalogSearch(params); assert.ok(search.error); assert.equal(searchCatalog(previewProducts, search).length, 0);
 }
 const search = parseCatalogSearch({ q: ["101", "102"], sort: "unsupported" });
 assert.equal(search.query, "101"); assert.equal(search.sort, "default");
 assert.equal(parseCatalogSearch({ q: "x".repeat(1000) }).query.length, 100);
});
