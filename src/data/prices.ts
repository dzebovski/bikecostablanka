/**
 * Prices and free dates from Airbnb (EUR, two guests, all fees included).
 * Snapshot: update every field and `checkedOn` together when prices change.
 */

export type FreeWindow = { from: string; to?: string };

export type PriceMonth = {
  /** `YYYY-MM` */
  month: string;
  /** Free stretches this month; "open" when the whole month is free; empty when fully booked. */
  free: FreeWindow[] | "open";
  perNight?: number;
  example?: { nights: number; total: number; discount?: "weekly" | "monthly"; discountPct?: number };
};

export type PriceSnapshot = {
  checkedOn: string;
  currency: "EUR";
  /** Lowest per-night price of the season, shown as "from €71 / night". */
  fromPerNight: number;
  months: PriceMonth[];
  /** Per-night rate by check-in month for the booking estimate. */
  estimateRates: Record<string, number>;
  /** Per-night rate with Airbnb's monthly discount (28+ nights), by check-in month. */
  monthlyRates: Record<string, number>;
  /** Exact Airbnb totals by check-in month and nights, where the rates above would be off. */
  exactTotals: Record<string, Record<number, number>>;
  /** Conversion value per night when a month has no rate. */
  fallbackNightly: number;
};

// Airbnb, 2026-10-21: one price for the whole season, it depends only on the number of nights.
// Weekly discount: 11 n €1,275 · 14 n €1,623 · 21 n €2,434 · 27 n €3,130.
// Monthly discount: 28–29 nights −8% (€3,145 / €3,257), a full 30 nights −18% (€3,015).
const WEEKLY = 1623 / 14;
const MONTHLY = 3145 / 28;
const EXACT = { 21: 2434, 30: 3015 };
const SEASON = ["2026-11", "2026-12", "2027-01", "2027-03", "2027-04"];
const bySeason = <T>(value: T) => Object.fromEntries(SEASON.map((m) => [m, value]));

export const prices: PriceSnapshot = {
  checkedOn: "2026-10-21",
  currency: "EUR",
  fromPerNight: 116,
  months: [
    // The December window starts on 26 Nov (owner, 2026-10-18: sell 26 Nov – 26 Dec, two 14-night blocks or the whole month).
    { month: "2026-12", free: [{ from: "2026-11-26", to: "2026-12-26" }], perNight: 116, example: { nights: 14, total: 1623 } },
    { month: "2027-01", free: [{ from: "2027-01-12", to: "2027-01-23" }], perNight: 116, example: { nights: 11, total: 1275 } },
    { month: "2027-02", free: [] },
    { month: "2027-03", free: [{ from: "2027-03-20" }], perNight: 116, example: { nights: 14, total: 1623 } },
    { month: "2027-04", free: "open", perNight: 101, example: { nights: 30, total: 3015, discount: "monthly", discountPct: 18 } },
  ],
  estimateRates: bySeason(WEEKLY),
  monthlyRates: bySeason(MONTHLY),
  exactTotals: bySeason(EXACT),
  fallbackNightly: 116,
};

/** The free windows across the season, in order, for the "Free: …" notes. */
export const freeWindows: FreeWindow[] = prices.months.flatMap((m) => (Array.isArray(m.free) ? m.free : []));
