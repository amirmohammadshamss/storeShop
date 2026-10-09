import { notFound } from "next/navigation";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { TrackingView } from "../../../ui/order-views";
export const metadata = { title: "سفارش نمایشی", robots: { index: false, follow: false } };
export default async function PreviewTrackingPage({ params }: { params: Promise<{ idPursuit: string }> }) {
 const { idPursuit } = await params; const code = normalizeIdentifier(idPursuit);
 if (code !== "12345") notFound();
 return <TrackingView code={code} preview record={{ store_title: "خانه و زندگی", status_desc: "در حال آماده‌سازی", record_date_unix_time: 1791504000, price: 285000 }} />;
}
