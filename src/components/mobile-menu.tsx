"use client";

import {useEffect, useState} from "react";

import {Link} from "@/i18n/navigation";

type MobileMenuProps = {
  items: readonly {href: string; label: string}[];
  menuLabel: string;
  closeLabel: string;
  enquireLabel: string;
};

export function MobileMenu({
  items,
  menuLabel,
  closeLabel,
  enquireLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.dataset.menuOpen = "true";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        className="mobile-nav__toggle"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>{open ? closeLabel : menuLabel}</span>
        <span aria-hidden="true" className={`menu-icon ${open ? "is-open" : ""}`}>
          <i />
          <i />
        </span>
      </button>
      <div
        aria-hidden={!open}
        className={`mobile-nav__panel ${open ? "is-open" : ""}`}
        id="mobile-navigation"
      >
        <nav aria-label="Mobile navigation">
          {items.map((item, index) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className="button button--light mobile-nav__cta"
          href="/enquire"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        >
          <span>{enquireLabel}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
