import { ordersText } from "@/content/fa/orders";
import Link from "next/link";

export function LookupUnavailable() {
  return (
    <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-8">
      <h1 className="text-2xl font-bold">{ordersText.lookupDisabledTitle}</h1>
      <p className="leading-8 text-stone-600">{ordersText.lookupDisabledNotice}</p>
      <Link href="/preview/track" className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">{ordersText.previewTracking}</Link>
    </section>
  );
}
