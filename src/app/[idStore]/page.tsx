import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore, getCatalog } from "@/lib/catalog/data";
import { normalizeStoreCode } from "@/lib/catalog/identifiers";
import { CatalogView } from "../ui/catalog-view";
type Props = { params: Promise<{ idStore: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { idStore } = await params;
 try { const store = await getStore(idStore); return { title: store?.title ?? "فروشگاه", robots: { index: false, follow: false } }; }
 catch { return { title: "فروشگاه", robots: { index: false, follow: false } }; }
}
export default async function StorePage({ params }: Props) {
 const { idStore } = await params; const code = normalizeStoreCode(idStore);
 if (!code) notFound();
 const store = await getStore(code); if (!store) notFound();
 const products = await getCatalog(code);
 return <CatalogView store={store} products={products} basePath={`/${encodeURIComponent(code)}`} />;
}
