"use client";
import { customerFields } from "@/lib/checkout/fields";
import { CustomerField } from "./checkout/customer-field";
import { DraftActions } from "./checkout/draft-actions";
import { useCustomerReview } from "./checkout/use-customer-review";

export function CheckoutForm({ preview, backPath }: { preview: boolean; backPath: string }) {
  const { errors, reviewed, review, clearReview } = useCustomerReview();
  return (
    <form noValidate className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6" onChange={clearReview} onSubmit={review}>
      <h2 className="text-xl font-bold">اطلاعات خریدار</h2>
      <p className="text-sm leading-7 text-stone-600">
        {preview ? "برای بررسی فرم از اطلاعات نمونه استفاده کنید. " : ""}
        اطلاعات این فرم در مرورگر ذخیره یا برای خرید ارسال نمی‌شود. با تازه‌سازی صفحه باید دوباره وارد شود.
      </p>
      {customerFields.map(field => <CustomerField key={field.name} field={field} error={errors[field.name]} />)}
      <button className="w-full rounded-xl bg-teal-800 px-5 py-3 text-white hover:bg-teal-900">بررسی اطلاعات</button>
      {reviewed && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">اطلاعات معتبر است. پرداخت هنوز فعال نیست و هیچ سفارشی ثبت نشده است.</p>}
      <button disabled className="w-full rounded-xl bg-stone-200 px-5 py-3 text-stone-500">پرداخت غیرفعال است</button>
      <DraftActions backPath={backPath} />
    </form>
  );
}
