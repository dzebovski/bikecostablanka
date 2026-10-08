"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { dayInfo, fromOrd, toOrd } from "@/lib/booking";
import { formatDay, formatMonthYear, weekdayInitials } from "@/lib/format";
import { useBooking } from "./booking-context";
import { validHover } from "./summary";

function daysInMonth(monthStart: number) {
  const [y, m] = fromOrd(monthStart).split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Monday-first weekday index, 0–6. */
function weekday(night: number) {
  return (new Date(night * 86_400_000).getUTCDay() + 6) % 7;
}

function addMonths(night: number, delta: number) {
  const [y, m, d] = fromOrd(night).split("-").map(Number);
  const month = m - 1 + delta;
  const year = y + Math.floor(month / 12);
  const mm = ((month % 12) + 12) % 12;
  const first = toOrd(`${year}-${String(mm + 1).padStart(2, "0")}-01`);
  return first + Math.min(d, daysInMonth(first)) - 1;
}

/**
 * Month grids as real tables of buttons with a roving tab stop.
 * Arrows move by day/week, PageUp/PageDown by month, Home/End to the week edges, Enter picks.
 */
export function Calendar({ monthStarts, layout }: { monthStarts: number[]; layout: "columns" | "list" }) {
  const b = useBooking();
  const root = useRef<HTMLDivElement>(null);
  const keyNav = useRef(false);
  const weekdays = weekdayInitials(b.locale);
  const first = b.months[0];
  const lastMonth = b.months[b.months.length - 1];
  const last = lastMonth + daysInMonth(lastMonth) - 1;
  const hover = validHover(b);

  useEffect(() => {
    if (!keyNav.current) return;
    keyNav.current = false;
    const button = root.current?.querySelector<HTMLButtonElement>(`[data-ord="${b.focusDay}"]`);
    button?.focus({ preventScroll: layout === "columns" });
    if (layout === "list") button?.scrollIntoView({ block: "nearest" });
  }, [b.focusDay, b.viewIndex, layout]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = b.focusDay;
    if (current === null) return;
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: number;
    if (event.key in steps) next = current + steps[event.key];
    else if (event.key === "PageUp") next = addMonths(current, -1);
    else if (event.key === "PageDown") next = addMonths(current, 1);
    else if (event.key === "Home") next = current - weekday(current);
    else if (event.key === "End") next = current + 6 - weekday(current);
    else return;
    event.preventDefault();
    next = Math.min(last, Math.max(first, next));
    keyNav.current = true;
    b.setFocusDay(next);
    if (layout === "columns") {
      const visibleFrom = b.months[b.viewIndex];
      const visibleTo = b.months[b.viewIndex + 2] ?? last + 1;
      const index = b.months.findLastIndex((start) => next >= start);
      if (next < visibleFrom) b.setViewIndex(Math.min(index, b.months.length - 2));
      else if (next >= visibleTo) b.setViewIndex(Math.max(0, Math.min(index - 1, b.months.length - 2)));
    }
  }

  return (
    <div
      ref={root}
      onKeyDown={onKeyDown}
      onMouseLeave={() => b.setHover(null)}
      className={layout === "columns" ? "flex justify-between gap-10" : "flex flex-col gap-2.5"}
    >
      {monthStarts.map((monthStart) => {
        const count = daysInMonth(monthStart);
        const lead = weekday(monthStart);
        const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => monthStart + i)];
        while (cells.length % 7) cells.push(null);
        const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
        const title = formatMonthYear(monthStart, b.locale);
        return (
          <div key={monthStart} className={layout === "columns" ? "flex w-[308px] flex-col gap-2.5" : "flex flex-col gap-2.5 pt-2 first:pt-0"}>
            <p className="t-body font-medium" id={`m-${monthStart}`}>
              {title}
            </p>
            <table role="grid" aria-labelledby={`m-${monthStart}`} className="w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-0.5 t-sm tnum">
              {layout === "columns" && (
                <thead>
                  <tr>
                    {weekdays.map((w, i) => (
                      <th key={i} scope="col" aria-hidden="true" className="h-7 p-0 text-xs font-medium">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {weeks.map((week, w) => (
                  <tr key={w}>
                    {week.map((night, i) =>
                      night === null ? (
                        <td key={i} className="p-0" />
                      ) : (
                        <td key={i} className="p-0">
                          <Day night={night} hover={hover} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function Day({ night, hover }: { night: number; hover: number | null }) {
  const b = useBooking();
  const { start, end } = b.sel;
  const info = dayInfo(night, b.sel, b.today, b.booked);
  const picking = start !== null && end === null;
  const isStart = night === start;
  const isEnd = night === end;
  const inRange = start !== null && end !== null && night > start && night < end;
  const preview = hover !== null && start !== null && night > start && night <= hover;
  let edge: string | undefined;
  if (isStart) edge = end !== null || hover !== null ? "start" : "single";
  if (isEnd) edge = "end";

  const notes = [
    night === b.today ? b.t.picker.today : null,
    info.booked ? b.t.picker.booked : null,
    info.checkoutOnly ? b.t.picker.checkoutOnly : null,
    info.short ? b.t.picker.underMin : null,
  ].filter(Boolean);

  return (
    <button
      type="button"
      className="day"
      data-ord={night}
      tabIndex={b.focusDay === night ? 0 : -1}
      aria-disabled={!info.selectable || undefined}
      aria-pressed={isStart || isEnd}
      aria-label={[formatDay(night, b.locale), ...notes].join(", ")}
      data-today={night === b.today || undefined}
      data-booked={info.booked || undefined}
      data-past={(info.past && !info.booked) || undefined}
      data-short={info.short || undefined}
      data-unreachable={info.unreachable || undefined}
      data-range={inRange || undefined}
      data-preview={(preview && !isStart) || undefined}
      data-preview-end={(preview && night === hover) || undefined}
      data-edge={edge}
      onClick={() => {
        b.setFocusDay(night);
        if (info.selectable) b.pickDay(night);
      }}
      onMouseEnter={() => {
        if (picking && b.hover !== night) b.setHover(night);
      }}
      onFocus={() => {
        if (picking && b.hover !== night) b.setHover(night);
      }}
    >
      {Number(fromOrd(night).slice(8))}
    </button>
  );
}
