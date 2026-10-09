import { getServerEnv } from "@/config/env.server";
import "server-only";
import type { z } from "zod";
import { BackendError, catalogCacheSeconds, requestBackend } from "./transport";
import type { ReadPolicy } from "@/types/api";
import { backendFailureEvent } from "./events";
export { BackendError } from "./transport";
export async function readBackend<T>(path: string, schema: z.ZodType<T>, policy: ReadPolicy = "private"): Promise<T> {
 try {
  const ttl = policy === "catalog" ? catalogCacheSeconds(getServerEnv().BACKEND_CATALOG_TTL_SECONDS) : 0;
  return await requestBackend(getServerEnv().BACKEND_API_URL, path, schema, policy, ttl);
 } catch (error) {
  if (error instanceof BackendError) console.error(JSON.stringify(backendFailureEvent(error)));
  throw error;
 }
}
