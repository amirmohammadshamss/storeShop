import { commonText } from "@/content/fa/common";
import { ordersText } from "@/content/fa/orders";
import type { TrackingViewProps } from "@/types/ui";
import Link from "next/link";

import { formatJalaliDate } from "@/lib/localization/dates";
import { formatPersianNumber } from "@/lib/localization/numbers";

export function TrackingView({ record, code, preview = false }: TrackingViewProps) {
  const fields = [
    { label: commonText.trackingCode, value: code },
    { label: ordersText.orderStatus, value: record.status_desc },
    { label: commonText.store, value: record.store_title },
    { label: ordersText.purchaseDate, value: formatJalaliDate(record.record_date_unix_time) },
    { label: commonText.amount, value: `${formatPersianNumber(record.price)} ${preview ? commonText.toman : commonText.apiUnit}` },
  ];
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">{commonText.trackOrder}</h1>
      {preview && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{ordersText.previewTrackingNotice}</p>}
      <dl className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-6">
        {fields.map(field => (
          <div key={field.label} className="flex flex-wrap justify-between gap-4 py-5">
            <dt className="text-stone-500">{field.label}</dt>
            <dd className="font-medium"><bdi>{field.value}</bdi></dd>
          </div>
        ))}
      </dl>
      <Link href={preview ? "/preview/track" : "/track"} className="inline-block text-teal-800 hover:underline">{ordersText.trackAnotherOrder}</Link>
    </section>
  );
}
