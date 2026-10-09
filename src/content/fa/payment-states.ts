import type { PaymentMessage } from "@/types/orders";
import type { PaymentState } from "@/types/orders";

export const paymentMessages: Record<PaymentState, PaymentMessage> = {
  success: { title: "پرداخت تأیید شد", description: "سرویس پرداخت وضعیت موفق را گزارش کرده است." },
  failed: { title: "پرداخت ناموفق", description: "پرداخت تکمیل نشده است. پیش از تلاش دوباره وضعیت سفارش را بررسی کنید." },
  cancelled: { title: "پرداخت لغو شد", description: "پرداخت لغو شده است؛ سفارش جدیدی به‌صورت خودکار ایجاد نمی‌شود." },
  pending: { title: "در انتظار تأیید پرداخت", description: "هنوز نتیجه قطعی دریافت نشده است. این صفحه را دوباره بررسی کنید." },
  unknown: { title: "وضعیت پرداخت مشخص نیست", description: "موفقیت پرداخت تأیید نشده است. بدون بررسی وضعیت، خرید را تکرار نکنید." },
};
