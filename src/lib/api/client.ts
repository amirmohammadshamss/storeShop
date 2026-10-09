import "server-only";
import { z } from "zod";
export class BackendError extends Error {
 constructor(public readonly kind: "configuration" | "network" | "http" | "schema", public readonly status?: number) { super(`Backend request failed: ${kind}`); }
}
export async function readBackend<T>(path: string, schema: z.ZodType<T>): Promise<T> {
 const configured = process.env.BACKEND_API_URL;
 if (!configured) throw new BackendError("configuration");
 let url: URL;
 try {
  const base = new URL(configured.endsWith("/") ? configured : `${configured}/`);
  url = new URL(path.replace(/^\/+/, ""), base);
  if (!["https:", "http:"].includes(base.protocol) || url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) throw new Error("Invalid path");
 } catch { throw new BackendError("configuration"); }
 let response: Response;
 try { response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000), redirect: "error" }); }
 catch { throw new BackendError("network"); }
 if (!response.ok) throw new BackendError("http", response.status);
 try { return schema.parse(await response.json()); }
 catch { throw new BackendError("schema"); }
}
