import { z } from "zod";

export const referenceSchema = z.object({ code: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/), title: z.string().min(1).max(1000), price: z.number().int().nonnegative().safe() }).strict();
export const cartItemSchema = referenceSchema.extend({ selections: z.array(z.string().max(200)).max(20), optionNames: z.array(z.string().min(1).max(200)).max(20), quantity: z.number().int().min(1).max(99) }).refine(value => value.optionNames.length === value.selections.length);
export type ProductReference = z.infer<typeof referenceSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export function variantKey(item: Pick<CartItem, "code" | "selections">): string { return JSON.stringify([item.code, ...item.selections]); }
export const stateSchema = z.object({
 version: z.literal(1), storeCode: z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/), preview: z.boolean(),
 cart: z.array(cartItemSchema).max(60).refine(items => new Set(items.map(variantKey)).size === items.length),
 wishlist: z.array(referenceSchema).max(60).refine(items => new Set(items.map(item => item.code)).size === items.length),
}).strict();
export type ShoppingState = z.infer<typeof stateSchema>;
