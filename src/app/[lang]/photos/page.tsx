import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { photoGroups, photos } from "@/data/photos";
import { LightboxProvider, PhotoTrigger } from "@/components/lightbox";
import { TrackedLink } from "@/components/tracked-link";

export async function generateMetadata({ params }: PageProps<"/[lang]/photos">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.meta.photosTitle, alternates: { canonical: `/${lang}/photos` } };
}

export default async function AllPhotos({ params }: PageProps<"/[lang]/photos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <LightboxProvider photos={photos} locale={lang} t={{ lightbox: t.lightbox, allPhotos: t.allPhotos, cta: t.cta }} source="lightbox">
      <div data-component="AllPhotos">
        <header className="sticky top-0 z-10 border-b border-line bg-paper">
          <div className="mx-auto flex min-h-14 max-w-[1200px] flex-wrap items-center gap-4 px-5 py-1.5 md:px-10">
            <Link href={`/${lang}`} className="btn btn-secondary btn-sm">
              {t.allPhotos.back}
            </Link>
            <nav aria-label={t.allPhotos.rooms} className="swipe order-last w-full gap-2 md:order-none md:w-auto md:flex-1 md:flex-wrap md:overflow-visible">
              {photoGroups.map((group) => (
                <a key={group} href={`#${group}`} className="btn btn-secondary btn-sm btn-pill font-normal">
                  {t.allPhotos.groups[group]}
                </a>
              ))}
            </nav>
            <TrackedLink
              href={`/${lang}?dates=1&source=all_photos`}
              event="open_date_picker"
              params={{ source: "all_photos" }}
              className="btn btn-primary btn-sm ml-auto md:ml-0"
            >
              {t.cta.checkDates}
            </TrackedLink>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-5 pt-7 pb-16 md:px-10">
          <h1 className="t-h1">
            {t.allPhotos.title} <span className="tnum">· {photos.length}</span>
          </h1>
          {photoGroups.map((group) => (
            <section key={group} id={group} className="flex scroll-mt-32 flex-col gap-4 pt-10">
              <h2 className="t-h2">{t.allPhotos.groups[group]}</h2>
              {group === "practical" && <p className="t-sm">{t.allPhotos.practicalNote}</p>}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2">
                {photos.map((photo, index) =>
                  photo.group !== group ? null : (
                    <PhotoTrigger key={photo.id} index={index} className="tile aspect-[4/3] border-0 p-0" label={photo.alt}>
                      <Image src={photo.file} alt={photo.alt} fill sizes="(min-width: 1200px) 380px, (min-width: 600px) 50vw, 100vw" />
                    </PhotoTrigger>
                  ),
                )}
              </div>
            </section>
          ))}
        </main>
      </div>
    </LightboxProvider>
  );
}
