"use client";

import type { MouseEvent } from "react";
import { MIN_NIGHTS } from "@/lib/booking";
import { prices } from "@/data/prices";
import { fill, formatDay, formatDayRange, formatEuro } from "@/lib/format";
import { useBooking, type Source } from "./booking-context";
import { guestLabel } from "./guest-picker";
import { earliestCheckOut } from "./summary";

/** Check-in / check-out / guests on marigold, stacked: the Final CTA below 1024px. */
export function BookingFields({ source, messages = true }: { source: Source; messages?: boolean }) {
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

  return (
    <div className="picker">
      <div className="grid grid-cols-2 border-b border-charcoal">
        {dateField(t.checkIn, checkInLabel, "border-r border-charcoal pr-3")}
        {dateField(t.checkOut, checkOutLabel, picking ? "" : "pl-3", picking)}
      </div>
      <button
        type="button"
        data-guests-field
        aria-haspopup="dialog"
        aria-expanded={b.surface === "guests"}
        className="field w-full"
        onClick={(e) => b.openGuests(e.currentTarget)}
      >
        <span className="t-label">{t.guests}</span>
        <span className="t-body flex justify-between gap-2 font-medium">
          <span className="truncate">{guestLabel(b.t, b.guests)}</span>
          <span aria-hidden="true">▾</span>
        </span>
      </button>
      {messages && <StatusMessage />}
    </div>
  );
}

/**
 * One marigold pill: Check-in | Check-out | Guests | summary, then the primary action.
 * The bottom bar uses it at 72px, the Final CTA at 88px ("lg").
 */
export function BarFields({ source, size = "md" }: { source: Source; size?: "md" | "lg" }) {
  const b = useBooking();
  const t = b.t.booking;
  const { start, end } = b.sel;
  const picking = start !== null && end === null;
  const value = size === "lg" ? "t-h3 font-medium" : "t-body font-medium";
  const width = size === "lg" ? "w-[184px]" : "w-[148px]";
  const checkIn = start !== null ? formatDay(start, b.locale) : t.addDate;
  const checkOut = end !== null ? formatDay(end, b.locale) : picking ? t.pickDate : t.addDate;
  const open = (e: MouseEvent<HTMLButtonElement>) => b.openDates(source, e.currentTarget);

  const dateField = (label: string, text: string, active: boolean) => (
    <button
      type="button"
      data-date-field
      data-event="open_date_picker"
      aria-haspopup="dialog"
      aria-expanded={b.surface === "dates"}
      data-active={active || undefined}
      className={`bar-field ${width}`}
      onClick={open}
    >
      <span className="t-label">{label}</span>
      <span className={`${value} truncate ${start !== null ? "tnum" : ""}`}>{text}</span>
    </button>
  );

  return (
    <div className={`bbar-pill pr-3 pl-5 ${size === "lg" ? "h-[88px]! pr-4 pl-6" : ""}`}>
      {dateField(t.checkIn, checkIn, false)}
      <span className="bar-divider" aria-hidden="true" />
      {dateField(t.checkOut, checkOut, picking)}
      <span className="bar-divider" aria-hidden="true" />
      <button
        type="button"
        data-guests-field
        aria-haspopup="dialog"
        aria-expanded={b.surface === "guests"}
        className={`bar-field ${size === "lg" ? "w-[208px]" : "w-[176px]"}`}
        onClick={(e) => b.openGuests(e.currentTarget)}
      >
        <span className="t-label">{t.guests}</span>
        <span className={`${value} flex justify-between gap-2`}>
          <span className="truncate">{guestLabel(b.t, b.guests)}</span>
          <span aria-hidden="true">▾</span>
        </span>
      </button>
      <span className="bar-divider" aria-hidden="true" />
      <BarSummary large={size === "lg"} />
      <BookingAction source={source} tall={size === "lg"} className="ml-auto shrink-0" />
    </div>
  );
}

/** "from €71 / night · 11+ nights · fees included", or "14 nights · ≈ €999 · exact price on Airbnb" for a valid range. */
function BarSummary({ large }: { large: boolean }) {
  const b = useBooking();
  const t = b.t.booking;
  const valid = b.status === "valid" && b.nights !== null;
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3" aria-live="polite">
      {valid ? (
        <>
          <p className={`${large ? "t-h3" : "t-body"} truncate font-medium tnum`}>
            {fill(t.nights, { n: b.nights! })}
            {b.estimate !== null && ` · ${fill(t.estimate, { price: formatEuro(b.estimate, b.locale) })}`}
          </p>
          <p className="t-sm truncate">{b.estimate !== null ? t.exactPrice : t.priceOnAirbnb}</p>
        </>
      ) : (
        <>
          <p className={`${large ? "t-h3" : "t-body"} truncate`}>
            {t.from} <span className="font-medium tnum">{formatEuro(prices.fromPerNight, b.locale)}</span> {t.perNight}
          </p>
          <p className="t-sm truncate">{t.terms}</p>
        </>
      )}
    </div>
  );
}

/**
 * The booking states as one small panel: picking hint (2), too short (4), conflict (5)
 * and calendar unavailable (6). Empty (1) and valid (3) need no message.
 */
export function BarMessages({ className = "" }: { className?: string }) {
  const b = useBooking();
  const hint = b.status === "picking" && b.sel.start !== null ? earliestCheckOut(b) : null;
  const status = b.status === "short" || b.status === "conflict";
  const unavailable = b.availability === "error";
  if (!hint && !status && !unavailable) return null;
  return (
    <div data-component="BookingMessage" className={`flex flex-col gap-2 ${className}`}>
      {status ? (
        <StatusMessage className="p-0! animate-none!" />
      ) : (
        hint && (
          <p className="t-sm tnum" aria-live="polite">
            {hint}
          </p>
        )
      )}
      {unavailable && <p className="t-sm">{b.t.booking.unavailable}</p>}
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

