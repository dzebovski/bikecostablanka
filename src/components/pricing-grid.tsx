import {priceTiers} from "@/content/site";

import {ButtonLink} from "./button-link";

export function PricingGrid() {
  return (
    <div className="pricing-wrap">
      <div className="demo-label">
        <span aria-hidden="true" />
        Demo pricing
      </div>
      <div className="pricing-grid">
        {priceTiers.map((tier, index) => (
          <article className="price-card" key={tier.durationLabel}>
            <span className="price-card__index">0{index + 1}</span>
            <p className="eyebrow">{tier.stayType}</p>
            <h3>{tier.durationLabel}</h3>
            <strong>{tier.demoAmount}</strong>
            <p>{tier.discountNote}</p>
            <ButtonLink href={`/enquire?interest=${index === 0 ? "house" : "winter"}`} variant="text">
              Ask about this stay
            </ButtonLink>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        These amounts are for prototype evaluation only. Availability, inclusions and a final quote must be confirmed directly.
      </p>
    </div>
  );
}
