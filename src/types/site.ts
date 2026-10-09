

export type SiteConfig = { origin: string | null; indexing: boolean; storeCodes: string[] };

export type ReadinessEnvironment = { BACKEND_API_URL?: string; CHECKOUT_DRAFT_SECRET?: string; APP_ORIGIN?: string; NODE_ENV?: string };
