import { estimatedCartTotal, variantKey, type CartItem } from "@/lib/shopping/state";
import { formatPersianNumber } from "@/lib/localization/numbers";
import { CartItemRow } from "./cart-item-row";

type Props = { items: CartItem[]; id: string; basePath: string; preview: boolean; unavailable: (code: string) => boolean; onQuantity: (key: string, quantity: number) => void; onRemove: (key: string) => void };

export function CartContent({ items, id, basePath, preview, unavailable, onQuantity, onRemove }: Props) {
  const total = estimatedCartTotal(items);
  return (
    <>
      {items.length === 0 ? <p className="text-stone-500">سبد خرید خالی است. از صفحه محصول، گزینه‌ها را انتخاب و به سبد اضافه کنید.</p> : (
        <ul className="divide-y divide-stone-200">
          {items.map((item, index) => {
            const key = variantKey(item);
            return <CartItemRow key={key} item={item} quantityId={`${id}-quantity-${index}`} basePath={basePath}
              unavailable={unavailable(item.code)} onQuantity={quantity => onQuantity(key, quantity)} onRemove={() => onRemove(key)} />;
          })}
        </ul>
      )}
      <p className="font-semibold">جمع تقریبی: {total === null ? "قابل محاسبه نیست" : formatPersianNumber(total)} {preview ? "تومان" : "واحد API"}</p>
      <p className="text-sm leading-7 text-stone-600">قیمت‌ها ممکن است تغییر کرده باشند. مبلغ، موجودی و هزینه ارسال باید در سرویس خرید تأیید شود. پرداخت چندمحصولی هنوز فعال نیست.</p>
      <button disabled className="rounded-xl bg-stone-200 px-5 py-3 text-sm text-stone-500">پرداخت سبد غیرفعال است</button>
    </>
  );
}
