"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { landingPhotos } from "@/data/photos";
import { track } from "@/lib/analytics";
import { fill } from "@/lib/format";
import { PhotoTrigger } from "@/components/lightbox";

/**
 * Desktop: one large photo and a 2×2 grid with 40px outer corners.
 * Mobile: a swipe carousel over all photos with a "1 / 30" chip.
 */
export function Gallery({ locale, t }: { locale: Locale; t: Dictionary["gallery"] }) {
  const [current, setCurrent] = useState(1);
  const strip = useRef<HTMLDivElement>(null);
  const total = landingPhotos.length;

  function onScroll() {
    const el = strip.current;
    if (!el || !el.clientWidth) return;
    setCurrent(Math.round(el.scrollLeft / el.clientWidth) + 1);
  }

  return (
    <section id="photos" data-component="Gallery" aria-label={t.label} className="relative order-first -mx-3 md:order-none md:mx-0">
      <div
        ref={strip}
        onScroll={onScroll}
        className="swipe gap-0 rounded-[40px_40px_20px_20px] md:grid md:h-[480px] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-2 md:gap-2 md:overflow-hidden md:rounded-hero"
      >
        {landingPhotos.map((photo, i) => {
          const featured = i < 5;
          const name = t.names[i] ?? photo.alt;
          return (
            <PhotoTrigger
              key={photo.id}
              index={i}
              label={i === 0 ? fill(t.openFirst, { n: 1, total, name }) : fill(t.open, { n: i + 1, name })}
              className={`tile relative aspect-[4/3] flex-[0_0_100%] rounded-none border-0 p-0 md:aspect-auto ${
                i === 0 ? "md:row-span-2" : ""
              } ${featured ? "" : "md:hidden"}`}
            >
              <Image
                src={photo.file}
                alt={photo.alt}
                fill
                preload={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes={i === 0 ? "(min-width: 1200px) 560px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1200px) 280px, (min-width: 768px) 25vw, 100vw"}
              />
            </PhotoTrigger>
          );
        })}
      </div>
      <span className="chip tnum absolute right-3 bottom-3 border-snow bg-snow md:hidden" aria-hidden="true">
        {fill(t.counter, { n: current, total })}
      </span>
      <Link
        href={`/${locale}/photos`}
        data-event="open_gallery"
        onClick={() => track("open_gallery", { photo_index: 0, source: "show_all" })}
        className="btn btn-secondary btn-on-photo btn-sm absolute right-4 bottom-4 hidden md:inline-flex"
      >
        {fill(t.showAll, { total })}
      </Link>
    </section>
  );
}
