import Link from "next/link";
import type { Product } from "@/lib/catalog/schema";
import type { Draft } from "@/lib/checkout/draft";
import { formatPersianNumber } from "@/lib/localization/numbers";

export function CheckoutSummary({ product, draft }: { product: Product; draft: Draft }) {
  return (
    <aside className="space-y-5 rounded-2xl bg-teal-900 p-6 text-white">
      <h2 className="text-xl font-bold">خلاصه سفارش</h2>
      <p>{product.title}</p>
      <p className="text-sm text-teal-100">{product.store.title}</p>
      {product.features.map((feature, i) => <p key={`${feature.name}-${i}`} className="text-sm">{feature.name}: {draft.selections[i]}</p>)}
      <p className="text-2xl font-semibold">{formatPersianNumber(product.price)} <span className="text-sm">{draft.preview ? "تومان" : "واحد API"}</span></p>
      <p className="text-xs leading-6 text-teal-100">اطلاعات محصول هنگام باز کردن این صفحه دوباره دریافت می‌شود. موجودی، هزینه ارسال و مبلغ نهایی پرداخت هنوز تأیید نشده‌اند. پیش‌نویس پس از ۳۰ دقیقه منقضی می‌شود.</p>
      {draft.preview && <Link href="/preview/result/success" className="block text-sm underline underline-offset-4">مشاهده حالت‌های نمایشی پرداخت</Link>}
    </aside>
  );
}
