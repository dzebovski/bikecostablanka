import {getTranslations} from "next-intl/server";

import {navigation} from "@/content/site";
import {Link} from "@/i18n/navigation";

import {MobileMenu} from "./mobile-menu";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");
  const items = navigation.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link aria-label="Bike Costa Blanca home" className="brand" href="/">
          <span aria-hidden="true" className="brand__mark">
            BC
          </span>
          <span className="brand__name">
            Bike <i>Costa Blanca</i>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="desktop-nav">
          {items.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/enquire">
          {t("enquire")}
          <span aria-hidden="true">↗</span>
        </Link>
        <MobileMenu
          closeLabel={t("close")}
          enquireLabel={t("enquire")}
          items={items}
          menuLabel={t("menu")}
        />
      </div>
    </header>
  );
}
