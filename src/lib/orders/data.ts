import "server-only";
import { readBackend, BackendError } from "../api/client";
import { normalizeIdentifier } from "../catalog/identifiers";
import { trackingSchema, invoiceSchema } from "./schema";
export function orderLookupEnabled(): boolean { return process.env.ORDER_LOOKUP_ENABLED === "true"; }
export async function getTracking(code: string) {
 if (!orderLookupEnabled()) throw new Error("Order lookup is disabled");
 const normalized = normalizeIdentifier(code); if (!normalized) return null;
 try { return await readBackend(`AdminChannel/purchase/track_order/${encodeURIComponent(normalized)}`, trackingSchema); }
 catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
}
export async function getInvoice(code: string) {
 if (!orderLookupEnabled()) throw new Error("Order lookup is disabled");
 const normalized = normalizeIdentifier(code); if (!normalized) return null;
 try {
  const invoice = await readBackend(`AdminChannel/purchase/get_payment_result/${encodeURIComponent(normalized)}`, invoiceSchema);
  if (normalizeIdentifier(invoice.invoice_id) !== normalized) throw new BackendError("schema");
  return invoice;
 } catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
}
