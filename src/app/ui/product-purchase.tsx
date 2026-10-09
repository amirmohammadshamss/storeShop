"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog/schema";
export function ProductPurchase({ product, preview }: { product: Product; preview: boolean }) {
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
 <div className="rounded-2xl border border-stone-200 bg-white p-5"><p className="font-semibold">اطلاعات سفارش</p><p className="mt-2 text-sm leading-7 text-stone-600">{preview ? "خرید نمایشی را بررسی کنید؛ هیچ پرداختی انجام نمی‌شود." : "می‌توانید اطلاعات سفارش را بررسی کنید؛ پرداخت هنوز فعال نیست."}</p><button disabled={pending} className="mt-4 w-full rounded-xl bg-teal-800 px-5 py-3 font-medium text-white hover:bg-teal-900 disabled:opacity-50">{pending ? "در حال آماده‌سازی…" : "ادامه و بررسی سفارش"}</button></div>
 {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
 </form>;
}
