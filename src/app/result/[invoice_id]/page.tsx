import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoice, orderLookupEnabled } from "@/lib/orders/data";
import { legacyPaymentState } from "@/lib/orders/schema";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { LookupUnavailable } from "../../ui/orders/lookup-unavailable";
import { PaymentView } from "../../ui/orders/payment-view";
export const metadata: Metadata = { title: "نتیجه پرداخت", robots: { index: false, follow: false } };
export default async function InvoicePage({ params }: { params: Promise<{ invoice_id: string }> }) {
 const { invoice_id } = await params; const code = normalizeIdentifier(invoice_id); if (!code) notFound();
 if (!orderLookupEnabled()) return <LookupUnavailable />;
 const invoice = await getInvoice(code); if (!invoice) notFound();
 return <PaymentView invoice={invoice} state={legacyPaymentState(invoice)} />;
}
