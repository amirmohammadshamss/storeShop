import type { NextConfig } from "next";
const config: NextConfig = {
 poweredByHeader: false,
 async headers() {
  return ["/result/:path*", "/track/:path*", "/api/checkout/:path*"].map(source => ({ source, headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Referrer-Policy", value: "no-referrer" }] }));
 },
};
export default config;
