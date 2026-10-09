import { getServerEnv } from "@/config/env.server";
import { PRIVATE_CRAWL_PATHS } from "@/constants/site";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site/config";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
 const config = siteConfig(getServerEnv());
 if (!config.indexing || !config.origin) return { rules: { userAgent: "*", disallow: "/" } };
 return { rules: { userAgent: "*", allow: "/", disallow: PRIVATE_CRAWL_PATHS }, sitemap: `${config.origin}/sitemap.xml` };
}
