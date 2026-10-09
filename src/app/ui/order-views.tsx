import Link from "next/link";
import type { Invoice, PaymentState, TrackingRecord } from "@/lib/orders/schema";
import { formatJalaliDate } from "@/lib/localization/dates";
import { formatPersianNumber } from "@/lib/localization/numbers";
const labels: Record<PaymentState, { title: string; description: string }> = {
 success: { title: "پرداخت تأیید شد", description: "سرویس پرداخت وضعیت موفق را گزارش کرده است." },
 failed: { title: "پرداخت ناموفق", description: "پرداخت تکمیل نشده است. پیش از تلاش دوباره وضعیت سفارش را بررسی کنید." },
 cancelled: { title: "پرداخت لغو شد", description: "پرداخت لغو شده است؛ سفارش جدیدی به‌صورت خودکار ایجاد نمی‌شود." },
 pending: { title: "در انتظار تأیید پرداخت", description: "هنوز نتیجه قطعی دریافت نشده است. این صفحه را دوباره بررسی کنید." },
 unknown: { title: "وضعیت پرداخت مشخص نیست", description: "موفقیت پرداخت تأیید نشده است. بدون بررسی وضعیت، خرید را تکرار نکنید." },
};
export function LookupUnavailable() {
 return <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-8"><h1 className="text-2xl font-bold">استعلام سفارش هنوز فعال نیست</h1><p className="leading-8 text-stone-600">اتصال و دسترسی امن به اطلاعات سفارش باید تأیید شود. برای بررسی ظاهر صفحه از نسخه نمایشی استفاده کنید.</p><Link href="/preview/track" className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">پیگیری نمایشی</Link></section>;
}
export function TrackingView({ record, code, preview = false }: { record: TrackingRecord; code: string; preview?: boolean }) {
 const fields = [{ label: "کد پیگیری", value: code }, { label: "وضعیت سفارش", value: record.status_desc }, { label: "فروشگاه", value: record.store_title }, { label: "تاریخ خرید", value: formatJalaliDate(record.record_date_unix_time) }, { label: "مبلغ", value: `${formatPersianNumber(record.price)} ${preview ? "تومان" : "واحد API"}` }];
 return <section className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-bold">پیگیری سفارش</h1>{preview && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">سفارش نمایشی — اطلاعات نمونه است و به سفارش واقعی مربوط نیست.</p>}<dl className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-6">{fields.map(field => <div key={field.label} className="flex flex-wrap justify-between gap-4 py-5"><dt className="text-stone-500">{field.label}</dt><dd className="font-medium"><bdi>{field.value}</bdi></dd></div>)}</dl><Link href={preview ? "/preview/track" : "/track"} className="inline-block text-teal-800 hover:underline">پیگیری سفارش دیگر</Link></section>;
}
export function PaymentView({ invoice, state, preview = false }: { invoice: Invoice; state: PaymentState; preview?: boolean }) {
 const label = labels[state];
 return <section className="mx-auto max-w-2xl space-y-6">{preview && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">نتیجه نمایشی — هیچ پرداختی انجام نشده است.</p>}<div className="rounded-2xl border border-stone-200 bg-white p-8"><p className="mb-3 text-sm text-stone-500">نتیجه پرداخت</p><h1 className="text-2xl font-bold">{label.title}</h1><p className="mt-4 leading-8 text-stone-600">{label.description}</p><dl className="mt-6 space-y-4"><div className="flex justify-between gap-4"><dt>شماره فاکتور</dt><dd><bdi>{invoice.invoice_id}</bdi></dd></div><div className="flex justify-between gap-4"><dt>تاریخ</dt><dd>{formatJalaliDate(invoice.create_date_unix_time)}</dd></div><div className="flex justify-between gap-4"><dt>مبلغ</dt><dd>{formatPersianNumber(invoice.amount)} {preview ? "تومان" : "واحد API"}</dd></div>{invoice.order_tracking_code && <div className="flex justify-between gap-4"><dt>کد پیگیری</dt><dd><bdi>{invoice.order_tracking_code}</bdi></dd></div>}</dl></div><Link href={preview ? "/preview/track" : "/track"} className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">پیگیری سفارش</Link>{preview && <nav aria-label="حالت‌های نمایشی پرداخت" className="flex flex-wrap gap-4 text-sm">{Object.entries(labels).map(([value, item]) => <Link key={value} className="text-teal-800 hover:underline" href={`/preview/result/${value}`}>{item.title}</Link>)}</nav>}</section>;
}
