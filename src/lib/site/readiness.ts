export function readiness(env: { BACKEND_API_URL?: string; CHECKOUT_DRAFT_SECRET?: string; APP_ORIGIN?: string; NODE_ENV?: string }) {
 let backendConfigured = false; let publicOriginConfigured = false;
 try { const url = new URL(env.BACKEND_API_URL ?? ""); backendConfigured = ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash; } catch { /* Invalid or absent configuration. */ }
 try { const url = new URL(env.APP_ORIGIN ?? ""); const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname); publicOriginConfigured = ["http:", "https:"].includes(url.protocol) && url.origin === env.APP_ORIGIN && (env.NODE_ENV !== "production" || url.protocol === "https:" || loopback); } catch { /* Invalid or absent configuration. */ }
 const draftSigningConfigured = (env.CHECKOUT_DRAFT_SECRET?.length ?? 0) >= 32;
 const ready = backendConfigured && draftSigningConfigured && (env.NODE_ENV !== "production" || publicOriginConfigured);
 return { status: ready ? "ready" : "not-ready", checks: { backendConfigured, draftSigningConfigured, publicOriginConfigured } };
}
