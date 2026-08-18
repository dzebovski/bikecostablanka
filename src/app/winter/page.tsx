import type {Metadata} from "next";

import {ButtonLink} from "@/components/button-link";
import {PricingGrid} from "@/components/pricing-grid";
import {SectionIntro} from "@/components/section-intro";
import {practicalFaq} from "@/content/site";

export const metadata: Metadata = {
  title: "Winter Stays",
  description:
    "A slower one-to-three month winter in Ondara, with cycling, coast, everyday life and room for remote work to be confirmed.",
};

const winterDay = [
  {time: "08:12", title: "Open the shutters", copy: "Coffee, breakfast and a look at the light over the hills."},
  {time: "10:05", title: "Choose your direction", copy: "A mountain loop, a coast day or a quiet morning at the house."},
  {time: "14:30", title: "Return without rushing", copy: "Lunch late, work for a while, or take the afternoon into Dénia."},
  {time: "19:42", title: "Come back together", copy: "Cook at home and compare two versions of the same winter day."},
] as const;

export default function WinterPage() {
  return (
    <main id="main-content">
      <section className="winter-hero">
        <div className="winter-hero__inner page-shell">
          <p className="eyebrow eyebrow--light">Winter in Marina Alta</p>
          <h1>
            A season that feels less like escape,
            <em>more like life.</em>
          </h1>
          <p>
            Stay for one to three months and let the Costa Blanca become a routine rather than an itinerary.
          </p>
          <ButtonLink href="/enquire?interest=winter" variant="light">
            Enquire about winter
          </ButtonLink>
          <span className="winter-hero__mark">W / 26</span>
        </div>
      </section>

      <section className="fit-section section-space page-shell">
        <SectionIntro eyebrow="Who it suits" index="01" title="For people who want more than a sunny week." />
        <div className="fit-grid">
          <article>
            <span>RIDE</span>
            <h3>Riders building a winter base</h3>
            <p>Enough time to recover, repeat favourite roads and choose the right route for the day.</p>
          </article>
          <article>
            <span>SHARE</span>
            <h3>Partners with different plans</h3>
            <p>Cycling can be central without asking everyone in the house to organise their day around it.</p>
          </article>
          <article>
            <span>RESET</span>
            <h3>Anyone ready for a new rhythm</h3>
            <p>A practical setting for reading, cooking, exploring and living outdoors more often.</p>
          </article>
        </div>
      </section>

      <section className="day-section section-space">
        <div className="page-shell">
          <SectionIntro
            copy="Not a programme — simply the kind of unforced structure a longer stay makes possible."
            eyebrow="One possible day"
            index="02"
            title="Follow the light, not the lobby clock."
          />
          <ol className="day-line">
            {winterDay.map((moment) => (
              <li key={moment.time}>
                <time>{moment.time}</time>
                <span aria-hidden="true" />
                <div>
                  <h3>{moment.title}</h3>
                  <p>{moment.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="work-balance section-space page-shell">
        <div className="work-balance__headline">
          <p className="eyebrow">Work, ride, wander</p>
          <h2>The house can hold more than one kind of day.</h2>
        </div>
        <div className="work-balance__grid">
          <article>
            <strong>01</strong>
            <h3>Remote work, carefully stated</h3>
            <p>
              A longer stay can include work, but exact internet speed and desk arrangements remain TBC. Confirm both before relying on them.
            </p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Two plans, one base</h3>
            <p>
              One guest takes the mountain road; another heads to Dénia, a market or the coast. The house brings the day back together.
            </p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Everyday Ondara</h3>
            <p>
              The prototype focuses on useful orientation — a real town in Marina Alta — while exact distances and facilities are confirmed later.
            </p>
          </article>
        </div>
      </section>

      <section className="faq-section section-space">
        <div className="page-shell faq-section__inner">
          <div>
            <p className="eyebrow">Practical notes</p>
            <h2>Useful answers, with the unknowns left visible.</h2>
          </div>
          <div className="faq-list">
            {practicalFaq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  {item.question} <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section section-space page-shell">
        <SectionIntro eyebrow="Demo pricing" index="03" title="A month changes the question from ‘what should we see?’ to ‘how shall we live?’" />
        <PricingGrid />
      </section>
    </main>
  );
}
