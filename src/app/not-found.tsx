import Link from "next/link";
export default function NotFound() { return <section className="space-y-6"><h1 className="text-2xl font-bold">صفحه پیدا نشد</h1><p>نشانی صفحه را بررسی کنید.</p><Link className="inline-block rounded-xl bg-teal-700 px-5 py-3 text-white" href="/">بازگشت به خانه</Link></section>; }
