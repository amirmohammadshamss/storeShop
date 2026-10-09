import assert from "node:assert/strict";

export const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
export const origin = new URL(base).origin;
export async function page(path: string, phrase: string, cookie?: string) {
 const response = await fetch(`${base}${path}`, { headers: cookie ? { Cookie: cookie } : undefined });
 const html = await response.text();
 assert.equal(response.status, 200, path); assert.ok(html.includes(phrase), `Missing expected content: ${path}`);
 if (path.startsWith("/result") || path.startsWith("/track")) {
  assert.ok(response.headers.get("cache-control")?.includes("no-store"), `Missing private cache policy: ${path}`);
  assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"), `Missing indexing protection: ${path}`);
 }
 console.log(`${path}: passed`);
}
export async function draft(body: unknown, requestOrigin = origin) {
 return fetch(`${base}/api/checkout/draft`, { method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin }, body: JSON.stringify(body) });
}
