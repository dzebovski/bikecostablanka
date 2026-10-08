# Build prompt: landing v2 in Next.js

Paste everything under the line into a new coding session opened in this repo (`~/Documents/olekseenko/bikecostablanka`).

---

## 0. Before you write code

1. Read `TASKS.md`, `docs/PROJECT_SUMMARY.md`, `docs/CONTEXT.md` (facts) and `AGENTS.md`.
2. This is **Next.js 16.4** (App Router, Cache Components and partial prefetching on, Turbopack, Tailwind 4 via `@tailwindcss/turbopack`). Your memory of Next.js is out of date: read the relevant guides in `node_modules/next/dist/docs/` before using any API (`'use cache'`, `cacheLife`, `next/image`, `next/font`, route handlers, `generateStaticParams`, `LayoutProps`/`PageProps`, `proxy.ts`).
3. Read the approved design from the Claude Design canvas **https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, page "Page 2" (all artboards named `V2-*`)**. Use the Artifact tool, `action: "read"`, with `paths`:
   `project/V2-Desktop.dc.html`, `project/V2-Mobile.dc.html`, `project/V2-Components.dc.html`, `project/V2-BookingDesktop.dc.html`, `project/V2-BookingMobile.dc.html`, `project/V2-DatePicker.dc.html`, `project/V2-Overlays.dc.html`, `project/V2-AllPhotos.dc.html`, `project/V2-Lightbox.dc.html`, `project/canvas.json` (the notes `v2rules`, `v2events`, `v2motion`).
   The artboards are the source of truth for layout, sizes, copy and states. Page 1 (Main, Mobile, States, Calendar…) is the **old rejected direction**: ignore it.
4. The design rules are strict, and the owner rejects anything that adds new visual devices. **Build what is drawn. Do not add** shadows, gradients, icons, extra colours, new radii, serif type, dark sections or animations that are not in the artboards. If something is missing, choose the closest existing component and list it in your final report.

## 1. What we are building

A one-page conversion landing for an Airbnb townhouse in Ondara (Costa Blanca) for 11+ night winter stays by Northern European road cyclists. The main conversion is `LongStayIntent`: the visitor picks ≥ 11 nights and goes to Airbnb with dates and guests prefilled. Second action: message the host (WhatsApp / email).

Routes: `/en` (only locale for now; UK and DE come later through the same dictionaries), `/en/photos` (all photos), a `not-found` page. `/` redirects via the existing `src/proxy.ts`.

## 2. Design tokens (from the artboards)

| Token | Value | Role (only this role) |
|---|---|---|
| paper | `#f7f0e1` | page background |
| snow | `#ffffff` | cards, booking card, modals, popovers; full-width bands only for Prices and the Final CTA card |
| charcoal | `#23212c` | text, primary button, strong borders |
| line | `rgba(35,33,44,.16)` | hairlines |
| marigold | `#fcbd1c` | date/guest picker fields and selected dates **only** |
| pine | `#006434` | wordmark and text links only |
| morning-sky | `#a6dfff` | the one "Free: …" note in Prices only |

- Font: **Inter** via `next/font/google`, weights 300/400/500, `font-feature-settings: "ss01"` (Neue Haas Unica is first in the design stack but needs a licence; keep Inter unless the owner provides one).
- Type scale: H1 40/1.0/300 (mobile 30), H2 28/1.1/300 (mobile 24), H3 18/1.25/400, body 16/1.45/400, small 14/1.4/400, label 12/500 uppercase +0.06em, number (FactStat) 32/300 tabular lining figures (mobile 28).
- Radii: photos 20, hero gallery outer corners 40 (mobile carousel 40 40 20 20), buttons 20, pills 99, chips and inline messages 12. No shadows anywhere.
- Spacing: container 1200px with 40px side padding; body column max 720px, gap 64px, booking card 336px sticky at `top: 80px`. Sections 48px vertical (mobile 32px, 20px side gutter) separated by a 1px hairline.
- Put tokens in `src/app/[lang]/globals.css` as CSS variables + Tailwind 4 `@theme`. No hex values in components.

## 3. Components

