export function isSameOrigin(request: Request, configuredOrigin?: string): boolean {
 const origin = request.headers.get("origin");
 if (!origin || origin === "null") return false;
 try {
  const parsed = new URL(origin);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.origin !== origin) return false;
  if (configuredOrigin) {
   const configured = new URL(configuredOrigin);
   return configured.origin === configuredOrigin && origin === configuredOrigin;
  }
  // Next.js may build request.url with its internal listen hostname. Host retains the requested authority.
  // Never use untrusted forwarded-host/proto headers as an origin allowlist.
  const host = request.headers.get("host");
  if (!host || /[\s\/@?#]/.test(host)) return false;
  const expected = new URL(`${new URL(request.url).protocol}//${host}`);
  return expected.origin === origin;
 } catch { return false; }
}
