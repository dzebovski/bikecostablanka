import type { Guests } from "./booking.ts";

/**
 * Direct booking on Lodgify, a third-party holiday-rental platform, as the second channel after Airbnb.
 * An empty `NEXT_PUBLIC_DIRECT_BOOKING_URL` means the direct option is not rendered anywhere.
 */
export function directBookingBaseUrl(raw: string | undefined = process.env.NEXT_PUBLIC_DIRECT_BOOKING_URL): string | null {
  const value = (raw ?? "").trim();
  return value || null;
}

export type Stay = { checkIn: string; checkOut: string; guests: Guests };

/**
 * Lodgify page for a stay. For now it opens without dates: append Lodgify's date and guest
 * parameters here once the Lodgify site is published and the format is verified on a real page.
 * The stay is still sent with the analytics events.
 */
export function directBookingUrl(stay: Stay, base: string | null = directBookingBaseUrl()): string | null {
  void stay;
  return base;
}
