import { commonText } from "@/content/fa/common";
import { shoppingText } from "@/content/fa/shopping";
import type { CartContentProps } from "@/types/ui";
import { estimatedCartTotal, variantKey } from "@/lib/shopping/state";

import { formatPersianNumber } from "@/lib/localization/numbers";
import { CartItemRow } from "./cart-item-row";

export function CartContent({ items, id, basePath, preview, unavailable, onQuantity, onRemove }: CartContentProps) {
  const total = estimatedCartTotal(items);
  return (
    <>
      {items.length === 0 ? <p className="text-stone-500">{shoppingText.emptyCart}</p> : (
        <ul className="divide-y divide-stone-200">
          {items.map((item, index) => {
            const key = variantKey(item);
            return <CartItemRow key={key} item={item} quantityId={`${id}-quantity-${index}`} basePath={basePath}
              unavailable={unavailable(item.code)} onQuantity={quantity => onQuantity(key, quantity)} onRemove={() => onRemove(key)} />;
          })}
        </ul>
      )}
      <p className="font-semibold">{shoppingText.estimatedTotalPrefix}{total === null ? shoppingText.totalUnavailable : formatPersianNumber(total)} {preview ? commonText.toman : commonText.apiUnit}</p>
      <p className="text-sm leading-7 text-stone-600">{shoppingText.cartEstimateNotice}</p>
      <button disabled className="rounded-xl bg-stone-200 px-5 py-3 text-sm text-stone-500">{shoppingText.cartCheckoutDisabled}</button>
    </>
  );
}
