# Prompt: Bike Costa Blanca landing page, version 2 (from scratch)

> For Claude Design (a new canvas). Paste everything below the line.
> Facts: [CONTEXT.md](CONTEXT.md). Why v2 exists: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) §4.

---

## 1. Task

Design a **new** conversion landing page for **Bike Costa Blanca**: an entire 3-bedroom townhouse in Ondara (Costa Blanca, Spain), let on Airbnb for stays of **11+ nights**, mainly to road cyclists and winter guests from Northern Europe.

One goal: the visitor picks dates (11+ nights) and continues to Airbnb. Second goal: the visitor messages the host.

Deliver one canvas with:
- **Desktop page** (1440 wide, fluid down to 1024) and **mobile page** (390 wide, works at 360), full length.
- **Overlays and states** as separate artboards (list in §8).
- A short **component sheet** showing each component once with its variants.

Start from a blank canvas. Do not reuse the previous canvas.

## 2. What the owner wants (and what failed before)

- **Like Airbnb:** systematic, scannable, compact. Facts before mood. Every block answers a question a guest has before booking. No big empty bands.
- **House first:** the photos and what's inside come first; cycling is the strongest reason to choose this house and comes right after.
- **Not flat, not loud:** the first version felt "all sand on one background". The second felt "busy and inconsistent". Aim between them: calm, with a few clear accents used the same way everywhere.
- The previous attempt failed because it added many devices at once: serif, a dark band, a yellow bottom bar, a blue strip, odd corners, overlay panels, an asymmetric grid, different card sizes. **Don't do that.** Follow the guardrails in §3 strictly.

## 3. Consistency guardrails (non-negotiable)

1. **One typeface family** from the design system (Neue Haas Unica / Inter). Hierarchy comes from size and weight contrast: big light headings (300), small medium labels (500), body 400. **Numbers are the accent:** prices, km, metres climbed, nights and the rating are set larger, in tabular figures, always in the same style.
2. **Color roles, used the same way everywhere:**
   - `paper`: page background.
   - `snow`: raised surfaces (cards, booking card, modals, a section band at most twice per page).
   - `charcoal`: text, hairlines, the primary button.
   - `marigold`: **only** the date/guest picker surface and the selected dates in the calendar. Nothing else is yellow.
   - `pine`: wordmark and inline text links only.
   - `morning-sky`: at most one small informational surface (e.g. the "free dates" note), or none.
   - No dark section.
3. **Radii:** photos 20px everywhere. Exceptions: the hero gallery uses `radius-hero` 40 on its outer corners only, and the mobile hero photo uses 40. Buttons 20, pills 99, chips 12.
4. **At most 8 component types** for the page body: SectionHeader, PhotoTile, InfoRow (label + value), FactStat (big number + label), Card, Button (primary / secondary / text link →), Chip, Accordion. Everything is built from these.
5. **One spacing rhythm:** sections 48px apart on desktop and 32px on mobile, separated by a 1px hairline (Airbnb style). Inside sections 16/24px. Container 1200px; body column 720px.
6. **One label per action:** "Check availability →" always means go to Airbnb with dates; "Check dates" always opens the date picker. Strava links are plain text links with ↗, never buttons.
7. **No decoration:** no shadows (design-system rule), no gradients, no icons beyond the → ↗ ▾ × glyphs, no emoji, no stock or illustration.

## 4. Design system

Use **"Cabin Journal"**: https://claude.ai/artifact/L86s9zkwAQpujtyk35g2Mt (read its README and tokens). Approved deviations, and only these:
- a **sticky compact header** (56px desktop, 52px mobile);
- a **sticky booking card** on desktop and a **sticky bottom bar** on mobile;
- **compact spacing** (§3.5) instead of 96–120px between sections.

## 5. Page structure: desktop

```
Header (sticky)
Title block
Gallery (1 large + 4)
┌──────────── body column (≈62%) ────────────┐ ┌─ Booking card (sticky) ─┐
│ Key facts row                                │ │                          │
│ Highlights (3)                               │ │                          │
│ About the house                              │ │                          │
│ Where you'll sleep (5 rooms)                 │ │                          │
│ What this place offers (10 + modal)          │ │                          │
└──────────────────────────────────────────────┘ └──────────────────────────┘
Rides from the door (full container width)
Prices & free dates
Reviews
Location
Host + Good to know
FAQ
Final CTA
Footer
```

