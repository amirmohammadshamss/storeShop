import { catalogText } from "@/content/fa/catalog";
import type { QueryParams, CatalogSort, CatalogSearch } from "@/types/catalog";
import type { ProductSummary } from "@/types/catalog";
import { MAX_SEARCH_QUERY_LENGTH } from "@/constants/catalog";
import { PERSIAN_LOCALE, PERSIAN_SORT_LOCALE, PERSIAN_YEH, PERSIAN_KEH } from "@/constants/localization";
import { normalizeDigits } from "../localization/numbers";

export function normalizeSearch(value: string): string {
 return normalizeDigits(value).normalize("NFKC").replace(/ي/g, PERSIAN_YEH).replace(/ك/g, PERSIAN_KEH).replace(/[\u200c\u200d]/g, " ").replace(/\s+/g, " ").trim().toLocaleLowerCase(PERSIAN_LOCALE);
}
function first(value: string | string[] | undefined): string { return (Array.isArray(value) ? value[0] : value) ?? ""; }
export function parseCatalogSearch(params: QueryParams): CatalogSearch {
 const query = first(params.q).trim().slice(0, MAX_SEARCH_QUERY_LENGTH);
 const sortValue = first(params.sort);
 const sort: CatalogSort = sortValue === "price-asc" || sortValue === "price-desc" || sortValue === "title" ? sortValue : "default";
 const bounds: (number | undefined)[] = [];
 let error: string | undefined;
 for (const field of ["min", "max"]) {
  const value = normalizeDigits(first(params[field])).trim();
  if (!value) { bounds.push(undefined); continue; }
  const amount = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(amount)) { bounds.push(undefined); error = catalogText.invalidPriceRange; }
  else bounds.push(amount);
 }
 const [minimum, maximum] = bounds;
 if (minimum !== undefined && maximum !== undefined && minimum > maximum) error = catalogText.reversedPriceRange;
 return { query, minimum, maximum, sort, error };
}
export function searchCatalog(products: ProductSummary[], search: CatalogSearch): ProductSummary[] {
 if (search.error) return [];
 const query = normalizeSearch(search.query);
 const result = products.filter(product => {
  return (!query || normalizeSearch(`${product.title} ${product.code}`).includes(query)) &&
   (search.minimum === undefined || product.price >= search.minimum) && (search.maximum === undefined || product.price <= search.maximum);
 });
 const compareCode = (a: ProductSummary, b: ProductSummary) => a.code.localeCompare(b.code, PERSIAN_SORT_LOCALE, { numeric: true });
 if (search.sort === "price-asc") result.sort((a, b) => a.price - b.price || compareCode(a, b));
 if (search.sort === "price-desc") result.sort((a, b) => b.price - a.price || compareCode(a, b));
 if (search.sort === "title") result.sort((a, b) => a.title.localeCompare(b.title, PERSIAN_SORT_LOCALE) || compareCode(a, b));
 return result;
}

export type { QueryParams } from "@/types/catalog";
export type { CatalogSort } from "@/types/catalog";
export type { CatalogSearch } from "@/types/catalog";
