import { checkoutText } from "@/content/fa/checkout";
import { getServerEnv } from "@/config/env.server";
import { MIN_SIGNING_SECRET_LENGTH, DRAFT_VERSION } from "@/constants/checkout";
import { NextResponse } from "next/server";
import { draftInputSchema, validateSelections } from "@/lib/checkout/validation";
import { draftProduct } from "@/lib/checkout/product";
import { DRAFT_COOKIE, DRAFT_LIFETIME, signDraft } from "@/lib/checkout/draft";
import { checkoutResponse, readSmallJson, sameOrigin } from "@/lib/checkout/http";
export async function POST(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse(checkoutText.invalidRequest, 403);
 let input;
 try { input = draftInputSchema.parse(await readSmallJson(request)); }
 catch { return checkoutResponse(checkoutText.invalidProductInput, 400); }
 const secret = getServerEnv().CHECKOUT_DRAFT_SECRET ?? "";
 if (secret.length < MIN_SIGNING_SECRET_LENGTH) return checkoutResponse(checkoutText.draftNotConfigured, 503);
 try {
  const product = await draftProduct(input);
  if (!product) return checkoutResponse(checkoutText.productNotFound, 404);
  if (!validateSelections(product, input.selections)) return checkoutResponse(checkoutText.selectAllOptions, 400);
  const token = signDraft({ ...input, version: DRAFT_VERSION, expires: Date.now() + DRAFT_LIFETIME * 1000 }, secret);
  const response = NextResponse.json({ destination: "/result/payment" }, { headers: { "Cache-Control": "private, no-store" } });
  response.cookies.set(DRAFT_COOKIE, token, { httpOnly: true, secure: getServerEnv().NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: DRAFT_LIFETIME });
  return response;
 } catch { return checkoutResponse(checkoutText.productReadFailedRetry, 503); }
}
export async function DELETE(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse(checkoutText.invalidRequest, 403);
 const response = checkoutResponse(checkoutText.draftRemoved, 200);
 response.cookies.set(DRAFT_COOKIE, "", { httpOnly: true, secure: getServerEnv().NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
 return response;
}
