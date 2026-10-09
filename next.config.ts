import type { NextConfig } from "next";
const config: NextConfig = {
 poweredByHeader: false,
 async headers() {
  return [{ source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }] }, ...["/result/:path*", "/track/:path*", "/api/:path*"].map(source => ({ source, headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Referrer-Policy", value: "no-referrer" }] }))];
 },
};
export default config;
