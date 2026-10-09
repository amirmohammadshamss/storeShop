import { notFound } from "next/navigation";
import { previewProducts } from "@/lib/catalog/preview";
import { normalizeIdentifier } from "@/lib/catalog/identifiers";
import { ProductView } from "../../../ui/product-view";
export const metadata = { title: "محصول نمایشی", robots: { index: false, follow: false } };
export default async function PreviewProductPage({ params }: { params: Promise<{ idProduct: string }> }) {
 const { idProduct } = await params;
 const product = previewProducts.find(value => value.code === normalizeIdentifier(idProduct));
 if (!product) notFound();
 return <ProductView product={product} basePath="/preview/store" preview />;
}
