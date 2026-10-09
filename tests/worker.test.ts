import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { retirementWorker } from "../src/generated/retirement-worker";
import { isOwnedLegacyWorker, updateOwnedLegacyWorkers } from "../src/lib/worker-retirement";
type LifecycleEvent = { waitUntil(promise: Promise<unknown>): void };
function workerHarness({ cacheFailure = false, claimFailure = false } = {}) {
 const handlers = new Map<string, (event: LifecycleEvent) => void>();
 const deleted: string[] = []; const events: string[] = [];
 const scope = "https://example.com/";
 vm.runInNewContext(retirementWorker, {
  URL,
  location: { origin: "https://example.com" },
  registration: { scope, unregister: async () => { events.push("unregister"); return true; } },
  caches: { keys: async () => { if (cacheFailure) throw new Error("cache unavailable"); return [`workbox-precache-v2-${scope}`, `workbox-precache-v1-${scope}`, "other-app-cache", "workbox-precache-v2-https://example.com/other/", "workbox-runtime-https://example.com/"]; }, delete: async (key: string) => { deleted.push(key); return true; } },
  clients: { claim: async () => { events.push("claim"); if (claimFailure) throw new Error("claim unavailable"); } },
  skipWaiting: async () => { events.push("skipWaiting"); },
  addEventListener: (name: string, handler: (event: LifecycleEvent) => void) => handlers.set(name, handler),
 });
 async function dispatch(name: string) { let completion: Promise<unknown> | undefined; handlers.get(name)?.({ waitUntil: promise => { completion = promise; } }); assert.ok(completion); await completion; }
 return { handlers, deleted, events, dispatch };
}
test("compiled retirement worker bypasses waiting, removes only owned precaches, and unregisters", async () => {
 const worker = workerHarness();
 assert.equal(worker.handlers.has("fetch"), false);
 await worker.dispatch("install"); await worker.dispatch("activate");
 assert.deepEqual(worker.events, ["skipWaiting", "claim", "unregister"]);
 assert.deepEqual(worker.deleted.sort(), ["workbox-precache-v1-https://example.com/", "workbox-precache-v2-https://example.com/"]);
});
test("retirement still unregisters when cache access or client claiming fails", async () => {
 const cache = workerHarness({ cacheFailure: true }); await cache.dispatch("activate"); assert.deepEqual(cache.events, ["claim", "unregister"]);
 const claim = workerHarness({ claimFailure: true }); await claim.dispatch("activate"); assert.deepEqual(claim.events, ["claim", "unregister"]);
});
test("owned worker detection excludes other origins and script paths", () => {
 assert.equal(isOwnedLegacyWorker("https://example.com/sw.js", "https://example.com"), true);
 assert.equal(isOwnedLegacyWorker("https://example.com/service-worker.js", "https://example.com"), true);
 assert.equal(isOwnedLegacyWorker("https://example.com/js/serviceworker.js", "https://example.com"), true);
 assert.equal(isOwnedLegacyWorker("https://other.example/sw.js", "https://example.com"), false);
 assert.equal(isOwnedLegacyWorker("https://example.com/other/sw.js", "https://example.com"), false);
 assert.equal(isOwnedLegacyWorker("bad URL", "https://example.com"), false);
});
test("client updates owned registrations only and preserves newer unrelated workers", async () => {
 const updated: string[] = [];
 function registration(active: string, waiting?: string): ServiceWorkerRegistration {
  return { active: { scriptURL: active }, waiting: waiting ? { scriptURL: waiting } : null, installing: null, update: async () => { updated.push(active); } } as unknown as ServiceWorkerRegistration;
 }
 await updateOwnedLegacyWorkers([
  registration("https://example.com/sw.js"),
  registration("https://other.example/sw.js"),
  registration("https://example.com/other-worker.js"),
  registration("https://example.com/service-worker.js", "https://example.com/new-worker.js"),
 ], "https://example.com");
 assert.deepEqual(updated, ["https://example.com/sw.js"]);
});