Body is built from 8 primitives only: **SectionHeader, PhotoTile, InfoRow, FactStat, Card, Button** (primary / secondary / text link), **Chip, Accordion**. Their states (default, hover, pressed, focus-visible, disabled) are drawn on `V2-Components`.

Section components (each root carries `data-component="<Name>"`, the same names as in the artboards):
Header, TitleBlock, Gallery, KeyFacts, Highlights, About, SleepCards, Amenities, BookingCard, Rides, RouteCard, PriceTable, Reviews, ReviewCard, Location, HostCard, ThingsToKnow, FAQ, FinalCTA, Footer, MobileBookingBar, BookingSheet, DatePicker, GuestPicker, Lightbox, AllPhotos, AmenitiesModal, CookieBanner.

Server components by default. Client islands only where there is interaction: booking (card, final CTA, mobile bar and sheet, date and guest pickers, which share one booking state), gallery + lightbox, header active-section highlight and language menu, SleepCards arrows, About "Show more", review "Show more", amenities modal, cookie banner. FAQ uses native `<details>`.

## 4. Content

- All copy lives in `src/i18n/messages/en.json`. **Restructure it to match the v2 sections** and take the text exactly from `V2-Desktop` (mobile uses the shorter variants drawn on `V2-Mobile`; store them as separate keys where they differ).
- Facts must match `docs/CONTEXT.md`. Prices and free dates are the 2026-10-08 snapshot: keep them in one typed data file (`src/data/prices.ts`) with the "checked on" date, because they will be updated.
- Placeholders that the owner still has to supply. Do not invent them:
  - WhatsApp number and email: read from `NEXT_PUBLIC_CONTACT_WHATSAPP` / `NEXT_PUBLIC_CONTACT_EMAIL`. If a value is missing, **do not render** that link (no `href="#"`).
  - Host photo: the "E" initial avatar as drawn. The host paragraph is draft copy: keep it in the dictionary and list it in the report as "to confirm".
  - Bernia route photo: the drawn placeholder tile.
  - Map: the drawn placeholder tile with a link to Google Maps for "Ondara, Alicante" (town, not the address).
  - "17–21°C" is provisional (AEMET figures pending): keep, list in the report.

## 5. Images

Use `next/image` with correct `sizes`; the first gallery image gets `priority`. Alt text as in the artboards.

| Place | Files (`public/images/…`) |
|---|---|
| Gallery 1 + 4 | `house/terrace-awning.jpg`, `house/bike-storage.jpg`, `house/dining-fireplace.jpg`, `house/bedroom-1-king.jpg`, `house/loft-room-bianchi.jpg` |
| Where you'll sleep | `house/bedroom-1-king.jpg`, `house/bedroom-2-king.jpg`, `house/bedroom-3.jpg`, `house/bedroom-single-desk.jpg`, `house/loft-room-bianchi.jpg` |
| Rides | `coll-de-rates.jpeg`, `vall-debo.jpeg`, Bernia placeholder, January photo: copy `docs/reference/media/photo-january-2025-ride-in-shorts.jpg` to `public/images/rides/january-2025-shorts.jpg` (`object-position: 50% 30%`) |
| All photos (6 groups, 30 photos) | groups and order exactly as on `V2-AllPhotos`; file names in `public/images/house/` match the alt texts (terrace-*, courtyard*, living-room*, kitchen*, dining-*, bedroom-*, workspace, bathroom-*, guest-wc, bike-storage, loft-room-*, bianchi-1970s, laundry, parking-space-30, facade, entrance-gate, staircase) |
| 404 | `house/terrace-awning.jpg` |

Keep one ordered photo list in `src/data/photos.ts` (id, file, alt, group). The gallery, lightbox and all-photos page all read it.

## 6. Booking logic (the part that makes money)

