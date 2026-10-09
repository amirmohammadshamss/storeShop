const workerPaths = new Set(["/sw.js", "/service-worker.js", "/js/serviceworker.js"]);
export function isOwnedLegacyWorker(scriptUrl: string, origin: string): boolean {
 try { const url = new URL(scriptUrl); return url.origin === origin && workerPaths.has(url.pathname); }
 catch { return false; }
}
export async function updateOwnedLegacyWorkers(registrations: readonly ServiceWorkerRegistration[], origin: string): Promise<void> {
 await Promise.allSettled(registrations.filter(registration => {
  const latestWorker = registration.installing ?? registration.waiting ?? registration.active;
  return Boolean(latestWorker && isOwnedLegacyWorker(latestWorker.scriptURL, origin));
 }).map(registration => registration.update()));
}
