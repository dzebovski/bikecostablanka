import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { airbnbListingUrl } from "@/lib/airbnb";
import { LanguageMenu } from "@/components/language-menu";
import { CookieSettingsLink } from "@/components/islands";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const social = "text-charcoal";
  return (
    <footer data-component="Footer" className="mx-5 mt-section border-t border-line md:mx-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3.5 pt-6 pb-7 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-5 md:px-10 md:py-7">
        <Link href={`/${locale}`} className="wordmark">
          {t.brand}
        </Link>
        <nav aria-label={t.footer.social} className="t-sm flex flex-wrap gap-x-5 gap-y-2 md:gap-x-6">
          <a href="https://www.instagram.com/bikecostablanca/" className={social}>
            {t.footer.instagram}
          </a>
          <a href="https://www.tiktok.com/@bikecostablanca" className={social}>
            {t.footer.tiktok}
          </a>
          <a href={airbnbListingUrl(locale)} className={social}>
            {t.footer.airbnb}
          </a>
          <CookieSettingsLink label={t.footer.cookieSettings} />
        </nav>
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <LanguageMenu locale={locale} t={t.language} up />
          <p className="t-sm">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
