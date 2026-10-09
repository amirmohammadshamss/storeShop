import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/lib/catalog/schema";
import { productImages } from "@/lib/catalog/schema";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { WishlistButton } from "../wishlist-button";

type Props = { product: ProductSummary; storeCode: string; basePath: string; preview: boolean };

export function ProductCard({ product, storeCode, basePath, preview }: Props) {
  const image = productImages(product.images_url)[0];
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-lg">
      <Link href={`${basePath}/${encodeURIComponent(product.code)}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
        <div className="relative aspect-[4/3] bg-stone-100">
          {image ? <Image src={image} alt={product.title} fill unoptimized className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /> :
            <div className="flex h-full items-center justify-center text-stone-400">تصویر موجود نیست</div>}
        </div>
        <div className="px-6 pt-6">
          <p className="mb-2 text-xs text-stone-500">کد محصول <bdi>{product.code}</bdi></p>
          <h3 className="text-lg font-bold group-hover:text-teal-800">{product.title}</h3>
        </div>
      </Link>
      <div className="space-y-4 p-6 pt-4">
        <span className="font-semibold">{formatPersianNumber(product.price)} <span className="text-xs font-normal text-stone-500">{preview ? "تومان" : "واحد API"}</span></span>
        <WishlistButton product={product} storeCode={storeCode} preview={preview} />
      </div>
    </article>
  );
}
