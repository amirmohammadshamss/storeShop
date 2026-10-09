"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog/schema";
import { addToCart } from "@/lib/shopping/state";
import { useShopping } from "./use-shopping";
export function ProductPurchase({ product, preview }: { product: Product; preview: boolean }) {
 const { update } = useShopping(product.store.code, preview);
 const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const router = useRouter();
 return <form className="mt-8 space-y-5" onSubmit={async event => {
  event.preventDefault(); if (pending) return;
  const data = new FormData(event.currentTarget); setPending(true); setMessage("");
  try {
   const response = await fetch("/api/checkout/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeCode: product.store.code, productCode: product.code, preview, selections: product.features.map((_, i) => String(data.get(`feature-${i}`) ?? "")) }) });
   const result: { message?: string } = await response.json();
   if (!response.ok) { setMessage(result.message ?? "ایجاد پیش‌نویس ممکن نیست."); return; }
   router.push("/result/payment");
  } catch { setMessage("ارتباط برقرار نشد؛ دوباره تلاش کنید."); }
  finally { setPending(false); }
 }}>
 {product.features.map((feature, index) => <fieldset key={`${feature.name}-${index}`} disabled={pending}><legend className="mb-3 text-sm font-semibold">{feature.name}</legend><div className="flex flex-wrap gap-3">{feature.desc.split(",").map(value => value.trim()).filter(Boolean).map((option, i) => <label key={`${option}-${i}`} className="flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-3"><input required type="radio" name={`feature-${index}`} value={option} className="accent-teal-800" />{option}</label>)}</div></fieldset>)}
 <button type="button" disabled={pending} className="w-full rounded-xl border border-teal-800 px-5 py-3 font-medium text-teal-800 hover:bg-teal-50" onClick={event => {
  const form = event.currentTarget.form;
  if (!form || !form.reportValidity()) return;
  const data = new FormData(form);
  try { update(current => addToCart(current, product, product.features.map((_, i) => String(data.get(`feature-${i}`) ?? "")))); setMessage("محصول به سبد این فروشگاه اضافه شد."); }
  catch { setMessage("افزودن به سبد ممکن نیست؛ گزینه‌ها، فضای مرورگر و محدودیت تعداد را بررسی کنید."); }
 }}>افزودن به سبد خرید</button>
 <div className="rounded-2xl border border-stone-200 bg-white p-5"><p className="font-semibold">اطلاعات سفارش</p><p className="mt-2 text-sm leading-7 text-stone-600">{preview ? "خرید نمایشی را بررسی کنید؛ هیچ پرداختی انجام نمی‌شود." : "می‌توانید اطلاعات سفارش را بررسی کنید؛ پرداخت هنوز فعال نیست."}</p><button disabled={pending} className="mt-4 w-full rounded-xl bg-teal-800 px-5 py-3 font-medium text-white hover:bg-teal-900 disabled:opacity-50">{pending ? "در حال آماده‌سازی…" : "ادامه و بررسی سفارش"}</button></div>
 {message && <p role="status" className="text-sm text-stone-700">{message}</p>}
 </form>;
}
