import type {Metadata} from "next";

import {ButtonLink} from "@/components/button-link";

export const metadata: Metadata = {
  title: "Getting Here",
  description:
    "A practical prototype guide to reaching Ondara via Alicante or Valencia, with notes for cars, bike boxes and transfers.",
};

export default function GettingHerePage() {
  return (
    <main id="main-content">
      <section className="journey-hero page-shell">
        <div>
          <p className="eyebrow">Getting to Ondara</p>
          <h1>The last part of the journey should feel clear.</h1>
        </div>
        <p>
          Start with either Alicante or Valencia, then confirm the best onward plan for your dates, group and bikes. Exact timings and services remain part of the booking conversation.
        </p>
      </section>

      <section className="airport-section page-shell">
        <article className="airport-card">
          <span>ALC</span>
          <p className="eyebrow">Alicante–Elche</p>
          <h2>Approach from the south</h2>
          <p>A practical flight option for Ondara. Compare schedules, vehicle space and onward transport before booking.</p>
          <small>Transfer details · TBC</small>
        </article>
        <article className="airport-card airport-card--accent">
          <span>VLC</span>
          <p className="eyebrow">Valencia</p>
          <h2>Approach from the north</h2>
          <p>A second useful gateway. The right choice depends on flights, arrival time and whether you travel with bike boxes.</p>
          <small>Transfer details · TBC</small>
        </article>
      </section>

      <section className="travel-choices section-space page-shell">
        <div className="travel-choices__intro">
          <p className="eyebrow">Car or no car?</p>
          <h2>Choose for the life you want once you arrive.</h2>
        </div>
        <div className="travel-choices__grid">
          <article>
            <span>01</span>
            <h3>With a car</h3>
            <p>Useful for flexible food shops, different ride starts and independent coast or village days. Confirm parking before booking.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Without a car</h3>
            <p>Possible plans depend on current local transport and the exact house position. Ask the host to sense-check your itinerary.</p>
          </article>
        </div>
      </section>

      <section className="bike-travel section-space">
        <div className="page-shell bike-travel__inner">
          <div>
            <p className="eyebrow eyebrow--light">Travelling with bikes</p>
            <h2>Plan the bulky details before the boarding pass.</h2>
          </div>
          <ul className="number-list">
            <li><span>01</span><p>Add the bike to your airline booking and check current packing rules.</p></li>
            <li><span>02</span><p>Confirm that the onward vehicle can take every passenger, case and bike box.</p></li>
            <li><span>03</span><p>Ask how empty boxes can be handled at the house; arrangements are TBC.</p></li>
            <li><span>04</span><p>Keep tools, reassembly needs and first-ride checks in the arrival plan.</p></li>
          </ul>
        </div>
      </section>

      <section className="arrival-checklist section-space page-shell">
        <div>
          <p className="eyebrow">Arrival checklist</p>
          <h2>Four confirmations, then travel lighter.</h2>
        </div>
        <ol>
          <li><span>Flight and landing time</span><i>01</i></li>
          <li><span>Car or transfer capacity</span><i>02</i></li>
          <li><span>Bike-box handling</span><i>03</i></li>
          <li><span>Exact arrival instructions</span><i>04</i></li>
        </ol>
        <ButtonLink href="/enquire">Ask about your arrival</ButtonLink>
      </section>
    </main>
  );
}
