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
  /** Conversion value per night when a month has no rate. */
  fallbackNightly: number;
};

export const prices: PriceSnapshot = {
  checkedOn: "2026-10-08",
  currency: "EUR",
  fromPerNight: 71,
  months: [
    { month: "2026-12", free: [{ from: "2026-12-01", to: "2026-12-27" }], perNight: 71, example: { nights: 14, total: 999 } },
    { month: "2027-01", free: [{ from: "2027-01-12", to: "2027-01-23" }], perNight: 100, example: { nights: 11, total: 1101 } },
    { month: "2027-02", free: [] },
    { month: "2027-03", free: [{ from: "2027-03-20" }], perNight: 105, example: { nights: 11, total: 1155 } },
    { month: "2027-04", free: "open", perNight: 102, example: { nights: 28, total: 2848, discount: "monthly", discountPct: 20 } },
  ],
  estimateRates: {
    "2026-12": 999 / 14,
    "2027-01": 1101 / 11,
    "2027-03": 105,
    "2027-04": 2848 / 28,
  },
  fallbackNightly: 75,
};

/** The free windows across the season, in order, for the "Free: …" notes. */
export const freeWindows: FreeWindow[] = prices.months.flatMap((m) => (Array.isArray(m.free) ? m.free : []));
