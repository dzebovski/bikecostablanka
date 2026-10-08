type Params = Record<string, string | number>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Params) => void;
    fbq?: (command: "track" | "trackCustom", name: string, params?: Params) => void;
  }
}

/** Sends an event to GA4 and Meta Pixel when they are loaded (no-op otherwise). */
export function track(name: string, params: Params = {}, metaStandardEvent?: string) {
  window.gtag?.("event", name, params);
  if (metaStandardEvent) window.fbq?.("track", metaStandardEvent, params);
  else window.fbq?.("trackCustom", name, params);
}
