import Link from "next/link";
import type { CartItem } from "@/lib/shopping/state";
import { formatPersianNumber } from "@/lib/localization/numbers";

type Props = { item: CartItem; quantityId: string; basePath: string; unavailable: boolean; onQuantity: (quantity: number) => void; onRemove: () => void };

export function CartItemRow({ item, quantityId, basePath, unavailable, onQuantity, onRemove }: Props) {
  return (
    <li className="space-y-3 py-5">
      <Link href={`${basePath}/${encodeURIComponent(item.code)}`} className="font-semibold text-teal-800 hover:underline">{item.title}</Link>
      <p className="text-sm text-stone-500">{item.selections.map((value, i) => `${item.optionNames[i]}: ${value}`).join("، ")}</p>
      {unavailable && <p className="text-sm text-amber-800">این محصول در فهرست فعلی نیست؛ موجود بودن آن را از صفحه محصول بررسی کنید.</p>}
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor={quantityId} className="text-sm">تعداد</label>
        <select id={quantityId} value={item.quantity} onChange={event => onQuantity(Number(event.target.value))} className="rounded-lg border border-stone-300 p-2">
          {Array.from({ length: 99 }, (_, i) => <option key={i + 1} value={i + 1}>{formatPersianNumber(i + 1)}</option>)}
        </select>
        <span className="text-sm text-stone-600">قیمت ذخیره‌شده: {formatPersianNumber(item.price)}</span>
        <button className="text-sm text-red-700 hover:underline" onClick={onRemove}>حذف {item.title}</button>
      </div>
    </li>
  );
}
