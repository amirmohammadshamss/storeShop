"use client";
import { useState } from "react";
import { removeCartItem, setCartQuantity, type ShoppingState } from "@/lib/shopping/state";
import { useShopping } from "../use-shopping";

export function usePanelActions(storeCode: string, preview: boolean) {
  const { state, update } = useShopping(storeCode, preview);
  const [error, setError] = useState("");
  function run(operation: (current: ShoppingState) => ShoppingState, failure: string) {
    try { update(operation); setError(""); } catch { setError(failure); }
  }
  return {
    state, error,
    changeQuantity: (key: string, quantity: number) => run(current => setCartQuantity(current, key, quantity), "به‌روزرسانی سبد ممکن نیست."),
    removeCart: (key: string) => run(current => removeCartItem(current, key), "حذف از سبد ممکن نیست."),
    removeWishlist: (code: string) => run(current => ({ ...current, wishlist: current.wishlist.filter(item => item.code !== code) }), "حذف علاقه‌مندی ممکن نیست."),
  };
}
