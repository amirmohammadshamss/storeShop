import { normalizeDigits } from "../localization/numbers";
import { RESERVED_STORE_CODES, IDENTIFIER_PATTERN } from "@/constants/catalog";
const reserved: ReadonlySet<string> = new Set(RESERVED_STORE_CODES);
export function normalizeIdentifier(value: string): string | null {
 const normalized = normalizeDigits(value).trim();
 return IDENTIFIER_PATTERN.test(normalized) ? normalized : null;
}
export function normalizeStoreCode(value: string): string | null {
 const code = normalizeIdentifier(value);
 return code && !reserved.has(code.toLowerCase()) ? code : null;
}
