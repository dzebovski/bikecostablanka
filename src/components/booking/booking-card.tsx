"use client";

import { prices } from "@/data/prices";
import { fill, formatDay, formatEuro } from "@/lib/format";
import { ContactLink } from "@/components/contact-link";
import { contact } from "@/lib/contact";
import { useBooking } from "./booking-context";
import { earliestCheckOut, nightsAndPrice, validHover } from "./summary";

/* Pieces of the former sticky booking card, now used by the bottom bar, its popovers and the Final CTA. */

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
export function PickingHint() {
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
