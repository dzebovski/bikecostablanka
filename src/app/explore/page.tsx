import type {Metadata} from "next";
import Image from "next/image";

import {ButtonLink} from "@/components/button-link";
import {SectionIntro} from "@/components/section-intro";

export const metadata: Metadata = {
  title: "Explore Marina Alta",
  description:
    "Ideas beyond the bike: Dénia, the Costa Blanca coast, Marina Alta villages and a day for partners while others ride.",
};

const places = [
  {number: "01", title: "Dénia", note: "A coastal change of pace for a longer lunch, a wander and time by the Mediterranean."},
  {number: "02", title: "The coast", note: "Choose a slow shoreline day when the bike stays at home and the horizon does the work."},
  {number: "03", title: "Villages", note: "Let the inland roads lead to smaller places, older streets and a different view of Marina Alta."},
  {number: "04", title: "Markets", note: "Build the day around local produce, then bring it back to a kitchen that belongs to you for the month."},
] as const;

export default function ExplorePage() {
  return (
    <main id="main-content">
      <section className="explore-hero page-shell">
        <div className="explore-hero__visual image-frame">
          <Image alt="Quiet green mountain road in Marina Alta" fetchPriority="high" fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw" src="/images/routes/vall-debo.jpeg" />
        </div>
        <div className="explore-hero__copy">
          <p className="eyebrow">Off the bike</p>
          <h1>There is more than one way to have a good day here.</h1>
          <p>
            Marina Alta works when the group splits up as well as when it stays together: coast, towns, villages and an afternoon with nowhere urgent to be.
          </p>
          <ButtonLink href="/enquire?interest=explore">Plan a mixed stay</ButtonLink>
        </div>
      </section>

      <section className="places-section section-space page-shell">
        <SectionIntro eyebrow="Four directions" index="01" title="Follow appetite, weather or curiosity." />
        <div className="places-grid">
          {places.map((place) => (
            <article key={place.title}>
              <span>{place.number}</span>
              <h3>{place.title}</h3>
              <p>{place.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="parallel-day section-space">
        <div className="page-shell">
          <div className="parallel-day__title">
            <p className="eyebrow eyebrow--light">A day while they ride</p>
            <h2>Two plans. One satisfying return.</h2>
          </div>
          <div className="parallel-day__columns">
            <ol>
              <li><time>09:00</time><p>They roll towards the inland valleys.</p></li>
              <li><time>10:30</time><p>You take the slower direction towards Dénia.</p></li>
              <li><time>13:15</time><p>A long lunch, a market stop or a walk by the coast.</p></li>
              <li><time>17:40</time><p>Meet back at the house with two different stories.</p></li>
            </ol>
            <p className="parallel-day__note">
              This is the quiet advantage of a longer stay: no single day has to do everything, and no guest has to borrow someone else’s idea of a holiday.
            </p>
          </div>
        </div>
      </section>

      <section className="final-cta page-shell">
        <p className="eyebrow">Shared base, separate freedoms</p>
        <h2>Build a stay that works for every guest.</h2>
        <ButtonLink href="/the-house" variant="outline">See the house</ButtonLink>
      </section>
    </main>
  );
}
