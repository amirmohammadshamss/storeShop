import { z } from "zod";
import { normalizeIranianMobile } from "../localization/numbers";
import { normalizeIdentifier, normalizeStoreCode } from "../catalog/identifiers";
import type { Product } from "../catalog/schema";
const productCode = z.string().transform(normalizeIdentifier).pipe(z.string());
const storeCode = z.string().transform(normalizeStoreCode).pipe(z.string());
export const draftInputSchema = z.object({ storeCode, productCode, preview: z.boolean(), selections: z.array(z.string().max(200)).max(20) }).strict();
export const customerSchema = z.object({
 full_name: z.string().trim().min(2, "نام و نام خانوادگی را وارد کنید.").max(150),
 mobile: z.string().transform(normalizeIranianMobile).pipe(z.string({ error: "شماره موبایل معتبر وارد کنید." })),
 email: z.union([z.literal(""), z.email({ error: "ایمیل معتبر وارد کنید." })]).optional().default(""),
 address: z.string().trim().min(5, "آدرس را کامل وارد کنید.").max(1000),
 description: z.string().trim().max(1000).default(""),
}).strict();
export type Customer = z.infer<typeof customerSchema>;
export type DraftInput = z.infer<typeof draftInputSchema>;
export function validateSelections(product: Product, selections: string[]): boolean {
 return selections.length === product.features.length && product.features.every((feature, index) => feature.desc.split(",").map(value => value.trim()).filter(Boolean).includes(selections[index]));
}
export function purchasePayload(product: Product, selections: string[], customer: Customer) {
 if (!validateSelections(product, selections)) throw new Error("Invalid product options");
 return { ...customer, product_id: product.id, product_specs: product.features.map((feature, index) => `${selections[index]}=${feature.name}`).join(",") };
}
