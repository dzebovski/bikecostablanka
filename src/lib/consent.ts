import { tagIds } from "@/lib/analytics";

export type Consent = "granted" | "denied";

const COOKIE = "bcb_consent";
const SIX_MONTHS = 60 * 60 * 24 * 182;
const CHANGE = "bcb:consent";
const REOPEN = "bcb:cookie-settings";

export function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|; )bcb_consent=(granted|denied)/);
  return match ? (match[1] as Consent) : null;
}

export function saveConsent(value: Consent) {
  document.cookie = `${COOKIE}=${value}; Max-Age=${SIX_MONTHS}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event(CHANGE));
}

export function onConsentChange(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  return () => window.removeEventListener(CHANGE, callback);
}

/** Footer "Cookie settings" reopens the banner. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(REOPEN));
}

export function onCookieSettings(callback: () => void) {
  window.addEventListener(REOPEN, callback);
  return () => window.removeEventListener(REOPEN, callback);
}

/**
 * Inline <head> script: Consent Mode v2 defaults (all denied) before any tag loads,
 * then the stored choice. Rendered only when a Google tag ID exists.
 */
export const consentDefaultsScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});var c=document.cookie.match(/(?:^|; )${COOKIE}=(granted|denied)/);if(c&&c[1]==='granted')gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});`;

export const hasGoogleTag = Boolean(tagIds.ga || tagIds.gads);

function inject(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

let googleLoaded = false;
let metaLoaded = false;

/** Loads tags after the visitor has chosen. Meta Pixel only after "Accept". */
export function applyConsent(value: Consent) {
  const state = value === "granted" ? "granted" : "denied";
  if (hasGoogleTag && window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    if (!googleLoaded) {
      googleLoaded = true;
      window.gtag("js", new Date());
      if (tagIds.ga) window.gtag("config", tagIds.ga);
      if (tagIds.gads) window.gtag("config", tagIds.gads);
      inject(`https://www.googletagmanager.com/gtag/js?id=${tagIds.ga || tagIds.gads}`);
    }
  }
  if (value === "granted" && tagIds.meta && !metaLoaded) {
    metaLoaded = true;
    const queue: unknown[][] = [];
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
      else queue.push(args);
    }) as NonNullable<Window["fbq"]>;
    fbq.queue = queue;
    Object.assign(fbq, { push: fbq, loaded: true, version: "2.0" });
    window.fbq = fbq;
    (window as Window & { _fbq?: unknown })._fbq = fbq;
    fbq("init", tagIds.meta);
    fbq("track", "PageView");
    inject("https://connect.facebook.net/en_US/fbevents.js");
  }
  if (value === "denied" && metaLoaded) {
    window.fbq?.("consent", "revoke");
  }
}
