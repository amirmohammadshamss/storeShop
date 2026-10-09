import type { ProductSummary, Store } from "@/lib/catalog/schema";
import { parseCatalogSearch, searchCatalog, type QueryParams } from "@/lib/catalog/search";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { ShoppingPanel } from "./shopping-panel";
import { StoreHeader } from "./catalog/store-header";
import { CatalogFilters } from "./catalog/catalog-filters";
import { ProductCard } from "./catalog/product-card";

type Props = { store: Store; products: ProductSummary[]; basePath: string; preview?: boolean; params?: QueryParams };

export function CatalogView({ store, products, basePath, preview = false, params = {} }: Props) {
  const search = parseCatalogSearch(params);
  const visible = searchCatalog(products, search);
  return (
    <div className="space-y-10">
      {preview && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">نسخه نمایشی — محصولات و قیمت‌ها نمونه هستند و امکان پرداخت وجود ندارد.</p>}
      <StoreHeader store={store} basePath={basePath} />
      <ShoppingPanel storeCode={store.code} preview={preview} basePath={basePath} products={products} />
      <section aria-labelledby="catalog-title">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="catalog-title" className="text-2xl font-bold">محصولات فروشگاه</h2>
          <span className="text-sm text-stone-500">{formatPersianNumber(visible.length)} از {formatPersianNumber(products.length)} محصول</span>
        </div>
        <CatalogFilters search={search} basePath={basePath} />
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-600">
            {products.length === 0 ? "در حال حاضر محصولی برای نمایش وجود ندارد." : "محصولی با این جستجو یا محدوده قیمت پیدا نشد."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(product => <ProductCard key={product.code} product={product} storeCode={store.code} basePath={basePath} preview={preview} />)}
          </div>
        )}
      </section>
    </div>
  );
}
