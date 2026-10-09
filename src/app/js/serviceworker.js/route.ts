import { retirementResponse } from "@/lib/worker-response";
export const dynamic = "force-dynamic";
export function GET() { return retirementResponse(); }
