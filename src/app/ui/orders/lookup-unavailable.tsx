import Link from "next/link";

export function LookupUnavailable() {
  return (
    <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-8">
      <h1 className="text-2xl font-bold">استعلام سفارش هنوز فعال نیست</h1>
      <p className="leading-8 text-stone-600">اتصال و دسترسی امن به اطلاعات سفارش باید تأیید شود. برای بررسی ظاهر صفحه از نسخه نمایشی استفاده کنید.</p>
      <Link href="/preview/track" className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">پیگیری نمایشی</Link>
    </section>
  );
}
