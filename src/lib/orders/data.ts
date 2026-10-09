import { technicalText } from "@/content/technical";
import { getServerEnv } from "@/config/env.server";
import { API_PATHS } from "@/constants/api";
import "server-only";
import { readBackend, BackendError } from "../api/client";
import { normalizeIdentifier } from "../catalog/identifiers";
import { trackingSchema, invoiceSchema } from "./schema";
export function orderLookupEnabled(): boolean { return getServerEnv().ORDER_LOOKUP_ENABLED === "true"; }
export async function getTracking(code: string) {
 if (!orderLookupEnabled()) throw new Error(technicalText.orderLookupDisabled);
 const normalized = normalizeIdentifier(code); if (!normalized) return null;
 try { return await readBackend(`${API_PATHS.tracking}${encodeURIComponent(normalized)}`, trackingSchema); }
 catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
}
export async function getInvoice(code: string) {
 if (!orderLookupEnabled()) throw new Error(technicalText.orderLookupDisabled);
 const normalized = normalizeIdentifier(code); if (!normalized) return null;
 try {
  const invoice = await readBackend(`${API_PATHS.invoice}${encodeURIComponent(normalized)}`, invoiceSchema);
  if (normalizeIdentifier(invoice.invoice_id) !== normalized) throw new BackendError("schema");
  return invoice;
 } catch (error) { if (error instanceof BackendError && error.status === 404) return null; throw error; }
}
