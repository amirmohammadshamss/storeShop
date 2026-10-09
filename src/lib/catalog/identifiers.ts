import { normalizeDigits } from "../localization/numbers";
const reserved = new Set(["track", "result", "preview", "api"]);
export function normalizeIdentifier(value: string): string | null {
 const normalized = normalizeDigits(value).trim();
 return /^[a-zA-Z0-9_-]{1,80}$/.test(normalized) ? normalized : null;
}
export function normalizeStoreCode(value: string): string | null {
 const code = normalizeIdentifier(value);
 return code && !reserved.has(code.toLowerCase()) ? code : null;
}
