"use client";

import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { usePresence } from "@/hooks/use-presence";
import { useBooking } from "./booking-context";
import { Calendar } from "./calendar";
import { pickerSummary } from "./summary";

/** Legend under the months (desktop popover). */
function Legend() {
  const { t } = useBooking();
  const dot = "inline-block size-5 rounded-pill";
  return (
    <div className="t-sm flex flex-wrap items-center gap-x-5 gap-y-2" aria-hidden="true">
      <span className="inline-flex items-center gap-1.5">
        <span className={`${dot} border border-charcoal`} />
        {t.picker.legendToday}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="line-through">28</span>
        {t.picker.legendBooked}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className={`${dot} border border-dashed border-charcoal`} />
        {t.picker.legendShort}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className={`${dot} bg-marigold`} />
        {t.picker.legendStay}
      </span>
    </div>
  );
}

/** Desktop date popover under the booking card fields. */
export function DatePickerPopover() {
  const b = useBooking();
  const open = b.surface === "dates";
  const { mounted, state } = usePresence(open, 140);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, b.close);

  useEffect(() => {
    if (!open) return;
    const day = ref.current?.querySelector<HTMLButtonElement>('.day[tabindex="0"]');
    day?.focus({ preventScroll: true });
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element;
      if (ref.current?.contains(target) || target.closest?.("[data-date-field]")) return;
      b.close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // Focus the day only when the popover opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;
  const atFirst = b.viewIndex <= 0;
  const atLast = b.viewIndex >= b.months.length - 2;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={b.t.picker.label}
      data-component="DatePicker"
      data-state={state}
      className="pop absolute top-[calc(100%+8px)] -right-6 z-30 flex w-[720px] flex-col gap-5 p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="step"
          aria-label={b.t.picker.previousMonth}
          disabled={atFirst}
          onClick={() => b.setViewIndex(Math.max(0, b.viewIndex - 1))}
        >
          ←
        </button>
        <p className="t-sm font-medium tnum" aria-live="polite">
          {pickerSummary(b)}
        </p>
        <button
          type="button"
          className="step"
          aria-label={b.t.picker.nextMonth}
          disabled={atLast}
          onClick={() => b.setViewIndex(Math.min(b.months.length - 2, b.viewIndex + 1))}
        >
          →
        </button>
      </div>
      <Calendar monthStarts={b.months.slice(b.viewIndex, b.viewIndex + 2)} layout="columns" />
      <Legend />
      <div className="flex items-center justify-between border-t border-line pt-4">
        <button type="button" className="text-button t-body" onClick={b.clear}>
          {b.t.picker.clear}
        </button>
        <button type="button" className="btn btn-secondary" onClick={b.close}>
          {b.t.picker.close}
        </button>
      </div>
    </div>
  );
}
