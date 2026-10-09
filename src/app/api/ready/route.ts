import { readiness } from "@/lib/site/readiness";
export const dynamic = "force-dynamic";
export function GET() { const result = readiness(process.env); return Response.json(result, { status: result.status === "ready" ? 200 : 503, headers: { "Cache-Control": "private, no-store" } }); }
