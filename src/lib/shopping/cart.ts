import { technicalText } from "@/content/technical";
import type { Product } from "@/types/catalog";
import { validateSelections } from "../checkout/validation";
import { cartItemSchema, stateSchema, variantKey } from "./schema";
import type { CartItem } from "@/types/shopping";
import type { ShoppingState } from "@/types/shopping";

export function addToCart(state: ShoppingState, product: Product, selections: string[]): ShoppingState {
 if (product.store.code !== state.storeCode || !validateSelections(product, selections)) throw new Error(technicalText.invalidStoreOptions);
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
