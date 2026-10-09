import Link from "next/link";
import type { TrackingRecord } from "@/lib/orders/schema";
import { formatJalaliDate } from "@/lib/localization/dates";
import { formatPersianNumber } from "@/lib/localization/numbers";

export function TrackingView({ record, code, preview = false }: { record: TrackingRecord; code: string; preview?: boolean }) {
  const fields = [
    { label: "کد پیگیری", value: code },
    { label: "وضعیت سفارش", value: record.status_desc },
    { label: "فروشگاه", value: record.store_title },
    { label: "تاریخ خرید", value: formatJalaliDate(record.record_date_unix_time) },
    { label: "مبلغ", value: `${formatPersianNumber(record.price)} ${preview ? "تومان" : "واحد API"}` },
  ];
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">پیگیری سفارش</h1>
      {preview && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">سفارش نمایشی — اطلاعات نمونه است و به سفارش واقعی مربوط نیست.</p>}
      <dl className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-6">
        {fields.map(field => (
          <div key={field.label} className="flex flex-wrap justify-between gap-4 py-5">
            <dt className="text-stone-500">{field.label}</dt>
            <dd className="font-medium"><bdi>{field.value}</bdi></dd>
          </div>
        ))}
      </dl>
      <Link href={preview ? "/preview/track" : "/track"} className="inline-block text-teal-800 hover:underline">پیگیری سفارش دیگر</Link>
    </section>
  );
}
