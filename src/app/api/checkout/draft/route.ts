import { NextResponse } from "next/server";
import { draftInputSchema, validateSelections } from "@/lib/checkout/validation";
import { draftProduct } from "@/lib/checkout/product";
import { DRAFT_COOKIE, DRAFT_LIFETIME, signDraft } from "@/lib/checkout/draft";
import { checkoutResponse, readSmallJson, sameOrigin } from "@/lib/checkout/http";
export async function POST(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse("درخواست معتبر نیست.", 403);
 let input;
 try { input = draftInputSchema.parse(await readSmallJson(request)); }
 catch { return checkoutResponse("محصول و گزینه‌ها را بررسی کنید.", 400); }
 const secret = process.env.CHECKOUT_DRAFT_SECRET ?? "";
 if (secret.length < 32) return checkoutResponse("پیش‌نویس خرید هنوز پیکربندی نشده است.", 503);
 try {
  const product = await draftProduct(input);
  if (!product) return checkoutResponse("محصول پیدا نشد.", 404);
  if (!validateSelections(product, input.selections)) return checkoutResponse("همه گزینه‌های محصول را انتخاب کنید.", 400);
  const token = signDraft({ ...input, version: 1, expires: Date.now() + DRAFT_LIFETIME * 1000 }, secret);
  const response = NextResponse.json({ destination: "/result/payment" }, { headers: { "Cache-Control": "private, no-store" } });
  response.cookies.set(DRAFT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: DRAFT_LIFETIME });
  return response;
 } catch { return checkoutResponse("دریافت اطلاعات محصول ممکن نیست؛ دوباره تلاش کنید.", 503); }
}
export async function DELETE(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse("درخواست معتبر نیست.", 403);
 const response = checkoutResponse("پیش‌نویس حذف شد.", 200);
 response.cookies.set(DRAFT_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
 return response;
}
