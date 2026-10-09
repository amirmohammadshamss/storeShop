import "server-only";
import type { ServerEnvironment } from "@/types/environment";

// Read at request time so deployment configuration is not frozen during module loading.
// Domain validators retain their existing behavior; optional preview configuration stays optional.
export function getServerEnv(): ServerEnvironment {
  return {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    BACKEND_CATALOG_TTL_SECONDS: process.env.BACKEND_CATALOG_TTL_SECONDS,
    CHECKOUT_DRAFT_SECRET: process.env.CHECKOUT_DRAFT_SECRET,
    APP_ORIGIN: process.env.APP_ORIGIN,
    ORDER_LOOKUP_ENABLED: process.env.ORDER_LOOKUP_ENABLED,
    SITE_ORIGIN: process.env.SITE_ORIGIN,
    CATALOG_INDEXING_ENABLED: process.env.CATALOG_INDEXING_ENABLED,
    PUBLIC_STORE_CODES: process.env.PUBLIC_STORE_CODES,
    NODE_ENV: process.env.NODE_ENV,
  };
}
