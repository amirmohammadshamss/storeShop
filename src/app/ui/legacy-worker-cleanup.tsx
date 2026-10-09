"use client";
import { useEffect } from "react";
import { updateOwnedLegacyWorkers } from "@/lib/worker-retirement";
export function LegacyWorkerCleanup() {
 useEffect(() => {
  if (!("serviceWorker" in navigator)) return;
  void navigator.serviceWorker.getRegistrations().then(registrations => updateOwnedLegacyWorkers(registrations, window.location.origin)).catch(() => undefined);
 }, []);
 return null;
}
