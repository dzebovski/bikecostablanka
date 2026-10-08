"use client";

import { useEffect, useRef } from "react";
import { MAX_INFANTS, isGuestsFull, type Guests } from "@/lib/booking";
import { fill } from "@/lib/format";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { usePresence } from "@/hooks/use-presence";
import { useBooking } from "./booking-context";

/** "2 guests" / "3 guests, 1 infant, pets" */
export function guestLabel(t: ReturnType<typeof useBooking>["t"], g: Guests) {
  const total = g.adults + g.children;
  const parts = [fill(total === 1 ? t.guests.guest : t.guests.guestsCount, { n: total })];
  if (g.infants) parts.push(fill(g.infants === 1 ? t.guests.infant : t.guests.infantsCount, { n: g.infants }));
  if (g.pets) parts.push(t.guests.withPets);
  return parts.join(", ");
}

/** Adults, children, infants and pets rows (GuestPicker). */
export function GuestRows() {
  const b = useBooking();
  const g = b.guests;
  const t = b.t.guests;
  const full = isGuestsFull(g);
  const rows: { key: "adults" | "children" | "infants"; label: string; hint: string; min: boolean; max: boolean }[] = [
    { key: "adults", label: t.adults, hint: t.adultsHint, min: g.adults <= 1, max: full },
    { key: "children", label: t.children, hint: t.childrenHint, min: g.children <= 0, max: full },
    { key: "infants", label: t.infants, hint: t.infantsHint, min: g.infants <= 0, max: g.infants >= MAX_INFANTS },
  ];
  return (
    <div>
      {rows.map((row) => (
        <div key={row.key} className="row items-center">
          <div>
            <p className="t-body font-medium">{row.label}</p>
            <p className="t-sm">{row.hint}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="step"
              aria-label={fill(t.fewer, { what: row.label.toLowerCase() })}
              disabled={row.min}
              onClick={() => b.updateGuests({ [row.key]: g[row.key] - 1 })}
            >
              −
            </button>
            <span className="t-body w-5 text-center font-medium tnum" aria-live="polite">
              {g[row.key]}
            </span>
            <button
              type="button"
              className="step"
              aria-label={fill(t.more, { what: row.label.toLowerCase() })}
              disabled={row.max}
              onClick={() => b.updateGuests({ [row.key]: g[row.key] + 1 })}
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="row items-center border-b-0">
        <div>
          <p className="t-body font-medium" id="pets-label">
            {t.pets}
          </p>
          <p className="t-sm">{t.petsHint}</p>
        </div>
        <button
          type="button"
          role="switch"
          className="switch"
          aria-checked={g.pets}
          aria-labelledby="pets-label"
          onClick={() => b.updateGuests({ pets: !g.pets })}
        />
      </div>
      {full && (
        <p role="alert" className="msg t-sm bg-paper font-medium">
          {t.max}
        </p>
      )}
    </div>
  );
}

/** Desktop popover under the Guests field of the booking card. */
export function GuestPopover() {
  const b = useBooking();
  const open = b.surface === "guests";
  const { mounted, state } = usePresence(open, 140);
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, b.close);

  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLButtonElement>("button:not([disabled])")?.focus();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as Element).closest?.("[data-guests-field]")) return;
      b.close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, b]);

  if (!mounted) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={b.t.guests.label}
      data-component="GuestPicker"
      data-state={state}
      className="pop absolute top-[calc(100%+8px)] -right-6 z-30 flex w-[360px] flex-col px-6 pt-2 pb-5"
    >
      <GuestRows />
      <div className="flex justify-end pt-3">
        <button type="button" className="btn btn-secondary" onClick={b.close}>
          {b.t.guests.done}
        </button>
      </div>
    </div>
  );
}
