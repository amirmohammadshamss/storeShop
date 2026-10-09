"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { customerSchema } from "@/lib/checkout/validation";
export function CheckoutForm({ preview, backPath }: { preview: boolean; backPath: string }) {
 const [errors, setErrors] = useState<Record<string, string>>({}); const [reviewed, setReviewed] = useState(false); const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const router = useRouter();
 const fields = [{ name: "full_name", label: "نام و نام خانوادگی", type: "text" }, { name: "mobile", label: "شماره موبایل", type: "tel" }, { name: "email", label: "ایمیل (اختیاری)", type: "email" }, { name: "address", label: "آدرس", type: "text" }, { name: "description", label: "توضیحات سفارش (اختیاری)", type: "text" }];
 return <form noValidate className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6" onChange={() => setReviewed(false)} onSubmit={event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget)); const result = customerSchema.safeParse(data);
  const nextErrors: Record<string, string> = {};
  if (!result.success) for (const issue of result.error.issues) nextErrors[String(issue.path[0])] = issue.message;
  setErrors(nextErrors); setReviewed(result.success);
  const firstError = Object.keys(nextErrors)[0];
  if (firstError) {
   const input = event.currentTarget.elements.namedItem(firstError);
   if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.focus();
  }
 }}>
 <h2 className="text-xl font-bold">اطلاعات خریدار</h2><p className="text-sm leading-7 text-stone-600">{preview ? "برای بررسی فرم از اطلاعات نمونه استفاده کنید. " : ""}اطلاعات این فرم در مرورگر ذخیره یا برای خرید ارسال نمی‌شود. با تازه‌سازی صفحه باید دوباره وارد شود.</p>
 {fields.map(field => <div key={field.name}><label htmlFor={field.name} className="mb-2 block text-sm font-medium">{field.label}</label>{["address", "description"].includes(field.name) ? <textarea id={field.name} name={field.name} rows={3} maxLength={1000} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-700/30" /> : <input id={field.name} name={field.name} type={field.type} autoComplete="off" maxLength={150} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-700/30" />}{errors[field.name] && <p id={`${field.name}-error`} className="mt-2 text-sm text-red-700">{errors[field.name]}</p>}</div>)}
 <button className="w-full rounded-xl bg-teal-800 px-5 py-3 text-white hover:bg-teal-900">بررسی اطلاعات</button>
 {reviewed && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">اطلاعات معتبر است. پرداخت هنوز فعال نیست و هیچ سفارشی ثبت نشده است.</p>}
 <button disabled className="w-full rounded-xl bg-stone-200 px-5 py-3 text-stone-500">پرداخت غیرفعال است</button>
 <div className="flex items-center justify-between gap-3 text-sm"><Link href={backPath} className="text-teal-800 hover:underline">ویرایش محصول</Link><button type="button" disabled={pending} className="text-stone-600 hover:underline" onClick={async () => { setPending(true); try { const response = await fetch("/api/checkout/draft", { method: "DELETE" }); if (response.ok) { router.replace(backPath); router.refresh(); } else setMessage("حذف پیش‌نویس ممکن نیست."); } catch { setMessage("ارتباط برقرار نشد."); } finally { setPending(false); } }}>حذف پیش‌نویس</button></div>
 {message && <p role="alert" className="text-red-700">{message}</p>}
 </form>;
}
