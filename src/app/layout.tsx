import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LegacyWorkerCleanup } from "./ui/legacy-worker-cleanup";
export const metadata: Metadata = { title: { default: "فروشگاه", template: "%s | فروشگاه" }, description: "خرید آنلاین و پیگیری سفارش", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased"><LegacyWorkerCleanup /><a href="#main" className="sr-only focus:not-sr-only focus:block focus:p-4">رفتن به محتوای اصلی</a><header className="border-b border-stone-200 bg-white"><nav aria-label="ناوبری اصلی" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><Link href="/" className="text-xl font-bold">فروشگاه</Link><div className="flex gap-5 text-sm text-teal-800"><Link href="/track" className="hover:underline">پیگیری سفارش</Link><Link href="/preview/store" className="hover:underline">فروشگاه نمایشی</Link></div></nav></header><main id="main" className="mx-auto max-w-6xl px-6 py-12">{children}</main></body></html>;
}
