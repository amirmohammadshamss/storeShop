import { commonText } from "@/content/fa/common";
import { ordersText } from "@/content/fa/orders";
import type { Metadata } from "next";
import Link from "next/link";
import { orderLookupEnabled } from "@/lib/orders/data";
import { CodeForm } from "../ui/code-form";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: commonText.trackOrder, robots: { index: false, follow: false } };
export default function TrackPage() {
 const enabled = orderLookupEnabled();
 return <section className="mx-auto max-w-xl space-y-6 rounded-2xl border border-stone-200 bg-white p-8"><h1 className="text-2xl font-bold">{commonText.trackOrder}</h1>{enabled ? <><p className="leading-8 text-stone-600">{ordersText.enterTrackingCode}</p><CodeForm basePath="/track" kind="tracking" /></> : <p className="leading-8 text-stone-600">{ordersText.liveLookupDisabled}</p>}<Link href="/preview/track" className="inline-block text-teal-800 hover:underline">{ordersText.viewPreviewTracking}</Link></section>;
}
