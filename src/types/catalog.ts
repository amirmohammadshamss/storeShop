import type { z } from "zod";
import type { storeSchema } from "@/lib/catalog/schema";
import type { summarySchema } from "@/lib/catalog/schema";
import type { productSchema } from "@/lib/catalog/schema";

export type Store = z.infer<typeof storeSchema>;

export type ProductSummary = z.infer<typeof summarySchema>;

export type Product = z.infer<typeof productSchema>;

export type QueryParams = Record<string, string | string[] | undefined>;

export type CatalogSort = "default" | "price-asc" | "price-desc" | "title";

export type CatalogSearch = { query: string; minimum?: number; maximum?: number; sort: CatalogSort; error?: string };
