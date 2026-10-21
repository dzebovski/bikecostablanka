import type { Guests } from "./booking.ts";

/**
 * Direct booking on Lodgify, a third-party holiday-rental platform, as the second channel after Airbnb.
 * `NEXT_PUBLIC_DIRECT_BOOKING_URL` is the property page, e.g. https://bikecostablanca.lodgify.com/en/casa-adosada-3-hab-parking-35-banos.
 * Empty means the direct option is not rendered anywhere.
 */
export function directBookingBaseUrl(raw: string | undefined = process.env.NEXT_PUBLIC_DIRECT_BOOKING_URL): string | null {
  const value = (raw ?? "").trim();
  return value || null;
}

export type Stay = { checkIn: string; checkOut: string; guests: Guests };

/** "2026-12-01" → "20261201", the date format Lodgify reads. */
const lodgifyDate = (iso: string) => iso.replaceAll("-", "");

/**
 * Lodgify property page with the stay prefilled:
 * ?arrival=20261201&departure=20261215&adults=2&children=0&pets=0&infants=0
 */
export function directBookingUrl(stay: Stay, base: string | null = directBookingBaseUrl()): string | null {
  if (!base) return null;
  const url = new URL(base);
  url.searchParams.set("arrival", lodgifyDate(stay.checkIn));
  url.searchParams.set("departure", lodgifyDate(stay.checkOut));
  url.searchParams.set("adults", String(stay.guests.adults));
  url.searchParams.set("children", String(stay.guests.children));
  url.searchParams.set("pets", stay.guests.pets ? "1" : "0");
  url.searchParams.set("infants", String(stay.guests.infants));
  return url.toString();
}
