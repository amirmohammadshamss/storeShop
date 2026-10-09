import { previewText } from "@/content/fa/preview";
import type { PreviewTrackingPageProps } from "@/types/routes";
import { notFound } from "next/navigation";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { TrackingView } from "../../../ui/orders/tracking-view";
export const metadata = { title: previewText.previewOrderTitle, robots: { index: false, follow: false } };
export default async function PreviewTrackingPage({ params }: PreviewTrackingPageProps) {
 const { idPursuit } = await params; const code = normalizeIdentifier(idPursuit);
 if (code !== "12345") notFound();
 return <TrackingView code={code} preview record={{ store_title: previewText.sampleStoreTitle, status_desc: previewText.sampleOrderStatus, record_date_unix_time: 1791504000, price: 285000 }} />;
}
