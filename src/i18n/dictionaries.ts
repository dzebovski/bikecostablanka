import "server-only";
import type { Locale } from "./config";
import type en from "./messages/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./messages/en.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
