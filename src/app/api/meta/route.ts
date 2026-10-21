import type { NextRequest } from "next/server";

const GRAPH = "https://graph.facebook.com/v24.0";

/** Events the site sends; anything else is dropped. */
const EVENTS = new Set(["PageView", "InitiateCheckout", "LongStayIntent", "contact_host", "view_dates", "open_date_picker", "open_gallery", "open_amenities"]);

type Body = {
  eventName?: unknown;
  eventId?: unknown;
  params?: unknown;
  url?: unknown;
};

/** Plain string/number params only, at most 20 of them. */
function cleanParams(params: unknown) {
  if (!params || typeof params !== "object") return {};
  const entries = Object.entries(params).filter(
    ([key, value]) => key.length <= 40 && (typeof value === "number" || (typeof value === "string" && value.length <= 200)),
  );
  return Object.fromEntries(entries.slice(0, 20));
}

/** Click ID cookie from `fbclid` in the landing URL when the Pixel has not set `_fbc` yet. */
function fbcFromUrl(url: string) {
  try {
    const fbclid = new URL(url).searchParams.get("fbclid");
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Meta Conversions API: the server copy of a Pixel event, deduplicated by `event_id`.
 * Sends nothing without the visitor's consent cookie or without the token.
 */
export async function POST(request: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return new Response(null, { status: 204 });
  if (request.cookies.get("bcb_consent")?.value !== "granted") return new Response(null, { status: 204 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const { eventName, eventId, url } = body;
  if (typeof eventName !== "string" || !EVENTS.has(eventName)) return new Response(null, { status: 400 });
  if (typeof eventId !== "string" || eventId.length > 64) return new Response(null, { status: 400 });
  const sourceUrl = typeof url === "string" ? url.slice(0, 1000) : undefined;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const userData = {
    client_ip_address: ip || undefined,
    client_user_agent: request.headers.get("user-agent") || undefined,
    fbp: request.cookies.get("_fbp")?.value,
    fbc: request.cookies.get("_fbc")?.value ?? (sourceUrl ? fbcFromUrl(sourceUrl) : undefined),
  };

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: cleanParams(body.params),
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  try {
    const response = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Never log the request URL: it carries the token.
    if (!response.ok) console.error("[meta capi]", response.status, (await response.text()).slice(0, 500));
  } catch {
    console.error("[meta capi] request failed");
  }
  return new Response(null, { status: 204 });
}
