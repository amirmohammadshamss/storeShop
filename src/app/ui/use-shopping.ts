"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { parseShopping, shoppingStorageKey, type ShoppingState } from "@/lib/shopping/state";
const changedEvent = "storeshop-shopping-change";
export function useShopping(storeCode: string, preview: boolean) {
 const key = shoppingStorageKey(storeCode, preview);
 const getSnapshot = useCallback(() => { try { return window.localStorage.getItem(key) ?? ""; } catch { return ""; } }, [key]);
 const subscribe = useCallback((notify: () => void) => {
  const listener = (event: Event) => {
   if (event instanceof StorageEvent && event.key !== key && event.key !== null) return;
   if (event instanceof CustomEvent && event.detail !== key) return;
   notify();
  };
  window.addEventListener("storage", listener); window.addEventListener(changedEvent, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(changedEvent, listener); };
 }, [key]);
 const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
 const state = useMemo(() => parseShopping(raw, storeCode, preview), [raw, storeCode, preview]);
 const update = useCallback((operation: (current: ShoppingState) => ShoppingState) => {
  const current = parseShopping(window.localStorage.getItem(key) ?? "", storeCode, preview);
  const next = operation(current);
  window.localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(changedEvent, { detail: key }));
 }, [key, storeCode, preview]);
 return { state, update };
}