### 5.1 Header
Wordmark "Bike Costa Blanca" (pine, light). Anchor nav: Photos · The house · Rides · Prices · Reviews · Location · FAQ. Language `EN ▾` (EN / UK / DE). Primary small button "Check dates". After scrolling past the gallery, the nav highlights the current section.

### 5.2 Title block
- H1: **Your winter cycling base on the Costa Blanca**
- Meta: `Ondara, Costa Blanca, Spain · ★ 5.0 (2 reviews) · 11-night minimum · Free cancellation`

### 5.3 Gallery
1 large (50%) + 2×2, 8px gaps, outer corners 40px. "Show all 30 photos" (secondary button on the last tile). Each tile opens the lightbox at that photo.
Order: terrace-awning (large), bike-storage, dining-fireplace, bedroom-1-king, loft-room-bianchi.

### 5.4 Key facts row
FactStat ×4: **5** guests · **3** bedrooms · **3.5** bathrooms · **302** Mbps Wi-Fi.

### 5.5 Highlights (3 InfoRows, Airbnb style)
- **Ride from the door.** Coll de Rates, Vall d'Ebo and Bernia loops start at the house.
- **Warm for winter.** Wood-burning fireplace and heating in every room.
- **Self check-in.** Lockbox at the gate; the host replies within an hour.

### 5.6 About the house
4 lines + "Show more ▾" (expands inline). Text: newly renovated, own front door, two floors, terrace and courtyard, set up for living for weeks.

### 5.7 Where you'll sleep
Horizontal row of 5 Cards (photo 4:3 + name + beds), arrows on desktop, swipe on mobile: Bedroom 1 (king, en-suite) · Bedroom 2 (king, en-suite) · Bedroom 3 (king) · Single room (single, desk) · Loft room (private, lockable, own bathroom and kitchenette, restored 1970s Bianchi).

### 5.8 What this place offers
10 InfoRows in 2 columns, cyclist-relevant first: Secure indoor bike storage · Washer and dryer · Wood-burning fireplace · Heating & A/C in every room · Fibre Wi-Fi 302 Mbps · Dedicated workspace · Room-darkening blinds · Bath · Roof terrace with sun loungers · Own parking space (4–5 min walk). Button "Show all 40+ amenities" → modal. Text link "Check dates →".

### 5.9 Rides from the door (the cycling section)
SectionHeader + one line: "Three classic loops. Every route starts at the front door."
3 route Cards in a row: photo 16:10, name, level Chip (Hard / Medium), FactStats **75 km · 1,160 m**, one sentence, "Route on Strava ↗".
- Coll de Rates: Hard, 75 km, 1,160 m
- Vall d'Ebo: Medium, 68 km, 870 m
- Ondara–Bernia Loop: Medium, 77 km, 990 m (no photo yet: neutral `snow` placeholder with the route name)

Below: one row of 4 FactStats: **Dec–Feb** pro teams train here · **17–21°C** average highs Nov–Apr · **~1 h** from Alicante or Valencia · **11:57 / 19:20** Coll de Rates, Pogačar vs your host.
Optional media slot: the vertical clip `video-group-ride-quiet-road-17s.mp4` as a muted looping PhotoTile in the row (same size and radius as a route photo). Leave it out if it breaks the grid.

### 5.10 Prices & free dates
`snow` band. Left: SectionHeader + "Winter 2026/27, two guests, Airbnb fees included" + primary button "See your exact price" (opens the date picker). Right: a table:

| Month | Free dates | Per night | Example |
|---|---|---|---|
| December | 1–27 Dec | €71 | 14 nights · €999 |
| January | 12–23 Jan | €100 | 11 nights · €1,101 |
| February | Fully booked (Chip) | — | — |
| March | from 20 Mar | €105 | 11 nights · €1,155 |
| April | open | €102 | 28 nights · €2,848 (monthly −20%) |

Footnote: "Prices checked on Airbnb on 8 Oct 2026 and may change. Weekly and monthly discounts apply automatically. Stays of a month or more include electricity up to €3.33 a night."

