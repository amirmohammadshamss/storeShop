import { page } from "./client";

export async function verifyOrders() {
  await page("/track", "استعلام واقعی");
  await page("/track/12345", "استعلام سفارش هنوز فعال نیست");
  await page("/result/example", "استعلام سفارش هنوز فعال نیست");
  await page("/preview/track/12345", "در حال آماده‌سازی");
  for (const [state, phrase] of [["success", "پرداخت تأیید شد"], ["failed", "پرداخت ناموفق"], ["cancelled", "پرداخت لغو شد"], ["pending", "در انتظار تأیید پرداخت"], ["unknown", "وضعیت پرداخت مشخص نیست"]]) await page(`/preview/result/${state}`, phrase);
}
