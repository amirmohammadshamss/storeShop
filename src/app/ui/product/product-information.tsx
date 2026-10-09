import { catalogText } from "@/content/fa/catalog";
import { commonText } from "@/content/fa/common";
import type { ProductInformationProps } from "@/types/ui";

import { plainDescription } from "@/lib/catalog/schema";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { ProductPurchase } from "../product-purchase";
import { WishlistButton } from "../wishlist-button";

export function ProductInformation({ product, preview }: ProductInformationProps) {
  return (
    <section className="py-4">
      <p className="text-sm text-stone-500">{commonText.productCodePrefix}<bdi>{product.code}</bdi></p>
      <h1 className="mt-4 text-3xl font-bold leading-relaxed">{product.title}</h1>
      <div className="mt-6 flex items-center gap-4">
        {product.primary_price != null && product.primary_price > product.price && <del className="text-stone-400">{formatPersianNumber(product.primary_price)}</del>}
        <p className="text-2xl font-bold">{formatPersianNumber(product.price)} <span className="text-sm font-normal text-stone-500">{preview ? commonText.toman : commonText.apiUnit}</span></p>
      </div>
      <p className="mt-6 whitespace-pre-line leading-8 text-stone-600">{plainDescription(product.desc) || catalogText.missingDescription}</p>
      <div className="mt-5"><WishlistButton product={product} storeCode={product.store.code} preview={preview} /></div>
      <ProductPurchase product={product} preview={preview} />
    </section>
  );
}
