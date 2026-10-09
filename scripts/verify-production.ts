import { startFixtureBackend } from "./fixture-backend";
import { runProductionCheck } from "./production-server";

const backend = await startFixtureBackend();
try {
 await runProductionCheck("scripts/smoke.ts", { BACKEND_API_URL: backend.url });
 // Enable gated order reads only in this isolated fixture instance, never against AdminChannel.
 await runProductionCheck("scripts/contracts-smoke.ts", { BACKEND_API_URL: backend.url, ORDER_LOOKUP_ENABLED: "true", SITE_ORIGIN: "https://shop.fixture.test", CATALOG_INDEXING_ENABLED: "true", PUBLIC_STORE_CODES: "fixture" });
 if (backend.purchaseCount() !== 0) throw new Error("Verification unexpectedly called a backend mutation.");
} finally { await backend.close(); }
