import Link from "next/link";
import type { ProductReference } from "@/lib/shopping/state";

type Props = { items: ProductReference[]; basePath: string; unavailable: (code: string) => boolean; onRemove: (code: string) => void };

export function WishlistContent({ items, basePath, unavailable, onRemove }: Props) {
  if (!items.length) return <p className="text-stone-500">هنوز محصولی ذخیره نکرده‌اید.</p>;
  return (
    <ul className="divide-y divide-stone-200">
      {items.map(item => (
        <li key={item.code} className="flex flex-wrap justify-between gap-4 py-4">
          <div>
            <Link href={`${basePath}/${encodeURIComponent(item.code)}`} className="font-semibold text-teal-800 hover:underline">{item.title}</Link>
            {unavailable(item.code) && <p className="mt-2 text-sm text-amber-800">در فهرست فعلی نیست؛ صفحه محصول را بررسی کنید.</p>}
          </div>
          <button className="text-sm text-red-700 hover:underline" onClick={() => onRemove(item.code)}>حذف {item.title}</button>
        </li>
      ))}
    </ul>
  );
}
