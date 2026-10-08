import Image from "next/image";
import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PlainHeader } from "@/components/site-header";

export default async function NotFound() {
  const locale = defaultLocale;
  const t = await getDictionary(locale);
  return (
    <>
      <title>{t.meta.notFoundTitle}</title>
      <PlainHeader locale={locale} t={t} />
      <main className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-5 py-12 md:grid-cols-2 md:px-10 md:py-12">
        <div className="flex flex-col gap-4">
          <p className="t-label">{t.notFound.label}</p>
          <h1 className="t-h1">{t.notFound.title}</h1>
          <p className="t-body">{t.notFound.text}</p>
          <Link href={`/${locale}`} className="btn btn-primary self-start">
            {t.notFound.back}
          </Link>
        </div>
        <div className="tile aspect-[4/3]">
          <Image src="/images/house/terrace-awning.jpg" alt={t.notFound.alt} fill sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </main>
    </>
  );
}
