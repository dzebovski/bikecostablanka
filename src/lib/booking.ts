/**
 * Booking rules. Pure functions only, no React and no local-time Date maths.
 * Dates are calendar dates in Europe/Madrid, handled as day ordinals
 * (days since 1970-01-01) or as `YYYY-MM-DD` strings.
 */

export const MIN_NIGHTS = 11;
export const MAX_GUESTS = 5;
export const MAX_INFANTS = 5;

const DAY_MS = 86_400_000;

/** A booked stretch from the iCal feed: `to` is exclusive (the check-out day). */
export type DateRange = { from: string; to: string };
export type OrdRange = { from: number; to: number };
export type Selection = { start: number | null; end: number | null };
export type Status = "empty" | "picking" | "valid" | "short" | "conflict";

export function toOrd(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function fromOrd(ord: number): string {
  return new Date(ord * DAY_MS).toISOString().slice(0, 10);
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && fromOrd(toOrd(value)) === value;
}

/** Today's calendar date in Madrid, whatever the visitor's time zone. */
export function todayInMadrid(now = new Date()): number {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return toOrd(iso);
}

export function toOrdRanges(ranges: readonly DateRange[]): OrdRange[] {
  return ranges.map((r) => ({ from: toOrd(r.from), to: toOrd(r.to) })).sort((a, b) => a.from - b.from);
}

/** A night is booked when it falls inside any `[from, to)`. */
export function isBooked(night: number, booked: readonly OrdRange[]): boolean {
  return booked.some((r) => night >= r.from && night < r.to);
}

/** Booked ranges that overlap the nights `[start, end)`. */
export function overlapping(start: number, end: number, booked: readonly OrdRange[]): OrdRange[] {
  return booked.filter((r) => r.from < end && r.to > start);
}

export function canCheckIn(night: number, today: number, booked: readonly OrdRange[]): boolean {
  return night >= today && !isBooked(night, booked);
}

/**
 * Valid when the stay is at least 11 nights and every night in `[start, end)` is free.
 * The check-out day itself may be booked: the first booked night after a free stretch
 * is a valid check-out.
 */
export function canCheckOut(start: number, end: number, booked: readonly OrdRange[]): boolean {
  return end - start >= MIN_NIGHTS && overlapping(start, end, booked).length === 0;
}

/** The first booked night after `start`, i.e. the latest possible check-out. */
export function firstBookedAfter(start: number, booked: readonly OrdRange[]): number | null {
  let first: number | null = null;
  for (const r of booked) {
    const night = Math.max(r.from, start + 1);
    if (night < r.to && (first === null || night < first)) first = night;
  }
  return first;
}

export function selectionStatus(sel: Selection, booked: readonly OrdRange[]): Status {
  if (sel.start === null) return "empty";
  if (sel.end === null) return "picking";
  if (overlapping(sel.start, sel.end, booked).length > 0) return "conflict";
  if (sel.end - sel.start < MIN_NIGHTS) return "short";
  return "valid";
}

export type DayInfo = {
  past: boolean;
  /** Booked and not usable as a check-out. */
  booked: boolean;
  /** Booked night that can still be the check-out day. */
  checkoutOnly: boolean;
  /** Would give fewer than 11 nights (dashed ring). */
  short: boolean;
  /** Past the next booked night. */
  unreachable: boolean;
  selectable: boolean;
};

export function dayInfo(night: number, sel: Selection, today: number, booked: readonly OrdRange[]): DayInfo {
  const past = night < today;
  const bookedNight = isBooked(night, booked);
  const picking = sel.start !== null && sel.end === null;
  const after = picking && night > sel.start!;
  const checkoutOnly = bookedNight && after && canCheckOut(sel.start!, night, booked);
  const short = after && night - sel.start! < MIN_NIGHTS && !bookedNight;
  const unreachable = after && !short && !canCheckOut(sel.start!, night, booked);
  let selectable: boolean;
  if (after) selectable = canCheckOut(sel.start!, night, booked);
  else selectable = canCheckIn(night, today, booked);
  return { past, booked: bookedNight && !checkoutOnly, checkoutOnly, short, unreachable, selectable };
}

/** What a click on `night` does to the selection. Unusable days leave it unchanged. */
export function pick(sel: Selection, night: number, today: number, booked: readonly OrdRange[]): Selection {
  const startingOver = sel.start === null || sel.end !== null || night <= sel.start;
  if (startingOver) return canCheckIn(night, today, booked) ? { start: night, end: null } : sel;
  return canCheckOut(sel.start!, night, booked) ? { start: sel.start, end: night } : sel;
}

/** The first check-in on or after `from` that has at least 11 free nights. */
export function nextFreeWindow(from: number, today: number, booked: readonly OrdRange[], horizon: number): number | null {
  for (let night = Math.max(from, today); night <= horizon; night++) {
    if (canCheckIn(night, today, booked) && canCheckOut(night, night + MIN_NIGHTS, booked)) return night;
  }
  return null;
}

export function monthKey(ord: number): string {
  return fromOrd(ord).slice(0, 7);
}

/** Rough total from the per-night rate of the check-in month, or null without a rate. */
export function estimateTotal(start: number, nights: number, rates: Readonly<Record<string, number>>): number | null {
  const rate = rates[monthKey(start)];
  return rate ? Math.round(nights * rate) : null;
}

export type Guests = { adults: number; children: number; infants: number; pets: boolean };

export const DEFAULT_GUESTS: Guests = { adults: 2, children: 0, infants: 0, pets: false };

export function guestCount(g: Guests): number {
  return g.adults + g.children;
}

export function isGuestsFull(g: Guests): boolean {
  return guestCount(g) >= MAX_GUESTS;
}

/** Clamps a guest change to Airbnb's rules for this listing. */
export function setGuests(g: Guests, change: Partial<Guests>): Guests {
  const next = { ...g, ...change };
  next.adults = Math.max(1, next.adults);
  next.children = Math.max(0, next.children);
  next.infants = Math.min(MAX_INFANTS, Math.max(0, next.infants));
  if (guestCount(next) > MAX_GUESTS) return g;
  return next;
}
