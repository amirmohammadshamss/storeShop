import Link from "next/link";
import type { Product } from "@/lib/catalog/schema";
import { productImages } from "@/lib/catalog/schema";
import { ProductGallery } from "./product-gallery";
import { ShoppingPanel } from "./shopping-panel";
import { ProductInformation } from "./product/product-information";

export function ProductView({ product, basePath, preview = false }: { product: Product; basePath: string; preview?: boolean }) {
  return (
    <div>
      <Link href={basePath} className="mb-8 inline-block text-sm text-teal-800 hover:underline">→ بازگشت به {product.store.title}</Link>
      {preview && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">محصول نمایشی — اطلاعات و قیمت نمونه است.</p>}
      <div className="mb-8"><ShoppingPanel storeCode={product.store.code} preview={preview} basePath={basePath} /></div>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={productImages(product.images_url)} title={product.title} />
        <ProductInformation product={product} preview={preview} />
      </div>
    </div>
  );
}
