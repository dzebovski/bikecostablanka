import type {PriceTier} from "@/types";

export const navigation = [
  {href: "/the-house", labelKey: "stay"},
  {href: "/winter", labelKey: "winter"},
  {href: "/routes", labelKey: "routes"},
  {href: "/explore", labelKey: "explore"},
  {href: "/getting-here", labelKey: "gettingHere"},
] as const;

export const houseFacts = [
  {value: "3", label: "bedrooms"},
  {value: "2–5", label: "guests"},
  {value: "3", label: "shower rooms"},
  {value: "15", label: "night minimum"},
] as const;

export const priceTiers: readonly PriceTier[] = [
  {
    stayType: "A proper reset",
    durationLabel: "15 nights",
    demoAmount: "€1,500",
    discountNote: "A simple starting point for a longer Costa Blanca stay.",
  },
  {
    stayType: "Winter month",
    durationLabel: "1 month",
    demoAmount: "€2,400",
    discountNote: "Room to settle into a slower, more useful rhythm.",
  },
  {
    stayType: "Seasonal base",
    durationLabel: "2–3 months",
    demoAmount: "€2,000/month",
    discountNote: "Demo monthly rate for an extended winter chapter.",
  },
] as const;

export const longStayFeatures = [
  {
    title: "A house, not a stopover",
    copy: "Three bedrooms and three shower rooms create comfortable separation for couples, families or a small riding group.",
  },
  {
    title: "Space around the ride",
    copy: "The stay is designed around real days: breakfast, a long route, an unhurried return and dinner at home.",
  },
  {
    title: "A base in Ondara",
    copy: "Set between the Marina Alta coast and inland climbs, with Dénia and the surrounding valleys within easy reach.",
  },
] as const;

export const practicalFaq = [
  {
    question: "Is the house only for cyclists?",
    answer:
      "No. Cycling is one reason the location works so well, but the house is equally intended for guests who want coast, markets, villages and a milder winter routine.",
  },
  {
    question: "How long can we stay?",
    answer:
      "The prototype is built around stays of at least 15 nights, with demo pricing for one to three months.",
  },
  {
    question: "Can I work remotely?",
    answer:
      "The layout supports longer everyday stays, but connection speed and workstation details are still to be confirmed before booking.",
  },
  {
    question: "What should we confirm before booking?",
    answer:
      "Exact location, availability, house rules, heating, internet, parking and any transfer or bike-storage needs should all be confirmed directly with the host.",
  },
] as const;
