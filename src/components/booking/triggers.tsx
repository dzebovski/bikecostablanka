"use client";

import { useBooking, type Source } from "./booking-context";
import { BookingAction, BookingFields } from "./booking-fields";
import { FromPrice } from "./booking-card";

/** "Check dates" (button) or "Check dates →" (text link): always opens the date picker. */
export function CheckDates({ source, variant = "button", className = "" }: { source: Source; variant?: "button" | "link"; className?: string }) {
  const b = useBooking();
  const label = variant === "link" ? b.t.cta.checkDatesLink : b.t.cta.checkDates;
  return (
    <button
      type="button"
      data-event="open_date_picker"
      className={variant === "link" ? `link t-body self-start border-0 bg-transparent p-0 min-h-11 ${className}` : `btn btn-primary ${className}`}
      onClick={(e) => b.openDates(source, e.currentTarget)}
    >
      {label}
    </button>
  );
}

/** Header action: "Check availability →" once the dates are valid, otherwise "Check dates". */
export function HeaderAction() {
  const b = useBooking();
  if (b.airbnbHref) {
    return (
      <a
        href={b.airbnbHref}
        target="_blank"
        rel="noopener"
        className="btn btn-primary btn-sm"
        data-event="click_book_airbnb"
        data-conversion="LongStayIntent"
        onClick={() => b.onCheckAvailability("header")}
      >
        {b.t.cta.checkAvailability}
      </a>
    );
  }
  return (
    <button type="button" className="btn btn-primary btn-sm" data-event="open_date_picker" onClick={(e) => b.openDates("header", e.currentTarget)}>
      {b.t.cta.checkDates}
    </button>
  );
}

/** Sticky bottom bar below 1024px; hidden while the sheet is open. */
export function MobileBookingBar() {
  const b = useBooking();
  if (b.surface === "sheet") return null;
  return (
    <div
      data-component="MobileBookingBar"
      className="fixed inset-x-0 bottom-0 z-20 flex h-[72px] items-center justify-between gap-3 border-t border-charcoal bg-snow pr-4 pl-5 lg:hidden"
    >
      <div className="flex flex-col gap-0.5">
        <FromPrice size="bar" />
        <p className="t-sm">{b.t.mobileBar.terms}</p>
      </div>
      <button type="button" className="btn btn-primary" data-event="open_date_picker" onClick={(e) => b.openDates("mobile_bar", e.currentTarget)}>
        {b.t.cta.checkDates}
      </button>
    </div>
  );
}

/** Final CTA card fields and action. */
export function FinalCtaForm() {
  return (
    <>
      <div className="hidden flex-wrap items-stretch gap-4 md:flex">
        <div className="min-w-0 flex-[1_1_520px]">
          <BookingFields source="final_cta" wide />
        </div>
        <BookingAction source="final_cta" tall />
      </div>
      <div className="flex flex-col gap-4 md:hidden">
        <BookingFields source="final_cta" messages={false} />
        <BookingAction source="final_cta" />
      </div>
    </>
  );
}
