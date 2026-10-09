import Link from "next/link";
import type { Product } from "@/lib/catalog/schema";
import { plainDescription, productImages } from "@/lib/catalog/schema";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { ProductGallery } from "./product-gallery";
import { ProductPurchase } from "./product-purchase";
export function ProductView({ product, basePath, preview = false }: { product: Product; basePath: string; preview?: boolean }) {
 return <div><Link href={basePath} className="mb-8 inline-block text-sm text-teal-800 hover:underline">→ بازگشت به {product.store.title}</Link>{preview && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">محصول نمایشی — اطلاعات و قیمت نمونه است.</p>}<div className="grid gap-10 md:grid-cols-2"><ProductGallery images={productImages(product.images_url)} title={product.title} /><section className="py-4"><p className="text-sm text-stone-500">کد محصول <bdi>{product.code}</bdi></p><h1 className="mt-4 text-3xl font-bold leading-relaxed">{product.title}</h1><div className="mt-6 flex items-center gap-4">{product.primary_price != null && product.primary_price > product.price && <del className="text-stone-400">{formatPersianNumber(product.primary_price)}</del>}<p className="text-2xl font-bold">{formatPersianNumber(product.price)} <span className="text-sm font-normal text-stone-500">{preview ? "تومان" : "واحد API"}</span></p></div><p className="mt-6 whitespace-pre-line leading-8 text-stone-600">{plainDescription(product.desc) || "توضیحی برای این محصول ثبت نشده است."}</p><ProductPurchase product={product} preview={preview} /></section></div></div>;
}
