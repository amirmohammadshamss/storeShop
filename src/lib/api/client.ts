import "server-only";
import type { z } from "zod";
import { BackendError, catalogCacheSeconds, requestBackend, type ReadPolicy } from "./transport";
import { backendFailureEvent } from "./events";
export { BackendError } from "./transport";
export async function readBackend<T>(path: string, schema: z.ZodType<T>, policy: ReadPolicy = "private"): Promise<T> {
 try {
  const ttl = policy === "catalog" ? catalogCacheSeconds(process.env.BACKEND_CATALOG_TTL_SECONDS) : 0;
  return await requestBackend(process.env.BACKEND_API_URL, path, schema, policy, ttl);
 } catch (error) {
  if (error instanceof BackendError) console.error(JSON.stringify(backendFailureEvent(error)));
  throw error;
 }
}
