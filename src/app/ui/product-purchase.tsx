"use client";
import type { Product } from "@/lib/catalog/schema";
import { ProductOptions } from "./product/product-options";
import { useProductPurchase } from "./product/use-product-purchase";

export function ProductPurchase({ product, preview }: { product: Product; preview: boolean }) {
  const { pending, message, continueCheckout, addCart } = useProductPurchase(product, preview);
  return (
    <form className="mt-8 space-y-5" onSubmit={continueCheckout}>
      <ProductOptions features={product.features} disabled={pending} />
      <button type="button" disabled={pending} className="w-full rounded-xl border border-teal-800 px-5 py-3 font-medium text-teal-800 hover:bg-teal-50"
        onClick={event => addCart(event.currentTarget.form)}>افزودن به سبد خرید</button>
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <p className="font-semibold">اطلاعات سفارش</p>
        <p className="mt-2 text-sm leading-7 text-stone-600">{preview ? "خرید نمایشی را بررسی کنید؛ هیچ پرداختی انجام نمی‌شود." : "می‌توانید اطلاعات سفارش را بررسی کنید؛ پرداخت هنوز فعال نیست."}</p>
        <button disabled={pending} className="mt-4 w-full rounded-xl bg-teal-800 px-5 py-3 font-medium text-white hover:bg-teal-900 disabled:opacity-50">
          {pending ? "در حال آماده‌سازی…" : "ادامه و بررسی سفارش"}
        </button>
      </div>
      {message && <p role="status" className="text-sm text-stone-700">{message}</p>}
    </form>
  );
}
