import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { landingPhotos } from "@/data/photos";
import { BookingProvider } from "@/components/booking/booking-context";
import { BookingCard } from "@/components/booking/booking-card";
import { BookingSheet } from "@/components/booking/booking-sheet";
import { MobileBookingBar } from "@/components/booking/triggers";
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
        <main id="top" className="mx-auto max-w-[1200px] md:px-10">
          <div className="flex flex-col">
            <TitleBlock t={t} />
            <Gallery locale={lang} t={t.gallery} />
          </div>
          <AnchorStrip t={t} />
          <div className="flex flex-col md:pt-8 lg:flex-row lg:flex-wrap lg:items-start lg:gap-16">
            <div id="house" className="min-w-0 lg:max-w-[720px] lg:flex-[999_1_560px]">
              <KeyFacts t={t} />
              <Highlights t={t} />
              <About t={t} />
              <SleepCards t={t} />
              <Amenities t={t} />
            </div>
            <BookingCard />
          </div>
          <Rides t={t} />
        </main>
        <PriceTable t={t} locale={lang} />
        <div className="mx-auto max-w-[1200px] md:px-10">
          <Reviews t={t} />
          <Location t={t} />
          <HostAndGoodToKnow t={t} />
          <Faq t={t} />
          <FinalCta t={t} locale={lang} />
        </div>
        <Footer locale={lang} t={t} />
        <MobileBookingBar />
        <BookingSheet />
      </LightboxProvider>
    </BookingProvider>
  );
}
