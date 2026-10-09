import { randomUUID } from "node:crypto";
import type { BackendError } from "./transport";
export function backendFailureEvent(error: BackendError) {
 return { event: "backend_read_failed", correlationId: randomUUID(), kind: error.kind, ...(error.status !== undefined ? { status: error.status } : {}) };
}
