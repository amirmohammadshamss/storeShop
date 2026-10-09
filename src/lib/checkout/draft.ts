import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { draftInputSchema } from "./validation";
export const DRAFT_COOKIE = "storeshop_draft";
export const DRAFT_LIFETIME = 30 * 60;
const schema = draftInputSchema.extend({ expires: z.number().int().positive(), version: z.literal(1) });
export type Draft = z.infer<typeof schema>;
export function signDraft(draft: Draft, secret: string): string {
 if (secret.length < 32) throw new Error("Draft secret must be configured");
 const payload = Buffer.from(JSON.stringify(schema.parse(draft))).toString("base64url");
 const token = `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
 if (token.length > 3500) throw new Error("Draft is too large");
 return token;
}
export function readDraft(token: string | undefined, secret: string, now = Date.now()): Draft | null {
 if (!token || token.length > 3500 || secret.length < 32) return null;
 try {
  const parts = token.split("."); if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const draft = schema.parse(JSON.parse(Buffer.from(payload, "base64url").toString()));
  return draft.expires > now && draft.expires <= now + DRAFT_LIFETIME * 1000 ? draft : null;
 } catch { return null; }
}
