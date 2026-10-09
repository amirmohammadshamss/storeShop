import { NextResponse } from "next/server";
import { isSameOrigin } from "./origin";
export function checkoutResponse(message: string, status: number) {
 return NextResponse.json({ message }, { status, headers: { "Cache-Control": "private, no-store" } });
}
export function sameOrigin(request: Request): boolean {
 return isSameOrigin(request, process.env.APP_ORIGIN);
}
export async function readSmallJson(request: Request): Promise<unknown> {
 if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("Expected JSON");
 const reader = request.body?.getReader(); if (!reader) throw new Error("Missing body");
 const chunks: Uint8Array[] = []; let size = 0;
 try {
  while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 12000) { await reader.cancel(); throw new Error("Body too large"); } chunks.push(value); }
 } finally { reader.releaseLock(); }
 return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
