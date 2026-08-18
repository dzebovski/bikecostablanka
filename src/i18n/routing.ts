import {defineRouting} from "next-intl/routing";

import {activeLocales} from "@/types";

export const routing = defineRouting({
  locales: activeLocales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
