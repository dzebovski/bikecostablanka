/** Every listing photo, in the order of the "All photos" page. */

export type PhotoGroup = "terrace" | "living" | "bedrooms" | "bathrooms" | "bikes" | "practical";

export type Photo = { id: string; file: string; width: number; height: number; alt: string; group: PhotoGroup };

export const photoGroups: PhotoGroup[] = ["terrace", "living", "bedrooms", "bathrooms", "bikes", "practical"];

const house = (name: string) => `/images/house/${name}.jpg`;

export const photos: Photo[] = [
  { id: "terrace-awning", file: house("terrace-awning"), width: 1440, height: 1080, alt: "Roof terrace with awning, sun loungers and dining set", group: "terrace" },
  { id: "terrace-dining", file: house("terrace-dining"), width: 1440, height: 1041, alt: "Terrace dining table", group: "terrace" },
  { id: "terrace-loungers", file: house("terrace-loungers"), width: 1440, height: 1080, alt: "Sun loungers on the terrace", group: "terrace" },
  { id: "terrace-loungers-2", file: house("terrace-loungers-2"), width: 1440, height: 885, alt: "Sun loungers, second view", group: "terrace" },
  { id: "terrace-glass-wall", file: house("terrace-glass-wall"), width: 1440, height: 1738, alt: "Glass wall onto the terrace", group: "terrace" },
  { id: "courtyard", file: house("courtyard"), width: 1440, height: 1920, alt: "Private inner courtyard", group: "terrace" },
  { id: "courtyard-through-glass", file: house("courtyard-through-glass"), width: 1440, height: 1473, alt: "Courtyard seen through glass", group: "terrace" },

  { id: "living-room", file: house("living-room"), width: 1440, height: 1080, alt: "Living room with wooden beams", group: "living" },
  { id: "living-room-tv", file: house("living-room-tv"), width: 1440, height: 1080, alt: "Living room with 65-inch TV", group: "living" },
  { id: "kitchen-island", file: house("kitchen-island"), width: 1440, height: 1920, alt: "Kitchen with island", group: "living" },
  { id: "kitchen", file: house("kitchen"), width: 1440, height: 1920, alt: "Kitchen", group: "living" },
  { id: "dining-fireplace", file: house("dining-fireplace"), width: 1440, height: 1080, alt: "Dining area with wood-burning fireplace", group: "living" },
  { id: "dining-table", file: house("dining-table"), width: 1440, height: 1920, alt: "Dining table", group: "living" },

  { id: "bedroom-1-king", file: house("bedroom-1-king"), width: 1440, height: 1080, alt: "Bedroom 1 with king bed", group: "bedrooms" },
  { id: "bedroom-2-king", file: house("bedroom-2-king"), width: 1440, height: 1920, alt: "Bedroom 2, king bed", group: "bedrooms" },
  { id: "bedroom-3", file: house("bedroom-3"), width: 1440, height: 1920, alt: "Bedroom 3, king bed", group: "bedrooms" },
  { id: "bedroom-single-desk", file: house("bedroom-single-desk"), width: 1440, height: 1080, alt: "Single room with desk", group: "bedrooms" },
  { id: "workspace", file: house("workspace"), width: 1440, height: 1184, alt: "Workspace", group: "bedrooms" },

  { id: "bathroom-1", file: house("bathroom-1"), width: 1440, height: 1080, alt: "Bathroom 1", group: "bathrooms" },
  { id: "bathroom-2", file: house("bathroom-2"), width: 1440, height: 1920, alt: "Bathroom 2", group: "bathrooms" },
  { id: "guest-wc", file: house("guest-wc"), width: 1440, height: 1920, alt: "Guest WC", group: "bathrooms" },

  { id: "bike-storage", file: house("bike-storage"), width: 1440, height: 1080, alt: "Road bike on the wall rack inside the house", group: "bikes" },
  { id: "loft-room-bianchi", file: house("loft-room-bianchi"), width: 1440, height: 1080, alt: "Loft room with a restored 1970s Bianchi", group: "bikes" },
  { id: "loft-room-sofa", file: house("loft-room-sofa"), width: 1440, height: 1080, alt: "Loft room sofa", group: "bikes" },
  { id: "bianchi-1970s", file: house("bianchi-1970s"), width: 1440, height: 2170, alt: "Restored 1970s Bianchi", group: "bikes" },

  { id: "laundry", file: house("laundry"), width: 1440, height: 1920, alt: "Washer and dryer", group: "practical" },
  { id: "parking-space-30", file: house("parking-space-30"), width: 1440, height: 1920, alt: "Private parking space No. 30", group: "practical" },
  { id: "facade", file: house("facade"), width: 1440, height: 1924, alt: "Facade", group: "practical" },
  { id: "entrance-gate", file: house("entrance-gate"), width: 1440, height: 1869, alt: "Entrance gate with lockbox", group: "practical" },
  { id: "staircase", file: house("staircase"), width: 1440, height: 1920, alt: "Terrazzo staircase", group: "practical" },
];

/** The five photos of the gallery on the landing, in order. */
export const featuredIds = ["terrace-awning", "bike-storage", "dining-fireplace", "bedroom-1-king", "loft-room-bianchi"];

/** Landing order for the carousel and lightbox: the featured five first, then the rest by group. */
export const landingPhotos: Photo[] = [
  ...featuredIds.map((id) => photos.find((p) => p.id === id)!),
  ...photos.filter((p) => !featuredIds.includes(p.id)),
];

export const photoIndex = (list: Photo[], id: string) => list.findIndex((p) => p.id === id);
