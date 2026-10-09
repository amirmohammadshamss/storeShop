import { MIN_CUSTOMER_NAME_LENGTH, MIN_CUSTOMER_ADDRESS_LENGTH, MAX_CUSTOMER_NAME_LENGTH, MAX_CUSTOMER_TEXT_LENGTH } from "@/constants/checkout";
import { MAX_OPTION_LENGTH, MAX_PRODUCT_OPTIONS } from "@/constants/shopping";
import { checkoutText } from "@/content/fa/checkout";
import { technicalText } from "@/content/technical";
import type { Customer } from "@/types/checkout";
import { z } from "zod";
import { normalizeIranianMobile } from "../localization/numbers";
import { normalizeIdentifier, normalizeStoreCode } from "../catalog/identifiers";
import type { Product } from "@/types/catalog";
const productCode = z.string().transform(normalizeIdentifier).pipe(z.string());
const storeCode = z.string().transform(normalizeStoreCode).pipe(z.string());
export const draftInputSchema = z.object({ storeCode, productCode, preview: z.boolean(), selections: z.array(z.string().max(MAX_OPTION_LENGTH)).max(MAX_PRODUCT_OPTIONS) }).strict();
export const customerSchema = z.object({
 full_name: z.string().trim().min(MIN_CUSTOMER_NAME_LENGTH, checkoutText.requiredName).max(MAX_CUSTOMER_NAME_LENGTH),
 mobile: z.string().transform(normalizeIranianMobile).pipe(z.string({ error: checkoutText.invalidMobile })),
 email: z.union([z.literal(""), z.email({ error: checkoutText.invalidEmail })]).optional().default(""),
 address: z.string().trim().min(MIN_CUSTOMER_ADDRESS_LENGTH, checkoutText.requiredAddress).max(MAX_CUSTOMER_TEXT_LENGTH),
 description: z.string().trim().max(MAX_CUSTOMER_TEXT_LENGTH).default(""),
}).strict();

export function validateSelections(product: Product, selections: string[]): boolean {
 return selections.length === product.features.length && product.features.every((feature, index) => feature.desc.split(",").map(value => value.trim()).filter(Boolean).includes(selections[index]));
}
export function purchasePayload(product: Product, selections: string[], customer: Customer) {
 if (!validateSelections(product, selections)) throw new Error(technicalText.invalidProductOptions);
 return { ...customer, product_id: product.id, product_specs: product.features.map((feature, index) => `${selections[index]}=${feature.name}`).join(",") };
}

export type { Customer } from "@/types/checkout";
export type { DraftInput } from "@/types/checkout";
