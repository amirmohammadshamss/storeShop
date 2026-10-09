import { normalizeStoreCode } from "../catalog/identifiers";
export type SiteConfig = { origin: string | null; indexing: boolean; storeCodes: string[] };
export function siteConfig(env: Record<string, string | undefined>): SiteConfig {
 let origin: string | null = null;
 try { const url = new URL(env.SITE_ORIGIN ?? ""); if (url.protocol === "https:" && !url.username && !url.password && url.origin === env.SITE_ORIGIN) origin = url.origin; } catch { /* No verified public origin. */ }
 const values = (env.PUBLIC_STORE_CODES ?? "").split(",").map(value => value.trim()).filter(Boolean);
 const codes = values.map(normalizeStoreCode);
 const storeCodes = values.length <= 20 && codes.every(code => code !== null) ? [...new Set(codes as string[])] : [];
 return { origin, indexing: Boolean(origin && env.CATALOG_INDEXING_ENABLED === "true" && storeCodes.length), storeCodes };
}
export function publicCatalogUrl(config: SiteConfig, storeCode: string, productCode?: string): string | null {
 if (!config.origin || !config.indexing || !config.storeCodes.includes(storeCode)) return null;
 return `${config.origin}/${encodeURIComponent(storeCode)}${productCode === undefined ? "" : `/${encodeURIComponent(productCode)}`}`;
}
