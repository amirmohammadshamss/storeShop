import { createServer } from "node:http";
import { fixtureStore, fixtureProducts, fixtureTracking, fixtureInvoice } from "../tests/fixtures/adminchannel";
export async function startFixtureBackend() {
 let purchases = 0;
 const server = createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://fixture.local").pathname;
  response.setHeader("Content-Type", "application/json");
  if (request.method !== "GET") { purchases++; response.writeHead(405); response.end(JSON.stringify({ error: "No mutations allowed in fixture backend" })); return; }
  if (path === "/api/v1/AdminChannel/store/get_store/fixture") { response.end(JSON.stringify(fixtureStore)); return; }
  if (path === "/api/v1/Adminchannel/product/get_products/fixture") { response.end(JSON.stringify({ Products: fixtureProducts })); return; }
  if (path.startsWith("/api/v1/AdminChannel/product/get_product/fixture/")) {
   const code = path.split("/").at(-1);
   const base = fixtureProducts[0];
   if (code === "cross-store") { response.end(JSON.stringify({ ...base, code, store: { ...fixtureStore, code: "another-store" } })); return; }
   if (code === "malformed") { response.end(JSON.stringify({ ...base, code, price: "SHOULD_NOT_LEAK" })); return; }
   if (code === "redirect") { response.writeHead(302, { Location: "https://untrusted.example/" }); response.end(); return; }
   const product = fixtureProducts.find(value => value.code === code);
   if (product) { response.end(JSON.stringify({ ...product, price: String(product.price) })); return; }
  }
  if (path === "/api/v1/AdminChannel/purchase/track_order/fixture-track") { response.end(JSON.stringify(fixtureTracking)); return; }
  if (path === "/api/v1/AdminChannel/purchase/get_payment_result/fixture-invoice") { response.end(JSON.stringify(fixtureInvoice)); return; }
  response.writeHead(404); response.end(JSON.stringify({ error: "Fixture not found" }));
 });
 await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
 const address = server.address(); if (!address || typeof address === "string") throw new Error("Fixture backend did not listen");
 return { url: `http://127.0.0.1:${address.port}/api/v1/`, purchaseCount: () => purchases, close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())) };
}
