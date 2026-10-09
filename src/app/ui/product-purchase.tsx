"use client";
import { catalogText } from "@/content/fa/catalog";
import type { ProductPurchaseProps } from "@/types/ui";

import { ProductOptions } from "./product/product-options";
import { useProductPurchase } from "./product/use-product-purchase";

export function ProductPurchase({ product, preview }: ProductPurchaseProps) {
  const { pending, message, continueCheckout, addCart } = useProductPurchase(product, preview);
  return (
    <form className="mt-8 space-y-5" onSubmit={continueCheckout}>
      <ProductOptions features={product.features} disabled={pending} />
      <button type="button" disabled={pending} className="w-full rounded-xl border border-teal-800 px-5 py-3 font-medium text-teal-800 hover:bg-teal-50"
        onClick={event => addCart(event.currentTarget.form)}>{catalogText.addToCart}</button>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <p className="font-semibold">{catalogText.orderDetails}</p>
        <p className="mt-2 text-sm leading-7 text-stone-600">{preview ? catalogText.previewCheckoutHint : catalogText.liveCheckoutHint}</p>
        <button disabled={pending} className="mt-4 w-full rounded-xl bg-teal-800 px-5 py-3 font-medium text-white hover:bg-teal-900 disabled:opacity-50">
          {pending ? catalogText.preparing : catalogText.continueCheckout}
        </button>
      </div>
      {message && <p role="status" className="text-sm text-stone-700">{message}</p>}
    </form>
  );
}
