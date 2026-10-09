import { previewText } from "@/content/fa/preview";
import type { Metadata } from "next";
import { CodeForm } from "../../ui/code-form";
export const metadata: Metadata = { title: previewText.previewTracking, robots: { index: false, follow: false } };
export default function PreviewTrackPage() {
 return <section className="mx-auto max-w-xl space-y-6 rounded-2xl border border-stone-200 bg-white p-8"><h1 className="text-2xl font-bold">{previewText.previewTracking}</h1><p className="rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-900">{previewText.sampleTrackingHint}</p><CodeForm basePath="/preview/track" kind="tracking" /></section>;
}
