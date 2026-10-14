/** Every Airbnb listing photo, in the order of the "All photos" page; rooms follow the Airbnb photo tour. */

export type PhotoGroup = "terrace" | "living" | "bedrooms" | "bathrooms" | "bikes" | "practical";

export type Photo = { id: string; file: string; width: number; height: number; alt: string; group: PhotoGroup };

export const photoGroups: PhotoGroup[] = ["terrace", "living", "bedrooms", "bathrooms", "bikes", "practical"];

const house = (name: string) => `/images/house/${name}.jpg`;

export const photos: Photo[] = [
  { id: "patio", file: house("patio"), width: 1440, height: 1920, alt: "Patio: private inner courtyard", group: "terrace" },
  { id: "courtyard", file: house("courtyard"), width: 1440, height: 1920, alt: "Patio: courtyard with plants", group: "terrace" },
  { id: "courtyard-door", file: house("courtyard-door"), width: 1440, height: 1080, alt: "Patio: glass door onto the courtyard", group: "terrace" },
  { id: "window-planter", file: house("window-planter"), width: 1440, height: 1920, alt: "Patio: window and planter", group: "terrace" },
  { id: "terrace-dining", file: house("terrace-dining"), width: 1440, height: 1041, alt: "Roof terrace: dining table", group: "terrace" },
  { id: "terrace-loungers-2", file: house("terrace-loungers-2"), width: 1440, height: 885, alt: "Roof terrace: sun loungers", group: "terrace" },
  { id: "terrace-awning", file: house("terrace-awning"), width: 1440, height: 1080, alt: "Roof terrace with awning, sun loungers and dining set", group: "terrace" },
  { id: "terrace-glass-wall", file: house("terrace-glass-wall"), width: 1440, height: 1738, alt: "Glass wall onto the terrace", group: "terrace" },

  { id: "living-room-tv", file: house("living-room-tv"), width: 1440, height: 1080, alt: "Living room with 65-inch TV", group: "living" },
  { id: "living-room-sofa", file: house("living-room-sofa"), width: 1440, height: 1920, alt: "Living room: sofa", group: "living" },
  { id: "living-room", file: house("living-room"), width: 1440, height: 1080, alt: "Living room with wooden beams", group: "living" },
  { id: "living-room-hallway", file: house("living-room-hallway"), width: 1440, height: 1080, alt: "Living room and hallway", group: "living" },
  { id: "kitchen-island", file: house("kitchen-island"), width: 1440, height: 1920, alt: "Kitchen with island", group: "living" },
  { id: "kitchen-bar-stools", file: house("kitchen-bar-stools"), width: 1440, height: 1920, alt: "Kitchen: island with bar stools", group: "living" },
  { id: "kitchen", file: house("kitchen"), width: 1440, height: 1920, alt: "Kitchen", group: "living" },
  { id: "dining-fireplace", file: house("dining-fireplace"), width: 1440, height: 1080, alt: "Dining area with wood-burning fireplace", group: "living" },
  { id: "dining-table", file: house("dining-table"), width: 1440, height: 1920, alt: "Dining area: table for five", group: "living" },
  { id: "courtyard-through-glass", file: house("courtyard-through-glass"), width: 1440, height: 1473, alt: "Dining area: courtyard seen through glass", group: "living" },
  { id: "dining-through-glass", file: house("dining-through-glass"), width: 1440, height: 1920, alt: "Dining area seen through the glass wall", group: "living" },

  { id: "bedroom-1-king", file: house("bedroom-1-king"), width: 1440, height: 1080, alt: "Bedroom 1: king bed", group: "bedrooms" },
  { id: "bedroom-1-headboard", file: house("bedroom-1-headboard"), width: 1440, height: 1920, alt: "Bedroom 1: king bed with wooden headboard", group: "bedrooms" },
  { id: "bedroom-1-bedside", file: house("bedroom-1-bedside"), width: 1440, height: 1920, alt: "Bedroom 1: bedside", group: "bedrooms" },
  { id: "bedroom-1-art", file: house("bedroom-1-art"), width: 1440, height: 1920, alt: "Bedroom 1: bed and wardrobes", group: "bedrooms" },
  { id: "bedroom-1-wardrobes", file: house("bedroom-1-wardrobes"), width: 1440, height: 1081, alt: "Bedroom 1: built-in wardrobes", group: "bedrooms" },
  { id: "bedroom-1-tv", file: house("bedroom-1-tv"), width: 1440, height: 1080, alt: "Bedroom 1: TV wall", group: "bedrooms" },
  { id: "bedroom-2", file: house("bedroom-2"), width: 1440, height: 1080, alt: "Bedroom 2: king bed and lit shelves", group: "bedrooms" },
  { id: "bedroom-2-king", file: house("bedroom-2-king"), width: 1440, height: 1920, alt: "Bedroom 2: king bed", group: "bedrooms" },
  { id: "bedroom-2-shelves", file: house("bedroom-2-shelves"), width: 1440, height: 1920, alt: "Bedroom 2: shelves and armchair", group: "bedrooms" },
  { id: "bedroom-2-bed", file: house("bedroom-2-bed"), width: 1440, height: 1920, alt: "Bedroom 2: bed", group: "bedrooms" },
  { id: "bedroom-single-desk", file: house("bedroom-single-desk"), width: 1440, height: 1080, alt: "Bedroom 3: single bed and desk", group: "bedrooms" },
  { id: "workspace", file: house("workspace"), width: 1440, height: 1184, alt: "Bedroom 3: workspace with office chair", group: "bedrooms" },

  { id: "bathroom-1", file: house("bathroom-1"), width: 1440, height: 1920, alt: "Bathroom 1", group: "bathrooms" },
  { id: "bathroom-1-vanity", file: house("bathroom-1-vanity"), width: 1440, height: 1920, alt: "Bathroom 1: vanity", group: "bathrooms" },
  { id: "bathroom-2", file: house("bathroom-2"), width: 1440, height: 1080, alt: "Bathroom 2", group: "bathrooms" },
  { id: "bathroom-2-shower", file: house("bathroom-2-shower"), width: 1440, height: 1286, alt: "Bathroom 2: shower", group: "bathrooms" },
  { id: "bathroom-3", file: house("bathroom-3"), width: 1440, height: 1080, alt: "Bathroom 3", group: "bathrooms" },
  { id: "bathroom-3-shower", file: house("bathroom-3-shower"), width: 1440, height: 1920, alt: "Bathroom 3: shower and WC", group: "bathrooms" },
  { id: "guest-wc", file: house("guest-wc"), width: 1440, height: 1920, alt: "Guest WC", group: "bathrooms" },

  { id: "bike-storage", file: house("bike-storage"), width: 1440, height: 1080, alt: "Road bike on the wall rack inside the house", group: "bikes" },
  { id: "loft-room-bianchi", file: house("loft-room-bianchi"), width: 1440, height: 1080, alt: "Loft room with a restored 1970s Bianchi", group: "bikes" },
  { id: "bianchi-1970s", file: house("bianchi-1970s"), width: 1440, height: 2170, alt: "Loft room: restored 1970s Bianchi", group: "bikes" },
  { id: "loft-room-bike", file: house("loft-room-bike"), width: 1440, height: 1920, alt: "Loft room: Bianchi above the stairs", group: "bikes" },
  { id: "loft-room-kitchenette", file: house("loft-room-kitchenette"), width: 1440, height: 1920, alt: "Loft room: kitchenette", group: "bikes" },
  { id: "loft-room-stairs", file: house("loft-room-stairs"), width: 1440, height: 1080, alt: "Loft room: stairs to the upper level", group: "bikes" },
  { id: "loft-room-sofa", file: house("loft-room-sofa"), width: 1440, height: 1080, alt: "Loft room: sofa", group: "bikes" },

  { id: "laundry", file: house("laundry"), width: 1440, height: 1920, alt: "Laundry: washer and dryer", group: "practical" },
  { id: "parking-garage", file: house("parking-garage"), width: 1440, height: 935, alt: "Parking: underground car park", group: "practical" },
  { id: "parking-space-30", file: house("parking-space-30"), width: 1440, height: 1920, alt: "Parking: private space No. 30", group: "practical" },
  { id: "facade", file: house("facade"), width: 1440, height: 1924, alt: "Facade", group: "practical" },
  { id: "entrance-gate", file: house("entrance-gate"), width: 1440, height: 1869, alt: "Entrance gate with lockbox", group: "practical" },
  { id: "staircase", file: house("staircase"), width: 1440, height: 1920, alt: "Terrazzo staircase", group: "practical" },
  { id: "hallway-storage", file: house("hallway-storage"), width: 1440, height: 1469, alt: "Hallway storage cupboards", group: "practical" },
  { id: "dressing-mirror", file: house("dressing-mirror"), width: 1440, height: 1920, alt: "Dressing table with mirror", group: "practical" },
];

/** The five photos of the gallery on the landing, in order. */
export const featuredIds = ["terrace-awning", "bike-storage", "dining-fireplace", "bedroom-1-king", "loft-room-bianchi"];

/** Landing order for the carousel and lightbox: the featured five first, then the rest by group. */
export const landingPhotos: Photo[] = [
  ...featuredIds.map((id) => photos.find((p) => p.id === id)!),
  ...photos.filter((p) => !featuredIds.includes(p.id)),
];

export const photoIndex = (list: Photo[], id: string) => list.findIndex((p) => p.id === id);
