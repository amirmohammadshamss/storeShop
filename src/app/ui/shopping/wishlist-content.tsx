import { commonText } from "@/content/fa/common";
import { shoppingText } from "@/content/fa/shopping";
import type { WishlistContentProps } from "@/types/ui";
import Link from "next/link";

export function WishlistContent({ items, basePath, unavailable, onRemove }: WishlistContentProps) {
  if (!items.length) return <p className="text-stone-500">{shoppingText.emptyWishlist}</p>;
  return (
    <ul className="divide-y divide-stone-200">
      {items.map(item => (
        <li key={item.code} className="flex flex-wrap justify-between gap-4 py-4">
          <div>
            <Link href={`${basePath}/${encodeURIComponent(item.code)}`} className="font-semibold text-teal-800 hover:underline">{item.title}</Link>
            {unavailable(item.code) && <p className="mt-2 text-sm text-amber-800">{shoppingText.wishlistProductUnavailable}</p>}
          </div>
          <button className="text-sm text-red-700 hover:underline" onClick={() => onRemove(item.code)}>{commonText.removePrefix}{item.title}</button>
        </li>
      ))}
    </ul>
  );
}
