import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog/data";
import { normalizeStoreCode } from "@/lib/catalog/identifiers";
import { ProductView } from "../../ui/product-view";
type Props = { params: Promise<{ idStore: string; idProduct: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { idStore, idProduct } = await params;
 try { const product = await getProduct(idStore, idProduct); return { title: product?.title ?? "محصول", robots: { index: false, follow: false } }; }
 catch { return { title: "محصول", robots: { index: false, follow: false } }; }
}
export default async function ProductPage({ params }: Props) {
 const { idStore, idProduct } = await params;
 const code = normalizeStoreCode(idStore); if (!code) notFound();
 const product = await getProduct(code, idProduct); if (!product) notFound();
 return <ProductView product={product} basePath={`/${encodeURIComponent(code)}`} />;
}
