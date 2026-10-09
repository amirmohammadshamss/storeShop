import { PERSIAN_LOCALE } from "@/constants/localization";
export function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, digit => { const code = digit.charCodeAt(0); return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660); });
}
export function normalizeIranianMobile(value: string): string | null {
  const normalized = normalizeDigits(value).trim().replace(/[\s-]/g, "");
  return /^09\d{9}$/.test(normalized) ? normalized : null;
}
export function formatPersianNumber(value: number): string { return new Intl.NumberFormat(PERSIAN_LOCALE).format(value); }
