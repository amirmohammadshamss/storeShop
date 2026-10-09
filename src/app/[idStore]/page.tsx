import { commonText } from "@/content/fa/common";
import { getServerEnv } from "@/config/env.server";
import type { StorePageProps } from "@/types/routes";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";
import { catalogMetadata } from "@/lib/site/metadata";
import { notFound } from "next/navigation";
import { getStore, getCatalog } from "@/lib/catalog/data";
import { normalizeStoreCode } from "@/lib/catalog/identifiers";

import { CatalogView } from "../ui/catalog-view";

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
 const { idStore } = await params;
 try { const store = await getStore(idStore); return store ? catalogMetadata(siteConfig(getServerEnv()), store) : { title: commonText.store, robots: { index: false, follow: false } }; }
 catch { return { title: commonText.store, robots: { index: false, follow: false } }; }
}
export default async function StorePage({ params, searchParams }: StorePageProps) {
 const { idStore } = await params; const code = normalizeStoreCode(idStore);
 if (!code) notFound();
 const store = await getStore(code); if (!store) notFound();
 const products = await getCatalog(code);
 return <CatalogView store={store} products={products} basePath={`/${encodeURIComponent(code)}`} params={await searchParams} />;
}
