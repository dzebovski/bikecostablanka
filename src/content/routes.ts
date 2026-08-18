import type {CyclingRoute} from "@/types";

export const cyclingRoutes: readonly CyclingRoute[] = [
  {
    slug: "coll-de-rates",
    title: "Coll de Rates",
    summary:
      "The Costa Blanca benchmark: a sustained mountain day with open views and a climb riders return to measure themselves against.",
    distanceKm: 75,
    elevationM: 1160,
    difficulty: "Hard",
    image: {
      src: "/images/routes/coll-de-rates.jpeg",
      alt: "Cyclist climbing through the pale mountain landscape near Coll de Rates",
      width: 1551,
      height: 2253,
    },
    stravaUrl: "https://www.strava.com/routes/3514697316111501132",
    highlights: [
      "The region’s signature climb",
      "Long mountain views",
      "A rewarding target for experienced riders",
    ],
    localNote:
      "Keep something in reserve for the return. The headline climb is only one part of a substantial day from the house.",
    character:
      "Purposeful and expansive — a route for the day when you want the mountains to be the main event.",
    routeStory: [
      "From the gentler roads around Ondara, the landscape steadily folds into the inland valleys. The approach is part of the pleasure: citrus country gives way to limestone ridges and a clearer sense of height.",
      "Coll de Rates is the reference point, but the route earns its place through the whole arc of the ride — sustained rather than theatrical, with the coast waiting beyond the mountains on the return.",
    ],
  },
  {
    slug: "vall-debo",
    title: "Vall d’Ebo",
    summary:
      "A quieter passage inland through Pego and the valleys — rolling, scenic and rich in the small roads that make winter riding here feel generous.",
    distanceKm: 68,
    elevationM: 870,
    difficulty: "Medium",
    image: {
      src: "/images/routes/vall-debo.jpeg",
      alt: "A quiet road winding through the green mountains of Vall d’Ebo",
      width: 4032,
      height: 2268,
    },
    stravaUrl: "https://www.strava.com/routes/3514701466186284876",
    highlights: [
      "Quiet inland roads",
      "Pego and the surrounding valley",
      "A balanced climbing day",
    ],
    localNote:
      "This is the route for settling into the landscape: steady pacing, a café pause and time to look beyond the wheel in front.",
    character:
      "Rhythmic and exploratory — enough climbing to feel earned, without turning the whole day into a test.",
    routeStory: [
      "The road north opens into the Pego valley before turning inland. The sense of space arrives quickly: cultivated flats, older villages and mountain walls that draw the route onward.",
      "Vall d’Ebo feels removed without being remote. It is a persuasive winter loop because the gradients, scenery and quiet kilometres share the work rather than competing for attention.",
    ],
  },
  {
    slug: "ondara-bernia",
    title: "Ondara–Bernia",
    summary:
      "A characterful loop towards the Sierra de Bernia, pairing a strong climbing profile with changing views between inland terrain and the coast.",
    distanceKm: 77,
    elevationM: 990,
    difficulty: "Medium",
    stravaUrl: "https://www.strava.com/routes/3514958094482175874",
    highlights: [
      "Sierra de Bernia scenery",
      "Coast-to-mountain contrast",
      "A varied full morning from Ondara",
    ],
    localNote:
      "A good choice once your legs have settled into the week: varied terrain and a route that keeps changing its point of view.",
    character:
      "Varied and scenic — a complete Costa Blanca loop rather than a ride built around one famous summit.",
    routeStory: [
      "This loop uses Ondara’s position between the sea and the mountains to full effect. The road gradually collects height as the Bernia range takes over the horizon.",
      "The return shifts the mood again, reconnecting the sharper inland landscape with the softer coastal plain. It is a useful portrait of why this works as a base, not simply a destination climb.",
    ],
  },
] as const;

export function getCyclingRoute(slug: string) {
  return cyclingRoutes.find((route) => route.slug === slug);
}
