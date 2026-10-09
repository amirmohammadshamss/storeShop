export type EnvironmentSource = Record<string, string | undefined>;
export type ServerEnvironment = EnvironmentSource & {
  BACKEND_API_URL?: string;
  BACKEND_CATALOG_TTL_SECONDS?: string;
  CHECKOUT_DRAFT_SECRET?: string;
  APP_ORIGIN?: string;
  ORDER_LOOKUP_ENABLED?: string;
  SITE_ORIGIN?: string;
  CATALOG_INDEXING_ENABLED?: string;
  PUBLIC_STORE_CODES?: string;
  NODE_ENV?: string;
};
