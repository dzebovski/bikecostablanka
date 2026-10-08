"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePresence } from "@/hooks/use-presence";
import { track } from "@/lib/analytics";
import { openCookieSettings } from "@/lib/consent";
import { useBooking } from "@/components/booking/booking-context";

/** About: four clamped lines and "Show more". */
export function AboutText({ text, textMobile, more, less }: { text: string; textMobile: string; more: string; less: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p id="about-text" className={`t-body ${open ? "" : "clamp-4"}`}>
        {open ? (
          text
        ) : (
          <>
            <span className="md:hidden">{textMobile}</span>
            <span className="hidden md:inline">{text}</span>
          </>
        )}
      </p>
      <button type="button" className="text-button t-body" aria-expanded={open} aria-controls="about-text" onClick={() => setOpen((o) => !o)}>
        {open ? less : more}
      </button>
    </>
  );
}

/** Where you'll sleep: a scroll row with ← → on desktop and swipe on mobile. */
export function SleepRow({ title, previous, next, children }: { title: string; previous: string; next: string; children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  function update() {
    const el = list.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  }

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function scroll(direction: 1 | -1) {
    const el = list.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * (216 + 16) * 2, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <h2 className="t-h2">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button type="button" className="btn btn-secondary btn-sm btn-round" aria-label={previous} disabled={edges.start} onClick={() => scroll(-1)}>
            ←
          </button>
          <button type="button" className="btn btn-secondary btn-sm btn-round" aria-label={next} disabled={edges.end} onClick={() => scroll(1)}>
            →
          </button>
        </div>
      </div>
      <ul ref={list} onScroll={update} className="swipe swipe-bleed md:mx-0 md:gap-4 md:px-0">
        {children}
      </ul>
    </>
  );
}

/** "Show all 40+ amenities" and the modal it opens. */
export function AmenitiesButton({ t, checkDates }: { t: Dictionary["amenities"]; checkDates: string }) {
  const [open, setOpen] = useState(false);
  const { mounted, state } = usePresence(open, 140);
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const booking = useBooking();

  useEffect(() => {
    const el = dialog.current;
    if (!mounted || !el) return;
    if (!el.open) el.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mounted]);

  function close() {
    setOpen(false);
    window.setTimeout(() => button.current?.focus({ preventScroll: true }), 0);
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        className="btn btn-secondary"
        data-event="open_amenities"
        onClick={() => {
          track("open_amenities");
          setOpen(true);
        }}
      >
        {t.showAll}
      </button>
      {mounted && (
        <dialog
          ref={dialog}
          className="modal amenities-modal"
          data-component="AmenitiesModal"
          data-state={state}
          aria-label={t.title}
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="t-h2">{t.title}</h2>
              <button type="button" className="step text-xl" aria-label={t.close} onClick={close}>
                ×
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-6 pt-1 pb-4">
              {t.groups.map((group) => (
                <div key={group.title}>
                  <h3 className="t-label pt-3.5 pb-0.5">{group.title}</h3>
                  <ul className="t-body">
                    {group.items.map((item, i) => (
                      <li key={item} className={`row py-3 ${i === group.items.length - 1 ? "border-b-0" : ""}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-3.5">
              <p className="t-sm">{t.modalFooter}</p>
              <button
                type="button"
                className="btn btn-primary"
                data-event="open_date_picker"
                onClick={(e) => {
                  const el = e.currentTarget;
                  setOpen(false);
                  window.setTimeout(() => booking.openDates("amenities_modal", button.current ?? el), 160);
                }}
              >
                {checkDates}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

/** Footer link that reopens the cookie banner. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" className="t-sm border-0 bg-transparent p-0 text-charcoal underline underline-offset-[3px]" onClick={openCookieSettings}>
      {label}
    </button>
  );
}
