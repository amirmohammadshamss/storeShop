import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site/config";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
 const config = siteConfig(process.env);
 if (!config.indexing || !config.origin) return { rules: { userAgent: "*", disallow: "/" } };
 return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/result/", "/track/", "/preview/", "/js/", "/sw.js", "/service-worker.js"] }, sitemap: `${config.origin}/sitemap.xml` };
}
