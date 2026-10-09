import { checkoutText } from "@/content/fa/checkout";
import { commonText } from "@/content/fa/common";
import type { CheckoutSummaryProps } from "@/types/ui";
import Link from "next/link";

import { formatPersianNumber } from "@/lib/localization/numbers";

export function CheckoutSummary({ product, draft }: CheckoutSummaryProps) {
  return (
    <aside className="space-y-5 rounded-2xl bg-teal-900 p-6 text-white">
      <h2 className="text-xl font-bold">{checkoutText.orderSummary}</h2>
      <p>{product.title}</p>
      <p className="text-sm text-teal-100">{product.store.title}</p>
      {product.features.map((feature, i) => <p key={`${feature.name}-${i}`} className="text-sm">{feature.name}: {draft.selections[i]}</p>)}
      <p className="text-2xl font-semibold">{formatPersianNumber(product.price)} <span className="text-sm">{draft.preview ? commonText.toman : commonText.apiUnit}</span></p>
      <p className="text-xs leading-6 text-teal-100">{checkoutText.draftSummaryNotice}</p>
      {draft.preview && <Link href="/preview/result/success" className="block text-sm underline underline-offset-4">{checkoutText.previewPaymentStates}</Link>}
    </aside>
  );
}
