"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/analytics";
import { airbnbUrl, EST_NIGHTLY_EUR, MIN_NIGHTS, nightsBetween } from "@/lib/airbnb";

type Labels = {
  checkIn: string;
  checkOut: string;
  guests: string;
  nightsLabel: string;
  submit: string;
  errorDates: string;
  errorMinNights: string;
  airbnbNote: string;
};

export function BookingForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  function onDatesChange(nextIn: string, nextOut: string) {
    setCheckIn(nextIn);
    setCheckOut(nextOut);
    setError("");
    if (nextIn && nextOut) {
      track("view_dates", { nights: nightsBetween(nextIn, nextOut), check_in: nextIn, locale });
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!checkIn || !checkOut || nights <= 0) return setError(labels.errorDates);
    if (nights < MIN_NIGHTS) return setError(labels.errorMinNights);

    const params = {
      nights,
      guests,
      check_in: checkIn,
      check_out: checkOut,
      locale,
      value: nights * EST_NIGHTLY_EUR,
      currency: "EUR",
    };
    track("click_book_airbnb", params, "InitiateCheckout");
    track("LongStayIntent", params);

    window.open(airbnbUrl(locale, checkIn, checkOut, guests), "_blank", "noopener");
  }

  const field = "flex flex-col gap-1 text-sm font-medium";
  const input = "rounded-lg border border-black/15 bg-white px-3 py-2 text-base";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">
      <label className={field}>
        {labels.checkIn}
        <input type="date" className={input} value={checkIn} onChange={(e) => onDatesChange(e.target.value, checkOut)} />
      </label>
      <label className={field}>
        {labels.checkOut}
        <input type="date" className={input} value={checkOut} onChange={(e) => onDatesChange(checkIn, e.target.value)} />
      </label>
      <label className={field}>
        {labels.guests}
        <select className={input} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-lg bg-orange-600 px-5 py-2.5 font-semibold text-white hover:bg-orange-700">
        {labels.submit}
      </button>
      <p className="text-sm text-black/60 sm:col-span-4" aria-live="polite">
        {error ? <span className="text-red-700">{error}</span> : nights > 0 ? `${nights} ${labels.nightsLabel} · ${labels.airbnbNote}` : labels.airbnbNote}
      </p>
    </form>
  );
}
