import type {Metadata} from "next";
import {Cormorant_Garamond, Manrope} from "next/font/google";
import {NextIntlClientProvider} from "next-intl";
import {setRequestLocale} from "next-intl/server";

import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bike Costa Blanca — A winter house in Marina Alta",
    template: "%s · Bike Costa Blanca",
  },
  description:
    "A considered long-stay house in Ondara for Costa Blanca winters, cycling days and slower time by the Mediterranean.",
  robots: {index: false, follow: false, googleBot: {index: false, follow: false}},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("en");

  return (
    <html
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body>
        <NextIntlClientProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
