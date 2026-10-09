"use client";
import { useState, type FormEvent } from "react";
import { customerSchema } from "@/lib/checkout/validation";

export function useCustomerReview() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState(false);
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = customerSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    const nextErrors: Record<string, string> = {};
    if (!result.success) for (const issue of result.error.issues) nextErrors[String(issue.path[0])] = issue.message;
    setErrors(nextErrors);
    setReviewed(result.success);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const input = event.currentTarget.elements.namedItem(firstError);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.focus();
    }
  }
  return { errors, reviewed, review, clearReview: () => setReviewed(false) };
}
