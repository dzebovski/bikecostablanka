"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { prices } from "@/data/prices";
import { DESKTOP } from "@/hooks/use-media";
import { airbnbUrl } from "@/lib/airbnb";
import { track, trackLongStayIntent } from "@/lib/analytics";
import {
  DEFAULT_GUESTS,
  MIN_NIGHTS,
  estimateTotal,
  fromOrd,
  guestCount,
  isIsoDate,
  nextFreeWindow,
  overlapping,
  pick,
  selectionStatus,
  setGuests as clampGuests,
  toOrd,
  toOrdRanges,
  todayInMadrid,
  type DateRange,
  type Guests,
  type OrdRange,
  type Selection,
  type Status,
} from "@/lib/booking";

export type BookingMessages = Pick<Dictionary, "booking" | "picker" | "guests" | "sheet" | "cta" | "mobileBar">;

export type Source =
  | "header"
  | "bottom_bar"
  | "amenities"
  | "prices"
  | "final_cta"
  | "mobile_bar"
  | "lightbox"
  | "all_photos"
  | "amenities_modal"
  | "sheet";

type Surface = "dates" | "guests" | "sheet" | null;
/** Where the desktop popovers open: the bottom bar, or the Final CTA fields when that section is in view. */
export type Anchor = "bar" | "final";
type Availability = "loading" | "ok" | "error";

type BookingContextValue = {
  locale: Locale;
  t: BookingMessages;
  today: number;
  months: number[];
  sel: Selection;
  guests: Guests;
  booked: OrdRange[];
  availability: Availability;
  status: Status;
  nights: number | null;
  estimate: number | null;
  conflicts: OrdRange[];
  hover: number | null;
  setHover: (night: number | null) => void;
  surface: Surface;
  anchor: Anchor;
  /** The element that opened the current surface (for aligning the popover to the clicked field). */
  trigger: { current: HTMLElement | null };
  sheetStep: "dates" | "guests";
  setSheetStep: (step: "dates" | "guests") => void;
  viewIndex: number;
  setViewIndex: (index: number) => void;
  focusDay: number | null;
  setFocusDay: (night: number) => void;
  openDates: (source: Source, trigger?: HTMLElement | null) => void;
  openGuests: (trigger?: HTMLElement | null) => void;
  close: () => void;
  pickDay: (night: number) => void;
  clear: () => void;
  extend: () => void;
  showNextFree: () => void;
  updateGuests: (change: Partial<Guests>) => void;
  airbnbHref: string | null;
  onCheckAvailability: (source: Source) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking must be used inside <BookingProvider>");
  return value;
}

/** For islands that also render outside the landing (lightbox on /photos). */
export function useOptionalBooking() {
  return useContext(BookingContext);
}

const MONTHS_SHOWN = 12;

const noopSubscribe = () => () => {};

export const FINAL_CTA_ID = "final-cta";

/** The clicked field's own anchor, else the Final CTA when it is on screen (the bar hides there), else the bar. */
function anchorFor(el?: HTMLElement | null): Anchor {
  const own = el?.closest<HTMLElement>("[data-anchor]")?.dataset.anchor;
  if (own === "bar" || own === "final") return own;
  const final = document.getElementById(FINAL_CTA_ID);
  if (!final) return "bar";
  const rect = final.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0 ? "final" : "bar";
}

function monthStarts(today: number) {
  const [y, m] = fromOrd(today).split("-").map(Number);
  return Array.from({ length: MONTHS_SHOWN }, (_, i) => {
    const month = m - 1 + i;
    const year = y + Math.floor(month / 12);
    return toOrd(`${year}-${String((month % 12) + 1).padStart(2, "0")}-01`);
  });
}

function monthIndexOf(months: number[], night: number) {
  let index = 0;
  months.forEach((start, i) => {
    if (night >= start) index = i;
  });
  return index;
}

