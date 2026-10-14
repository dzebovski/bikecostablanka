# Dev task: direct booking (Lodgify) as a second channel

Open a new coding session in this repo and paste everything under the line.

---

## 0. Before you write code

- Read `TASKS.md`, `docs/CONTEXT.md`, `docs/BUILD_PROMPT.md` (§6 booking, §7 events) and `AGENTS.md`. This is Next.js 16.4: check `node_modules/next/dist/docs/` before using any framework API.
- Design: Claude Design canvas https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, page "Page 3 · Direct booking" (task: `docs/DESIGN_TASK_DIRECT_BOOKING.md`). If Page 3 is not drawn yet, follow the design task text.
- Base branch: `refine-rhythm-bar` (bottom booking bar) if it has been merged or the owner says to build on it; otherwise `main`. Ask the owner if unsure. Work on a new branch `direct-booking`. Never push to `main` without the owner's OK (it deploys production).

## 1. Owner decisions (hard rules)

1. Airbnb stays primary: the charcoal "Check availability →" button. Direct is a secondary pine text link "Book direct via Lodgify →".
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

- Desktop, bar closed, valid dates: the link "Book direct via Lodgify →" replaces the second summary line inside the bar ("exact price on Airbnb"). **No panel floats above the bar** (owner: a permanent panel is a bad solution); that panel stays reserved for booking problems. Picker open: the link plus the benefit line in the popover footer (see `P3-BarDesktop` A and B).
- In `src/components/booking/booking-fields.tsx`, add a `BookDirectLink` next to `BookingAction`. It is a pine underlined text link "Book direct via Lodgify →" plus one benefit line in small text. It renders only when `directHref` is set, opens in a new tab (`rel="noopener"`), carries `data-event="click_book_direct"` and calls `onBookDirect(source)`.
- Render it under the primary action in:
  - the desktop booking surface: the bottom-bar popover footer, or the card on `main`;
  - step 2 of the mobile sheet (`booking-sheet.tsx`);
  - the Final CTA (`FinalCtaForm` in `triggers.tsx`), desktop and mobile.
- The header keeps the Airbnb action only.
- **"Two ways to book" block** in the Prices section (`src/components/landing/sections.tsx`), under the table. Two columns:
  - **Airbnb**: protection, reviews, free cancellation, action: the text link "Check dates →" (opens the picker). Both columns are InfoRow lists inside the Prices snow band, not Cards (see `P3-Sections`).
  - **Direct via Lodgify**: welcome pack, book and pay on Lodgify (a third-party holiday-rental platform), Eugene directly, 50/50 payment. No cancellation row: Lodgify shows its own terms. The action "Book direct →" opens the picker when there are no dates yet, and the direct URL when the range is valid.
  - No prices in either column. If the direct URL is not configured, hide the whole block.
- **FAQ item** "Can I book directly with you?", with the text from the design task.
- All copy goes in `src/i18n/messages/en.json`: `cta.bookDirect`, `direct.benefit`, `direct.options.*`, `faq` item.

## 5. Checks

- Unit test `src/lib/direct.test.ts`: env empty gives `null`; env set gives the base URL, also when dates are passed.
- `npm run lint`, `npm test` and `npm run build` pass.
- On the Vercel preview, with `NEXT_PUBLIC_DIRECT_BOOKING_URL` set **for Preview only** to the owner's URL, or to the old site's book-direct page as a stand-in:
  - Pick 1–15 Dec: both "Check availability →" and "Book direct via Lodgify →" appear in the bar/card, the sheet and the Final CTA.
  - The direct link opens the URL in a new tab. The dev console shows `click_book_direct` and `LongStayIntent` with `channel=direct` and the same params as Airbnb.
  - Empty, too short and conflict states show no direct link.
  - With the env var unset, nothing direct renders.
- `grep -ri "save\|cheaper\|5%\|discount"` in the changed copy returns nothing about direct booking.

## 6. Report

Preview URL; screenshots of the bar/card, sheet, Final CTA and the "Two ways to book" block; everything still waiting for the owner:
- the published Lodgify URL and its date/guest parameters;
- the old site's book-direct page, which still says "Save up to 5% compared with Airbnb" and should be changed.

