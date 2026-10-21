type Params = Record<string, string | number>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
  }
}

/** Tag IDs. A missing ID means that tag is never loaded and its calls are no-ops. */
export const tagIds = {
  ga: process.env.NEXT_PUBLIC_GA_ID || "",
  meta: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  gads: process.env.NEXT_PUBLIC_GADS_ID || "",
  /** Optional Google Ads conversion label for LongStayIntent (`AW-…/label`). */
  gadsLongStayLabel: process.env.NEXT_PUBLIC_GADS_LONGSTAY_LABEL || "",
};

const devLog = process.env.NODE_ENV !== "production";

/**
 * Sends a Meta event from the browser (Pixel) and the server (Conversions API) with one
 * event ID, so Meta counts it once. Runs only when the Pixel is loaded, i.e. after "Accept".
 */
export function trackMeta(eventName: string, params: Params = {}, custom = false) {
  if (!tagIds.meta || !window.fbq) return;
  const eventId = crypto.randomUUID();
  window.fbq(custom ? "trackCustom" : "track", eventName, params, { eventID: eventId });
  fetch("/api/meta", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ eventName, eventId, params, url: location.href }),
    keepalive: true,
  }).catch(() => {});
}

/** Sends an event to GA4 and Meta when they are loaded (no-op otherwise). */
export function track(name: string, params: Params = {}, metaStandardEvent?: string) {
  if (devLog) console.info("[track]", name, params, metaStandardEvent ? `(Meta ${metaStandardEvent})` : "");
  if (tagIds.ga || tagIds.gads) window.gtag?.("event", name, params);
  if (metaStandardEvent) trackMeta(metaStandardEvent, params);
  else trackMeta(name, params, true);
}

/** The main conversion: GA4 event, Meta custom event and the Google Ads conversion. */
export function trackLongStayIntent(params: Params & { value: number; currency: string }) {
  track("LongStayIntent", params);
  if (tagIds.gads && tagIds.gadsLongStayLabel) {
    window.gtag?.("event", "conversion", {
      send_to: `${tagIds.gads}/${tagIds.gadsLongStayLabel}`,
      value: params.value,
      currency: params.currency,
    });
  }
}
