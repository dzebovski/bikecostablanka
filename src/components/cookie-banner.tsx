"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { applyConsent, onConsentChange, onCookieSettings, readConsent, saveConsent, type Consent } from "@/lib/consent";

const subscribe = (callback: () => void) => onConsentChange(callback);

/** Consent banner: "Only necessary" and "Accept" with equal weight. Tags load only after a choice. */
export function CookieBanner({ t }: { t: Dictionary["cookies"] }) {
  const consent = useSyncExternalStore<Consent | null | "unknown">(subscribe, readConsent, () => "unknown");
  const [reopened, setReopened] = useState(false);

  useEffect(() => onCookieSettings(() => setReopened(true)), []);

  useEffect(() => {
    if (consent === "granted" || consent === "denied") applyConsent(consent);
  }, [consent]);

  const showing = !(consent === "unknown" || (consent !== null && !reopened));

  // The desktop booking bar waits for a choice (globals.css: [data-cookie]).
  useEffect(() => {
    if (!showing) return;
    document.documentElement.dataset.cookie = "";
    return () => {
      delete document.documentElement.dataset.cookie;
    };
  }, [showing]);

  if (!showing) return null;

  function choose(value: Consent) {
    saveConsent(value);
    setReopened(false);
  }

  return (
    <div
      role="region"
      aria-label={t.label}
      data-component="CookieBanner"
      className="fixed inset-x-3 bottom-[calc(var(--bar-h)+12px)] z-30 lg:bottom-3 mx-auto flex max-w-[1000px] flex-wrap items-center gap-4 rounded-photo border border-charcoal bg-snow px-5 py-4 md:inset-x-6 md:gap-6 md:px-6 md:py-5"
      style={{ animation: "fade-rise 200ms var(--ease) both" }}
    >
      <p className="t-sm flex-[1_1_420px]">{t.text}</p>
      <div className="flex gap-3">
        <button type="button" className="btn btn-secondary" onClick={() => choose("denied")}>
          {t.necessary}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => choose("granted")}>
          {t.accept}
        </button>
      </div>
    </div>
  );
}
