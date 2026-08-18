import type {Metadata} from "next";
import Image from "next/image";

import {ButtonLink} from "@/components/button-link";
import {RouteCard} from "@/components/route-card";
import {SectionIntro} from "@/components/section-intro";
import {houseFacts} from "@/content/site";
import {cyclingRoutes} from "@/content/routes";

export const metadata: Metadata = {
  title: "A winter house in Marina Alta",
  description:
    "Stay longer in Ondara: a three-bedroom house between Costa Blanca cycling routes, Dénia and the Marina Alta valleys.",
};

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="home-hero page-shell">
        <div className="home-hero__copy">
          <p className="eyebrow">Ondara · Costa Blanca · 15 nights and longer</p>
          <h1>
            A winter house
            <span>between coast and climb.</span>
          </h1>
          <p className="home-hero__lead">
            Settle into Marina Alta with room to ride, work, cook and explore — a slower Mediterranean base for two to five guests.
          </p>
          <div className="button-row">
            <ButtonLink href="/enquire">Enquire about your stay</ButtonLink>
            <ButtonLink href="/the-house" variant="text">
              See the house
            </ButtonLink>
          </div>
          <p className="home-hero__aside">Three bedrooms · Three shower rooms · Ondara, Spain</p>
        </div>
        <div className="home-hero__visual">
          <div className="home-hero__image">
            <Image
              alt="Warm dining area inside the Bike Costa Blanca house"
              fill
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 760px) 100vw, 52vw"
              src="/images/house/dining-room.jpeg"
            />
          </div>
          <p className="vertical-note">Marina Alta · Mediterranean winter</p>
          <div aria-hidden="true" className="sun-stamp">
            <span>LONG STAYS</span>
            <i>BCB</i>
          </div>
        </div>
      </section>

      <section className="fact-strip">
        <div className="fact-strip__inner page-shell">
          {houseFacts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-house section-space page-shell">
        <SectionIntro
          copy="A simple, grown-up base for the practical parts of a long stay — with enough room for everyone to keep their own rhythm."
          eyebrow="The house"
          index="01"
          title="Arrive, unpack properly, and make it yours for a while."
        />
        <div className="home-house__grid">
          <div className="home-house__image image-frame">
            <Image
              alt="Dining space seen through the glass doors of the Ondara house"
              fill
              sizes="(max-width: 760px) 100vw, 58vw"
              src="/images/house/dining-through-glass.jpg"
            />
          </div>
          <div className="home-house__note">
            <span className="editorial-number">01—04</span>
            <h3>Made for days that do not need a timetable.</h3>
            <p>
              The house is the anchor: breakfast before a route, a quiet afternoon for one partner, dinner together and space to reset for tomorrow.
            </p>
            <ButtonLink href="/the-house" variant="outline">
              Explore the house
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="winter-teaser section-space">
        <div className="winter-teaser__inner page-shell">
          <div className="winter-teaser__title">
            <p className="eyebrow eyebrow--light">Winter, differently</p>
            <h2>
              Trade the short days for a season with <em>room in it.</em>
            </h2>
          </div>
          <div className="winter-teaser__copy">
            <p>
              One month is enough to find a routine. Two or three lets the place become familiar: the bakery, the morning light, the route you now know by heart.
            </p>
            <ul className="line-list line-list--light">
              <li>Long-stay rhythm, not hotel turnover</li>
              <li>Mountain days and coastal afternoons</li>
              <li>Space for riders and non-riders alike</li>
            </ul>
            <ButtonLink href="/winter" variant="light">
              See winter stays
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="routes-feature section-space page-shell">
        <SectionIntro
          copy="Three loops from the wider Ondara landscape. Not an exhaustive guide — just a useful first proof of what sits beyond the front door."
          eyebrow="Ride from here"
          index="02"
          title="The routes make the location tangible."
        />
        <div className="route-grid">
          {cyclingRoutes.map((route, index) => (
            <RouteCard index={index} key={route.slug} route={route} />
          ))}
        </div>
        <div className="section-end-link">
          <ButtonLink href="/routes" variant="outline">
            Browse all routes
          </ButtonLink>
        </div>
      </section>

      <section className="split-story section-space page-shell">
        <div className="split-story__image image-frame">
          <Image
            alt="Cyclist on a quiet Costa Blanca mountain road"
            fill
            sizes="(max-width: 760px) 100vw, 46vw"
            src="/images/routes/vall-debo.jpeg"
          />
        </div>
        <div className="split-story__body">
          <p className="eyebrow">More than the ride</p>
          <h2>A good base should work for both of you.</h2>
          <p>
            While one person rides inland, another can take a slower day towards Dénia, the coast, the markets or the villages of Marina Alta. Meet again with stories from two different days.
          </p>
          <ButtonLink href="/explore" variant="text">
            Explore without the bike
          </ButtonLink>
        </div>
      </section>

      <section className="host-note">
        <div className="host-note__inner page-shell">
          <p className="eyebrow">Local context, lightly held</p>
          <blockquote>
            “The most useful advice is rarely a list. It is knowing which direction fits the weather, the legs and the kind of day you want.”
          </blockquote>
          <p className="host-note__caption">A prototype promise for more considered hosting</p>
        </div>
      </section>

      <section className="final-cta page-shell">
        <p className="eyebrow">A warmer chapter</p>
        <h2>Make space for the winter you keep talking about.</h2>
        <ButtonLink href="/enquire">Enquire about your stay</ButtonLink>
      </section>
    </main>
  );
}
