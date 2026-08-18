import Image from "next/image";

import {Link} from "@/i18n/navigation";
import type {CyclingRoute} from "@/types";

import {RoutePlaceholder} from "./route-placeholder";

type RouteCardProps = {
  route: CyclingRoute;
  index: number;
};

export function RouteCard({route, index}: RouteCardProps) {
  return (
    <article className="route-card">
      <Link
        aria-label={`View ${route.title} route`}
        className="route-card__media"
        href={`/routes/${route.slug}`}
      >
        {route.image ? (
          <Image
            alt={route.image.alt}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 34vw"
            src={route.image.src}
          />
        ) : (
          <RoutePlaceholder title={route.title} />
        )}
        <span className="route-card__number">0{index + 1}</span>
      </Link>
      <div className="route-card__body">
        <div className="route-card__meta">
          <span>{route.distanceKm} km</span>
          <span>{route.elevationM.toLocaleString("en-GB")} m</span>
          <span>{route.difficulty}</span>
        </div>
        <h3>
          <Link href={`/routes/${route.slug}`}>{route.title}</Link>
        </h3>
        <p>{route.summary}</p>
        <Link className="text-link" href={`/routes/${route.slug}`}>
          Read the route <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
