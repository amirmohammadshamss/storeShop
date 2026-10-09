import { checkoutText } from "@/content/fa/checkout";
import { getServerEnv } from "@/config/env.server";
import { cookies } from "next/headers";
import { customerSchema, purchasePayload, validateSelections } from "@/lib/checkout/validation";
import { DRAFT_COOKIE, readDraft } from "@/lib/checkout/draft";
import { draftProduct } from "@/lib/checkout/product";
import { checkoutResponse, readSmallJson, sameOrigin } from "@/lib/checkout/http";
export async function POST(request: Request) {
 if (!sameOrigin(request)) return checkoutResponse(checkoutText.invalidRequest, 403);
 const draft = readDraft((await cookies()).get(DRAFT_COOKIE)?.value, getServerEnv().CHECKOUT_DRAFT_SECRET ?? "");
 if (!draft) return checkoutResponse(checkoutText.draftExpired, 409);
 let customer;
 try { customer = customerSchema.parse(await readSmallJson(request)); }
 catch { return checkoutResponse(checkoutText.invalidCustomer, 400); }
 try {
  const product = await draftProduct(draft);
  if (!product || !validateSelections(product, draft.selections)) return checkoutResponse(checkoutText.productChanged, 409);
  // Prepare only; no upstream purchase request until price, inventory, and idempotency contracts are verified.
  purchasePayload(product, draft.selections, customer);
  return checkoutResponse(draft.preview ? checkoutText.previewPurchaseDisabled : checkoutText.livePurchaseDisabled, 503);
 } catch { return checkoutResponse(checkoutText.productReadFailed, 503); }
}
