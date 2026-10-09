"use client";
import { commonText } from "@/content/fa/common";
import type { ErrorPageProps } from "@/types/routes";
export default function ErrorPage({ reset }: ErrorPageProps) { return <section role="alert" className="space-y-6"><h1 className="text-2xl font-bold">{commonText.loadError}</h1><button onClick={reset} className="rounded-xl bg-teal-700 px-5 py-3 text-white">{commonText.retry}</button></section>; }
