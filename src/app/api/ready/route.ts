import { getServerEnv } from "@/config/env.server";
import { readiness } from "@/lib/site/readiness";
export const dynamic = "force-dynamic";
export function GET() { const result = readiness(getServerEnv()); return Response.json(result, { status: result.status === "ready" ? 200 : 503, headers: { "Cache-Control": "private, no-store" } }); }
