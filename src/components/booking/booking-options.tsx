"use client";

import { directBookingBaseUrl } from "@/lib/direct";
import { useBooking } from "./booking-context";

/**
 * "Two ways to book" in Prices & free dates: Airbnb and direct booking on Lodgify, no prices.
 * Without valid dates both buttons open the picker; with them they book. Hidden when no direct URL is set.
 */
export function BookingOptions() {
  const b = useBooking();
  if (!directBookingBaseUrl()) return null;
  const o = b.t.direct.options;
  const openPicker = (e: React.MouseEvent<HTMLButtonElement>) => b.openDates("booking_options", e.currentTarget);

  const column = (title: string, rows: string[], action: React.ReactNode) => (
    <div className="flex flex-col gap-3">
      <h3 className="t-label">{title}</h3>
      <ul className="t-sm md:t-body">
        {rows.map((row, i) => (
          <li key={row} className={`row ${i === rows.length - 1 ? "border-b-0" : ""}`}>
            {row}
          </li>
        ))}
      </ul>
      <div className="self-stretch md:self-start">{action}</div>
    </div>
  );

  const airbnb = b.airbnbHref ? (
    <a
      href={b.airbnbHref}
      target="_blank"
      rel="noopener"
      className="btn btn-book btn-secondary w-full md:w-auto"
      data-event="click_book_airbnb"
      data-conversion="LongStayIntent"
      onClick={() => b.onCheckAvailability("booking_options")}
    >
      {b.t.cta.checkAvailability}
    </a>
  ) : (
    <button type="button" className="btn btn-book btn-secondary w-full md:w-auto" data-event="open_date_picker" onClick={openPicker}>
      {b.t.cta.checkAvailability}
    </button>
  );

  const direct = b.directHref ? (
    <a
      href={b.directHref}
      target="_blank"
      rel="noopener"
      className="btn btn-book btn-primary w-full md:w-auto"
      data-event="click_book_direct"
      data-conversion="LongStayIntent"
      onClick={() => b.onBookDirect("booking_options")}
    >
      {b.t.cta.bookDirect}
    </a>
  ) : (
    <button type="button" className="btn btn-book btn-primary w-full md:w-auto" data-event="open_date_picker" onClick={openPicker}>
      {b.t.cta.bookDirect}
    </button>
  );

  return (
    <div data-component="BookingOptions" className="flex flex-col gap-5 border-t border-line pt-8">
      <div className="sh">
        <h3 className="t-h3 font-medium">{o.title}</h3>
        <p className="t-sm">{o.intro}</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {column(o.direct.title, o.direct.rows, direct)}
        <div className="border-t border-charcoal pt-4 md:border-0 md:pt-0">{column(o.airbnb.title, o.airbnb.rows, airbnb)}</div>
      </div>
    </div>
  );
}
