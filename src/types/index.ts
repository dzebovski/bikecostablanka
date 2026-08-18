export const availableLocales = ["en", "nl", "de", "es"] as const;
export const activeLocales = ["en"] as const;

export type Locale = (typeof activeLocales)[number];
export type FutureLocale = (typeof availableLocales)[number];

export type LocalImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CyclingRoute = {
  slug: string;
  title: string;
  summary: string;
  distanceKm: number;
  elevationM: number;
  difficulty: "Medium" | "Hard";
  image?: LocalImage;
  stravaUrl: string;
  highlights: readonly string[];
  localNote?: string;
  character: string;
  routeStory: readonly string[];
};

export type PriceTier = {
  stayType: string;
  durationLabel: string;
  demoAmount: string;
  discountNote: string;
};

export type PracticalNeed = "parking" | "bike-box" | "transfer";
export type EnquiryInterest = "house" | "winter" | "cycling" | "explore";

export type EnquiryPayload = {
  interest: EnquiryInterest;
  arrival: string;
  departure: string;
  guests: number;
  cyclists: number;
  practicalNeeds: PracticalNeed[];
  name: string;
  email: string;
  message?: string;
};

export type EnquiryState = "idle" | "submitting" | "success";
