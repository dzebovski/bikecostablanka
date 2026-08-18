import type {Metadata} from "next";

import {ButtonLink} from "@/components/button-link";
import {RouteCard} from "@/components/route-card";
import {cyclingRoutes} from "@/content/routes";

export const metadata: Metadata = {
  title: "Cycling Routes",
  description:
    "Three Costa Blanca cycling routes from the wider Ondara landscape: Coll de Rates, Vall d’Ebo and Ondara–Bernia.",
};

export default function RoutesPage() {
  return (
    <main id="main-content">
      <section className="catalogue-hero page-shell">
        <div>
          <p className="eyebrow">Ride from Marina Alta</p>
          <h1>Three routes. Three different reasons to stay.</h1>
        </div>
        <div className="catalogue-hero__copy">
          <p>
            A compact first collection rather than a complete guide. Distances and elevation are route references; always review current conditions and your own readiness before setting out.
          </p>
          <div className="route-key">
            <span>03 routes</span>
            <span>220 km combined</span>
            <span>3,020 m climbing</span>
          </div>
        </div>
      </section>

      <section className="route-catalogue section-space page-shell">
        <div className="route-grid route-grid--catalogue">
          {cyclingRoutes.map((route, index) => (
            <RouteCard index={index} key={route.slug} route={route} />
          ))}
        </div>
      </section>

      <section className="route-house-link page-shell">
        <div>
          <p className="eyebrow">The point of the routes</p>
          <h2>Good roads matter more when the base works after the ride.</h2>
        </div>
        <div>
          <p>
            Three bedrooms, three shower rooms and a minimum 15-night stay make the house a place to recover, repeat and explore without compressing everything into a weekend.
          </p>
          <ButtonLink href="/the-house" variant="outline">
            See the house
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
