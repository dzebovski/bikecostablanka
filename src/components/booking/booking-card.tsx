"use client";

import { prices } from "@/data/prices";
import { fill, formatDay, formatEuro } from "@/lib/format";
import { ContactLink } from "@/components/contact-link";
import { contact } from "@/lib/contact";
import { useBooking } from "./booking-context";
import { BookingAction, BookingFields, NightsLine } from "./booking-fields";
import { DatePickerPopover } from "./date-picker";
import { GuestPopover } from "./guest-picker";
import { earliestCheckOut, nightsAndPrice, validHover } from "./summary";

/** "from €71 / night" */
export function FromPrice({ size = "card" }: { size?: "card" | "bar" }) {
  const { t, locale } = useBooking();
  return (
    <p className={`flex items-baseline ${size === "bar" ? "gap-1" : "gap-1.5"}`}>
      <span className="t-sm">{t.booking.from}</span>
      <span className={size === "bar" ? "t-num text-[24px]!" : "t-num"}>{formatEuro(prices.fromPerNight, locale)}</span>
      <span className="t-sm">{t.booking.perNight}</span>
    </p>
  );
}

/** State 2 hint: earliest check-out, plus the hovered range on desktop. */
function PickingHint() {
  const b = useBooking();
  if (b.status !== "picking" || b.sel.start === null) return null;
  const hover = validHover(b);
  return (
    <p className="t-sm tnum" aria-live="polite">
      {earliestCheckOut(b)}
      {hover !== null && (
        <>
          <br />
          {fill(b.t.booking.hovering, { date: formatDay(hover, b.locale) })}{" "}
          <span className="font-medium">{nightsAndPrice(b, b.sel.start, hover - b.sel.start)}</span>
        </>
      )}
    </p>
  );
}

export function UnavailableNote() {
  const b = useBooking();
  if (b.availability !== "error") return null;
  return <p className="t-sm">{b.t.booking.unavailable}</p>;
}

/** "Questions? Message Eugene on WhatsApp" (or email); hidden when no contact is set. */
export function QuestionsLine({ source }: { source: string }) {
  const { t } = useBooking();
  const channel = contact.whatsapp ? "whatsapp" : contact.email ? "email" : null;
  if (!channel) return null;
  return (
    <p className="t-sm">
      {t.booking.questions}{" "}
      <ContactLink channel={channel} source={source} className="link">
        {channel === "whatsapp" ? t.booking.messageWhatsapp : t.booking.messageEmail}
      </ContactLink>
    </p>
  );
}

export function BookingCard() {
  const b = useBooking();
  const t = b.t.booking;
  return (
    <aside
      id="book"
      data-component="BookingCard"
      aria-label={t.label}
      className="card hidden w-full max-w-[336px] flex-col gap-4 relative z-10 md:flex lg:sticky lg:top-20 lg:flex-[1_1_320px]"
    >
      <div>
        <FromPrice />
        <p className="t-sm mt-1.5">{t.terms}</p>
      </div>
      <div className="relative">
        <BookingFields source="card" />
        <DatePickerPopover />
        <GuestPopover />
      </div>
      <PickingHint />
      {b.status !== "short" && b.status !== "conflict" && <NightsLine />}
      <UnavailableNote />
      <BookingAction source="card" className="w-full" />
      <p className="t-sm">{t.noCharge}</p>
      <div className="flex flex-col gap-2.5 border-t border-line pt-3.5">
        <QuestionsLine source="card" />
        <p className="t-sm tnum">{t.trust}</p>
      </div>
    </aside>
  );
}
