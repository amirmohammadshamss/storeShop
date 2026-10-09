import { previewText } from "@/content/fa/preview";
import type { PreviewResultPageProps } from "@/types/routes";
import { notFound } from "next/navigation";
import { PaymentView } from "../../../ui/orders/payment-view";
import type { PaymentState } from "@/types/orders";
export const metadata = { title: previewText.previewResultTitle, robots: { index: false, follow: false } };
const states: PaymentState[] = ["success", "failed", "cancelled", "pending", "unknown"];
export default async function PreviewResultPage({ params }: PreviewResultPageProps) {
 const { status } = await params; const state = states.find(value => value === status); if (!state) notFound();
 return <PaymentView preview state={state} invoice={{ invoice_id: "sample-101", done: state === "success", amount: 285000, create_date_unix_time: 1791504000, order_tracking_code: "12345" }} />;
}
