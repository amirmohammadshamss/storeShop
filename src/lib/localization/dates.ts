import { commonText } from "@/content/fa/common";
import { PERSIAN_CALENDAR_LOCALE, TEHRAN_TIME_ZONE } from "@/constants/localization";
export function formatJalaliDate(unixSeconds: number): string {
 const date = new Date(unixSeconds * 1000);
 if (!Number.isFinite(date.getTime())) return commonText.invalidDate;
 return new Intl.DateTimeFormat(PERSIAN_CALENDAR_LOCALE, { year: "numeric", month: "long", day: "numeric", timeZone: TEHRAN_TIME_ZONE }).format(date);
}
