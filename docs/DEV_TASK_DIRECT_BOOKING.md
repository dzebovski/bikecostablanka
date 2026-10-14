# Dev task: direct booking (Lodgify) as a second channel

Open a new coding session in this repo and paste everything under the line.

---

## 0. Before you write code

- Read `TASKS.md`, `docs/CONTEXT.md`, `docs/BUILD_PROMPT.md` (§6 booking, §7 events) and `AGENTS.md`. This is Next.js 16.4: check `node_modules/next/dist/docs/` before using any framework API.
- Design: Claude Design canvas https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, page "Page 3 · Direct booking" (task: `docs/DESIGN_TASK_DIRECT_BOOKING.md`). If Page 3 is not drawn yet, follow the design task text.
- Base branch: `refine-rhythm-bar` (bottom booking bar) if it has been merged or the owner says to build on it; otherwise `main`. Ask the owner if unsure. Work on a new branch `direct-booking`. Never push to `main` without the owner's OK (it deploys production).

## 1. Owner decisions (hard rules)

1. Airbnb stays primary: the charcoal "Check availability →" button. Direct is a secondary pine text link "Book direct with Eugene →".
2. **Never show or imply that direct is cheaper**: no "save", no "−5%", no lower number, no price comparison anywhere (Airbnb rules). Benefits are non-price only: a welcome pack with local wine and olive oil, the host directly, 50% at booking and 50% five days before arrival.
3. The direct link opens a configured URL **without dates** for now (the Lodgify site `bikecostablanka.lodgify.com` is not published yet). Tracking still sends the dates the visitor picked on our site.

## 2. Config

- New `src/lib/direct.ts`, mirroring `src/lib/airbnb.ts`:
  - `directBookingBaseUrl()` reads `process.env.NEXT_PUBLIC_DIRECT_BOOKING_URL` and returns `null` when it is empty.
  - `directBookingUrl(locale, checkIn?, checkOut?, guests?)` returns the base URL unchanged for now. Keep the parameters in the signature, and add a short comment: append the Lodgify date and guest parameters once the site is published and the format has been verified on a real page.
- When the env var is missing, **no direct link renders anywhere** (no dead `href`).
- Do not add the env var to Vercel until the owner gives a working URL. List it in the report.

## 3. Booking state and events

In `src/components/booking/booking-context.tsx`:
- Move the params object now built inside `onCheckAvailability` into one helper (nights, guests, check_in, check_out, value, currency, locale, source) and add `channel: "airbnb" | "direct"`.
- Keep `airbnbHref` and `onCheckAvailability`. Airbnb events stay `click_book_airbnb` (Meta `InitiateCheckout`) + `trackLongStayIntent`, now with `channel: "airbnb"`.
- Add `directHref`: set only when the range is valid **and** a direct URL is configured.
- Add `onBookDirect(source)`: `track("click_book_direct", params, "InitiateCheckout")`, and when nights ≥ `MIN_NIGHTS`, `trackLongStayIntent({ ...params, channel: "direct" })`.
- `src/lib/analytics.ts` needs no API change.

## 4. UI

- In `src/components/booking/booking-fields.tsx`, add a `BookDirectLink` next to `BookingAction`. It is a pine underlined text link "Book direct with Eugene →" plus one benefit line in small text. It renders only when `directHref` is set, opens in a new tab (`rel="noopener"`), carries `data-event="click_book_direct"` and calls `onBookDirect(source)`.
- Render it under the primary action in:
  - the desktop booking surface: the bottom-bar popover footer, or the card on `main`;
  - step 2 of the mobile sheet (`booking-sheet.tsx`);
  - the Final CTA (`FinalCtaForm` in `triggers.tsx`), desktop and mobile.
- The header keeps the Airbnb action only.
- **"Two ways to book" block** in the Prices section (`src/components/landing/sections.tsx`), under the table. Two Cards:
  - **Airbnb**: protection, reviews, free cancellation, action "Check dates" (opens the picker).
  - **Direct with Eugene**: welcome pack, host directly, 50/50 payment, cancellation policy. The action "Book direct →" opens the picker when there are no dates yet, and the direct URL when the range is valid.
  - No prices in either Card. If the direct URL is not configured, hide the whole block.
- **FAQ item** "Can I book directly with you?", with the text from the design task.
- All copy goes in `src/i18n/messages/en.json`: `cta.bookDirect`, `direct.benefit`, `direct.options.*`, `faq` item. The direct cancellation policy is still missing: use a clear placeholder key and list it in the report. Do not invent a policy.

## 5. Checks

- Unit test `src/lib/direct.test.ts`: env empty gives `null`; env set gives the base URL, also when dates are passed.
- `npm run lint`, `npm test` and `npm run build` pass.
- On the Vercel preview, with `NEXT_PUBLIC_DIRECT_BOOKING_URL` set **for Preview only** to the owner's URL, or to the old site's book-direct page as a stand-in:
  - Pick 1–15 Dec: both "Check availability →" and "Book direct with Eugene →" appear in the bar/card, the sheet and the Final CTA.
  - The direct link opens the URL in a new tab. The dev console shows `click_book_direct` and `LongStayIntent` with `channel=direct` and the same params as Airbnb.
  - Empty, too short and conflict states show no direct link.
  - With the env var unset, nothing direct renders.
- `grep -ri "save\|cheaper\|5%\|discount"` in the changed copy returns nothing about direct booking.

## 6. Report

Preview URL; screenshots of the bar/card, sheet, Final CTA and the "Two ways to book" block; everything still waiting for the owner:
- the published Lodgify URL and its date/guest parameters;
- the direct cancellation policy;
- the old site's book-direct page, which still says "Save up to 5% compared with Airbnb" and should be changed.

Update `TASKS.md` (4.3.7 and the log).
