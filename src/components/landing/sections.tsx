import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { freeWindows, prices, type FreeWindow, type PriceMonth } from "@/data/prices";
import { landingPhotos, photoIndex } from "@/data/photos";
import { toOrd } from "@/lib/booking";
import { fill, formatDate, formatDayMonth, formatDayRange, formatEuro, formatList, formatMonthName } from "@/lib/format";
import { contact } from "@/lib/contact";
import { ContactLink } from "@/components/contact-link";
import { PhotoTrigger } from "@/components/lightbox";
import { AboutText, AmenitiesButton, SleepRow } from "@/components/islands";
import { CheckDates, FinalCtaForm } from "@/components/booking/triggers";
import { FINAL_CTA_ID } from "@/components/booking/booking-context";

type T = Dictionary;
type WithT = { t: T; locale: Locale };

/** Hides on mobile / desktop so the two drawn copy variants can share one tree. */
function Variants({ desktop, mobile }: { desktop: string; mobile?: string }) {
  if (!mobile || mobile === desktop) return <>{desktop}</>;
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="hidden md:inline">{desktop}</span>
    </>
  );
}

function FactStat({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`stat ${className}`}>
      <dt className="t-num">{value}</dt>
      <dd className="t-sm m-0">{label}</dd>
    </div>
  );
}

export function freeWindowText(w: FreeWindow, t: T, locale: Locale) {
  if (!w.to) return fill(t.prices.from, { date: formatDayMonth(toOrd(w.from), locale) });
  return formatDayRange(toOrd(w.from), toOrd(w.to), locale);
}

/* ---------- Title ---------- */

export function TitleBlock({ t }: { t: T }) {
  const sep = <span aria-hidden="true">·</span>;
  return (
    <section data-component="TitleBlock" className="sh">
      <h1 className="t-h1">{t.title.h1}</h1>
      <p className="t-sm flex flex-wrap gap-x-2 gap-y-1">
        <span>{t.title.place}</span>
        {sep}
        <a href="#reviews" className="font-medium text-charcoal tnum no-underline hover:underline">
          {t.title.rating}
        </a>
        {sep}
        <span>{t.title.minimum}</span>
        {sep}
        <span>{t.title.cancellation}</span>
      </p>
    </section>
  );
}

