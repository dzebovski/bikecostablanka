"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { usePresence } from "@/hooks/use-presence";
import { formatStay, weekdayInitials } from "@/lib/format";
import { useBooking } from "./booking-context";
import { BookingAction, StatusMessage } from "./booking-fields";
import { UnavailableNote } from "./booking-card";
import { Calendar } from "./calendar";
import { GuestRows, guestLabel } from "./guest-picker";
import { pickerSummary } from "./summary";

/**
 * Mobile bottom sheet: step 1 dates, step 2 guests. A modal <dialog> (focus stays inside,
 * Esc closes); swipe down or × closes too.
 */
export function BookingSheet() {
  const b = useBooking();
  const open = b.surface === "sheet";
  const { mounted, state } = usePresence(open, 240);
  const dialog = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const t = b.t;

  useEffect(() => {
    const el = dialog.current;
    if (!mounted || !el) return;
    if (!el.open) el.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mounted]);

  // Focus the chosen day when the dates step opens.
  useEffect(() => {
    if (!open || b.sheetStep !== "dates") return;
    const day = dialog.current?.querySelector<HTMLButtonElement>('.day[tabindex="0"]');
    day?.focus({ preventScroll: true });
    day?.scrollIntoView({ block: "center" });
  }, [open, b.sheetStep]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { y: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !dialog.current) return;
    drag.current.dy = Math.max(0, event.clientY - drag.current.y);
    dialog.current.style.transform = `translateY(${drag.current.dy}px)`;
  }
  function onPointerUp() {
    if (!drag.current || !dialog.current) return;
    const { dy } = drag.current;
    drag.current = null;
    dialog.current.style.transform = "";
    if (dy > 96) b.close();
  }

  if (!mounted) return null;
  const { start, end } = b.sel;
  const valid = b.status === "valid";

  return (
    <dialog
      ref={dialog}
      className="modal sheet"
      data-component="BookingSheet"
      data-state={state}
      aria-label={t.sheet.title}
      onCancel={(e) => {
        e.preventDefault();
        b.close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) b.close();
      }}
    >
      <div className="flex h-full flex-col">
        <div
          className="flex touch-none flex-col gap-3 px-5 pt-2.5"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span aria-hidden="true" className="h-1 w-10 self-center rounded-chip bg-charcoal opacity-25" />
          <div className="flex items-center justify-between">
            {b.sheetStep === "dates" ? (
              <h2 className="t-h2">{t.sheet.title}</h2>
            ) : (
              <button type="button" className="t-body min-h-11 border-0 bg-transparent p-0 font-medium" onClick={() => b.setSheetStep("dates")}>
                {t.sheet.back}
              </button>
            )}
            <button type="button" className="step text-xl" aria-label={t.sheet.close} onClick={b.close}>
              ×
            </button>
          </div>
          {b.sheetStep === "dates" ? (
            <div className="grid grid-cols-7 border-b border-line pb-1.5" aria-hidden="true">
              {weekdayInitials(b.locale).map((w, i) => (
                <span key={i} className="flex h-7 items-center justify-center text-xs font-medium">
                  {w}
                </span>
              ))}
            </div>
          ) : (
            <h2 className="t-h2">{t.sheet.whoIsComing}</h2>
          )}
        </div>

        {b.sheetStep === "dates" ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3">
              <Calendar monthStarts={b.months} layout="list" />
            </div>
            <div className="flex flex-col gap-3 border-t border-charcoal bg-snow px-5 pt-3.5 pb-6">
              <SheetMessages />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="t-body font-medium tnum" aria-live="polite">
                    {pickerSummary(b)}
                  </p>
                  {start !== null && end !== null && <p className="t-sm tnum">{formatStay(start, end, b.locale)}</p>}
                </div>
                {b.status === "short" || b.status === "conflict" ? (
                  <BookingAction source="sheet" />
                ) : (
                  <button type="button" className="btn btn-primary" disabled={!valid} onClick={() => b.setSheetStep("guests")}>
                    {valid ? t.sheet.next : t.cta.chooseNights}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div data-component="GuestPicker" className="min-h-0 flex-1 overflow-y-auto px-5 py-2">
              <GuestRows />
            </div>
            <div className="flex flex-col gap-2.5 border-t border-charcoal bg-snow px-5 pt-3.5 pb-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="t-body font-medium tnum">{start !== null && end !== null ? pickerSummary(b) : ""}</p>
                <p className="t-sm">{guestLabel(t, b.guests)}</p>
              </div>
              <UnavailableNote />
              <BookingAction source="sheet" className="w-full" />
              <p className="t-sm">{t.booking.noCharge}</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/** States 4–6 inside the sheet footer (paper, because the footer is snow). */
function SheetMessages() {
  const b = useBooking();
  if (b.status === "short" || b.status === "conflict") return <StatusMessage className="bg-paper" />;
  return <UnavailableNote />;
}
