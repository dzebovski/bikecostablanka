"use client";

import { canCheckOut, estimateTotal, MIN_NIGHTS } from "@/lib/booking";
import { prices } from "@/data/prices";
import { fill, formatDay, formatEuro } from "@/lib/format";
import type { useBooking } from "./booking-context";

type Booking = ReturnType<typeof useBooking>;

/** "14 nights · ≈ €999" or "14 nights · price on Airbnb" */
export function nightsAndPrice(b: Booking, start: number, nights: number) {
  const total = estimateTotal(start, nights, prices.estimateRates);
  const price = total !== null ? fill(b.t.booking.estimate, { price: formatEuro(total, b.locale) }) : b.t.booking.priceOnAirbnb;
  return `${fill(b.t.booking.nights, { n: nights })} · ${price}`;
}

/** "Earliest check-out: Sat 12 Dec (11 nights)." */
export function earliestCheckOut(b: Booking) {
  const start = b.sel.start;
  if (start === null) return null;
  if (!canCheckOut(start, start + MIN_NIGHTS, b.booked)) return b.t.booking.noWindow;
  return fill(b.t.booking.earliest, { date: formatDay(start + MIN_NIGHTS, b.locale), min: MIN_NIGHTS });
}

/** The hovered check-out, when it would be valid. */
export function validHover(b: Booking) {
  const { start, end } = b.sel;
  if (start === null || end !== null || b.hover === null) return null;
  return canCheckOut(start, b.hover, b.booked) ? b.hover : null;
}

/** One-line summary for the picker header and the mobile sheet footer. */
export function pickerSummary(b: Booking) {
  const { start, end } = b.sel;
  if (start === null) return b.t.booking.selectCheckIn;
  if (end !== null) return nightsAndPrice(b, start, end - start);
  const hover = validHover(b);
  if (hover !== null) return nightsAndPrice(b, start, hover - start);
  return earliestCheckOut(b) ?? "";
}
