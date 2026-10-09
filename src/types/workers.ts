export type LifecycleEvent = { waitUntil(promise: Promise<unknown>): void};
export type RetirementWorker = {
  registration: { scope: string; unregister(): Promise<boolean>};
  location: { origin: string};
  caches: CacheStorage;
  clients: { claim(): Promise<void>};
  skipWaiting(): Promise<void>;
  addEventListener(type: "install" | "activate", listener: (event: LifecycleEvent) => void): void;
};
