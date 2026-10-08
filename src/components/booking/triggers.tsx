"use client";

import { useEffect, useState } from "react";
import { FINAL_CTA_ID, useBooking, type Source } from "./booking-context";
import { BarFields, BarMessages, BookingAction, BookingFields } from "./booking-fields";
import { FromPrice } from "./booking-card";
import { DatePickerPopover } from "./date-picker";
import { GuestPopover } from "./guest-picker";

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

/**
 * Desktop booking bar (1024px and wider): fixed at the bottom, appears once the title block has
 * scrolled away, steps aside while the Final CTA is on screen, behind modals and the cookie banner.
 */
export function BookingBar() {
  const b = useBooking();
  const t = b.t.booking;
  const [pastTitle, setPastTitle] = useState(false);
  const [finalInView, setFinalInView] = useState(false);
  const open = b.anchor === "bar" && (b.surface === "dates" || b.surface === "guests");
  const shown = (pastTitle || open) && !finalInView;

  useEffect(() => {
    const title = document.querySelector('[data-component="TitleBlock"]');
    const final = document.getElementById(FINAL_CTA_ID);
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 56;
    const observers: IntersectionObserver[] = [];
    if (title) {
      const o = new IntersectionObserver(([entry]) => setPastTitle(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
        rootMargin: `-${header}px 0px 0px 0px`,
      });
      o.observe(title);
      observers.push(o);
    }
    if (final) {
      const o = new IntersectionObserver(([entry]) => setFinalInView(entry.isIntersecting));
      o.observe(final);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // A popover never stays open on a bar that has stepped aside.
  const { close, surface, anchor } = b;
  useEffect(() => {
    if (finalInView && anchor === "bar" && (surface === "dates" || surface === "guests")) close();
  }, [finalInView, anchor, surface, close]);

  return (
    <div
      data-component="BookingBar"
      data-anchor="bar"
      data-shown={shown}
      data-open={open || undefined}
      role="region"
      aria-label={t.label}
      className="bbar hidden lg:block"
    >
      {!open && <BarMessages className="msg pop absolute bottom-[calc(100%+8px)] left-4 max-w-[480px] rounded-chip border border-charcoal" />}
      <div className="relative">
        <BarFields source="bottom_bar" />
        <DatePickerPopover anchor="bar" />
        <GuestPopover anchor="bar" />
      </div>
    </div>
  );
}

/** Bottom bar below 1024px: the same marigold pill with the price and "Check dates"; hidden while the sheet is open. */
export function MobileBookingBar() {
  const b = useBooking();
  if (b.surface === "sheet") return null;
  return (
    <div data-component="MobileBookingBar" className="bbar lg:hidden">
      <div className="bbar-pill justify-between gap-3 pr-2 pl-6">
        <div className="flex min-w-0 flex-col gap-1">
          <FromPrice size="bar" />
          <p className="t-sm">{b.t.mobileBar.terms}</p>
        </div>
        <button type="button" className="btn btn-primary" data-event="open_date_picker" onClick={(e) => b.openDates("mobile_bar", e.currentTarget)}>
          {b.t.cta.checkDates}
        </button>
      </div>
    </div>
  );
}

/** Final CTA: where the bottom bar lands. The same pill, larger, with the states below it. */
export function FinalCtaForm() {
  return (
    <>
      <div className="hidden flex-col gap-4 lg:flex">
        <div data-anchor="final" className="relative">
          <BarFields source="final_cta" size="lg" />
          <DatePickerPopover anchor="final" />
          <GuestPopover anchor="final" />
        </div>
        <BarMessages />
      </div>
      <div className="flex flex-col gap-4 lg:hidden">
        <BookingFields source="final_cta" messages={false} />
        <BookingAction source="final_cta" />
      </div>
    </>
  );
}
