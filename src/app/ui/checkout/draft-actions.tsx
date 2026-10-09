"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DraftActions({ backPath }: { backPath: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function removeDraft() {
    setPending(true);
    try {
      const response = await fetch("/api/checkout/draft", { method: "DELETE" });
      if (response.ok) { router.replace(backPath); router.refresh(); }
      else setMessage("حذف پیش‌نویس ممکن نیست.");
    } catch { setMessage("ارتباط برقرار نشد."); }
    finally { setPending(false); }
  }
  return (
    <>
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href={backPath} className="text-teal-800 hover:underline">ویرایش محصول</Link>
        <button type="button" disabled={pending} className="text-stone-600 hover:underline" onClick={removeDraft}>حذف پیش‌نویس</button>
      </div>
      {message && <p role="alert" className="text-red-700">{message}</p>}
    </>
  );
}
