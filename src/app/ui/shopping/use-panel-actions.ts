"use client";
import { shoppingText } from "@/content/fa/shopping";
import { useState } from "react";
import { removeCartItem, setCartQuantity } from "@/lib/shopping/state";
import type { ShoppingState } from "@/types/shopping";
import { useShopping } from "../use-shopping";

export function usePanelActions(storeCode: string, preview: boolean) {
  const { state, update } = useShopping(storeCode, preview);
  const [error, setError] = useState("");
  function run(operation: (current: ShoppingState) => ShoppingState, failure: string) {
    try { update(operation); setError(""); } catch { setError(failure); }
  }
  return {
    state, error,
    changeQuantity: (key: string, quantity: number) => run(current => setCartQuantity(current, key, quantity), shoppingText.quantityUpdateFailed),
    removeCart: (key: string) => run(current => removeCartItem(current, key), shoppingText.cartRemovalFailed),
    removeWishlist: (code: string) => run(current => ({ ...current, wishlist: current.wishlist.filter(item => item.code !== code) }), shoppingText.wishlistRemovalFailed),
  };
}
