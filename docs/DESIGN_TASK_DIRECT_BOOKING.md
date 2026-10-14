# Design task: direct booking as a second channel

Open the Claude Design canvas https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, add a new page **"Page 3 · Direct booking"** and paste everything under the line.

---

## Task

Add a second way to book the house, **direct with the host** (Lodgify), next to Airbnb. It should feel like it was always part of the page, not like a second funnel. Draw only the screens and states listed below. Everything else on the page stays as it is.

Base: the v2 artboards on "Page 2" (`V2-*`), with one change: booking now lives in the **raus-style sticky bottom bar** (marigold pill fixed at the bottom of the viewport; date and guest popovers open upwards from it). Live reference: https://bikecostablanka.vercel.app/en (production still has the right-column card; the bottom bar is on the `refine-rhythm-bar` preview). Facts: `docs/CONTEXT.md` in the repo.

## Owner decisions (do not change)

1. **Airbnb stays the main action.** The charcoal primary button "Check availability →" goes to Airbnb with the dates. Direct is the secondary option.
2. **Never show or imply that direct is cheaper.** No "save", no "−5%", no "best price", no lower number, no price comparison of any kind (Airbnb rules). Direct is sold on non-price benefits only:
   - a welcome pack with wine from a local winery and local olive oil;
   - you deal with the host directly (Eugene);
   - you pay 50% when booking and 50% five days before arrival.
3. The direct option opens the Lodgify page **without dates** for now. On our side the visitor still picks dates first, exactly as for Airbnb.

## Guardrails

The v2 rules apply in full (`docs/LANDING_PROMPT_V2.md` §3): one font family, colours with their roles (marigold only for the picker and the bar), the same radii, no shadows, no gradients, no new icons, the 8 component types.

New label, and only one: **"Book direct via Lodgify →"** always opens the direct booking page. "Check availability →" still always means Airbnb; "Check dates" still always opens the picker. The direct option is a **text link** (pine, underlined), never a second filled button, so the hierarchy stays obvious.

## Artboards

1. **Bottom bar, desktop (1440), valid dates.** Bar: fields, summary "14 nights · ≈ €999", primary "Check availability →". In the open popover footer, under the existing "You won't be charged yet. Booking is completed on Airbnb." line: the link "Book direct via Lodgify →" and one benefit line, for example "Local wine & olive oil welcome pack · pay 50% now, 50% before arrival". Also draw the same popover in the empty, too short and conflict states: there the direct link is **hidden**, because, like the Airbnb button, it only appears with a valid range.
2. **Mobile sheet, step 2 (guests), 390.** Footer: "14 nights · ≈ €999", primary "Check availability →", then the "Book direct via Lodgify →" link and the benefit line. The mobile bar itself does not change.
3. **Final CTA, valid state**, desktop and mobile: the same pair (primary button + direct link).
4. **"Two ways to book" block** in the Stay chapter, inside "Prices & free dates", under the table. Two equal columns or two Cards:
   - **Airbnb**: "Book with Airbnb's protection", ★ 5.0 reviews, free cancellation for an 11-night stay, pay on Airbnb. Action: "Check dates".
   - **Direct via Lodgify**: welcome pack (local wine and olive oil), book and pay on Lodgify (a holiday-rental booking platform, not our own system), talk to Eugene directly, 50% now / 50% five days before arrival. No cancellation row: Lodgify shows its own terms.
   - **No prices in either column.** The table above already shows the Airbnb prices.
5. **FAQ item, open:** "Can I book directly with you?" → "Yes. Pick your dates here, then choose Book direct. You pay 50% when booking and the rest five days before arrival, and you get a welcome pack with local wine and olive oil. Prefer Airbnb? The Check availability button takes you there with your dates."
6. **Component sheet addition:** the "Book direct →" link in default, hover, pressed, focus-visible and hidden-when-no-dates, plus the benefit line style.

## Copy rules

- Never compare prices or mention discounts, fees or commission.
- "Eugene" by name, as everywhere else on the page.
- Keep the benefit line to one line at 1440 and two lines at 390.

## Events (add as a note on the canvas)

- "Check availability →": `click_book_airbnb` + `LongStayIntent`, `channel=airbnb`.
- "Book direct →": `click_book_direct` + Meta `InitiateCheckout` + `LongStayIntent`, `channel=direct`.
- Same params for both: nights, guests, check_in, check_out, value, currency, locale, source.
- Every direct link carries `data-event="click_book_direct"` in the markup.

## Done when

All six artboards exist on Page 3, the direct option never looks like the main action, and no artboard contains a price comparison.
