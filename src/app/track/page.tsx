import type { Metadata } from "next";
import Link from "next/link";
import { orderLookupEnabled } from "@/lib/orders/data";
import { CodeForm } from "../ui/code-form";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "پیگیری سفارش", robots: { index: false, follow: false } };
export default function TrackPage() {
 const enabled = orderLookupEnabled();
 return <section className="mx-auto max-w-xl space-y-6 rounded-2xl border border-stone-200 bg-white p-8"><h1 className="text-2xl font-bold">پیگیری سفارش</h1>{enabled ? <><p className="leading-8 text-stone-600">کد پیگیری خود را وارد کنید.</p><CodeForm basePath="/track" kind="tracking" /></> : <p className="leading-8 text-stone-600">استعلام واقعی تا تأیید اتصال و دسترسی امن به سفارش‌ها فعال نیست.</p>}<Link href="/preview/track" className="inline-block text-teal-800 hover:underline">مشاهده پیگیری نمایشی ←</Link></section>;
}
