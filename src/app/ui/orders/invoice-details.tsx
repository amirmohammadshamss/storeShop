import type { Invoice } from "@/lib/orders/schema";
import { formatJalaliDate } from "@/lib/localization/dates";
import { formatPersianNumber } from "@/lib/localization/numbers";

export function InvoiceDetails({ invoice, preview }: { invoice: Invoice; preview: boolean }) {
  return (
    <dl className="mt-6 space-y-4">
      <div className="flex justify-between gap-4"><dt>شماره فاکتور</dt><dd><bdi>{invoice.invoice_id}</bdi></dd></div>
      <div className="flex justify-between gap-4"><dt>تاریخ</dt><dd>{formatJalaliDate(invoice.create_date_unix_time)}</dd></div>
      <div className="flex justify-between gap-4"><dt>مبلغ</dt><dd>{formatPersianNumber(invoice.amount)} {preview ? "تومان" : "واحد API"}</dd></div>
      {invoice.order_tracking_code && <div className="flex justify-between gap-4"><dt>کد پیگیری</dt><dd><bdi>{invoice.order_tracking_code}</bdi></dd></div>}
    </dl>
  );
}