export function AnchorStrip({ t }: { t: T }) {
  return (
    <nav aria-label={t.header.navLabel} className="swipe swipe-bleed t-sm gap-2 md:hidden">
      {t.header.mobileNav.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="btn btn-secondary btn-sm btn-pill font-normal">
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/* ---------- Body column ---------- */

export function KeyFacts({ t }: { t: T }) {
  return (
    <section data-component="KeyFacts" aria-label={t.keyFacts.label} className="lg:col-span-4">
      <dl className="m-0 grid grid-cols-4 gap-x-3 md:gap-x-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
        {t.keyFacts.items.map((item) => (
          <FactStat key={item.label} value={item.value} label={item.label} />
        ))}
      </dl>
    </section>
  );
}

export function Highlights({ t }: { t: T }) {
  return (
    <section data-component="Highlights" className="flex flex-col lg:col-span-8">
      {t.highlights.map((item, i) => (
        <div key={item.title} className={`row row-stack first:pt-0 ${i === t.highlights.length - 1 ? "border-b-0 pb-0" : ""}`}>
          <h3 className="t-body m-0 font-medium">{item.title}</h3>
          <p className="t-sm">{item.text}</p>
        </div>
      ))}
    </section>
  );
}

export function About({ t }: { t: T }) {
  return (
    <section data-component="About" className="sec">
      <h2 className="t-h2">{t.about.title}</h2>
      <div className="flex flex-col">
        <AboutText text={t.about.text} textMobile={t.about.textMobile} more={t.about.showMore} less={t.about.showLess} />
      </div>
    </section>
  );
}

export function SleepCards({ t }: { t: T }) {
  return (
    <section data-component="SleepCards" className="sec">
      <SleepRow title={t.sleep.title} previous={t.sleep.previous} next={t.sleep.next}>
        {t.sleep.rooms.map((room) => {
          const index = photoIndex(landingPhotos, room.photo);
          const photo = landingPhotos[index];
          return (
            <li key={room.title} className="flex flex-[0_0_236px] flex-col gap-2 md:flex-[0_0_216px] lg:flex-[0_0_calc((100%-48px)/4)]">
              <PhotoTrigger index={index} className="tile aspect-[4/3] w-full border-0 p-0" label={room.alt}>
                <Image src={photo.file} alt={room.alt} fill sizes="(min-width: 1024px) 270px, 236px" />
              </PhotoTrigger>
              <div>
                <h3 className="t-h3">{room.title}</h3>
                <p className="t-sm">
                  <Variants desktop={room.text} mobile={"textMobile" in room ? room.textMobile : undefined} />
                </p>
              </div>
            </li>
          );
        })}
      </SleepRow>
    </section>
  );
}

export function Amenities({ t }: { t: T }) {
  const items = t.amenities.items;
  // Three columns from 768px (4 · 3 · 3), one list below.
  const size = Math.ceil(items.length / 3);
  const columns = [items.slice(0, size), items.slice(size, size + Math.ceil((items.length - size) / 2)), items.slice(size + Math.ceil((items.length - size) / 2))];
  return (
    <section data-component="Amenities" className="sec">
      <h2 className="t-h2">{t.amenities.title}</h2>
      <div className="t-body md:grid md:grid-cols-3 md:gap-x-8">
        {columns.map((column, c) => (
          <ul key={c}>
            {column.map((item, i) => {
              const lastInColumn = i === column.length - 1;
              const lastOfAll = lastInColumn && c === columns.length - 1;
              return (
                <li key={item} className={`row ${lastInColumn ? "md:border-b-0" : ""} ${lastOfAll ? "border-b-0" : ""}`}>
                  {item}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-6">
        <AmenitiesButton t={t.amenities} checkDates={t.cta.checkDates} />
        <CheckDates source="amenities" variant="link" />
      </div>
    </section>
  );
}

/* ---------- Rides ---------- */

export function Rides({ t }: { t: T }) {
  const r = t.rides;
  return (
    <section id="rides" data-component="Rides" className="sec">
      <div className="sh">
        <h2 className="t-h2">{r.title}</h2>
        <p className="t-body">{r.text}</p>
      </div>
      <div className="swipe swipe-bleed md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-8">
        {r.routes.map((route) => (
          <article key={route.name} data-component="RouteCard" className="flex flex-[0_0_290px] flex-col gap-4">
            {route.image ? (
              <div className="tile aspect-[16/10]">
                <Image src={route.image} alt={route.alt} fill sizes="(min-width: 1024px) 270px, (min-width: 768px) 45vw, 290px" />
              </div>
            ) : (
              <div className="tile flex aspect-[16/10] items-end p-4">
                <span className="t-label">{route.name}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="t-h3">{route.name}</h3>
                <span className={`chip ${route.hard ? "chip-solid" : ""}`}>{route.level}</span>
              </div>
              <dl className="m-0 flex gap-6">
                <FactStat value={route.km} label={r.km} />
                <FactStat value={route.climb} label={r.climbing} />
              </dl>
              <p className="t-sm">
                <Variants desktop={route.text} mobile={"textMobile" in route ? route.textMobile : undefined} />
              </p>
              <a href={route.strava} target="_blank" rel="noopener" className="link t-sm inline-flex min-h-11 items-center self-start md:min-h-0">
                {r.strava}
              </a>
            </div>
          </article>
        ))}
        <figure className="m-0 flex flex-[0_0_290px] flex-col gap-4">
          <div className="tile aspect-[16/10]">
            <Image
              src="/images/rides/january-2025-shorts.jpg"
              alt={r.winter.alt}
              fill
              sizes="(min-width: 1024px) 270px, (min-width: 768px) 45vw, 290px"
              className="object-[50%_30%]"
            />
          </div>
          <figcaption className="flex flex-col gap-2">
            <span className="t-h3">{r.winter.title}</span>
            <span className="t-sm">{r.winter.text}</span>
          </figcaption>
        </figure>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-line pt-6 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {r.facts.map((fact) => (
          <FactStat key={fact.label} value={fact.value} label={fact.label} />
        ))}
      </dl>
    </section>
  );
}

/* ---------- Prices (snow band 1 of 2) ---------- */

function monthFree(m: PriceMonth, t: T, locale: Locale) {
  if (m.free === "open") return t.prices.open;
  return m.free.map((w) => freeWindowText(w, t, locale)).join(", ");
}

function monthExample(m: PriceMonth, t: T, locale: Locale) {
  if (!m.example) return "—";
  return fill(t.prices.exampleValue, { n: m.example.nights, total: formatEuro(m.example.total, locale) });
}

function discountNote(m: PriceMonth, t: T) {
  if (m.example?.discount === "monthly") return fill(t.prices.monthlyDiscount, { pct: m.example.discountPct ?? 0 });
  if (m.example?.discount === "weekly") return t.prices.weeklyDiscount;
  return null;
}

export function PriceTable({ t, locale }: WithT) {
  const freeNote = fill(t.prices.freeNote, { windows: freeWindows.map((w) => freeWindowText(w, t, locale)).join(" · ") });
  const note = fill(t.prices.note, { date: formatDate(prices.checkedOn, locale) });
  const cell = "border-b border-line py-3.5";
  return (
    <section id="prices" data-component="PriceTable" className="band">
      <div className="wrap cols lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="sh">
            <h2 className="t-h2">{t.prices.title}</h2>
            <p className="t-body">{t.prices.text}</p>
          </div>
          <p className="t-sm rounded-chip bg-morning-sky px-3.5 py-3 font-medium md:px-4">{freeNote}</p>
          <CheckDates source="prices" className="hidden self-start md:inline-flex" />
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-8">
          {/* Desktop: table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="t-body w-full min-w-[560px] border-collapse tnum">
              <thead>
                <tr>
                  <th className="t-label border-b border-charcoal pb-3 text-left">{t.prices.month}</th>
                  <th className="t-label border-b border-charcoal pb-3 text-left">{t.prices.freeDates}</th>
                  <th className="t-label border-b border-charcoal pb-3 text-right">{t.prices.perNight}</th>
                  <th className="t-label border-b border-charcoal pb-3 text-right">{t.prices.example}</th>
                </tr>
              </thead>
              <tbody>
                {prices.months.map((m, i) => {
                  const last = i === prices.months.length - 1 ? "border-b-0" : "";
                  const booked = Array.isArray(m.free) && m.free.length === 0;
                  const discount = discountNote(m, t);
                  return (
                    <tr key={m.month}>
                      <td className={`${cell} ${last}`}>{formatMonthName(m.month, locale)}</td>
                      <td className={`${cell} ${last}`}>{booked ? <span className="chip chip-solid">{t.prices.fullyBooked}</span> : monthFree(m, t, locale)}</td>
                      <td className={`${cell} ${last} text-right ${m.perNight ? "font-medium" : ""}`}>{m.perNight ? formatEuro(m.perNight, locale) : "—"}</td>
                      <td className={`${cell} ${last} text-right`}>
                        {monthExample(m, t, locale)}
                        {discount && <span className="t-sm"> {discount}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile: list */}
          <ul className="tnum md:hidden">
            {prices.months.map((m, i) => {
              const last = i === prices.months.length - 1 ? "border-b-0" : "";
              const booked = Array.isArray(m.free) && m.free.length === 0;
              const discount = discountNote(m, t);
              if (booked) {
                return (
                  <li key={m.month} className={`row items-center ${last}`}>
                    <span className="t-body font-medium">{formatMonthName(m.month, locale)}</span>
                    <span className="chip chip-solid">{t.prices.fullyBooked}</span>
                  </li>
                );
              }
              return (
                <li key={m.month} className={`row row-stack ${last}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="t-body">
                      <span className="font-medium">{formatMonthName(m.month, locale)}</span> · {monthFree(m, t, locale)}
                    </span>
                    {m.perNight && (
                      <span className="t-body font-medium">
                        {formatEuro(m.perNight, locale)}
                        <span className="t-sm font-normal">{t.prices.nightSuffix}</span>
                      </span>
                    )}
                  </div>
                  <span className="t-sm">
                    {monthExample(m, t, locale)}
                    {discount && ` ${discount}`}
                  </span>
                </li>
              );
            })}
          </ul>
          <CheckDates source="prices" className="md:hidden" />
          <p className="t-sm">{note}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */

export function Reviews({ t }: { t: T }) {
  return (
    <section id="reviews" data-component="Reviews" className="sec">
      <h2 className="t-h2">{t.reviews.title}</h2>
      <div className="cols lg:items-start">
      <div className="stat lg:col-span-4">
        <p className="t-num text-[40px]! tracking-[-1px]! md:text-[48px]! md:tracking-[-1.2px]!">{t.reviews.rating}</p>
        <p className="t-sm">{t.reviews.count}</p>
      </div>
      <div className="swipe swipe-bleed md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:col-span-8 lg:gap-8">
        {t.reviews.items.map((review) => (
          <article key={review.name} data-component="ReviewCard" className="card flex flex-[0_0_290px] flex-col gap-4">
            <p className="t-body clamp-3">{review.quote}</p>
            <p className="t-sm">
              <span className="font-medium">{review.name}</span> · {review.date}
            </p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ---------- Location ---------- */

export function Location({ t }: { t: T }) {
  const l = t.location;
  return (
    <section id="location" data-component="Location" className="sec">
      <div className="sh">
        <h2 className="t-h2">{l.title}</h2>
        <p className="t-body">
          <Variants desktop={l.text} mobile={l.textMobile} />
        </p>
      </div>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-x-8">
        <a href={l.mapUrl} target="_blank" rel="noopener" aria-label={l.mapLabel} className="tile aspect-[4/3]">
          <span aria-hidden="true" className="absolute top-[46%] left-1/2 -mt-2 -ml-2 size-4 rounded-pill bg-charcoal" />
          <span aria-hidden="true" className="chip absolute bottom-3.5 left-3.5 bg-paper md:bottom-4 md:left-4">
            {l.mapChip}
          </span>
        </a>
        <dl className="t-sm md:t-body m-0">
          {l.distances.map((d, i) => (
            <div key={d.place} className={`row ${i === 0 ? "md:pt-0" : ""} ${i === l.distances.length - 1 ? "border-b-0" : ""}`}>
              <dt>{d.place}</dt>
              <dd className="m-0 font-medium tnum">{d.time}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="t-h3">{l.nonRiders}</h3>
        <ul className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4 lg:gap-8">
          {l.ideas.map((idea) => (
            <li key={idea.title} className="card flex flex-col gap-1 p-4 md:p-5">
              <span className="t-body font-medium">{idea.title}</span>
              <span className="t-sm">
                <Variants desktop={idea.text} mobile={idea.textMobile} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Host and good to know ---------- */

function HostCard({ t }: { t: T }) {
  const h = t.host;
  const hasContact = Boolean(contact.whatsapp || contact.email);
  return (
    <article data-component="HostCard" className="card flex flex-col gap-4 lg:col-span-4">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className="t-h2 inline-flex size-14 flex-[0_0_56px] items-center justify-center rounded-pill bg-paper md:size-16 md:flex-[0_0_64px]">
          {h.initial}
        </span>
        <div>
          <h3 className="t-h3 font-medium">{h.name}</h3>
          <p className="t-sm">{h.meta}</p>
        </div>
      </div>
      <p className="t-body">
        <Variants desktop={h.text} mobile={h.textMobile} />
      </p>
      {hasContact && (
        <div className="flex flex-col items-stretch gap-1 md:flex-row md:flex-wrap md:items-center md:gap-5">
          <ContactLink channel="whatsapp" source="host" className="btn btn-secondary">
            {h.whatsapp}
          </ContactLink>
          <ContactLink channel="email" source="host" className="link t-body inline-flex min-h-11 items-center self-center md:self-auto">
            {h.email}
          </ContactLink>
        </div>
      )}
    </article>
  );
}

function ThingsToKnow({ t }: { t: T }) {
  return (
    <div data-component="ThingsToKnow" className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-8">
      {t.goodToKnow.groups.map((group) => (
        <div key={group.title}>
          <h3 className="t-label pb-1">{group.title}</h3>
          <ul className="t-sm">
            {group.items.map((item, i) => (
              <li key={item} className={`row ${i === group.items.length - 1 ? "border-b-0" : ""}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function HostAndGoodToKnow({ t }: { t: T }) {
  return (
    <>
      <section className="sec">
        <h2 className="t-h2">
          <Variants desktop={t.host.titleDesktop} mobile={t.host.title} />
        </h2>
        <div className="cols lg:items-start">
          <HostCard t={t} />
          <div className="hidden md:block lg:col-span-8">
            <ThingsToKnow t={t} />
          </div>
        </div>
      </section>
      <section className="sec md:hidden">
        <h2 className="t-h2">{t.goodToKnow.title}</h2>
        <ThingsToKnow t={t} />
      </section>
    </>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ t }: { t: T }) {
  const hasContact = Boolean(contact.whatsapp || contact.email);
  return (
    <section id="faq" data-component="FAQ" className="sec">
      <h2 className="t-h2">{t.faq.title}</h2>
      <div className="cols">
      <div className="lg:col-span-8">
        {t.faq.items.map((item, i) => (
          <details key={item.q} open={i === 0} className="faq border-b border-line">
            <summary className="t-body md:t-h3 flex min-h-[52px] items-center justify-between gap-4 font-medium md:min-h-14 md:font-normal">
              <Variants desktop={item.q} mobile={"qMobile" in item ? item.qMobile : undefined} />
              <span aria-hidden="true" className="faq-closed">
                ▾
              </span>
              <span aria-hidden="true" className="faq-open">
                ×
              </span>
            </summary>
            <p className="t-sm md:t-body measure pb-4">
              <Variants desktop={item.a} mobile={item.aMobile} />
            </p>
          </details>
        ))}
        {hasContact && (
          <p className="t-body pt-6">
            {t.faq.anythingElse}{" "}
            <ContactLink channel={contact.whatsapp ? "whatsapp" : "email"} source="faq" className="link">
              {t.faq.message}
            </ContactLink>
          </p>
        )}
      </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA (snow 2 of 2) ---------- */

export function FinalCta({ t, locale }: WithT) {
  const windows = formatList(
    freeWindows.map((w) => freeWindowText(w, t, locale)),
    locale,
  );
  return (
    <section id={FINAL_CTA_ID} data-component="FinalCTA" className="sec">
      <div className="card flex flex-col gap-6 md:p-8">
        <div className="sh">
          <h2 className="t-h2">{t.finalCta.title}</h2>
          <p className="t-sm md:t-body">{fill(t.finalCta.text, { windows })}</p>
        </div>
        <FinalCtaForm />
        <div className="t-sm hidden flex-wrap gap-x-6 gap-y-1 md:flex">
          <p>{t.booking.noCharge}</p>
          <p className="tnum">{t.booking.trust}</p>
        </div>
      </div>
    </section>
  );
}
