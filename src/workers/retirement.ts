// Classic worker source, compiled during development/build. It never handles fetches or registers a new worker.
{
 const worker = globalThis as unknown as import("@/types/workers").RetirementWorker;
 worker.addEventListener("install", event => event.waitUntil(worker.skipWaiting()));
 worker.addEventListener("activate", event => event.waitUntil((async () => {
  // Workbox's default suffix is the registration scope. Preserve caches belonging to other scopes/apps.
  try {
   if (new URL(worker.registration.scope).origin === worker.location.origin) {
    const keys = await worker.caches.keys();
    await Promise.allSettled(keys.filter(key => key.startsWith("workbox-precache-") && key.endsWith(`-${worker.registration.scope}`)).map(key => worker.caches.delete(key)));
   }
  } catch { /* Cleanup failure must not keep the old worker in control. */ }
  try { await worker.clients.claim(); } catch { /* Existing clients can refresh normally. */ }
  try { await worker.registration.unregister(); } catch { /* This fetch-less worker still bypasses old cached responses. */ }
 })()));
}
