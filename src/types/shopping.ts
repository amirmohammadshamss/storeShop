import type { z } from "zod";
import type { referenceSchema } from "@/lib/shopping/schema";
import type { cartItemSchema } from "@/lib/shopping/schema";
import type { stateSchema } from "@/lib/shopping/schema";

export type ProductReference = z.infer<typeof referenceSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShoppingState = z.infer<typeof stateSchema>;
