"use client";
import { useId, useState } from "react";
import type { ProductSummary } from "@/lib/catalog/schema";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { usePanelActions } from "./shopping/use-panel-actions";
import { CartContent } from "./shopping/cart-content";
import { WishlistContent } from "./shopping/wishlist-content";

type Props = { storeCode: string; preview: boolean; basePath: string; products?: ProductSummary[] };

export function ShoppingPanel({ storeCode, preview, basePath, products }: Props) {
  const { state, error, changeQuantity, removeCart, removeWishlist } = usePanelActions(storeCode, preview);
  const [open, setOpen] = useState<"cart" | "wishlist" | null>(null);
  const id = useId();
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const unavailable = (code: string) => products !== undefined && !products.some(product => product.code === code);
  return (
    <section className="space-y-4" aria-label="سبد خرید و علاقه‌مندی‌های این فروشگاه">
      <div className="flex flex-wrap gap-3">
        <button aria-controls={id} aria-expanded={open === "cart"} onClick={() => setOpen(open === "cart" ? null : "cart")} className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium">سبد خرید ({formatPersianNumber(quantity)})</button>
        <button aria-controls={id} aria-expanded={open === "wishlist"} onClick={() => setOpen(open === "wishlist" ? null : "wishlist")} className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium">علاقه‌مندی‌ها ({formatPersianNumber(state.wishlist.length)})</button>
        <p className="self-center text-xs text-stone-500">فقط در این مرورگر و برای همین فروشگاه ذخیره می‌شود.</p>
      </div>
      {open && (
        <div id={id} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-bold">{open === "cart" ? "سبد خرید" : "علاقه‌مندی‌ها"}</h2>
          {open === "cart" ? <CartContent items={state.cart} id={id} basePath={basePath} preview={preview} unavailable={unavailable} onQuantity={changeQuantity} onRemove={removeCart} /> :
            <WishlistContent items={state.wishlist} basePath={basePath} unavailable={unavailable} onRemove={removeWishlist} />}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button onClick={() => setOpen(null)} className="text-sm text-stone-600 hover:underline">بستن</button>
        </div>
      )}
    </section>
  );
}
