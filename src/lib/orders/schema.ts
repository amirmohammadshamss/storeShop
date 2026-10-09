import { z } from "zod";
const id = z.union([z.string().min(1).max(80), z.number().int().nonnegative().safe()]).transform(String);
const amount = z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]).pipe(z.number().int().nonnegative().safe());
const timestamp = z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]).pipe(z.number().int().nonnegative().max(253402300799));
export const trackingSchema = z.object({ record_date_unix_time: timestamp, status_desc: z.string().min(1).max(500), store_title: z.string().min(1).max(200), price: amount });
export const invoiceSchema = z.object({ invoice_id: id, done: z.boolean(), create_date_unix_time: timestamp, amount, order_tracking_code: id.nullish(), store_code: id.nullish() });
export type TrackingRecord = z.infer<typeof trackingSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type PaymentState = "success" | "failed" | "cancelled" | "pending" | "unknown";
export function legacyPaymentState(invoice: Invoice): PaymentState { return invoice.done ? "success" : "unknown"; }
