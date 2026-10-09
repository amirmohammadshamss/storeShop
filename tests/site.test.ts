import assert from "node:assert/strict";
import test from "node:test";
import { siteConfig, publicCatalogUrl } from "../src/lib/site/config";
import { catalogMetadata, productStructuredData } from "../src/lib/site/metadata";
import { readiness } from "../src/lib/site/readiness";
import { fixtureProducts, fixtureStore } from "./fixtures/adminchannel";
const configured = siteConfig({ SITE_ORIGIN: "https://shop.example.com", CATALOG_INDEXING_ENABLED: "true", PUBLIC_STORE_CODES: "fixture" });
test("indexing requires HTTPS, explicit opt-in and a valid bounded store allowlist", () => {
 assert.equal(siteConfig({}).indexing, false);
 for (const origin of ["http://shop.example.com", "https://user:secret@shop.example.com", "https://shop.example.com/path", "https://shop.example.com/", "bad URL"]) assert.equal(siteConfig({ SITE_ORIGIN: origin, CATALOG_INDEXING_ENABLED: "true", PUBLIC_STORE_CODES: "fixture" }).indexing, false);
 assert.equal(siteConfig({ SITE_ORIGIN: "https://shop.example.com", PUBLIC_STORE_CODES: "fixture" }).indexing, false);
 assert.equal(siteConfig({ SITE_ORIGIN: "https://shop.example.com", CATALOG_INDEXING_ENABLED: "true", PUBLIC_STORE_CODES: "track,fixture" }).indexing, false);
 assert.equal(siteConfig({ SITE_ORIGIN: "https://shop.example.com", CATALOG_INDEXING_ENABLED: "true", PUBLIC_STORE_CODES: Array.from({ length: 21 }, (_, i) => `store${i}`).join(",") }).indexing, false);
 assert.equal(publicCatalogUrl(configured, "other-store"), null);
 assert.equal(publicCatalogUrl(configured, "fixture", "101"), "https://shop.example.com/fixture/101");
});
test("canonical/social metadata is emitted only for configured public stores", () => {
 const meta = catalogMetadata(configured, fixtureStore, fixtureProducts[0]);
 assert.deepEqual(meta.alternates, { canonical: "https://shop.example.com/fixture/101" }); assert.ok(meta.openGraph); assert.ok(meta.twitter);
 const disabled = catalogMetadata(siteConfig({}), fixtureStore, fixtureProducts[0]);
 assert.equal(disabled.alternates, undefined); assert.deepEqual(disabled.robots, { index: false, follow: false });
});
test("structured data escapes script boundaries and omits unverified price/availability offers", () => {
 const title = '</script><script>alert("x")</script>';
 const result = productStructuredData(configured, { ...fixtureProducts[0], title }); assert.ok(result); assert.equal(result.includes("</script>"), false);
 const data = JSON.parse(result) as { name: string; offers?: unknown; aggregateRating?: unknown };
 assert.equal(data.name, title); assert.equal(data.offers, undefined); assert.equal(data.aggregateRating, undefined);
 assert.equal(productStructuredData(siteConfig({}), fixtureProducts[0]), null);
});
test("readiness exposes only configuration checks, never secret values or backend URLs", () => {
 const secret = "server-only-test-key-".repeat(3);
 const env = { NODE_ENV: "production", BACKEND_API_URL: "https://backend.example/api/v1/", CHECKOUT_DRAFT_SECRET: secret, APP_ORIGIN: "https://shop.example.com" };
 const result = readiness(env); assert.equal(result.status, "ready");
 assert.equal(JSON.stringify(result).includes(secret), false); assert.equal(JSON.stringify(result).includes(env.BACKEND_API_URL), false);
 assert.equal(readiness({ ...env, APP_ORIGIN: "" }).status, "not-ready"); assert.equal(readiness({ ...env, APP_ORIGIN: "http://shop.example.com" }).status, "not-ready"); assert.equal(readiness({ ...env, CHECKOUT_DRAFT_SECRET: "short" }).status, "not-ready");
 assert.equal(readiness({ ...env, BACKEND_API_URL: "https://user:secret@backend.example/api" }).status, "not-ready");
});
