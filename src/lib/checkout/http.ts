import { technicalText } from "@/content/technical";
import { getServerEnv } from "@/config/env.server";
import { MAX_CHECKOUT_BODY_BYTES } from "@/constants/checkout";
import { NextResponse } from "next/server";
import { isSameOrigin } from "./origin";
export function checkoutResponse(message: string, status: number) {
 return NextResponse.json({ message }, { status, headers: { "Cache-Control": "private, no-store" } });
}
export function sameOrigin(request: Request): boolean {
 return isSameOrigin(request, getServerEnv().APP_ORIGIN);
}
export async function readSmallJson(request: Request): Promise<unknown> {
 if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error(technicalText.expectedJson);
 const reader = request.body?.getReader(); if (!reader) throw new Error(technicalText.missingBody);
 const chunks: Uint8Array[] = []; let size = 0;
 try {
  while (true) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > MAX_CHECKOUT_BODY_BYTES) { await reader.cancel(); throw new Error(technicalText.bodyTooLarge); } chunks.push(value); }
 } finally { reader.releaseLock(); }
 return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
