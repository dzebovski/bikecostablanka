"use client";

import { MIN_NIGHTS } from "@/lib/booking";
import { fill, formatDay, formatDayRange, formatEuro } from "@/lib/format";
import { useBooking, type Source } from "./booking-context";
import { guestLabel } from "./guest-picker";

/** Check-in / check-out / guests on marigold, shared by the booking card, the Final CTA and the sheet. */
export function BookingFields({ source, wide = false, messages = true }: { source: Source; wide?: boolean; messages?: boolean }) {
  const b = useBooking();
  const t = b.t.booking;
  const { start, end } = b.sel;
  const picking = start !== null && end === null;
  const checkInLabel = start !== null ? formatDay(start, b.locale) : t.addDate;
  const checkOutLabel = end !== null ? formatDay(end, b.locale) : picking ? t.pickDate : t.addDate;

  const dateField = (label: string, value: string, extra: string, active = false) => (
    <button
      type="button"
      data-date-field
      data-event="open_date_picker"
      aria-haspopup="dialog"
      className={`field ${active ? "field-active" : ""} ${extra}`}
      onClick={(e) => b.openDates(source, e.currentTarget)}
    >
      <span className="t-label">{label}</span>
      <span className={`t-body font-medium ${value !== t.addDate && value !== t.pickDate ? "tnum" : ""}`}>{value}</span>
    </button>
  );

  const guestsField = (
    <button
      type="button"
      data-guests-field
      aria-haspopup="dialog"
      aria-expanded={b.surface === "guests"}
      className={`field ${wide ? "pl-4" : "w-full"}`}
      onClick={(e) => b.openGuests(e.currentTarget)}
    >
      <span className="t-label">{t.guests}</span>
      <span className="t-body flex justify-between gap-2 font-medium">
        <span className="truncate">{guestLabel(b.t, b.guests)}</span>
        <span aria-hidden="true">▾</span>
      </span>
    </button>
  );

  if (wide) {
    return (
      <div className="picker grid grid-cols-3">
        {dateField(t.checkIn, checkInLabel, "border-r border-charcoal pr-4")}
        {dateField(t.checkOut, checkOutLabel, "border-r border-charcoal px-4", picking)}
        {guestsField}
      </div>
    );
  }

  return (
    <div className="picker">
      <div className="grid grid-cols-2 border-b border-charcoal">
        {dateField(t.checkIn, checkInLabel, "border-r border-charcoal pr-3")}
        {dateField(t.checkOut, checkOutLabel, picking ? "" : "pl-3", picking)}
      </div>
      {guestsField}
      {messages && <StatusMessage />}
    </div>
  );
}

/** Too short / conflict messages (states 4 and 5). */
export function StatusMessage({ className = "mb-4" }: { className?: string }) {
  const b = useBooking();
  const t = b.t.booking;
  if (b.status === "short" && b.sel.start !== null && b.nights !== null) {
    return (
      <div role="alert" className={`msg ${className}`}>
        <p className="t-sm font-medium">{fill(t.tooShort, { n: b.nights })}</p>
        <button type="button" className="link t-sm min-h-8 self-start border-0 bg-transparent p-0" onClick={b.extend}>
          {fill(t.extend, { date: formatDay(b.sel.start + MIN_NIGHTS, b.locale) })}
        </button>
      </div>
    );
  }
  if (b.status === "conflict") {
    const range = b.conflicts.map((r) => formatDayRange(r.from, r.to - 1, b.locale)).join(", ");
    return (
      <div role="alert" className={`msg ${className}`}>
        <p className="t-sm font-medium">{t.conflict}</p>
        <p className="t-sm tnum">{fill(t.bookedRange, { range })}</p>
        <button type="button" className="link t-sm min-h-8 self-start border-0 bg-transparent p-0" onClick={b.showNextFree}>
          {t.showNextFree}
        </button>
      </div>
    );
  }
  return null;
}

/** Primary action: "Check availability →" only for a valid range; otherwise says what to fix or opens the picker. */
export function BookingAction({ source, className = "", tall = false }: { source: Source; className?: string; tall?: boolean }) {
  const b = useBooking();
  const size = tall ? "min-h-16 px-8" : "";
  if (b.airbnbHref) {
    return (
      <a
        href={b.airbnbHref}
        target="_blank"
        rel="noopener"
        className={`btn btn-primary ${size} ${className}`}
        data-event="click_book_airbnb"
        data-conversion="LongStayIntent"
        onClick={() => b.onCheckAvailability(source)}
      >
        {b.t.cta.checkAvailability}
      </a>
    );
  }
  if (b.status === "short" || b.status === "conflict") {
    return (
      <button type="button" className={`btn ${size} ${className}`} disabled>
        {b.status === "short" ? b.t.cta.chooseNights : b.t.cta.chooseFree}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`btn btn-primary ${size} ${className}`}
      data-event="open_date_picker"
      onClick={(e) => b.openDates(source, e.currentTarget)}
    >
      {b.t.cta.checkDates}
    </button>
  );
}

/** "14 nights · ≈ €999 | exact price on Airbnb" for a chosen range. */
export function NightsLine() {
  const b = useBooking();
  if (b.sel.start === null || b.nights === null || b.status === "picking") return null;
  const t = b.t.booking;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <p className="t-body font-medium whitespace-nowrap tnum">
        {fill(t.nights, { n: b.nights })}
        {b.estimate !== null && ` · ${fill(t.estimate, { price: formatEuro(b.estimate, b.locale) })}`}
      </p>
      <p className="t-sm text-right">{b.estimate !== null ? t.exactPrice : t.priceOnAirbnb}</p>
    </div>
  );
}

