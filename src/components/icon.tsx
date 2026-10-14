/** Phosphor Light icons (amenities, key facts, highlights), inlined into the CSS at build time by @iconify/tailwind4. */

// Literal class names, so Tailwind can find them in the source.
const icons = {
  bicycle: "icon-[ph--bicycle-light]",
  "washing-machine": "icon-[ph--washing-machine-light]",
  fire: "icon-[ph--fire-light]",
  thermometer: "icon-[ph--thermometer-simple-light]",
  "thermometer-hot": "icon-[ph--thermometer-hot-light]",
  wifi: "icon-[ph--wifi-high-light]",
  desk: "icon-[ph--desk-light]",
  "office-chair": "icon-[ph--office-chair-light]",
  moon: "icon-[ph--moon-light]",
  bathtub: "icon-[ph--bathtub-light]",
  sun: "icon-[ph--sun-light]",
  car: "icon-[ph--car-light]",
  wrench: "icon-[ph--wrench-light]",
  "fork-knife": "icon-[ph--fork-knife-light]",
  oven: "icon-[ph--oven-light]",
  snowflake: "icon-[ph--snowflake-light]",
  coffee: "icon-[ph--coffee-light]",
  tv: "icon-[ph--television-simple-light]",
  lock: "icon-[ph--lock-key-light]",
  paw: "icon-[ph--paw-print-light]",
  users: "icon-[ph--users-light]",
  bed: "icon-[ph--bed-light]",
  shower: "icon-[ph--shower-light]",
  key: "icon-[ph--key-light]",
} as const;

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  const icon = icons[name as keyof typeof icons];
  return icon ? <span aria-hidden className={`${icon} size-6 shrink-0 ${className}`} /> : null;
}
