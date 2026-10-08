import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CookieBanner } from "@/components/cookie-banner";
import { consentDefaultsScript, hasGoogleTag } from "@/lib/consent";
import "./globals.css";

// Neue Haas Unica comes first in the design stack but needs a licence; Inter until the owner provides one.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#f7f0e1",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bikecostablanka.vercel.app"),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${lang}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [{ url: "/images/house/terrace-awning.jpg", width: 1440, height: 1080 }],
      locale: "en_GB",
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={lang} className={inter.variable}>
      <head>
        {hasGoogleTag && <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />}
      </head>
      <body>
        {children}
        <CookieBanner t={t.cookies} />
      </body>
    </html>
  );
}
