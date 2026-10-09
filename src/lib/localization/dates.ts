export function formatJalaliDate(unixSeconds: number): string {
 const date = new Date(unixSeconds * 1000);
 if (!Number.isFinite(date.getTime())) return "تاریخ نامعتبر";
 return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran" }).format(date);
}
