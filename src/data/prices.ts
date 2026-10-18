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
  /** Conversion value per night when a month has no rate. */
  fallbackNightly: number;
};

export const prices: PriceSnapshot = {
  checkedOn: "2026-10-18",
  currency: "EUR",
  fromPerNight: 116,
  months: [
    // The December window starts on 26 Nov (owner, 2026-10-18: sell 26 Nov – 26 Dec, two 14-night blocks or the whole month).
    { month: "2026-12", free: [{ from: "2026-11-26", to: "2026-12-26" }], perNight: 116, example: { nights: 14, total: 1623 } },
    { month: "2027-01", free: [{ from: "2027-01-12", to: "2027-01-23" }], perNight: 116, example: { nights: 11, total: 1275 } },
    { month: "2027-02", free: [] },
    { month: "2027-03", free: [{ from: "2027-03-20" }], perNight: 122, example: { nights: 11, total: 1338 } },
    { month: "2027-04", free: "open", perNight: 118, example: { nights: 28, total: 3300, discount: "monthly", discountPct: 8 } },
  ],
  estimateRates: {
    "2026-11": 1623 / 14,
    "2026-12": 1623 / 14,
    "2027-01": 1275 / 11,
    "2027-03": 1338 / 11,
    "2027-04": 3300 / 28,
  },
  monthlyRates: {
    "2026-11": 3015 / 30,
    "2026-12": 3015 / 30,
    "2027-04": 3300 / 28,
  },
  fallbackNightly: 116,
};

/** The free windows across the season, in order, for the "Free: …" notes. */
export const freeWindows: FreeWindow[] = prices.months.flatMap((m) => (Array.isArray(m.free) ? m.free : []));
