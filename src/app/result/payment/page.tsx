import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { DRAFT_COOKIE, readDraft } from "@/lib/checkout/draft";
import { draftProduct } from "@/lib/checkout/product";
import { validateSelections } from "@/lib/checkout/validation";
import { CheckoutSummary } from "../../ui/checkout/checkout-summary";
import { CheckoutForm } from "../../ui/checkout-form";
export const metadata: Metadata = { title: "بررسی سفارش", robots: { index: false, follow: false } };
export default async function CheckoutPage() {
 const draft = readDraft((await cookies()).get(DRAFT_COOKIE)?.value, process.env.CHECKOUT_DRAFT_SECRET ?? "");
 if (!draft) return <section className="space-y-5"><h1 className="text-2xl font-bold">پیش‌نویس خرید در دسترس نیست</h1><p>ممکن است منقضی شده باشد. محصول را دوباره انتخاب کنید.</p><Link href="/" className="inline-block rounded-xl bg-teal-800 px-5 py-3 text-white">انتخاب فروشگاه</Link><Link href="/preview/store" className="block text-teal-800">فروشگاه نمایشی</Link></section>;
 const product = await draftProduct(draft);
 if (!product || !validateSelections(product, draft.selections)) return <section className="space-y-5"><h1 className="text-2xl font-bold">محصول یا گزینه‌های آن تغییر کرده است</h1><Link href="/" className="text-teal-800">انتخاب دوباره محصول</Link></section>;
 const basePath = draft.preview ? "/preview/store" : `/${encodeURIComponent(draft.storeCode)}`;
 return <div><h1 className="mb-8 text-3xl font-bold">بررسی سفارش</h1>{draft.preview && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">سفارش نمایشی — هیچ خرید واقعی انجام نمی‌شود.</p>}<div className="grid items-start gap-8 md:grid-cols-[1fr_2fr]"><CheckoutSummary product={product} draft={draft} /><CheckoutForm preview={draft.preview} backPath={`${basePath}/${encodeURIComponent(draft.productCode)}`} /></div></div>;
}