**Availability (server).**
- Route handler `src/app/api/availability/route.ts` (or a cached server function, whichever the Next 16 docs recommend for Cache Components) fetches `process.env.AIRBNB_ICAL_URL`, parses `VEVENT` `DTSTART`/`DTEND` (all-day `DATE` values; `DTEND` is exclusive, the check-out day), and returns only `{ booked: [{ from: "YYYY-MM-DD", to: "YYYY-MM-DD" }], checkedAt }`, where `to` is exclusive. Cache for 1 hour.
- **The iCal URL is a secret.** Never send it to the client, never log it, never commit it. Local dev: `vercel env pull` (`.env*` is gitignored).
- If the fetch or parse fails, return `{ booked: null }`. The UI then shows state 6 ("Calendar unavailable"): the picker works, only the 11-night rule is checked, and the note "Final availability is checked on Airbnb." appears.

**Rules (client, one pure module `src/lib/booking.ts` with unit tests).**
- Dates are calendar dates in Europe/Madrid; work with `YYYY-MM-DD` strings or day ordinals, never local-time `Date` arithmetic.
- A night is booked if it is inside any `[from, to)`. Check-in must be a free night that is not in the past.
- A check-out is valid when `nights ≥ 11` and every night in `[check-in, check-out)` is free. **The first booked night after a free stretch is still a valid check-out day** (example: check-in 1 Dec, check-out 28 Dec is fine). This is what the `V2-DatePicker` prototype does.
- After check-in, days that would give < 11 nights get the dashed ring and are disabled; days beyond the next booked night are disabled.
- Show 2 months on desktop and a scrolling month list on mobile, from the current month for 12 months.
- Price estimate: per-night rates by check-in month from `src/data/prices.ts` (Dec 999/14, Jan 1101/11, Mar 105, Apr 2848/28). Show "14 nights · ≈ €999" + "exact price on Airbnb". Months without a rate show "price on Airbnb".

**States**, exactly as on `V2-BookingDesktop` / `V2-BookingMobile`:
1 empty, 2 picking (check-out field highlighted, "Earliest check-out: … (11 nights)", hover preview of the range in a lighter marigold band), 3 valid, 4 too short (inline message + "Extend to {date} →", which sets check-out to check-in + 11), 5 conflict with booked nights ("Some of these nights are booked. Booked: {range}." + "Show next free dates →", which reopens the calendar at the next free window), 6 calendar unavailable.

**Labels (one label per action):**
- "Check dates" (button) and "Check dates →" (text link) **always open the date picker**: on desktop the popover under the booking card fields (scroll the card into view first if needed); on mobile the bottom sheet.
- "Check availability →" appears **only when the dates are valid** and is the only control that goes to Airbnb. This applies to the booking card, the Final CTA, the mobile sheet and the header.
- Disabled primary button text says what to fix: "Choose 11+ nights", "Choose free dates".

**Guests.** Adults ≥ 1; adults + children ≤ 5; infants 0–5 don't count; pets toggle. At the limit, the + buttons are disabled and the note "Maximum 5 guests. Infants don't count." appears.

**Airbnb URL.** Extend `airbnbUrl()` in `src/lib/airbnb.ts`: `check_in`, `check_out`, `adults` (verified), plus `children`, `infants`, `pets` (verify on a real Airbnb page that they prefill; drop any that do not). Open in a new tab (`noopener`).

**Mobile sheet** (`V2-DatePicker`, mobile): step 1 dates with a sticky footer "14 nights · ≈ €999 / Tue 1 – Tue 15 Dec" + "Next: guests"; step 2 guests with "Check availability →". Swipe down or × closes. The mobile bottom bar ("from €71 / night · 11+ nights" + "Check dates") is always visible and hides while the sheet is open.

**Keyboard and a11y.** The date grid is a real grid of buttons: arrows move by day/week, PageUp/PageDown by month, Enter picks, Esc closes and returns focus to the field that opened it. Popovers and sheets are dialogs with focus trap. Messages use `role="alert"` and fade in, never shake.

## 7. Analytics and consent

Reuse `src/lib/analytics.ts` (`track(name, params, metaStandardEvent?)`). Every interactive element carries `data-event` as in the artboards.

