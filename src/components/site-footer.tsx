import {getTranslations} from "next-intl/server";

import {navigation} from "@/content/site";
import {Link} from "@/i18n/navigation";

export async function SiteFooter() {
  const nav = await getTranslations("Navigation");
  const footer = await getTranslations("Footer");

  return (
    <footer className="site-footer">
      <div className="site-footer__top page-shell">
        <div>
          <p className="eyebrow eyebrow--light">Ondara · Marina Alta</p>
          <p className="site-footer__statement">{footer("note")}</p>
        </div>
        <nav aria-label="Footer navigation" className="footer-nav">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {nav(item.labelKey)}
            </Link>
          ))}
        </nav>
        <Link className="footer-enquire" href="/enquire">
          {nav("enquire")} <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="site-footer__bottom page-shell">
        <p>Bike Costa Blanca</p>
        <p>{footer("prototype")}</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
