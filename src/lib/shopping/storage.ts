import { SHOPPING_VERSION, SHOPPING_STORAGE_PREFIX, MAX_SHOPPING_STORAGE_LENGTH } from "@/constants/shopping";
import { stateSchema } from "./schema";
import type { ShoppingState } from "@/types/shopping";

export function emptyShopping(storeCode: string, preview: boolean): ShoppingState { return { version: SHOPPING_VERSION, storeCode, preview, cart: [], wishlist: [] }; }
export function shoppingStorageKey(storeCode: string, preview: boolean): string { return `${SHOPPING_STORAGE_PREFIX}${preview ? "preview" : "live"}:${storeCode}`; }
export function parseShopping(raw: string, storeCode: string, preview: boolean): ShoppingState {
 if (raw.length > MAX_SHOPPING_STORAGE_LENGTH) return emptyShopping(storeCode, preview);
 try { const result = stateSchema.parse(JSON.parse(raw)); return result.storeCode === storeCode && result.preview === preview ? result : emptyShopping(storeCode, preview); }
 catch { return emptyShopping(storeCode, preview); }
}
