import { commonText } from "@/content/fa/common";
import { ordersText } from "@/content/fa/orders";
import type { PaymentViewProps } from "@/types/ui";
import Link from "next/link";

import { paymentMessages } from "@/lib/orders/messages";
import { InvoiceDetails } from "./invoice-details";

export function PaymentView({ invoice, state, preview = false }: PaymentViewProps) {
  const message = paymentMessages[state];
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      {preview && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{ordersText.previewPaymentNotice}</p>}
      <div className="rounded-2xl border border-stone-200 bg-white p-8">
        <p className="mb-3 text-sm text-stone-500">{ordersText.paymentResult}</p>
        <h1 className="text-2xl font-bold">{message.title}</h1>
        <p className="mt-4 leading-8 text-stone-600">{message.description}</p>
        <InvoiceDetails invoice={invoice} preview={preview} />
      </div>
      <Link href={preview ? "/preview/track" : "/track"} className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">{commonText.trackOrder}</Link>
      {preview && (
        <nav aria-label={ordersText.paymentStatesNavigation} className="flex flex-wrap gap-4 text-sm">
          {Object.entries(paymentMessages).map(([value, item]) => <Link key={value} className="text-teal-800 hover:underline" href={`/preview/result/${value}`}>{item.title}</Link>)}
        </nav>
      )}
    </section>
  );
}
