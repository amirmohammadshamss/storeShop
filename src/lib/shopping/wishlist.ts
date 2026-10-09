import type { ProductSummary } from "@/types/catalog";
import { referenceSchema, stateSchema } from "./schema";
import type { ShoppingState } from "@/types/shopping";

export function toggleWishlist(state: ShoppingState, product: ProductSummary): ShoppingState {
 const reference = referenceSchema.parse({ code: product.code, title: product.title, price: product.price });
 const wishlist = state.wishlist.some(item => item.code === product.code) ? state.wishlist.filter(item => item.code !== product.code) : [...state.wishlist, reference];
 return stateSchema.parse({ ...state, wishlist });
}
