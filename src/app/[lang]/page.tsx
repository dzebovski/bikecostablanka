import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { landingPhotos } from "@/data/photos";
import { BookingProvider } from "@/components/booking/booking-context";
import { BookingSheet } from "@/components/booking/booking-sheet";
import { BookingBar, MobileBookingBar } from "@/components/booking/triggers";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { LightboxProvider } from "@/components/lightbox";
import { SiteHeader } from "@/components/site-header";
import {
  About,
  Amenities,
  AnchorStrip,
  Faq,
  FinalCta,
  Highlights,
  HostAndGoodToKnow,
  KeyFacts,
  Location,
  PriceTable,
  Reviews,
  Rides,
  SleepCards,
  TitleBlock,
} from "@/components/landing/sections";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const bookingT = { booking: t.booking, picker: t.picker, guests: t.guests, sheet: t.sheet, cta: t.cta, mobileBar: t.mobileBar };

  return (
    <BookingProvider locale={lang} t={bookingT}>
      <LightboxProvider photos={landingPhotos} locale={lang} t={{ lightbox: t.lightbox, allPhotos: t.allPhotos, cta: t.cta }} source="lightbox">
        <SiteHeader locale={lang} t={t} />
        <main id="top">
          {/* Chapter 1: the house */}
          <div data-chapter="house" className="wrap chapter">
            <div className="flex flex-col gap-4 md:gap-6 md:pt-8">
              <TitleBlock t={t} />
              <Gallery locale={lang} t={t.gallery} />
              <AnchorStrip t={t} />
            </div>
            <div id="house" className="stack">
              <div className="cols">
                <KeyFacts t={t} />
                <Highlights t={t} />
              </div>
              <About t={t} />
              <SleepCards t={t} />
              <Amenities t={t} />
            </div>
          </div>
          {/* Chapter 2: riding */}
          <div data-chapter="riding" className="wrap chapter">
            <Rides t={t} />
          </div>
          {/* Chapter 3: stay */}
          <div data-chapter="stay" className="chapter">
            <PriceTable t={t} locale={lang} />
            <div className="wrap">
              <Reviews t={t} />
            </div>
          </div>
          {/* Chapter 4: practical */}
          <div data-chapter="practical" className="wrap chapter">
            <Location t={t} />
            <HostAndGoodToKnow t={t} />
            <Faq t={t} />
            <FinalCta t={t} locale={lang} />
          </div>
        </main>
        <Footer locale={lang} t={t} />
        <BookingBar />
        <MobileBookingBar />
        <BookingSheet />
      </LightboxProvider>
    </BookingProvider>
  );
}