| Event | When | Params |
|---|---|---|
| `open_date_picker` | any "Check dates" | `source` (header, card, amenities, prices, final_cta, mobile_bar, lightbox, all_photos, amenities_modal) |
| `view_dates` | a valid range is selected | nights, check_in, check_out |
| `click_book_airbnb` + Meta `InitiateCheckout` | "Check availability →" | nights, guests, check_in, check_out, value, currency `EUR`, locale, source |
| `LongStayIntent` (custom; Meta custom event + GA4 event + Google Ads conversion) | same click, nights ≥ 11 | same params; `value` = the estimate, or nights × 75 when there is no rate |
| `contact_host` | WhatsApp / email | channel, source |
| `open_gallery` | gallery tile, "Show all 30 photos", sleep tile | photo index |
| `open_amenities` | "Show all 40+ amenities" | – |

- IDs come from `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GADS_ID`. If an ID is missing, its tag is not loaded and `track()` is a no-op for it.
- **Google Consent Mode v2**: default `denied` for ad_storage, ad_user_data, ad_personalization and analytics_storage before any tag loads. CookieBanner (`V2-Overlays`): "Only necessary" and "Accept" with equal weight; the choice is stored for 6 months and updates consent. Meta Pixel loads only after "Accept". Footer link "Cookie settings" reopens the banner.

## 8. Motion (from the `v2motion` note)

Ease-out `cubic-bezier(.23,1,.32,1)`. Popovers 200 ms in / 140 ms out (fade + 6px). Mobile sheet 400 ms in / 240 ms out. Lightbox fade 200 ms. Buttons scale .97 on press. Gallery images scale 1.03 on hover (hover devices only, 700 ms). `prefers-reduced-motion`: fades only. Nothing else moves.

## 9. Responsive

- ≥ 1024px: the desktop artboard. 768–1023px: same structure, booking card drops under the body column (not sticky), the MobileBookingBar is shown. < 768px: the mobile artboard (carousel gallery with "1 / 30" chip, anchor pill strip under the title, swipe rows for rooms, rides and reviews, Prices as a list instead of a table, bottom bar + sheet).
- No horizontal page scroll at 360px. Touch targets ≥ 44px.

## 10. How to work

Small steps; after each one run `npm run lint` and `npm run build`, commit, push to a branch and check the Vercel preview. Do not push to `main` without the owner's OK (`main` deploys production).

1. Tokens, font, layout shell, Header, Footer, not-found.
2. Static sections in order (TitleBlock → Footer) with the content restructure in `en.json`, data files for prices and photos.
3. Booking: `src/lib/booking.ts` + tests, BookingCard with all 6 states, desktop DatePicker and GuestPicker, using mocked booked ranges first.
4. Availability route with the iCal feed and the failure state.
5. Mobile: bar, sheet (2 steps), carousel, swipe rows.
6. Gallery, Lightbox, `/en/photos`, AmenitiesModal.
7. Analytics, Consent Mode v2, CookieBanner.
8. QA pass against the checklist, then ask the owner to review the preview.

Update `TASKS.md` (section 4.3 and the log) as you go.

## 11. Acceptance checklist

- [ ] Every section on `V2-Desktop` and `V2-Mobile` is present, in the same order, with the same copy.
- [ ] Only the 7 colours, 1 font family and the listed radii are used; no shadows, gradients or extra icons.
- [ ] "Check dates" never goes to Airbnb; "Check availability →" only appears with a valid range.
- [ ] All 6 booking states are reproducible (the conflict state with the real feed: 20 Dec → 3 Jan).
- [ ] Check-out on the first booked night works (1 Dec → 28 Dec).
- [ ] The Airbnb tab opens with the dates and guests prefilled.
- [ ] Events fire with the params above (check in GA4 DebugView / Meta Test Events once the IDs exist; until then log them in dev).
- [ ] No tags or non-necessary cookies before consent.
- [ ] `AIRBNB_ICAL_URL` never appears in client bundles, logs or the repo.
- [ ] Keyboard: the whole booking flow works without a mouse; focus is always visible.
- [ ] Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO; LCP image is the first gallery photo.
- [ ] Missing contact values hide their links instead of rendering dead ones.
- [ ] The final report lists every place where you deviated from the artboards, and every placeholder still waiting for the owner.
