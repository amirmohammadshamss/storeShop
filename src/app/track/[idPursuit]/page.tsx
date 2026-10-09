import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTracking, orderLookupEnabled } from "@/lib/orders/data";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { LookupUnavailable, TrackingView } from "../../ui/order-views";
export const metadata: Metadata = { title: "وضعیت سفارش", robots: { index: false, follow: false } };
export default async function TrackingPage({ params }: { params: Promise<{ idPursuit: string }> }) {
 const { idPursuit } = await params; const code = normalizeIdentifier(idPursuit); if (!code) notFound();
 if (!orderLookupEnabled()) return <LookupUnavailable />;
 const record = await getTracking(code); if (!record) notFound();
 return <TrackingView record={record} code={code} />;
}
