import { cookies } from "next/headers";
import { customerSchema, purchasePayload, validateSelections } from "@/lib/checkout/validation";
import { DRAFT_COOKIE, readDraft } from "@/lib/checkout/draft";
import { draftProduct } from "@/lib/checkout/product";
import { checkoutResponse, readSmallJson, sameOrigin } from "@/lib/checkout/http";
export async function POST(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse("درخواست معتبر نیست.", 403);
 const draft = readDraft((await cookies()).get(DRAFT_COOKIE)?.value, process.env.CHECKOUT_DRAFT_SECRET ?? "");
 if (!draft) return checkoutResponse("پیش‌نویس خرید منقضی شده است؛ محصول را دوباره انتخاب کنید.", 409);
 let customer;
 try { customer = customerSchema.parse(await readSmallJson(request)); }
 catch { return checkoutResponse("اطلاعات خریدار را بررسی کنید.", 400); }
 try {
  const product = await draftProduct(draft);
  if (!product || !validateSelections(product, draft.selections)) return checkoutResponse("محصول یا گزینه‌های آن تغییر کرده است.", 409);
  // Prepare only; no upstream purchase request until price, inventory, and idempotency contracts are verified.
  purchasePayload(product, draft.selections, customer);
  return checkoutResponse(draft.preview ? "این سفارش نمایشی است؛ هیچ خرید یا پرداختی انجام نشده است." : "پرداخت تا تأیید قرارداد خرید و جلوگیری از تراکنش تکراری فعال نیست.", 503);
 } catch { return checkoutResponse("دریافت اطلاعات محصول ممکن نیست.", 503); }
}
