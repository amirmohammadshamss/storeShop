import { commonText } from "@/content/fa/common";
import { shoppingText } from "@/content/fa/shopping";
import type { CartItemRowProps } from "@/types/ui";
import { MAX_CART_QUANTITY } from "@/constants/shopping";
import Link from "next/link";

import { formatPersianNumber } from "@/lib/localization/numbers";

export function CartItemRow({ item, quantityId, basePath, unavailable, onQuantity, onRemove }: CartItemRowProps) {
  return (
    <li className="space-y-3 py-5">
      <Link href={`${basePath}/${encodeURIComponent(item.code)}`} className="font-semibold text-teal-800 hover:underline">{item.title}</Link>
      <p className="text-sm text-stone-500">{item.selections.map((value, i) => `${item.optionNames[i]}: ${value}`).join("، ")}</p>
      {unavailable && <p className="text-sm text-amber-800">{shoppingText.cartProductUnavailable}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor={quantityId} className="text-sm">{shoppingText.quantity}</label>
        <select id={quantityId} value={item.quantity} onChange={event => onQuantity(Number(event.target.value))} className="rounded-lg border border-stone-300 p-2">
          {Array.from({ length: MAX_CART_QUANTITY }, (_, i) => <option key={i + 1} value={i + 1}>{formatPersianNumber(i + 1)}</option>)}
        </select>
        <span className="text-sm text-stone-600">{shoppingText.savedPricePrefix}{formatPersianNumber(item.price)}</span>
        <button className="text-sm text-red-700 hover:underline" onClick={onRemove}>{commonText.removePrefix}{item.title}</button>
      </div>
    </li>
  );
}
