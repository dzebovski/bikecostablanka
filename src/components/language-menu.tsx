"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/lib/format";
import { usePresence } from "@/hooks/use-presence";

/** "EN ▾" pill with a menu of the available languages. */
export function LanguageMenu({ locale, t, up = false }: { locale: Locale; t: Dictionary["language"]; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const { mounted, state } = usePresence(open, 140);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>('[role="menuitemradio"]')?.focus();
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        className={`btn btn-secondary btn-sm btn-pill ${open ? "bg-snow" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={fill(t.label, { name: t.names[locale] })}
        onClick={() => setOpen((o) => !o)}
      >
        {locale.toUpperCase()} ▾
      </button>
      {mounted && (
        <ul
          role="menu"
          data-state={state}
          className={`pop absolute right-0 z-40 w-[200px] p-1.5 ${up ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"}`}
        >
          {locales.map((code) => (
            <li key={code} role="none">
              <Link
                href={`/${code}`}
                role="menuitemradio"
                aria-checked={code === locale}
                className={`t-body flex min-h-11 items-center justify-between rounded-chip px-3 text-charcoal no-underline ${
                  code === locale ? "bg-paper font-medium" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {t.names[code]} <span className="t-label">{code.toUpperCase()}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
