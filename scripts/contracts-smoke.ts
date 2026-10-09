import assert from "node:assert/strict";
const base = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3100";
const origin = new URL(base).origin;
const site = process.env.SITE_ORIGIN;
assert.ok(site);
async function html(path: string) { const response = await fetch(`${base}${path}`); assert.equal(response.status, 200, path); return response.text(); }
const health = await fetch(`${base}/api/health`); assert.equal(health.status, 200); assert.deepEqual(await health.json(), { status: "ok" });
assert.ok(health.headers.get("cache-control")?.includes("no-store"));
const ready = await fetch(`${base}/api/ready`); assert.equal(ready.status, 200);
const readyBody = await ready.text(); assert.equal(readyBody.includes(process.env.CHECKOUT_DRAFT_SECRET ?? "missing-key"), false); assert.equal(readyBody.includes(process.env.BACKEND_API_URL ?? "missing-url"), false);
const store = await html("/fixture"); assert.ok(store.includes("فروشگاه قرارداد آزمایشی")); assert.ok(store.includes(`${site}/fixture`));
const product = await html("/fixture/101"); assert.ok(product.includes("ماگ سرامیکی")); assert.ok(product.includes(`${site}/fixture/101`)); assert.ok(product.includes('type="application/ld+json"'));
const jsonLd = product.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]; assert.ok(jsonLd); const data = JSON.parse(jsonLd) as { name: string; offers?: unknown }; assert.equal(data.name, "ماگ سرامیکی"); assert.equal(data.offers, undefined);
const tracking = await html("/track/fixture-track"); assert.ok(tracking.includes("در حال آماده‌سازی")); assert.equal(tracking.includes("SHOULD_NOT_LEAK"), false);
const invoice = await html("/result/fixture-invoice"); assert.ok(invoice.includes("وضعیت پرداخت مشخص نیست")); assert.equal(invoice.includes("SHOULD_NOT_LEAK"), false);
const robots = await html("/robots.txt"); assert.ok(robots.includes("Disallow: /api/")); assert.ok(robots.includes("Disallow: /preview/"));
const sitemap = await html("/sitemap.xml"); assert.equal((sitemap.match(/<loc>/g) ?? []).length, 4); assert.ok(sitemap.includes(`${site}/fixture/101`)); assert.equal(sitemap.includes("preview"), false); assert.equal(sitemap.includes("track"), false);
async function draft(code: string) { return fetch(`${base}/api/checkout/draft`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify({ preview: false, storeCode: "fixture", productCode: code, selections: ["کرم"] }) }); }
for (const code of ["cross-store", "malformed", "redirect"]) { const response = await draft(code); assert.equal(response.status, 503, code); assert.equal((await response.text()).includes("SHOULD_NOT_LEAK"), false); assert.equal(response.headers.get("set-cookie"), null); }
const draftResponse = await draft("101"); assert.equal(draftResponse.status, 200); const cookie = draftResponse.headers.get("set-cookie")?.split(";")[0]; assert.ok(cookie);
const checkout = await fetch(`${base}/result/payment`, { headers: { Cookie: cookie } }); assert.ok((await checkout.text()).includes("ماگ سرامیکی"));
console.log("Real-route fixture contracts, metadata, private-field stripping, sitemap, health/readiness, and draft isolation passed. No live service was contacted.");
