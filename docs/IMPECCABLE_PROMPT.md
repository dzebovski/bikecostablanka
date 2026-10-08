# Impeccable prompt: rhythm + sticky bottom booking bar

Open a new Claude Code session in `~/Documents/olekseenko/bikecostablanka` and paste everything under the line.

---

/impeccable layout the landing page `src/app/[lang]/page.tsx` (live: https://bikecostablanka.vercel.app/en)

## Context

- A conversion landing for an Airbnb townhouse in Ondara, Costa Blanca, for 11+ night winter stays by Northern European road cyclists. Mode: **Persuade**. Main conversion: pick ≥ 11 nights → "Check availability →" → Airbnb with dates (`LongStayIntent`).
- Facts: `docs/CONTEXT.md`. Decisions and history: `docs/PROJECT_SUMMARY.md`. Current tokens, components and booking rules: `docs/BUILD_PROMPT.md` (§2 tokens, §3 components, §6 booking logic, §7 events). Approved design: Claude Design canvas https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn, page "Page 2" (`V2-*` artboards).
- Code: sections in `src/components/landing/sections.tsx`; booking in `src/components/booking/` (`booking-context.tsx`, `booking-card.tsx`, `booking-fields.tsx`, `booking-sheet.tsx`, `date-picker.tsx`, `calendar.tsx`, `guest-picker.tsx`, `triggers.tsx`, `summary.ts`); rules in `src/lib/booking.ts` (has tests); tokens in `src/app/[lang]/globals.css`.
- If PRODUCT.md / DESIGN.md are missing, write them from these docs and the current code (`init` / `document`). **Do not ask me questions that the docs already answer.**

## This is a refinement, not a redesign

Keep the identity: one family (Inter 300/400/500), paper / snow / charcoal / marigold / pine / morning-sky with their roles, radii (photos 20, hero gallery 40, buttons 20, pills 99, chips 12), no shadows, no gradients, no icons beyond → ↗ ▾ ×, all copy and facts. The owner rejected an earlier pass that added serif type, a dark band, a blue strip, odd corners and overlays at once ("аляповато"). **Two changes only: the rhythm and the booking bar.** Anything else you would like to change goes into a list in your report, not into the code.

## Task 1. Booking: from the right column to a sticky bottom bar (like raus.life)

Look at https://www.raus.life (home and /locations/waldrand) at 1440 and 390 wide and copy the **behaviour** of its fixed booking bar at the bottom of the viewport, not its branding.

Desktop (≥ 1024px):
- Remove the sticky `BookingCard` from the right column. The bar is `position: fixed` at the bottom, centred, with a max width of about 960px and a 16px gap from the viewport edges. It is a marigold pill (marigold = the picker, so this keeps the colour rule).
- Contents left to right: `Check-in | Check-out | Guests` fields (12px uppercase labels, 16/500 values, hairline dividers in charcoal) → summary ("from €71 / night · 11+ nights" when empty, "14 nights · ≈ €999" when valid) → one charcoal primary button.
- The button follows the existing labels: "Check dates" (opens the picker) until the range is valid, then "Check availability →" (Airbnb + events). Disabled states keep "Choose 11+ nights" / "Choose free dates".
- The date popover and guest popover open **upwards** from the field that was clicked, anchored to the bar. The 6 booking states (empty, picking, valid, too short with "Extend to {date} →", conflict with "Show next free dates →", calendar unavailable) appear as a small message panel above the bar, not inside it. "You won't be charged yet…" and "Message Eugene on WhatsApp" move into the open popover footer.
- Show the bar after the visitor scrolls past the title block (fade + 8px rise, 200ms; reduced motion: fade only). Hide it while the Final CTA section is in view, the lightbox or amenities modal is open, or the cookie banner is showing (the banner sits in the same place; the bar appears after a choice).
- Add bottom padding to the page equal to the bar height, so the footer is never covered.
- The header "Check dates" and every in-page "Check dates" / "Check dates →" open the bar's date popover instead of scrolling to the card.

Mobile (< 1024px):
- Keep the existing `MobileBookingBar` (price + "Check dates") and the 2-step `BookingSheet`. Restyle the bar to match the desktop bar (same marigold, radius, inset 8px from the edges, safe-area padding), so desktop and mobile read as one component.

Keep all of `src/lib/booking.ts`, the iCal availability, the URL builder and every analytics event and its params unchanged. Booking state stays in one context shared by the bar, popovers, sheet and Final CTA. Add `source: "bottom_bar"` to the events fired from the bar.

## Task 2. Rhythm

What I measured on the live page at 1440px:
- Every section is the same: 48px top and bottom + a hairline. The page reads as one long list with no chapters.
- Heading-to-content gaps are inconsistent: 16px (About, FAQ), 24px (Sleep, Amenities), 51–74px (Rides, Location, Prices, Final CTA).
- The top cluster is squeezed: KeyFacts has 0/32px, Highlights 8/8px, then About jumps to 48px.
- Widths keep switching: a 720px column (house) → 1120px (Rides) → full-bleed snow band (Prices) → 1120px → a 720px FAQ inside a 1120px section.
- Reviews has no section heading (only the big "5.0 ★"), unlike every other section.
- With the card gone, the 720px column + empty right side no longer makes sense.

What to do:
- Group the page into 4 chapters with one shared rule: **the house** (title, gallery, facts, highlights, about, sleep, amenities), **riding** (rides, weather facts), **stay** (prices & free dates, reviews), **practical** (location, host + good to know, FAQ, final CTA). Larger space between chapters (for example 96px desktop / 56px mobile), the current 48 / 32 between sections inside a chapter. One vertical scale for the whole page, as tokens (for example 8 · 16 · 24 · 32 · 48 · 96); no one-off values.
- One SectionHeader rhythm everywhere: H2 → 8px → optional intro line → 24px → content. Reviews gets an H2 ("Reviews") with the 5.0 number inside the content.
- One content grid: 12 columns in the 1200px container. Text blocks span 7–8 columns, media and tables span 12. Use the space freed by the card (for example key facts + highlights side by side, or the amenities list in 3 columns), but keep the measure of running text ≤ 72 characters.
- Hairlines only between sections inside a chapter; chapters are separated by space only. At most 2 snow bands (Prices and the Final CTA card), as now.
- The Final CTA becomes the place where the bar "lands": same fields, larger, and the bar hides while it is visible.
- Mobile: the same chapters with 56 / 32px, 20px gutters, no horizontal scroll at 360px.

## Process

1. Work on a branch `refine-rhythm-bar`; never push to `main` (it deploys production).
2. Before editing, capture 1440 and 390 screenshots of the current live page. After the change, capture the same views plus: the bar empty, bar with popover open (upwards), each of the 6 states, the mobile sheet. One batched check, one round of fixes, stop.
3. `npm run lint`, `npm test` (booking rules), `npm run build` must pass. Push the branch and give me the Vercel preview URL.
4. Update `TASKS.md` (section 4.3 and the log).

## Report

- Before/after screenshots, the preview URL.
- The spacing tokens you introduced and where each one is used.
- Every deviation from the `V2-*` artboards (the bar is an approved one).
- Things you would change next but did not touch.
