"use client";
import { commonText } from "@/content/fa/common";
import type { CodeFormProps } from "@/types/ui";
import { MAX_IDENTIFIER_LENGTH } from "@/constants/catalog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeIdentifier, normalizeStoreCode } from "@/lib/catalog/identifiers";
export function CodeForm({ basePath, store = false, kind = "product" }: CodeFormProps) {
 const [error, setError] = useState(""); const router = useRouter();
 return <form className="flex flex-wrap items-end gap-3" onSubmit={event => {
  event.preventDefault();
  const value = String(new FormData(event.currentTarget).get("code") ?? "");
  const code = store ? normalizeStoreCode(value) : normalizeIdentifier(value);
  if (!code) { setError(commonText.invalidCode); return; }
  setError(""); router.push(`${basePath ?? ""}/${encodeURIComponent(code)}`);
 }}>
  <div className="min-w-48 flex-1"><label htmlFor={store ? "store-code" : `${kind}-code`} className="mb-2 block text-sm font-medium">{store ? commonText.storeCode : kind === "tracking" ? commonText.trackingCode : commonText.productCode}</label><input id={store ? "store-code" : `${kind}-code`} name="code" required maxLength={MAX_IDENTIFIER_LENGTH} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? "code-error" : undefined} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20" placeholder={store ? commonText.storeCodePlaceholder : kind === "tracking" ? commonText.trackingCodePlaceholder : commonText.productCodePlaceholder} /></div>
  <button className="rounded-xl bg-teal-800 px-6 py-3 font-medium text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800">{store ? commonText.enterStore : kind === "tracking" ? commonText.trackOrder : commonText.viewProduct}</button>
  {error && <p id="code-error" role="alert" className="w-full text-sm text-red-700">{error}</p>}
 </form>;
}
