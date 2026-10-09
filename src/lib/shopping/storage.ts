import { stateSchema, type ShoppingState } from "./schema";

export function emptyShopping(storeCode: string, preview: boolean): ShoppingState { return { version: 1, storeCode, preview, cart: [], wishlist: [] }; }
export function shoppingStorageKey(storeCode: string, preview: boolean): string { return `storeshop:shopping:v1:${preview ? "preview" : "live"}:${storeCode}`; }
export function parseShopping(raw: string, storeCode: string, preview: boolean): ShoppingState {
 if (raw.length > 100000) return emptyShopping(storeCode, preview);
 try { const result = stateSchema.parse(JSON.parse(raw)); return result.storeCode === storeCode && result.preview === preview ? result : emptyShopping(storeCode, preview); }
 catch { return emptyShopping(storeCode, preview); }
}
