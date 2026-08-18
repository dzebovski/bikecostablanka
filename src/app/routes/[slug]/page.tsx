import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";

import {ButtonLink} from "@/components/button-link";
import {RoutePlaceholder} from "@/components/route-placeholder";
import {cyclingRoutes, getCyclingRoute} from "@/content/routes";

type RoutePageProps = {
  params: Promise<{slug: string}>;
};

export function generateStaticParams() {
  return cyclingRoutes.map((route) => ({slug: route.slug}));
}

export async function generateMetadata({params}: RoutePageProps): Promise<Metadata> {
  const {slug} = await params;
  const route = getCyclingRoute(slug);
  if (!route) return {title: "Route not found"};

  return {
    title: route.title,
    description: `${route.summary} ${route.distanceKm} km with ${route.elevationM.toLocaleString("en-GB")} m of climbing.`,
  };
}

export default async function RoutePage({params}: RoutePageProps) {
  const {slug} = await params;
  const route = getCyclingRoute(slug);
  if (!route) notFound();

  return (
    <main id="main-content">
      <section className="route-detail-hero page-shell">
        <div className="route-detail-hero__copy">
          <p className="eyebrow">Costa Blanca route note</p>
          <h1>{route.title}</h1>
          <p>{route.character}</p>
          <div className="button-row">
            <a className="button button--solid" href={route.stravaUrl} rel="noreferrer" target="_blank">
              <span>View on Strava</span><span aria-hidden="true">↗</span>
            </a>
            <ButtonLink href="/routes" variant="text">All routes</ButtonLink>
          </div>
        </div>
        <div className="route-detail-hero__media">
          {route.image ? (
            <Image alt={route.image.alt} fetchPriority="high" fill loading="eager" sizes="(max-width: 760px) 100vw, 54vw" src={route.image.src} />
          ) : (
            <RoutePlaceholder className="route-placeholder--hero" title={route.title} />
          )}
        </div>
      </section>

      <section className="route-metrics">
        <div className="route-metrics__inner page-shell">
          <div><strong>{route.distanceKm}</strong><span>kilometres</span></div>
          <div><strong>{route.elevationM.toLocaleString("en-GB")}</strong><span>metres climbing</span></div>
          <div><strong>{route.difficulty}</strong><span>route level</span></div>
        </div>
      </section>

      <section className="route-narrative section-space page-shell">
        <div className="route-narrative__title">
          <p className="eyebrow">The character</p>
          <h2>{route.summary}</h2>
        </div>
        <div className="route-narrative__copy">
          {route.routeStory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="route-notes section-space">
        <div className="page-shell route-notes__grid">
          <div>
            <p className="eyebrow eyebrow--light">Route highlights</p>
            <ul className="line-list line-list--light">
              {route.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
          <blockquote>
            <span>Local note</span>
            “{route.localNote}”
          </blockquote>
        </div>
      </section>

      <section className="route-disclaimer page-shell">
        <p>
          Route figures and the external Strava link are planning references, not turn-by-turn guidance. Check the current route, weather and road conditions before riding.
        </p>
      </section>

      <section className="final-cta page-shell">
        <p className="eyebrow">Ride, return, repeat</p>
        <h2>Make the route part of a longer winter.</h2>
        <ButtonLink href="/enquire?interest=cycling">Enquire about a cycling stay</ButtonLink>
      </section>
    </main>
  );
}
