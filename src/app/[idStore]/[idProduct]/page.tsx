import { commonText } from "@/content/fa/common";
import { getServerEnv } from "@/config/env.server";
import type { ProductPageProps } from "@/types/routes";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site/config";
import { catalogMetadata, productStructuredData } from "@/lib/site/metadata";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog/data";
import { normalizeStoreCode } from "@/lib/catalog/identifiers";
import { ProductView } from "../../ui/product-view";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
 const { idStore, idProduct } = await params;
 try { const product = await getProduct(idStore, idProduct); return product ? catalogMetadata(siteConfig(getServerEnv()), product.store, product) : { title: commonText.product, robots: { index: false, follow: false } }; }
 catch { return { title: commonText.product, robots: { index: false, follow: false } }; }
}
export default async function ProductPage({ params }: ProductPageProps) {
 const { idStore, idProduct } = await params;
 const code = normalizeStoreCode(idStore); if (!code) notFound();
 const product = await getProduct(code, idProduct); if (!product) notFound();
 const structured = productStructuredData(siteConfig(getServerEnv()), product);
 return <>{structured && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structured }} />}<ProductView product={product} basePath={`/${encodeURIComponent(code)}`} /></>;
}
