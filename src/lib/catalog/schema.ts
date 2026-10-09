import { z } from "zod";
const identifier = z.union([z.string().min(1), z.number().int().nonnegative()]).transform(String);
const amount = z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)]).pipe(z.number().int().nonnegative().safe());
const image = z.string().transform(value => {
 if (value.startsWith("/") && !value.startsWith("//")) return value;
 try { const url = new URL(value); return url.protocol === "https:" ? value : ""; } catch { return ""; }
});
export const storeSchema = z.object({ code: identifier, title: z.string().min(1), logo_file_url: image.nullish(), desc: z.string().nullish() });
export const summarySchema = z.object({ code: identifier, title: z.string().min(1), price: amount, images_url: z.union([image, z.array(image)]).nullish() });
export const catalogSchema = z.object({ Products: z.array(summarySchema) });
export const productSchema = summarySchema.extend({
 id: identifier,
 primary_price: amount.nullish(),
 desc: z.string().nullish(),
 store: storeSchema,
 features: z.union([z.literal(0), z.array(z.object({ name: z.string().min(1), desc: z.string() }))]).transform(value => value === 0 ? [] : value),
});
export type Store = z.infer<typeof storeSchema>;
export type ProductSummary = z.infer<typeof summarySchema>;
export type Product = z.infer<typeof productSchema>;
export function productImages(value: ProductSummary["images_url"]): string[] { return (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean); }
// Legacy HTML descriptions are rendered as text, never injected into the DOM.
export function plainDescription(value: string | null | undefined): string { return (value ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim(); }
