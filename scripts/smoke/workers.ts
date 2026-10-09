import assert from "node:assert/strict";
import { base } from "./client";

export async function verifyWorkers() {
  for (const path of ["/sw.js", "/service-worker.js", "/js/serviceworker.js"]) {
    const response = await fetch(`${base}${path}`); assert.equal(response.status, 200, path);
    assert.ok(response.headers.get("content-type")?.startsWith("application/javascript"));
    assert.ok(response.headers.get("cache-control")?.includes("no-store"));
    assert.equal(response.headers.get("service-worker-allowed"), "/");
    const script = await response.text();
    assert.ok(script.includes("registration.unregister")); assert.ok(script.includes("workbox-precache-"));
    assert.equal(script.includes("importScripts("), false); assert.equal(script.includes('addEventListener("fetch"'), false);
    console.log(`${path}: retirement handler passed`);
  }
  const oldShell = await fetch(`${base}/index.html`);
  const oldHtml = await oldShell.text();
  assert.ok(oldHtml.includes("صفحه پیدا نشد")); assert.ok(oldHtml.includes("noindex"));
  assert.equal(oldHtml.includes('<div id="root">'), false);
  console.log("Legacy SPA shell is no longer served.");
}
