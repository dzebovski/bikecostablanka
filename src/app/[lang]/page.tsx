import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BookingForm } from "@/components/booking-form";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

function Section({ id, eyebrow, title, children, tone }: { id: string; eyebrow: string; title: string; children: ReactNode; tone?: "muted" }) {
  return (
    <section id={id} className={`scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24 ${tone === "muted" ? "bg-black/[0.03]" : ""}`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-700">{eyebrow}</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Cards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-black/10 bg-white p-6">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-2 text-black/70">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  const navItems = [
    ["routes", t.nav.routes],
    ["house", t.nav.house],
    ["long-stay", t.nav.longStay],
    ["explore", t.nav.explore],
    ["getting-here", t.nav.gettingHere],
    ["faq", t.nav.faq],
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-black/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="font-semibold">Bike Costa Blanca</a>
          <nav className="hidden gap-5 text-sm md:flex">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-black/70 hover:text-black">{label}</a>
            ))}
          </nav>
          <a href="#book" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">{t.nav.book}</a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-4 py-24 text-white sm:px-6 sm:py-36">
          <Image src="/images/vall-debo.jpeg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/45" />
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{t.hero.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{t.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-lg text-white/90">{t.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="rounded-lg bg-orange-600 px-5 py-3 font-semibold hover:bg-orange-700">{t.hero.ctaPrimary}</a>
              <a href="#routes" className="rounded-lg bg-white/15 px-5 py-3 font-semibold backdrop-blur hover:bg-white/25">{t.hero.ctaSecondary}</a>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              {t.hero.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-sm text-white/75">{fact.label}</dt>
                  <dd className="text-2xl font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Section id="why" eyebrow={t.why.eyebrow} title={t.why.title}>
          <Cards items={t.why.items} />
        </Section>

        <Section id="routes" eyebrow={t.routes.eyebrow} title={t.routes.title} tone="muted">
          <p className="max-w-3xl text-lg text-black/70">{t.routes.intro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.routes.items.map((route) => (
              <article key={route.slug} className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
                <div className="relative aspect-[4/3] bg-black/10">
                  {route.image && <Image src={route.image} alt={route.imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold">{route.name}</h3>
                    <span className="text-sm text-black/60">{route.level}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-orange-700">
                    {route.km} {t.routes.distance} · {route.elevation} {t.routes.elevation}
                  </p>
                  <p className="mt-3 flex-1 text-black/70">{route.text}</p>
                  <a href={route.strava} target="_blank" rel="noopener" className="mt-4 font-semibold text-orange-700 hover:underline">
                    {t.routes.openStrava} →
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-black p-6 text-white sm:p-8">
            <h3 className="text-xl font-semibold">{t.routes.challenge.title}</h3>
            <p className="mt-2 text-white/80">{t.routes.challenge.text}</p>
          </div>
        </Section>

        <Section id="house" eyebrow={t.house.eyebrow} title={t.house.title}>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-lg text-black/70">{t.house.text}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {t.house.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="font-semibold">{group.title}</h3>
                    <ul className="mt-2 space-y-1 text-black/70">
                      {group.items.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image src={t.house.image} alt={t.house.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Section>

        <Section id="long-stay" eyebrow={t.longStay.eyebrow} title={t.longStay.title} tone="muted">
          <p className="max-w-3xl text-lg text-black/70">{t.longStay.text}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {t.longStay.points.map((point) => (
              <div key={point.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="font-semibold">{point.title}</h3>
                <p className="mt-2 text-black/70">{point.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-medium">{t.longStay.priceNote}</p>
        </Section>

        <Section id="explore" eyebrow={t.explore.eyebrow} title={t.explore.title}>
          <Cards items={t.explore.items} />
        </Section>

        <Section id="partners" eyebrow={t.partners.eyebrow} title={t.partners.title} tone="muted">
          <p className="max-w-3xl text-lg text-black/70">{t.partners.text}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {t.partners.items.map((partner) => (
              <div key={partner.name} className="rounded-2xl border border-black/10 bg-white p-6">
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="mt-2 text-black/70">{partner.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="getting-here" eyebrow={t.gettingHere.eyebrow} title={t.gettingHere.title}>
          <Cards items={t.gettingHere.items} />
        </Section>

        <Section id="host" eyebrow={t.host.eyebrow} title={t.host.title} tone="muted">
          <p className="max-w-3xl text-lg text-black/70">{t.host.text}</p>
        </Section>

        <Section id="faq" eyebrow={t.faq.eyebrow} title={t.faq.title}>
          <div className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group p-6">
                <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
                <p className="mt-3 text-black/70">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="book" eyebrow={t.booking.eyebrow} title={t.booking.title} tone="muted">
          <p className="mb-6 max-w-3xl text-lg text-black/70">{t.booking.text}</p>
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <BookingForm locale={lang} labels={t.booking} />
          </div>
        </Section>
      </main>

      <footer className="border-t border-black/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.tagline}</p>
          <div className="flex gap-5">
            <a href="https://www.instagram.com/bikecostablanca/" target="_blank" rel="noopener" className="hover:text-black">{t.footer.instagram}</a>
            <a href="https://www.tiktok.com/@bikecostablanca" target="_blank" rel="noopener" className="hover:text-black">{t.footer.tiktok}</a>
            <a href="https://www.airbnb.com/rooms/1692875983935079214" target="_blank" rel="noopener" className="hover:text-black">{t.footer.airbnb}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
