import Image from "next/image";
import Link from "next/link";
import type { ProductSummary, Store } from "@/lib/catalog/schema";
import { plainDescription, productImages } from "@/lib/catalog/schema";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { CodeForm } from "./code-form";
export function CatalogView({ store, products, basePath, preview = false }: { store: Store; products: ProductSummary[]; basePath: string; preview?: boolean }) {
 return <div className="space-y-12">
  {preview && <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">نسخه نمایشی — محصولات و قیمت‌ها نمونه هستند و امکان پرداخت وجود ندارد.</p>}
  <section className="grid gap-8 rounded-3xl bg-teal-900 p-8 text-white sm:p-12 lg:grid-cols-2"><div><p className="mb-3 text-sm text-teal-200">فروشگاه آنلاین</p><h1 className="text-3xl font-bold sm:text-4xl">{store.title}</h1><p className="mt-5 max-w-lg leading-8 text-teal-100">{plainDescription(store.desc) || "محصول مورد نظر خود را انتخاب کنید یا با کد محصول جستجو کنید."}</p></div><div className="self-end rounded-2xl bg-white p-5 text-stone-900"><CodeForm basePath={basePath} /></div></section>
  <section aria-labelledby="catalog-title"><div className="mb-6 flex items-center justify-between"><h2 id="catalog-title" className="text-2xl font-bold">محصولات فروشگاه</h2><span className="text-sm text-stone-500">{formatPersianNumber(products.length)} محصول</span></div>
   {products.length === 0 ? <p className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-600">در حال حاضر محصولی برای نمایش وجود ندارد.</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => {
    const image = productImages(product.images_url)[0];
    return <Link key={product.code} href={`${basePath}/${encodeURIComponent(product.code)}`} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"><div className="relative aspect-[4/3] bg-stone-100">{image ? <Image src={image} alt={product.title} fill unoptimized className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> : <div className="flex h-full items-center justify-center text-stone-400">تصویر موجود نیست</div>}</div><div className="p-6"><p className="mb-2 text-xs text-stone-500">کد محصول <bdi>{product.code}</bdi></p><h3 className="text-lg font-bold group-hover:text-teal-800">{product.title}</h3><div className="mt-5 flex items-center justify-between"><span className="font-semibold">{formatPersianNumber(product.price)} <span className="text-xs font-normal text-stone-500">{preview ? "تومان" : "واحد API"}</span></span><span aria-hidden="true" className="text-teal-700">←</span></div></div></Link>;
   })}</div>}
  </section>
 </div>;
}
