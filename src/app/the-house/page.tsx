import type {Metadata} from "next";
import Image from "next/image";

import {ButtonLink} from "@/components/button-link";
import {PricingGrid} from "@/components/pricing-grid";
import {SectionIntro} from "@/components/section-intro";
import {houseFacts, longStayFeatures} from "@/content/site";

export const metadata: Metadata = {
  title: "The House",
  description:
    "Explore the three-bedroom Bike Costa Blanca house in Ondara, designed for stays of 15 nights or longer.",
};

export default function HousePage() {
  return (
    <main id="main-content">
      <section className="inner-hero page-shell">
        <div className="inner-hero__copy">
          <p className="eyebrow">The house · Ondara</p>
          <h1>A place to live for a while, not just sleep.</h1>
          <p>
            Three bedrooms, three shower rooms and the everyday space a longer Costa Blanca stay asks for.
          </p>
          <ButtonLink href="/enquire?interest=house">Ask about the house</ButtonLink>
        </div>
        <div className="inner-hero__image image-frame">
          <Image
            alt="Dining room and long table inside the Ondara house"
            fill
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 760px) 100vw, 52vw"
            src="/images/house/dining-room.jpeg"
          />
          <span className="image-caption">House interior · current site photography</span>
        </div>
      </section>

      <section className="fact-strip fact-strip--inner">
        <div className="fact-strip__inner page-shell">
          {houseFacts.map((fact) => (
            <div key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-gallery section-space page-shell">
        <SectionIntro
          copy="The visual story stays deliberately honest: only existing, confirmed photography is used in this prototype."
          eyebrow="A first look"
          index="01"
          title="Warm, straightforward rooms with a long-stay frame of mind."
        />
        <div className="editorial-gallery__grid">
          <div className="gallery-tall image-frame">
            <Image
              alt="Warm dining room with wooden table and Mediterranean light"
              fill
              sizes="(max-width: 760px) 100vw, 46vw"
              src="/images/house/dining-room.jpeg"
            />
          </div>
          <div className="gallery-wide image-frame">
            <Image
              alt="Dining room viewed through glass doors"
              fill
              sizes="(max-width: 760px) 100vw, 48vw"
              src="/images/house/dining-through-glass.jpg"
            />
          </div>
          <div className="gallery-note">
            <span>Further rooms</span>
            <p>Additional verified photography will join the gallery after the prototype review.</p>
          </div>
        </div>
      </section>

      <section className="feature-section section-space">
        <div className="page-shell">
          <SectionIntro
            eyebrow="Long-stay essentials"
            index="02"
            title="Designed around the whole day."
          />
          <div className="feature-grid">
            {longStayFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>0{index + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
          <div className="tbc-note">
            <p className="eyebrow">Confirm before booking</p>
            <p>
              Exact address, availability, internet, heating, house rules, parking and bike-storage arrangements are intentionally marked for direct confirmation with the host.
            </p>
          </div>
        </div>
      </section>

      <section className="location-story section-space page-shell">
        <div>
          <p className="eyebrow">Approximate location</p>
          <h2>Ondara, between the coast and the inland valleys.</h2>
        </div>
        <div className="location-card" role="img" aria-label="Abstract location diagram showing Ondara between Dénia and the Marina Alta mountains">
          <span className="location-card__coast">Mediterranean</span>
          <span className="location-card__denia">Dénia</span>
          <span className="location-card__ondara">Ondara</span>
          <span className="location-card__mountains">Marina Alta</span>
        </div>
        <div className="location-story__copy">
          <p>
            The site deliberately describes the area, not the exact house position. Ondara gives the stay its balance: access towards Dénia and the coast, with the mountain roads opening inland.
          </p>
          <ButtonLink href="/getting-here" variant="text">
            Plan the journey
          </ButtonLink>
        </div>
      </section>

      <section className="pricing-section section-space page-shell">
        <SectionIntro
          copy="Clear test figures let us evaluate the booking path. They are not a live offer and do not confirm availability."
          eyebrow="Stay longer"
          index="03"
          title="Three simple ways to picture the stay."
        />
        <PricingGrid />
      </section>
    </main>
  );
}
