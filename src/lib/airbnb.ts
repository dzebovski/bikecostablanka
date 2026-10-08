import type { Locale } from "@/i18n/config";

export const AIRBNB_LISTING_ID = "1692875983935079214";
export const MIN_NIGHTS = 11;
/** Rough nightly price incl. fees, used only as the conversion value for ads. */
export const EST_NIGHTLY_EUR = 75;

const airbnbHost: Record<Locale, string> = {
  en: "www.airbnb.com",
};

export function nightsBetween(checkIn: string, checkOut: string) {
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000);
}

export function airbnbUrl(locale: Locale, checkIn?: string, checkOut?: string, adults?: number) {
  const url = new URL(`https://${airbnbHost[locale]}/rooms/${AIRBNB_LISTING_ID}`);
  if (checkIn) url.searchParams.set("check_in", checkIn);
  if (checkOut) url.searchParams.set("check_out", checkOut);
  if (adults) url.searchParams.set("adults", String(adults));
  return url.toString();
}
