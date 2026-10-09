"use client";
import { checkoutText } from "@/content/fa/checkout";
import type { CheckoutFormProps } from "@/types/ui";
import { customerFields } from "@/lib/checkout/fields";
import { CustomerField } from "./checkout/customer-field";
import { DraftActions } from "./checkout/draft-actions";
import { useCustomerReview } from "./checkout/use-customer-review";

export function CheckoutForm({ preview, backPath }: CheckoutFormProps) {
  const { errors, reviewed, review, clearReview } = useCustomerReview();
  return (
    <form noValidate className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6" onChange={clearReview} onSubmit={review}>
      <h2 className="text-xl font-bold">{checkoutText.customerDetails}</h2>
      <p className="text-sm leading-7 text-stone-600">
        {preview ? checkoutText.sampleCustomerHintPrefix : ""}
        {checkoutText.customerPrivacyNotice}</p>
      {customerFields.map(field => <CustomerField key={field.name} field={field} error={errors[field.name]} />)}
      <button className="w-full rounded-xl bg-teal-800 px-5 py-3 text-white hover:bg-teal-900">{checkoutText.reviewDetails}</button>
      {reviewed && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">{checkoutText.reviewSucceeded}</p>}
      <button disabled className="w-full rounded-xl bg-stone-200 px-5 py-3 text-stone-500">{checkoutText.paymentDisabled}</button>
      <DraftActions backPath={backPath} />
    </form>
  );
}
