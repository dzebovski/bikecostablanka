export const locales = ["en"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