function readUrlState(today: number): { sel: Selection; guests: Guests; openDates: boolean } | null {
  const params = new URLSearchParams(window.location.search);
  const checkIn = params.get("check_in");
  const checkOut = params.get("check_out");
  const sel: Selection = { start: null, end: null };
  if (isIsoDate(checkIn) && toOrd(checkIn) >= today) {
    sel.start = toOrd(checkIn);
    if (isIsoDate(checkOut) && toOrd(checkOut) > sel.start) sel.end = toOrd(checkOut);
  }
  const num = (key: string, fallback: number) => {
    const value = Number(params.get(key));
    return Number.isInteger(value) && params.has(key) ? value : fallback;
  };
  const guests = clampGuests(DEFAULT_GUESTS, {
    adults: num("adults", DEFAULT_GUESTS.adults),
    children: num("children", 0),
    infants: num("infants", 0),
    pets: params.get("pets") === "1",
  });
  const openDates = params.get("dates") === "1";
  if (sel.start === null && !openDates && !params.has("adults")) return null;
  return { sel, guests, openDates };
}

export function BookingProvider({ locale, t, children }: { locale: Locale; t: BookingMessages; children: ReactNode }) {
  // Today is read on the client only (the page itself is prerendered); 0 until hydrated.
  const today = useSyncExternalStore(noopSubscribe, todayInMadrid, () => 0);
  const months = useMemo(() => monthStarts(today), [today]);
  const [sel, setSel] = useState<Selection>({ start: null, end: null });
  const [guests, setGuestsState] = useState<Guests>(DEFAULT_GUESTS);
  const [booked, setBooked] = useState<OrdRange[]>([]);
  const [availability, setAvailability] = useState<Availability>("loading");
  const [hover, setHover] = useState<number | null>(null);
  const [surface, setSurface] = useState<Surface>(null);
  const [anchor, setAnchor] = useState<Anchor>("bar");
  const [sheetStep, setSheetStep] = useState<"dates" | "guests">("dates");
  const [viewIndex, setViewIndex] = useState(0);
  const [focusDay, setFocusDay] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  // Booked nights from the iCal feed (via our API, the feed URL stays on the server).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((res) => (res.ok ? res.json() : { booked: null }))
      .catch(() => ({ booked: null }))
      .then((data: { booked: DateRange[] | null }) => {
        if (cancelled) return;
        if (data.booked) {
          setBooked(toOrdRanges(data.booked));
          setAvailability("ok");
        } else setAvailability("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const status = selectionStatus(sel, booked);
  const nights = sel.start !== null && sel.end !== null ? sel.end - sel.start : null;
  const estimate = sel.start !== null && nights ? estimateTotal(sel.start, nights, prices.estimateRates) : null;
  const conflicts = useMemo(
    () => (sel.start !== null && sel.end !== null ? overlapping(sel.start, sel.end, booked) : []),
    [sel.start, sel.end, booked],
  );

  const firstSelectable = useCallback(
    (from: number) => nextFreeWindow(from, today, booked, months[months.length - 1] + 31) ?? Math.max(from, today),
    [today, booked, months],
  );

  const showMonthOf = useCallback(
    (night: number, desktop: boolean) => {
      const index = monthIndexOf(months, night);
      setViewIndex(desktop ? Math.min(index, months.length - 2) : index);
      setFocusDay(night);
    },
    [months],
  );

  const openDatesAt = useCallback(
    (focus: number, source: Source, el?: HTMLElement | null) => {
      track("open_date_picker", { source });
      trigger.current = el ?? (document.activeElement as HTMLElement | null);
      const desktop = window.matchMedia(DESKTOP).matches;
      showMonthOf(focus, desktop);
      setHover(null);
      if (desktop) {
        setAnchor(anchorFor(trigger.current));
        setSurface("dates");
      } else {
        setSheetStep("dates");
        setSurface("sheet");
      }
    },
    [showMonthOf],
  );

  const openDates = useCallback(
    (source: Source, el?: HTMLElement | null) => openDatesAt(sel.start ?? firstSelectable(today), source, el),
    [openDatesAt, sel.start, firstSelectable, today],
  );

  const openGuests = useCallback(
    (el?: HTMLElement | null) => {
      trigger.current = el ?? (document.activeElement as HTMLElement | null);
      if (window.matchMedia(DESKTOP).matches) {
        setAnchor(anchorFor(trigger.current));
        setSurface((s) => (s === "guests" ? null : "guests"));
      } else {
        setSheetStep("guests");
        setSurface("sheet");
      }
    },
    [],
  );

  const close = useCallback(() => {
    setSurface(null);
    setHover(null);
    const el = trigger.current;
    if (el && document.contains(el)) window.setTimeout(() => el.focus({ preventScroll: true }), 0);
  }, []);

  // Deep links: ?check_in=…&check_out=…&adults=… prefill, ?dates=1 opens the picker.
  useEffect(() => {
    if (!today) return;
    const state = readUrlState(today);
    if (!state) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reading the URL once after hydration */
    setSel(state.sel);
    setGuestsState(state.guests);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (state.openDates) {
      const url = new URL(window.location.href);
      const source = (url.searchParams.get("source") as Source | null) ?? "all_photos";
      url.searchParams.delete("dates");
      url.searchParams.delete("source");
      window.history.replaceState(null, "", url);
      window.setTimeout(() => openDatesAt(state.sel.start ?? today, source, null), 0);
    }
  }, [today, openDatesAt]);

  const reportRange = useCallback((next: Selection) => {
    if (next.start === null || next.end === null) return;
    track("view_dates", { nights: next.end - next.start, check_in: fromOrd(next.start), check_out: fromOrd(next.end) });
  }, []);

  const pickDay = useCallback(
    (night: number) => {
      const next = pick(sel, night, today, booked);
      if (next === sel) return;
      setSel(next);
      setHover(null);
      if (next.end !== null) {
        reportRange(next);
        if (surface === "dates") close();
      }
    },
    [sel, today, booked, surface, close, reportRange],
  );

  const clear = useCallback(() => {
    setSel({ start: null, end: null });
    setHover(null);
  }, []);

  const extend = useCallback(() => {
    if (sel.start === null) return;
    const next = { start: sel.start, end: sel.start + MIN_NIGHTS };
    setSel(next);
    if (selectionStatus(next, booked) === "valid") reportRange(next);
  }, [sel.start, booked, reportRange]);

  const showNextFree = useCallback(() => {
    const after = conflicts.length ? Math.max(...conflicts.map((r) => r.to)) : (sel.start ?? today);
    const focus = firstSelectable(after);
    setSel({ start: null, end: null });
    const desktop = window.matchMedia(DESKTOP).matches;
    const source: Source = !desktop ? "sheet" : anchor === "final" ? "final_cta" : "bottom_bar";
    openDatesAt(focus, source, document.activeElement as HTMLElement | null);
  }, [conflicts, sel.start, today, firstSelectable, openDatesAt, anchor]);

  const updateGuests = useCallback((change: Partial<Guests>) => setGuestsState((g) => clampGuests(g, change)), []);

  const airbnbHref =
    status === "valid" && sel.start !== null && sel.end !== null
      ? airbnbUrl(locale, fromOrd(sel.start), fromOrd(sel.end), guests)
      : null;

  const onCheckAvailability = useCallback(
    (source: Source) => {
      if (sel.start === null || sel.end === null || !nights) return;
      const params = {
        nights,
        guests: guestCount(guests),
        check_in: fromOrd(sel.start),
        check_out: fromOrd(sel.end),
        value: estimate ?? nights * prices.fallbackNightly,
        currency: prices.currency,
        locale,
        source,
      };
      track("click_book_airbnb", params, "InitiateCheckout");
      if (nights >= MIN_NIGHTS) trackLongStayIntent(params);
    },
    [sel, nights, guests, estimate, locale],
  );

  const value: BookingContextValue = {
    locale,
    t,
    today,
    months,
    sel,
    guests,
    booked,
    availability,
    status,
    nights,
    estimate,
    conflicts,
    hover,
    setHover,
    surface,
    anchor,
    trigger,
    sheetStep,
    setSheetStep,
    viewIndex,
    setViewIndex,
    focusDay,
    setFocusDay,
    openDates,
    openGuests,
    close,
    pickDay,
    clear,
    extend,
    showNextFree,
    updateGuests,
    airbnbHref,
    onCheckAvailability,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
