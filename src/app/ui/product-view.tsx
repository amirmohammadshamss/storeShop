import { catalogText } from "@/content/fa/catalog";
import type { ProductViewProps } from "@/types/ui";
import Link from "next/link";

import { productImages } from "@/lib/catalog/schema";
import { ProductGallery } from "./product-gallery";
import { ShoppingPanel } from "./shopping-panel";
import { ProductInformation } from "./product/product-information";

export function ProductView({ product, basePath, preview = false }: ProductViewProps) {
  return (
    <div>
      <Link href={basePath} className="mb-8 inline-block text-sm text-teal-800 hover:underline">{catalogText.backToStorePrefix}{product.store.title}</Link>
      {preview && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{catalogText.previewProductNotice}</p>}
      <div className="mb-8"><ShoppingPanel storeCode={product.store.code} preview={preview} basePath={basePath} /></div>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={productImages(product.images_url)} title={product.title} />
        <ProductInformation product={product} preview={preview} />
      </div>
    </div>
  );
}
