import { technicalText } from "@/content/technical";
import type { Draft } from "@/types/checkout";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { draftInputSchema } from "./validation";
import { DRAFT_LIFETIME, DRAFT_VERSION, MIN_SIGNING_SECRET_LENGTH, MAX_DRAFT_TOKEN_LENGTH } from "@/constants/checkout";
export { DRAFT_COOKIE, DRAFT_LIFETIME } from "@/constants/checkout";
export const draftSchema = draftInputSchema.extend({ expires: z.number().int().positive(), version: z.literal(DRAFT_VERSION) });

export function signDraft(draft: Draft, secret: string): string {
 if (secret.length < MIN_SIGNING_SECRET_LENGTH) throw new Error(technicalText.draftSecretRequired);
 const payload = Buffer.from(JSON.stringify(draftSchema.parse(draft))).toString("base64url");
 const token = `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
 if (token.length > MAX_DRAFT_TOKEN_LENGTH) throw new Error(technicalText.draftTooLarge);
 return token;
}
export function readDraft(token: string | undefined, secret: string, now = Date.now()): Draft | null {
 if (!token || token.length > MAX_DRAFT_TOKEN_LENGTH || secret.length < MIN_SIGNING_SECRET_LENGTH) return null;
 try {
  const parts = token.split("."); if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const draft = draftSchema.parse(JSON.parse(Buffer.from(payload, "base64url").toString()));
  return draft.expires > now && draft.expires <= now + DRAFT_LIFETIME * 1000 ? draft : null;
 } catch { return null; }
}

export type { Draft } from "@/types/checkout";
