"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { usePresence } from "@/hooks/use-presence";
import { useBooking, type Anchor } from "./booking-context";
import { QuestionsLine } from "./booking-card";
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

/**
 * Places a popover inside its anchor box: aligned to the clicked field, upwards from the bar,
 * and upwards from the Final CTA too unless there is no room above it.
 */
export function useAnchoredPlacement(ref: RefObject<HTMLDivElement | null>, open: boolean, anchor: Anchor) {
  const { trigger } = useBooking();
  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.offsetParent;
    if (!open || !el || !box) return;
    const boxRect = box.getBoundingClientRect();
    const field = trigger.current;
    const offset = field && box.contains(field) ? field.getBoundingClientRect().left - boxRect.left : 0;
    el.style.left = `${Math.max(0, Math.min(offset, boxRect.width - el.offsetWidth))}px`;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 56;
    const roomAbove = boxRect.top - header - 16;
    const roomBelow = window.innerHeight - boxRect.bottom - 16;
    el.dataset.place = anchor === "bar" || roomAbove >= el.offsetHeight || roomAbove >= roomBelow ? "up" : "down";
  }, [ref, open, anchor, trigger]);
}

/** "You won't be charged yet…" and "Questions? Message Eugene on WhatsApp" under an open popover. */
export function PopoverFooterNote({ anchor }: { anchor: Anchor }) {
  const { t } = useBooking();
  return (
    <div className="flex flex-col gap-1 border-t border-line pt-4">
      <p className="t-sm">{t.booking.noCharge}</p>
      <QuestionsLine source={anchor === "final" ? "final_cta" : "bottom_bar"} />
    </div>
  );
}

/** Desktop date popover, opened upwards from the bottom bar or the Final CTA fields. */
export function DatePickerPopover({ anchor }: { anchor: Anchor }) {
  const b = useBooking();
  const open = b.surface === "dates" && b.anchor === anchor;
  const { mounted, state } = usePresence(open, 140);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, b.close);
  useAnchoredPlacement(ref, mounted, anchor);

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
      className="pop pop-anchored flex w-[720px] flex-col gap-6 p-6"
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
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-t border-line pt-4">
          <button type="button" className="text-button t-body" onClick={b.clear}>
            {b.t.picker.clear}
          </button>
          <button type="button" className="btn btn-secondary" onClick={b.close}>
            {b.t.picker.close}
          </button>
        </div>
        <PopoverFooterNote anchor={anchor} />
      </div>
    </div>
  );
}
