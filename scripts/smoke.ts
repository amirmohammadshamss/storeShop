import assert from "node:assert/strict";
const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const origin = new URL(base).origin;
async function page(path: string, phrase: string, cookie?: string) {
 const response = await fetch(`${base}${path}`, { headers: cookie ? { Cookie: cookie } : undefined });
 const html = await response.text();
 assert.equal(response.status, 200, path); assert.ok(html.includes(phrase), `Missing expected content: ${path}`);
 if (path.startsWith("/result") || path.startsWith("/track")) {
  assert.ok(response.headers.get("cache-control")?.includes("no-store"), `Missing private cache policy: ${path}`);
  assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"), `Missing indexing protection: ${path}`);
 }
 console.log(`${path}: passed`);
}
async function draft(body: unknown, requestOrigin = origin) {
 return fetch(`${base}/api/checkout/draft`, { method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin }, body: JSON.stringify(body) });
}
const input = { preview: true, storeCode: "sample", productCode: "101", selections: ["کرم"] };
await page("/result/payment", "پیش‌نویس خرید در دسترس نیست");
assert.equal((await draft(input, "https://untrusted.example")).status, 403);
assert.equal((await draft({ ...input, selections: ["wrong"] })).status, 400);
assert.equal((await draft({ ...input, productCode: "../101" })).status, 400);
const response = await draft(input); assert.equal(response.status, 200);
assert.ok(response.headers.get("cache-control")?.includes("no-store"));
const setCookie = response.headers.get("set-cookie"); assert.ok(setCookie);
assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=Lax/i); assert.match(setCookie, /Max-Age=1800/i);
const cookie = setCookie.split(";")[0];
await page("/result/payment", "ماگ سرامیکی", cookie);
await page("/result/payment", "خلاصه سفارش", cookie);
await page("/result/payment", "پیش‌نویس خرید در دسترس نیست", cookie.slice(0, -5) + "wrong");
const customer = { full_name: "خریدار نمونه", mobile: "۰۹۱۲۳۴۵۶۷۸۹", email: "", address: "آدرس نمونه برای تست", description: "توضیح نمونه" };
const purchase = await fetch(`${base}/api/checkout`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie }, body: JSON.stringify(customer) });
assert.equal(purchase.status, 503); assert.ok((await purchase.text()).includes("هیچ خرید یا پرداختی"));
await page("/track", "استعلام واقعی");
await page("/track/12345", "استعلام سفارش هنوز فعال نیست");
await page("/result/example", "استعلام سفارش هنوز فعال نیست");
await page("/preview/track/12345", "در حال آماده‌سازی");
for (const [state, phrase] of [["success", "پرداخت تأیید شد"], ["failed", "پرداخت ناموفق"], ["cancelled", "پرداخت لغو شد"], ["pending", "در انتظار تأیید پرداخت"], ["unknown", "وضعیت پرداخت مشخص نیست"]]) await page(`/preview/result/${state}`, phrase);
const deleted = await fetch(`${base}/api/checkout/draft`, { method: "DELETE", headers: { Origin: origin, Cookie: cookie } });
assert.equal(deleted.status, 200); assert.match(deleted.headers.get("set-cookie") ?? "", /Max-Age=0/i);
console.log("Draft integrity, private caching, disabled payment and preview order states passed. No real purchases were made.");
