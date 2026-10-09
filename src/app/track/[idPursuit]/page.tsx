import { ordersText } from "@/content/fa/orders";
import type { TrackingPageProps } from "@/types/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTracking, orderLookupEnabled } from "@/lib/orders/data";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { LookupUnavailable } from "../../ui/orders/lookup-unavailable";
import { TrackingView } from "../../ui/orders/tracking-view";
export const metadata: Metadata = { title: ordersText.orderStatus, robots: { index: false, follow: false } };
export default async function TrackingPage({ params }: TrackingPageProps) {
 const { idPursuit } = await params; const code = normalizeIdentifier(idPursuit); if (!code) notFound();
 if (!orderLookupEnabled()) return <LookupUnavailable />;
 const record = await getTracking(code); if (!record) notFound();
 return <TrackingView record={record} code={code} />;
}
