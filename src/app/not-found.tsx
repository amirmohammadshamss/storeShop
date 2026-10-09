import { commonText } from "@/content/fa/common";
import Link from "next/link";
export default function NotFound() { return <section className="space-y-6"><h1 className="text-2xl font-bold">{commonText.notFound}</h1><p>{commonText.checkAddress}</p><Link className="inline-block rounded-xl bg-teal-700 px-5 py-3 text-white" href="/">{commonText.backHome}</Link></section>; }