### 5.11 Reviews
Big **5.0 ★** FactStat + "2 reviews". Two review Cards: quote (3 lines, "Show more"), name, month.
- Anja, September 2026: "Everything is high-quality and well-maintained, and you feel at home right away."
- Maya, August 2026: "Check in was easy and the place was clean, well organised and well equipped."
No placeholder cards and no dev notes.

### 5.12 Location
Map placeholder (photo radius 20) + InfoRows: Restaurant & bar 2 min walk · Shops, market & bakery 5 min walk · La Marina shopping centre 5 min drive · Beach 7 min drive · Dénia 10 min · Alicante airport ~1 h · Valencia airport ~1 h 10.
Then "Not everyone rides?": 4 Chips or short Cards: Beaches & coves · Old towns (Altea, Calpe, Jávea) · Hiking (Montgó) · Markets & festivals.

### 5.13 Host + Good to know
Host Card: avatar placeholder, **Eugene**, "Hosting since 2026 · Replies within an hour · Road cyclist", 2-line bio, secondary button "Message on WhatsApp", text link "Email".
Good to know, 3 columns of InfoRows:
- Stay rules: 11-night minimum · up to 5 guests (infants don't count) · pets allowed · free cancellation
- Getting here: fly to Alicante or Valencia · car hire recommended · bike-box transfers available
- Local partners: Maxima Bikes (Ondara) · Xabia's Bike (Dénia, Specialized) · transfer4u.es · "We don't rent bikes or run tours."

### 5.14 FAQ
Accordion, 7 questions: minimum stay · how booking works · warm in winter · where to keep the bike · bike rental or guided rides · remote work · best time for cycling. Plus "Anything else? Message Eugene".

### 5.15 Final CTA
`snow` card: H2 "Pick your dates", one line "11-night minimum · free 1–27 Dec, 12–23 Jan and from 20 Mar", then the same date/guest picker as the booking card (marigold) + "Check availability →".

### 5.16 Footer
Wordmark, Instagram · TikTok · Airbnb, language toggle, ©.

## 6. Booking card (desktop, sticky in the right column)
- Price: **from €71** / night (FactStat), sub-line "11+ nights · fees included".
- Marigold picker: Check-in | Check-out side by side, Guests below (uppercase labels, values 16px/500).
- After dates: "14 nights · ≈ €999" + "exact price on Airbnb".
- Primary full-width button "Check availability →".
- "You won't be charged yet. Booking is completed on Airbnb."
- Hairline, then "Questions? Message Eugene on WhatsApp" (link) and "★ 5.0 · Weekly discount · Free cancellation".

## 7. Mobile (390)
- Header: wordmark, `EN ▾`. No nav menu; an anchor strip (Photos · House · Rides · Prices · Reviews · FAQ) scrolls horizontally under the title block.
- Gallery: full-width swipe carousel 4:3, radius 40 on the top corners, counter "1 / 30", tap opens the lightbox.
- Same section order as desktop, single column; rows of cards (rooms, routes, reviews) become swipe rows with the next card peeking.
- Prices table becomes a list of month rows (month + free dates on the left, per-night price on the right, example below).
- **Sticky bottom bar** (snow, top hairline, 64–72px): "from €71 / night · 11+ nights" + primary "Check dates". It opens the booking sheet.
- Above the fold: header, carousel, title, meta line, key facts, bottom bar.

## 8. Overlays and states (separate artboards)

**Booking (desktop card and mobile sheet), each state:**
1. Empty: no dates; button "Check dates" opens the picker.
2. Picking: check-in chosen, waiting for check-out; hover preview of the range.
3. Valid: 14 nights, estimate shown, button "Check availability →".
4. Too short: 7 nights; inline message "The minimum stay is 11 nights. You picked 7." + one-tap fix "Extend to {date} →"; button disabled with the label "Choose 11+ nights".
5. Conflict with booked dates: range crosses a booked night; message "Some of these nights are booked." + "Show next free dates →".
6. Calendar unavailable (iCal feed down): picker works without booked dates; small note "Final availability is checked on Airbnb."

**Date picker:**
- Desktop popover under the fields: 2 months, ← → navigation, today marked, booked nights struck through and not selectable, days that would make a stay shorter than 11 nights muted after a check-in is chosen, selected range in marigold, "Clear dates" and "Close".
- Mobile full-height sheet: months stacked vertically (Nov–May), sticky summary at the bottom ("14 nights · ≈ €999" + "Next: guests"), then a guests step and "Check availability →".

**Guests picker:** stepper for Adults, Children, Infants (don't count), Pets toggle; max 5 guests; the + button disables at the limit with a hint.

**Gallery:** "All photos" page grouped by room (Terrace & courtyard · Living & kitchen · Bedrooms · Bathrooms · Bikes & loft room · Practical) and a lightbox (desktop: photo, ← →, counter, caption with room; mobile: full-screen swipe, swipe down to close).

**Amenities modal:** all amenities grouped (For your bike · Warm in winter · Working · Kitchen & living · Getting settled), close ×, footer "Check dates".

**Other:** FAQ item open and closed; header before/after scroll (active section); language menu open; cookie consent banner (bottom, "Accept" / "Only necessary", the necessary-only option equally prominent); a 404 page with "Back to the house".

**Interaction states** for Button, text link, PhotoTile, InfoRow-as-link, Chip, Accordion and calendar day: default, hover (desktop), pressed, focus-visible (2px charcoal ring), disabled.

## 9. Motion (short, consistent)
Ease-out `cubic-bezier(.23,1,.32,1)`. Popovers 200ms in, 140ms out (fade + 6px). Mobile sheet 400ms in, 240ms out. Lightbox fade 200ms. Buttons scale .97 on press. Messages fade in, never shake. `prefers-reduced-motion`: fades only.

## 10. Photos and media
Base URL: `https://bikecostablanka.vercel.app/images/house/` (30 files, names in CONTEXT.md: terrace-awning, terrace-dining, terrace-loungers, terrace-loungers-2, terrace-glass-wall, courtyard, courtyard-through-glass, living-room, living-room-tv, kitchen-island, kitchen, dining-fireplace, dining-table, bedroom-1-king, bedroom-2-king, bedroom-3, bedroom-single-desk, workspace, bathroom-1, bathroom-2, guest-wc, bike-storage, loft-room-bianchi, loft-room-sofa, bianchi-1970s, laundry, parking-space-30, facade, entrance-gate, staircase).
Routes: `https://bikecostablanka.vercel.app/images/coll-de-rates.jpeg`, `…/images/vall-debo.jpeg`.
Owner's media (vertical clips and photos, see CONTEXT §Media) can be uploaded to the canvas if a slot needs them; the January photo "riding in shorts" is good proof for the weather row.

## 11. Copy rules
English, sentence case, calm and factual, "you" for the guest, first person for the host. Facts and numbers exactly as in CONTEXT.md. Don't invent amenities, prices, reviews or distances. Missing items become a visible placeholder like [WHATSAPP NUMBER].

## 12. Handoff for development
- Every block carries `data-component` with its name; every CTA carries `data-event`: `click_book_airbnb` + `LongStayIntent` (Check availability), `open_date_picker`, `contact_host` (`channel=whatsapp|email`), `open_gallery`, `open_amenities`.
- Component names: Header, TitleBlock, Gallery, KeyFacts, Highlights, About, SleepCards, Amenities, Rides, RouteCard, PriceTable, Reviews, ReviewCard, Location, HostCard, ThingsToKnow, FAQ, FinalCTA, BookingCard, MobileBookingBar, BookingSheet, DatePicker, GuestPicker, Lightbox, AllPhotos, AmenitiesModal, CookieBanner, Footer.
- Accessibility: real buttons, links and labelled inputs; touch targets ≥ 44px; text contrast ≥ 4.5:1; focus visible; the calendar is keyboard-navigable (arrows, Enter, Esc).

## 13. Acceptance checklist
- [ ] Desktop and mobile pages, full length, plus every artboard in §8.
- [ ] A booking action is visible at every scroll position.
- [ ] Gallery and house facts come before the rides; rides appear by the second screen on desktop.
- [ ] Only the colors, radii and components allowed in §3; marigold only on the picker.
- [ ] One price story (from €71 + the month table); no conflicting numbers.
- [ ] No placeholders in reviews; every fact matches CONTEXT.md.
- [ ] Sections 48px apart (desktop) / 32px (mobile); nothing feels empty.
- [ ] Contrast ≥ 4.5:1, touch targets ≥ 44px.
