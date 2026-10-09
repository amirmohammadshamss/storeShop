import type { ProductSummary } from "./schema";
import { normalizeDigits } from "../localization/numbers";
export type QueryParams = Record<string, string | string[] | undefined>;
export type CatalogSort = "default" | "price-asc" | "price-desc" | "title";
export type CatalogSearch = { query: string; minimum?: number; maximum?: number; sort: CatalogSort; error?: string };
export function normalizeSearch(value: string): string {
 return normalizeDigits(value).normalize("NFKC").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u200d]/g, " ").replace(/\s+/g, " ").trim().toLocaleLowerCase("fa-IR");
}
function first(value: string | string[] | undefined): string { return (Array.isArray(value) ? value[0] : value) ?? ""; }
export function parseCatalogSearch(params: QueryParams): CatalogSearch {
 const query = first(params.q).trim().slice(0, 100);
 const sortValue = first(params.sort);
 const sort: CatalogSort = sortValue === "price-asc" || sortValue === "price-desc" || sortValue === "title" ? sortValue : "default";
 const bounds: (number | undefined)[] = [];
 let error: string | undefined;
 for (const field of ["min", "max"]) {
  const value = normalizeDigits(first(params[field])).trim();
  if (!value) { bounds.push(undefined); continue; }
  const amount = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(amount)) { bounds.push(undefined); error = "محدوده قیمت باید عدد صحیح و غیرمنفی باشد."; }
  else bounds.push(amount);
 }
 const [minimum, maximum] = bounds;
 if (minimum !== undefined && maximum !== undefined && minimum > maximum) error = "حداقل قیمت نباید بیشتر از حداکثر باشد.";
 return { query, minimum, maximum, sort, error };
}
export function searchCatalog(products: ProductSummary[], search: CatalogSearch): ProductSummary[] {
 if (search.error) return [];
 const query = normalizeSearch(search.query);
 const result = products.filter(product => {
  return (!query || normalizeSearch(`${product.title} ${product.code}`).includes(query)) &&
   (search.minimum === undefined || product.price >= search.minimum) && (search.maximum === undefined || product.price <= search.maximum);
 });
 const compareCode = (a: ProductSummary, b: ProductSummary) => a.code.localeCompare(b.code, "fa", { numeric: true });
 if (search.sort === "price-asc") result.sort((a, b) => a.price - b.price || compareCode(a, b));
 if (search.sort === "price-desc") result.sort((a, b) => b.price - a.price || compareCode(a, b));
 if (search.sort === "title") result.sort((a, b) => a.title.localeCompare(b.title, "fa") || compareCode(a, b));
 return result;
}
