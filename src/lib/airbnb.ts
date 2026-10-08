import type { Locale } from "@/i18n/config";
import type { Guests } from "@/lib/booking";

export const AIRBNB_LISTING_ID = "1692875983935079214";

const airbnbHost: Record<Locale, string> = {
  en: "www.airbnb.com",
};

export function airbnbListingUrl(locale: Locale) {
  return `https://${airbnbHost[locale]}/rooms/${AIRBNB_LISTING_ID}`;
}

/** Listing URL with dates and guests prefilled (Airbnb reads these query parameters). */
export function airbnbUrl(locale: Locale, checkIn?: string, checkOut?: string, guests?: Guests) {
  const url = new URL(airbnbListingUrl(locale));
  if (checkIn) url.searchParams.set("check_in", checkIn);
  if (checkOut) url.searchParams.set("check_out", checkOut);
  if (guests) {
    url.searchParams.set("adults", String(guests.adults));
    if (guests.children) url.searchParams.set("children", String(guests.children));
    if (guests.infants) url.searchParams.set("infants", String(guests.infants));
    if (guests.pets) url.searchParams.set("pets", "1");
  }
  return url.toString();
}
