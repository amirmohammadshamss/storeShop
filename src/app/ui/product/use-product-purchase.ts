"use client";
import { catalogText } from "@/content/fa/catalog";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/catalog";
import { addToCart } from "@/lib/shopping/state";
import { useShopping } from "../use-shopping";

export function useProductPurchase(product: Product, preview: boolean) {
  const { update } = useShopping(product.store.code, preview);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  function selections(form: HTMLFormElement) {
    const data = new FormData(form);
    return product.features.map((_, i) => String(data.get(`feature-${i}`) ?? ""));
  }
  async function continueCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const selected = selections(event.currentTarget);
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/checkout/draft", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeCode: product.store.code, productCode: product.code, preview, selections: selected }) });
      const result: { message?: string } = await response.json();
      if (!response.ok) { setMessage(result.message ?? catalogText.draftCreationFailed); return; }
      router.push("/result/payment");
    } catch { setMessage(catalogText.connectionFailedRetry); }
    finally { setPending(false); }
  }
  function addCart(form: HTMLFormElement | null) {
    if (!form || !form.reportValidity()) return;
    try { update(current => addToCart(current, product, selections(form))); setMessage(catalogText.cartAdded); }
    catch { setMessage(catalogText.cartAddFailed); }
  }
  return { pending, message, continueCheckout, addCart };
}
