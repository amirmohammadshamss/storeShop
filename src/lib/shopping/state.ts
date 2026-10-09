import { z } from "zod";
import type { Product, ProductSummary } from "../catalog/schema";
import { validateSelections } from "../checkout/validation";
const referenceSchema = z.object({ code: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/), title: z.string().min(1).max(1000), price: z.number().int().nonnegative().safe() }).strict();
const cartItemSchema = referenceSchema.extend({ selections: z.array(z.string().max(200)).max(20), optionNames: z.array(z.string().min(1).max(200)).max(20), quantity: z.number().int().min(1).max(99) }).refine(value => value.optionNames.length === value.selections.length);
export type ProductReference = z.infer<typeof referenceSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export function variantKey(item: Pick<CartItem, "code" | "selections">): string { return JSON.stringify([item.code, ...item.selections]); }
const stateSchema = z.object({
 version: z.literal(1), storeCode: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/), preview: z.boolean(),
 cart: z.array(cartItemSchema).max(60).refine(items => new Set(items.map(variantKey)).size === items.length),
 wishlist: z.array(referenceSchema).max(60).refine(items => new Set(items.map(item => item.code)).size === items.length),
}).strict();
export type ShoppingState = z.infer<typeof stateSchema>;
export function emptyShopping(storeCode: string, preview: boolean): ShoppingState { return { version: 1, storeCode, preview, cart: [], wishlist: [] }; }
export function shoppingStorageKey(storeCode: string, preview: boolean): string { return `storeshop:shopping:v1:${preview ? "preview" : "live"}:${storeCode}`; }
export function parseShopping(raw: string, storeCode: string, preview: boolean): ShoppingState {
 if (raw.length > 100000) return emptyShopping(storeCode, preview);
 try { const result = stateSchema.parse(JSON.parse(raw)); return result.storeCode === storeCode && result.preview === preview ? result : emptyShopping(storeCode, preview); }
 catch { return emptyShopping(storeCode, preview); }
}
export function toggleWishlist(state: ShoppingState, product: ProductSummary): ShoppingState {
 const reference = referenceSchema.parse({ code: product.code, title: product.title, price: product.price });
 const wishlist = state.wishlist.some(item => item.code === product.code) ? state.wishlist.filter(item => item.code !== product.code) : [...state.wishlist, reference];
 return stateSchema.parse({ ...state, wishlist });
}
export function addToCart(state: ShoppingState, product: Product, selections: string[]): ShoppingState {
 if (product.store.code !== state.storeCode || !validateSelections(product, selections)) throw new Error("Invalid store or options");
 const item = cartItemSchema.parse({ code: product.code, title: product.title, price: product.price, selections, optionNames: product.features.map(feature => feature.name), quantity: 1 });
 const key = variantKey(item); const existing = state.cart.find(value => variantKey(value) === key);
 const cart = existing ? state.cart.map(value => variantKey(value) === key ? { ...item, quantity: value.quantity + 1 } : value) : [...state.cart, item];
 return stateSchema.parse({ ...state, cart });
}
export function setCartQuantity(state: ShoppingState, key: string, quantity: number): ShoppingState {
 return stateSchema.parse({ ...state, cart: state.cart.map(item => variantKey(item) === key ? { ...item, quantity } : item) });
}
export function removeCartItem(state: ShoppingState, key: string): ShoppingState { return { ...state, cart: state.cart.filter(item => variantKey(item) !== key) }; }
export function estimatedCartTotal(cart: CartItem[]): number | null {
 let total = 0;
 for (const item of cart) { total += item.price * item.quantity; if (!Number.isSafeInteger(total)) return null; }
 return total;
}
