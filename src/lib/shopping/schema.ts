import type { CartItem } from "@/types/shopping";
import { IDENTIFIER_PATTERN } from "@/constants/catalog";
import { SHOPPING_VERSION, MAX_SAVED_PRODUCTS, MAX_CART_QUANTITY, MAX_PRODUCT_OPTIONS, MAX_OPTION_LENGTH } from "@/constants/shopping";
import { z } from "zod";

export const referenceSchema = z.object({ code: z.string().regex(IDENTIFIER_PATTERN), title: z.string().min(1).max(1000), price: z.number().int().nonnegative().safe() }).strict();
export const cartItemSchema = referenceSchema.extend({ selections: z.array(z.string().max(MAX_OPTION_LENGTH)).max(MAX_PRODUCT_OPTIONS), optionNames: z.array(z.string().min(1).max(MAX_OPTION_LENGTH)).max(MAX_PRODUCT_OPTIONS), quantity: z.number().int().min(1).max(MAX_CART_QUANTITY) }).refine(value => value.optionNames.length === value.selections.length);

export function variantKey(item: Pick<CartItem, "code" | "selections">): string { return JSON.stringify([item.code, ...item.selections]); }
export const stateSchema = z.object({
 version: z.literal(SHOPPING_VERSION), storeCode: z.string().regex(IDENTIFIER_PATTERN), preview: z.boolean(),
 cart: z.array(cartItemSchema).max(MAX_SAVED_PRODUCTS).refine(items => new Set(items.map(variantKey)).size === items.length),
 wishlist: z.array(referenceSchema).max(MAX_SAVED_PRODUCTS).refine(items => new Set(items.map(item => item.code)).size === items.length),
}).strict();

export type { ProductReference } from "@/types/shopping";
export type { CartItem } from "@/types/shopping";
export type { ShoppingState } from "@/types/shopping";
