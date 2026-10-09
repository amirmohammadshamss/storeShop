import Image from "next/image";
import Link from "next/link";
import type { ProductSummary, Store } from "@/lib/catalog/schema";
import { plainDescription, productImages } from "@/lib/catalog/schema";
import { parseCatalogSearch, searchCatalog, type QueryParams } from "@/lib/catalog/search";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { CodeForm } from "./code-form";
import { ShoppingPanel } from "./shopping-panel";
import { WishlistButton } from "./wishlist-button";

export function CatalogView({ store, products, basePath, preview = false, params = {} }: {
 store: Store; products: ProductSummary[]; basePath: string; preview?: boolean; params?: QueryParams;
}) {
 const search = parseCatalogSearch(params);
 const visible = searchCatalog(products, search);
 const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20";
 return <div className="space-y-10">
  {preview && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">نسخه نمایشی — محصولات و قیمت‌ها نمونه هستند و امکان پرداخت وجود ندارد.</p>}
  <section className="grid gap-8 rounded-3xl bg-teal-900 p-8 text-white sm:p-12 lg:grid-cols-2">
   <div><p className="mb-3 text-sm text-teal-200">فروشگاه آنلاین</p><h1 className="text-3xl font-bold sm:text-4xl">{store.title}</h1><p className="mt-5 max-w-lg leading-8 text-teal-100">{plainDescription(store.desc) || "محصول مورد نظر خود را انتخاب کنید یا با کد محصول جستجو کنید."}</p></div>
   <div className="self-end rounded-2xl bg-white p-5 text-stone-900"><CodeForm basePath={basePath} /></div>
  </section>
  <ShoppingPanel storeCode={store.code} preview={preview} basePath={basePath} products={products} />
  <section aria-labelledby="catalog-title">
   <div className="mb-6 flex items-center justify-between"><h2 id="catalog-title" className="text-2xl font-bold">محصولات فروشگاه</h2><span className="text-sm text-stone-500">{formatPersianNumber(visible.length)} از {formatPersianNumber(products.length)} محصول</span></div>
   <form action={basePath} method="get" className="mb-6 grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
    <div><label htmlFor="catalog-query" className="mb-2 block text-sm font-medium">نام یا کد محصول</label><input id="catalog-query" name="q" maxLength={100} defaultValue={search.query} className={inputClass} /></div>
    <div><label htmlFor="catalog-min" className="mb-2 block text-sm font-medium">حداقل قیمت</label><input id="catalog-min" name="min" inputMode="numeric" maxLength={16} defaultValue={search.minimum} aria-invalid={Boolean(search.error)} aria-describedby={search.error ? "filter-error" : undefined} className={inputClass} /></div>
    <div><label htmlFor="catalog-max" className="mb-2 block text-sm font-medium">حداکثر قیمت</label><input id="catalog-max" name="max" inputMode="numeric" maxLength={16} defaultValue={search.maximum} aria-invalid={Boolean(search.error)} aria-describedby={search.error ? "filter-error" : undefined} className={inputClass} /></div>
    <div><label htmlFor="catalog-sort" className="mb-2 block text-sm font-medium">مرتب‌سازی</label><select id="catalog-sort" name="sort" defaultValue={search.sort} className={inputClass}><option value="default">ترتیب فروشگاه</option><option value="price-asc">ارزان‌ترین</option><option value="price-desc">گران‌ترین</option><option value="title">نام محصول</option></select></div>
    <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-4"><button className="rounded-xl bg-teal-800 px-6 py-3 text-sm font-medium text-white hover:bg-teal-900">جستجو و اعمال فیلتر</button><Link href={basePath} className="text-sm text-teal-800 hover:underline">پاک کردن فیلترها</Link><p className="text-xs leading-6 text-stone-500">جستجو فقط در محصولات همین فهرست است؛ موجودی و دسته‌بندی تأیید نشده‌اند.</p></div>
    {search.error && <p id="filter-error" role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-4">{search.error}</p>}
   </form>
   {visible.length === 0 ? <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-600">{products.length === 0 ? "در حال حاضر محصولی برای نمایش وجود ندارد." : "محصولی با این جستجو یا محدوده قیمت پیدا نشد."}</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map(product => {
    const image = productImages(product.images_url)[0];
    const path = `${basePath}/${encodeURIComponent(product.code)}`;
    return <article key={product.code} className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-lg">
     <Link href={path} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"><div className="relative aspect-[4/3] bg-stone-100">{image ? <Image src={image} alt={product.title} fill unoptimized className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="flex h-full items-center justify-center text-stone-400">تصویر موجود نیست</div>}</div><div className="px-6 pt-6"><p className="mb-2 text-xs text-stone-500">کد محصول <bdi>{product.code}</bdi></p><h3 className="text-lg font-bold group-hover:text-teal-800">{product.title}</h3></div></Link>
     <div className="space-y-4 p-6 pt-4"><span className="font-semibold">{formatPersianNumber(product.price)} <span className="text-xs font-normal text-stone-500">{preview ? "تومان" : "واحد API"}</span></span><WishlistButton product={product} storeCode={store.code} preview={preview} /></div>
    </article>;
   })}</div>}
  </section>
 </div>;
}
