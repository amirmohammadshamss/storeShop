import type { z } from "zod";
import type { trackingSchema } from "@/lib/orders/schema";
import type { invoiceSchema } from "@/lib/orders/schema";

export type TrackingRecord = z.infer<typeof trackingSchema>;

export type Invoice = z.infer<typeof invoiceSchema>;

export type PaymentState = "success" | "failed" | "cancelled" | "pending" | "unknown";

export type PaymentMessage = { title: string; description: string };
