import "server-only";
import { cacheLife } from "next/cache";
import { fromOrd, toOrd, type DateRange } from "@/lib/booking";

export type Availability = { booked: DateRange[] | null; checkedAt?: string };

/** Mock for local development without the feed: the 2026-10-08 snapshot. */
const DEV_MOCK: DateRange[] = [
  { from: "2026-12-28", to: "2027-01-12" },
  { from: "2027-01-24", to: "2027-03-20" },
];

/** `20261228` or `20261228T150000Z` → `2026-12-28` */
function icalDate(value: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** Reads VEVENT DTSTART/DTEND (all-day DATE values; DTEND is the exclusive check-out day). */
export function parseIcal(text: string): DateRange[] {
  // Unfold continuation lines (RFC 5545 §3.1).
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const ranges: DateRange[] = [];
  let event: { from?: string | null; to?: string | null } | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") event = {};
    else if (line === "END:VEVENT" && event) {
      if (event.from) {
        const to = event.to && event.to > event.from ? event.to : fromOrd(toOrd(event.from) + 1);
        ranges.push({ from: event.from, to });
      }
      event = null;
    } else if (event) {
      const [name, value = ""] = splitProperty(line);
      if (name === "DTSTART") event.from = icalDate(value);
      if (name === "DTEND") event.to = icalDate(value);
    }
  }
  if (!ranges.length && !text.includes("BEGIN:VCALENDAR")) throw new Error("Not an iCal feed");
  return ranges.sort((a, b) => a.from.localeCompare(b.from));
}

function splitProperty(line: string): [string, string] {
  const colon = line.indexOf(":");
  if (colon < 0) return [line, ""];
  return [line.slice(0, colon).split(";")[0], line.slice(colon + 1)];
}

/** Booked ranges from the Airbnb iCal feed, cached for an hour. Throws on failure so errors are not cached. */
export async function getBookedRanges(): Promise<Availability> {
  "use cache";
  cacheLife("hours");
  const url = process.env.AIRBNB_ICAL_URL;
  if (!url?.startsWith("https://")) {
    if (process.env.NODE_ENV === "development") return { booked: DEV_MOCK, checkedAt: new Date().toISOString() };
    throw new Error("Availability feed is not configured");
  }
  const res = await fetch(url, { headers: { accept: "text/calendar" } });
  if (!res.ok) throw new Error(`Availability feed responded ${res.status}`);
  return { booked: parseIcal(await res.text()), checkedAt: new Date().toISOString() };
}
