import { commonText } from "@/content/fa/common";
import type { InvoiceDetailsProps } from "@/types/ui";

import { formatJalaliDate } from "@/lib/localization/dates";
import { formatPersianNumber } from "@/lib/localization/numbers";

export function InvoiceDetails({ invoice, preview }: InvoiceDetailsProps) {
  return (
    <dl className="mt-6 space-y-4">
      <div className="flex justify-between gap-4"><dt>{commonText.invoiceNumber}</dt><dd><bdi>{invoice.invoice_id}</bdi></dd></div>
      <div className="flex justify-between gap-4"><dt>{commonText.date}</dt><dd>{formatJalaliDate(invoice.create_date_unix_time)}</dd></div>
      <div className="flex justify-between gap-4"><dt>{commonText.amount}</dt><dd>{formatPersianNumber(invoice.amount)} {preview ? commonText.toman : commonText.apiUnit}</dd></div>
      {invoice.order_tracking_code && <div className="flex justify-between gap-4"><dt>{commonText.trackingCode}</dt><dd><bdi>{invoice.order_tracking_code}</bdi></dd></div>}
    </dl>
  );
}