Update `TASKS.md` (4.3.7 and the log).

## 7. Copy (EN · UK · DE)

Put these keys in `en.json` now. The UK and DE values go in when those locales are switched on. No price claims in any language.

| Key | EN | UK | DE |
|---|---|---|---|
| `cta.bookDirect` | Book direct via Lodgify → | Забронювати напряму через Lodgify → | Direkt über Lodgify buchen → |
| `direct.benefit` | Pay half now, half 5 days before arrival · welcome pack of local wine & olive oil | Половина зараз, решта за 5 днів до заїзду · вітальний набір: місцеве вино й оливкова олія | Hälfte jetzt, Rest 5 Tage vor Anreise · Willkommenspaket mit Wein und Olivenöl aus der Region |
| `direct.options.title` | Two ways to book | Два способи забронювати | Zwei Wege zu buchen |
| `direct.options.intro` | Pick your dates first. Then choose where to book. | Спершу виберіть дати. Потім — де бронювати. | Erst Daten wählen, dann entscheiden, wo Sie buchen. |
| `direct.options.airbnb.title` | On Airbnb | На Airbnb | Über Airbnb |
| `direct.options.airbnb.rows` | ★ 5.0 from 2 reviews · Free cancellation for an 11-night stay · Payment protected by Airbnb | ★ 5.0 за 2 відгуками · Безкоштовне скасування для 11 ночей · Оплату захищає Airbnb | ★ 5,0 aus 2 Bewertungen · Kostenlose Stornierung bei 11 Nächten · Zahlung durch Airbnb geschützt |
| `direct.options.direct.title` | Direct via Lodgify | Напряму через Lodgify | Direkt über Lodgify |
| `direct.options.direct.rows` | Welcome pack: wine from a local winery and local olive oil · Book and pay on Lodgify, a holiday-rental booking platform · Talk to Eugene directly, before and during your stay · Pay half when you book, the rest 5 days before arrival | Вітальний набір: вино з місцевої винарні й місцева оливкова олія · Бронювання й оплата на Lodgify, платформі для оренди житла · Спілкування з Євгеном напряму до і під час поїздки · Половина при бронюванні, решта за 5 днів до заїзду | Willkommenspaket: Wein von einem Weingut aus der Region und Olivenöl von hier · Buchung und Zahlung auf Lodgify, einer Buchungsplattform für Ferienunterkünfte · Direkter Kontakt mit Eugene vor und während des Aufenthalts · Hälfte bei Buchung, Rest 5 Tage vor Anreise |
| `faq.direct.q` | Can I book directly? | Чи можна забронювати напряму? | Kann ich direkt buchen? |
| `faq.direct.a` | Yes, on Lodgify, a holiday-rental booking platform. Pick your dates here, then choose Book direct via Lodgify. You pay half when you book and the rest 5 days before arrival, and a welcome pack of local wine and olive oil waits for you. Prefer Airbnb? Check availability takes you there with your dates. | Так, на Lodgify, платформі для оренди житла. Виберіть дати тут і натисніть «Забронювати напряму через Lodgify». Половину ви платите при бронюванні, решту за 5 днів до заїзду, а на вас чекає вітальний набір з місцевого вина й оливкової олії. Зручніше через Airbnb? Кнопка «Перевірити дати» переведе вас туди з вибраними датами. | Ja, über Lodgify, eine Buchungsplattform für Ferienunterkünfte. Wählen Sie hier Ihre Daten und dann „Direkt über Lodgify buchen“. Sie zahlen die Hälfte bei der Buchung und den Rest 5 Tage vor Anreise, und ein Willkommenspaket mit Wein und Olivenöl aus der Region wartet auf Sie. Lieber über Airbnb? „Verfügbarkeit prüfen“ bringt Sie mit Ihren Daten dorthin. |

Notes: "Eugene" stays in Latin script in DE; in UK use «Євген». In UK and DE, the label of "Check availability →" must match whatever the site uses for that button (the FAQ quotes it).
