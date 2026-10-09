"use client";
import { useState } from "react";
import type { ProductSummary } from "@/lib/catalog/schema";
import { toggleWishlist } from "@/lib/shopping/state";
import { useShopping } from "./use-shopping";
export function WishlistButton({ product, storeCode, preview }: { product: ProductSummary; storeCode: string; preview: boolean }) {
 const { state, update } = useShopping(storeCode, preview); const [error, setError] = useState("");
 const saved = state.wishlist.some(item => item.code === product.code);
 return <div><button type="button" aria-pressed={saved} aria-label={`${saved ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${product.title}`} onClick={() => {
  try { update(current => toggleWishlist(current, product)); setError(""); } catch { setError("ذخیره ممکن نیست؛ فضای مرورگر یا محدودیت ۶۰ محصول را بررسی کنید."); }
 }} className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-teal-800 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800">{saved ? "♥ ذخیره شده" : "♡ علاقه‌مندی"}</button>{error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}</div>;
}
