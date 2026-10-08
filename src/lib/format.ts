import type { Locale } from "@/i18n/config";
import { fromOrd, toOrd } from "@/lib/booking";

const intlLocale: Record<Locale, string> = { en: "en-GB" };

const DAY_MS = 86_400_000;
const utc = (ord: number) => new Date(ord * DAY_MS);

function fmt(locale: Locale, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(intlLocale[locale], { timeZone: "UTC", ...options });
}

/** "Tue 1 Dec" */
export function formatDay(ord: number, locale: Locale) {
  return fmt(locale, { weekday: "short", day: "numeric", month: "short" }).format(utc(ord));
}

/** "1 Dec" */
export function formatDayMonth(ord: number, locale: Locale) {
  return fmt(locale, { day: "numeric", month: "short" }).format(utc(ord));
}

/** "Dec" */
export function formatMonthShort(ord: number, locale: Locale) {
  return fmt(locale, { month: "short" }).format(utc(ord));
}

/** "December 2026" */
export function formatMonthYear(ord: number, locale: Locale) {
  return fmt(locale, { month: "long", year: "numeric" }).format(utc(ord));
}

/** "December" from "2026-12" */
export function formatMonthName(month: string, locale: Locale) {
  return fmt(locale, { month: "long" }).format(utc(toOrd(`${month}-01`)));
}

/** "8 Oct 2026" */
export function formatDate(iso: string, locale: Locale) {
  return fmt(locale, { day: "numeric", month: "short", year: "numeric" }).format(utc(toOrd(iso)));
}

/** "Tue 1 – Tue 15 Dec" or "Sun 20 Dec – Sun 3 Jan" */
export function formatStay(start: number, end: number, locale: Locale) {
  const sameMonth = fromOrd(start).slice(0, 7) === fromOrd(end).slice(0, 7);
  const first = sameMonth
    ? fmt(locale, { weekday: "short", day: "numeric" }).format(utc(start))
    : formatDay(start, locale);
  return `${first} – ${formatDay(end, locale)}`;
}

/** "1–27 Dec" or "28 Dec – 11 Jan" (both days inclusive) */
export function formatDayRange(first: number, last: number, locale: Locale) {
  const sameMonth = fromOrd(first).slice(0, 7) === fromOrd(last).slice(0, 7);
  if (sameMonth) return `${utc(first).getUTCDate()}–${formatDayMonth(last, locale)}`;
  return `${formatDayMonth(first, locale)} – ${formatDayMonth(last, locale)}`;
}

export function formatEuro(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocale[locale], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function formatList(items: string[], locale: Locale) {
  return new Intl.ListFormat(intlLocale[locale], { type: "conjunction" }).format(items);
}

export function weekdayInitials(locale: Locale) {
  // 2024-01-01 is a Monday.
  const monday = toOrd("2024-01-01");
  return Array.from({ length: 7 }, (_, i) => fmt(locale, { weekday: "narrow" }).format(utc(monday + i)));
}

/** Replaces `{name}` placeholders. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
