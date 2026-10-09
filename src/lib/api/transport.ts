import { technicalText } from "@/content/technical";
import type { BackendFailureKind, BackendRequestOptions, ReadPolicy } from "@/types/api";
import { BACKEND_TIMEOUT_MS, MAX_CATALOG_CACHE_SECONDS } from "@/constants/api";
import type { z } from "zod";
export class BackendError extends Error {
 constructor(public readonly kind: BackendFailureKind, public readonly status?: number) { super(technicalText.catalogCacheSecondsMessageTemplate(kind)); }
}

export function catalogCacheSeconds(configured: string | undefined): number {
 if (configured === undefined || configured === "") return 0;
 if (!/^\d+$/.test(configured)) throw new BackendError("configuration");
 const seconds = Number(configured);
 if (!Number.isInteger(seconds) || seconds < 0 || seconds > MAX_CATALOG_CACHE_SECONDS) throw new BackendError("configuration");
 return seconds;
}
export async function requestBackend<T>(
 baseUrl: string | undefined, path: string, schema: z.ZodType<T>, policy: ReadPolicy = "private", catalogTtl = 0,
 fetcher: typeof fetch = fetch,
): Promise<T> {
 if (!baseUrl) throw new BackendError("configuration");
 let url: URL;
 try {
  const base = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  url = new URL(path.replace(/^\/+/, ""), base);
  if (!["https:", "http:"].includes(base.protocol) || base.username || base.password || base.search || base.hash || url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || url.username || url.password) throw new Error(technicalText.invalidPath);
 } catch { throw new BackendError("configuration"); }
 if (!Number.isInteger(catalogTtl) || catalogTtl < 0 || catalogTtl > MAX_CATALOG_CACHE_SECONDS) throw new BackendError("configuration");
 const options: BackendRequestOptions = { signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS), redirect: "error" };
 if (policy === "catalog" && catalogTtl > 0) options.next = { revalidate: catalogTtl };
 else options.cache = "no-store";
 let response: Response;
 try { response = await fetcher(url, options); }
 catch { throw new BackendError("network"); }
 if (!response.ok) throw new BackendError("http", response.status);
 try { return schema.parse(await response.json()); }
 catch { throw new BackendError("schema"); }
}

export type { BackendFailureKind } from "@/types/api";
export type { BackendRequestOptions } from "@/types/api";
export type { ReadPolicy } from "@/types/api";
