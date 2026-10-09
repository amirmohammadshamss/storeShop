import { previewText } from "@/content/fa/preview";
import type { PreviewProductPageProps } from "@/types/routes";
import { notFound } from "next/navigation";
import { previewProducts } from "@/lib/catalog/preview";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { ProductView } from "../../../ui/product-view";
export const metadata = { title: previewText.previewProductTitle, robots: { index: false, follow: false } };
export default async function PreviewProductPage({ params }: PreviewProductPageProps) {
 const { idProduct } = await params;
 const product = previewProducts.find(value => value.code === normalizeIdentifier(idProduct));
 if (!product) notFound();
 return <ProductView product={product} basePath="/preview/store" preview />;
}
