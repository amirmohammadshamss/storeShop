import type { ReadinessEnvironment } from "@/types/site";
import { LOOPBACK_HOSTS } from "@/constants/site";
import { MIN_SIGNING_SECRET_LENGTH } from "@/constants/checkout";
export function readiness(env: ReadinessEnvironment) {
 let backendConfigured = false; let publicOriginConfigured = false;
 try { const url = new URL(env.BACKEND_API_URL ?? ""); backendConfigured = ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash; } catch { /* Invalid or absent configuration. */ }
 try { const url = new URL(env.APP_ORIGIN ?? ""); const loopback = LOOPBACK_HOSTS.includes(url.hostname); publicOriginConfigured = ["http:", "https:"].includes(url.protocol) && url.origin === env.APP_ORIGIN && (env.NODE_ENV !== "production" || url.protocol === "https:" || loopback); } catch { /* Invalid or absent configuration. */ }
 const draftSigningConfigured = (env.CHECKOUT_DRAFT_SECRET?.length ?? 0) >= MIN_SIGNING_SECRET_LENGTH;
 const ready = backendConfigured && draftSigningConfigured && (env.NODE_ENV !== "production" || publicOriginConfigured);
 return { status: ready ? "ready" : "not-ready", checks: { backendConfigured, draftSigningConfigured, publicOriginConfigured } };
}
