import type { MetadataRoute } from "next";
import { siteConfig, publicCatalogUrl } from "@/lib/site/config";
import { getStore, getCatalog } from "@/lib/catalog/data";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const config = siteConfig(process.env);
 if (!config.indexing || !config.origin) return [];
 const urls = new Set<string>();
 for (let start = 0; start < config.storeCodes.length; start += 4) {
  await Promise.all(config.storeCodes.slice(start, start + 4).map(async code => {
   try {
    const store = await getStore(code); if (!store) return;
    const products = await getCatalog(code);
    const storeUrl = publicCatalogUrl(config, code); if (storeUrl) urls.add(storeUrl);
    for (const product of products.slice(0, 500)) { const id = normalizeIdentifier(product.code); if (!id) continue; const url = publicCatalogUrl(config, code, id); if (url) urls.add(url); }
   } catch { /* Omit unavailable or malformed stores; do not substitute preview content. */ }
  }));
 }
 return [...urls].sort().map(url => ({ url }));
}
