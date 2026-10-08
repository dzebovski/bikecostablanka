"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageMenu } from "@/components/language-menu";
import { HeaderAction } from "@/components/booking/triggers";

/** Sticky header of the landing: wordmark, section links with the active one underlined, language, booking action. */
export function SiteHeader({ locale, t }: { locale: Locale; t: Pick<Dictionary, "brand" | "header" | "language"> }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = t.header.nav.map((item) => item.id);
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        // The topmost section that is in the upper half of the viewport.
        const current = ids.find((id) => (visible.get(id) ?? 0) > 0) ?? null;
        setActive(window.scrollY < 120 ? null : current);
      },
      { rootMargin: "-56px 0px -50% 0px", threshold: [0, 0.01] },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [t.header.nav]);

  return (
    <header data-component="Header" className="sticky top-0 z-20 h-[52px] border-b border-line bg-paper md:h-14">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 pr-4 pl-5 md:gap-6 md:px-10">
        <Link href={`/${locale}`} className="wordmark">
          {t.brand}
        </Link>
        <nav aria-label={t.header.navLabel} className="t-sm hidden min-w-0 flex-1 flex-wrap justify-center gap-[22px] lg:flex">
          {t.header.nav.map((item) => (
            <a key={item.id} className="navlink" href={`#${item.id}`} aria-current={active === item.id || undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <LanguageMenu locale={locale} t={t.language} />
          <div className="hidden md:block">
            <HeaderAction />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Header without section links, for the 404 page. */
export function PlainHeader({ locale, t }: { locale: Locale; t: Pick<Dictionary, "brand" | "language"> }) {
  return (
    <header className="sticky top-0 z-20 h-[52px] border-b border-line bg-paper md:h-14">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-3 pr-4 pl-5 md:px-10">
        <Link href={`/${locale}`} className="wordmark">
          {t.brand}
        </Link>
        <LanguageMenu locale={locale} t={t.language} />
      </div>
    </header>
  );
}
