import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";
import { catalogMetadata } from "@/lib/site/metadata";
import { notFound } from "next/navigation";
import { getStore, getCatalog } from "@/lib/catalog/data";
import { normalizeStoreCode } from "@/lib/catalog/identifiers";
import type { QueryParams } from "@/lib/catalog/search";
import { CatalogView } from "../ui/catalog-view";
type Props = { params: Promise<{ idStore: string }>; searchParams: Promise<QueryParams> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { idStore } = await params;
 try { const store = await getStore(idStore); return store ? catalogMetadata(siteConfig(process.env), store) : { title: "فروشگاه", robots: { index: false, follow: false } }; }
 catch { return { title: "فروشگاه", robots: { index: false, follow: false } }; }
}
export default async function StorePage({ params, searchParams }: Props) {
 const { idStore } = await params; const code = normalizeStoreCode(idStore);
 if (!code) notFound();
 const store = await getStore(code); if (!store) notFound();
 const products = await getCatalog(code);
 return <CatalogView store={store} products={products} basePath={`/${encodeURIComponent(code)}`} params={await searchParams} />;
}
