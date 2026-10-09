"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <section role="alert" className="space-y-6"><h1 className="text-2xl font-bold">دریافت اطلاعات ممکن نیست</h1><button onClick={reset} className="rounded-xl bg-teal-700 px-5 py-3 text-white">تلاش دوباره</button></section>; }
