# Design prompt: Bike Costa Blanca landing page (mobile + desktop)

> For: Claude Design / an artifact. Paste everything below the line.
> Status of decisions: confirmed by the owner on 2026-10-08 (TASKS.md §4.2).

---

## Task

Design a high-fidelity, conversion-focused landing page for **Bike Costa Blanca**, a 3-bedroom townhouse in Ondara (Costa Blanca, Spain) let on Airbnb for stays of **11+ nights**, mainly to road cyclists and winter guests from Northern Europe.

Deliver **two artboards in one artifact**: **mobile (390 px wide)** and **desktop (1440 px wide)**, full page length, side by side or switchable. Show the interactive states listed under "Booking module".

The page should feel like an **Airbnb listing page**: information is systematic, scannable and dense. Facts come before mood. Keep it **compact**: no oversized empty sections, no full-screen hero with a slogan and nothing else. Every block must answer a question the guest has before booking.

## Design system

Use my design system **"Cabin Journal"**: https://claude.ai/artifact/L86s9zkwAQpujtyk35g2Mt. Read its README and tokens and follow them: colors (`paper`, `charcoal`, `pine`, `marigold`, `snow`, `morning-sky`, `ember`), type scale (light 300 headings, 400 body, negative tracking, flush left), radii (12/20/40/pill), no shadows, no icon set (typographic glyphs → ▾ ×).

**Approved deviations** (they override the design system):
1. **Compact spacing:** section gaps 48–64 px on desktop and 32–40 px on mobile instead of 96–120 px. Card padding 16–20 px.
2. **Sticky booking:** on desktop a sticky booking card in the right column; on mobile a sticky bottom bar.
3. **Sticky compact header** (56 px desktop, 52 px mobile) instead of the transparent non-sticky one.

Color roles for this page:
- `charcoal` fills the primary CTA.
- `marigold` is the surface of the date/guest picker inside the booking module. This is the one "shouting" surface per view.
- `pine` is for the wordmark and inline links only.

## Conversion logic

**Primary action:** pick dates and guests → "Check availability on Airbnb →". This opens Airbnb with the dates prefilled and fires our `LongStayIntent` event. It must be reachable from every scroll position: header button, sticky card or bar, and inline CTAs after the key sections.

**Secondary action:** "Message Eugene" via **WhatsApp** (primary) or **email**. Show it in the booking module (small, under the CTA), in the host block and in the FAQ.

Nothing else competes: no newsletter, no social feed widgets.

**Hierarchy principle (house first, like Airbnb):** what is it and what does it look like → what's inside → why here (the riding) → what it costs for a long stay → proof (reviews) → where it is → who the host is → remaining doubts (FAQ, things to know).

## Page structure

### 1. Header (sticky)
- Left: wordmark "Bike Costa Blanca" (text, `pine`, weight 300).
- Center (desktop only): anchor nav: Photos · Amenities · Rides · Prices · Reviews · Location · FAQ.
- Right: language toggle `EN ▾` (EN / UK / DE) and a small `charcoal` button "Check dates".
- Mobile: wordmark, language toggle, "Check dates". No burger menu needed; the anchor nav can be a horizontal scroll strip under the gallery.

### 2. Title block (above the gallery, like Airbnb)
- H1: **"Your winter cycling base on the Costa Blanca"**
- Meta line: `Ondara, Costa Blanca, Spain · ★ 5.0 (2 reviews) · 11-night minimum`
- One-line subhead: "A newly renovated townhouse with a private terrace. Ride the pro teams' climbs from the door."

### 3. Photo gallery
- Desktop: Airbnb pattern, 1 large photo on the left (50%) + 2×2 grid on the right, radius 20 px on the outer corners, button "Show all 30 photos" on top of the last tile.
- Mobile: full-width swipe carousel, 4:3, counter "1 / 30", edge to edge.
- Hero order: terrace-awning (large), bike-storage, dining-fireplace, bedroom-1-king, loft-room-bianchi.
- "Show all photos" opens a grid grouped by room: Terrace & courtyard · Living & kitchen · Bedrooms · Bathrooms · Bikes & loft room · Practical (laundry, parking, entrance).

### 4. Two-column body (desktop: content ~62%, booking card ~34%, sticky)

Left column, in this order:

**4a. Key facts row:** `Entire home · 5 guests · 3 bedrooms · 3 beds · 3.5 bathrooms`.

**4b. Highlights** (Airbnb "3 highlights" pattern: bold line + one gray sentence, no icons):
- **Ride from the door.** Coll de Rates, Vall d'Ebo and Bernia loops start at the house.
- **Built for long winter stays.** Fireplace, heating in every room, fibre Wi-Fi 302 Mbps, washer and dryer.
- **Self check-in.** Lockbox at the gate. Host replies within an hour.

**4c. About the house:** 3–4 lines of description, then "Show more ▾".

**4d. Where you'll sleep:** horizontal carousel of cards with photo, room name and bed type: Bedroom 1 (king, en-suite) · Bedroom 2 (king, en-suite) · Bedroom 3 (king) · Single room with desk · Loft room (private, lockable, own bathroom and kitchenette, restored 1970s Bianchi).

**4e. What this place offers:** 2-column list showing 10 items, cyclist-relevant first. Then a button "Show all 40+ amenities" opening a modal grouped as: For your bike · Warm in winter · Working · Kitchen & living · Getting settled. Items: Secure indoor bike storage · Washer and dryer · Wood-burning fireplace · Heating & A/C in every room · Fibre Wi-Fi 302 Mbps · Dedicated workspace · Room-darkening blinds · Bath · Private terrace with sun loungers · Private parking space (4–5 min walk).
→ inline CTA after this block: "Check dates →" (text link style).

**4f. Rides from the door** (the cycling differentiator, compact):
- 3 route cards in one row (desktop) or a horizontal scroll (mobile). Each card: photo 16:9, name, level chip, `75 km · 1,160 m`, 1-line description, "Open on Strava →".
  - Coll de Rates: Hard, 75 km, 1,160 m
  - Vall d'Ebo: Medium, 68 km, 870 m
  - Ondara–Bernia Loop: Medium, 77 km, 990 m
- A thin strip under the cards, on `morning-sky`: "Coll de Rates: Pogačar 11:57 · Your host 19:20 · You?"
- A 4-item fact row: "Pro teams train here Dec–Feb" · "17–21°C average highs Nov–Apr" · "Alicante & Valencia airports ~1 h" · "2 bike shops nearby (rental & service)".

**4g. Prices for long stays:**
- A small table, Airbnb-like: Stay length | Typical total | Per night. Example rows: "14 nights, December | ≈ €1,000 | ≈ €71" and "11 nights, March | ≈ €1,155 | ≈ €105". Footnote: "Live price on Airbnb. Weekly discount applied automatically. Electricity included for stays of a month or more (€3.33/night allowance)."
- Inline CTA: "See your exact price →".

**4h. Reviews:** "★ 5.0 · 2 reviews". Two review cards (name, month, 3-line excerpt, "Show more"). Note: "Rating summary appears after 3 reviews."

**4i. Location:** a map placeholder card (rounded 20 px), then a distances list in 2 columns: Restaurant & bar 2 min walk · Shops, market & bakery 5 min walk · La Marina shopping centre 5 min drive · Beach 7 min drive · Dénia 10 min · Alicante airport ~1 h · Valencia airport ~1 h 10. Below: "Not everyone rides?" with 4 compact chips/cards: Beaches & coves · Old towns (Altea, Calpe, Jávea) · Hiking (Montgó) · Markets & festivals.

**4j. Meet your host:** card with avatar placeholder, "Eugene", "Hosting since 2026 · Replies within an hour · Road cyclist", 2-line bio, buttons "Message on WhatsApp" (outlined charcoal) and "Email".

**4k. Good to know** (Airbnb "Things to know", 3 columns desktop / stacked mobile):
- **Stay rules:** 11-night minimum · registered guests only · pets allowed.
- **Getting here:** fly to ALC or VLC · car hire recommended · bike-box transfers available.
- **Local partners:** Maxima Bikes (Ondara) · Xabia's Bike (Dénia, Specialized) · transfer4u.es. Note: "We don't rent bikes or run tours."

**4l. FAQ:** accordion, 6–8 questions (minimum stay, how booking works, warm in winter, bike storage, rentals/tours, remote work, best season).

### 5. Final CTA band
Full-width `paper` block: H2 "Pick your dates", a one-line reminder ("11-night minimum · live price on Airbnb"), and the same booking form inline.

### 6. Footer
Compact: wordmark, Instagram · TikTok · Airbnb, language toggle, © line.

## Booking module

**Desktop sticky card** (right column, starts next to section 4a, `snow` card on `paper`, radius 20, 1 px `charcoal` hairline, no shadow):
- Price line: **"from ~€70"** `/ night`, with a small gray "on a 2-week winter stay, fees included".
- Date/guest block on a `marigold` surface (radius 12–20): Check-in | Check-out (two fields side by side), Guests ▾ below. Uppercase `label` style for field labels.
- After dates are chosen: "14 nights · ≈ €1,000 estimate" plus "Exact price on Airbnb".
- Primary button full width, `charcoal`: **"Check availability on Airbnb →"**.
- Under it: "You won't be charged yet. Booking is completed on Airbnb."
- Divider, then "Questions? **Message Eugene on WhatsApp**" (pine link).
- Trust row: "★ 5.0 · Weekly discount · Free cancellation".

**Mobile sticky bottom bar** (64–72 px, `snow`, top hairline): left "from ~€70 / night · 11+ nights", right a `charcoal` button "Check dates". It opens a **bottom sheet** with the same form as the desktop card.

**States to show** (on separate small frames or annotations):
1. Empty: no dates.
2. Valid: 14 nights selected, estimate shown, CTA active.
3. Error: 7 nights selected, inline message "The minimum stay is 11 nights", CTA disabled or showing the message.
4. Mobile bottom sheet open.

## Density and type rules
- Desktop container 1120–1200 px. Body column max ~720 px.
- H1 36–40 px (display). Section H2 = `heading` 28 px desktop / 22–24 px mobile. Card titles = `subheading` 18 px.
- Body 16 px, meta and secondary 14 px gray (charcoal at ~70% opacity is not allowed for small text; use the full charcoal or check 4.5:1).
- Separate sections with a 1 px hairline + 32–48 px gap (Airbnb style), not big empty bands.
- Above the fold on desktop: header, title block, full gallery and the top of the booking card.
- Above the fold on mobile: header, carousel, title, meta line and key facts; the bottom bar is always visible.
- Prices and dates use tabular numerals.

## Photos (all real, from the listing)
Base URL: `https://bikecostablanka.vercel.app/images/house/`

| File | What |
|---|---|
| terrace-awning.jpg | Roof terrace with awning, loungers and dining set (HERO) |
| terrace-dining.jpg | Terrace dining table |
| terrace-loungers.jpg, terrace-loungers-2.jpg | Sun loungers |
| terrace-glass-wall.jpg | Glass wall onto the terrace |
| courtyard.jpg, courtyard-through-glass.jpg | Private inner courtyard |
| living-room.jpg, living-room-tv.jpg | Living room with wooden beams, 65" TV |
| kitchen-island.jpg, kitchen.jpg | Kitchen with island |
| dining-fireplace.jpg, dining-table.jpg | Dining area with fireplace |
| bedroom-1-king.jpg, bedroom-2-king.jpg, bedroom-3.jpg | King bedrooms |
| bedroom-single-desk.jpg, workspace.jpg | Single room with desk / workspace |
| bathroom-1.jpg, bathroom-2.jpg, guest-wc.jpg | Bathrooms |
| bike-storage.jpg | Road bike on the wall rack inside the house |
| loft-room-bianchi.jpg, loft-room-sofa.jpg, bianchi-1970s.jpg | Private loft room with a restored 1970s Bianchi |
| laundry.jpg | Washer and dryer |
| parking-space-30.jpg | Private parking space No. 30 |
| facade.jpg, entrance-gate.jpg, staircase.jpg | Outside, gate with lockbox, terrazzo stairs |

Route photos: `https://bikecostablanka.vercel.app/images/coll-de-rates.jpeg`, `.../images/vall-debo.jpeg` (Bernia has none yet: use a neutral `paper`-tone placeholder with the route name).

## Copy
Use the English copy from the live page as the source: https://bikecostablanka.vercel.app/en (full text: https://github.com/dzebovski/bikecostablanka/blob/main/src/i18n/messages/en.json). Shorten it where the layout needs; keep facts and numbers exact. Don't invent amenities, prices or reviews.

## Handoff notes for development
- Mark every CTA with its event name in an annotation: `click_book_airbnb` / `LongStayIntent` (all "Check availability" buttons), `contact_host` with `channel=whatsapp|email`, `open_gallery`, `open_amenities`.
- Components to name consistently (they become React components): Header, TitleBlock, Gallery, KeyFacts, Highlights, SleepCards, Amenities, RouteCard, PriceTable, ReviewCard, LocationList, HostCard, ThingsToKnow, FAQ, BookingCard, MobileBookingBar, BookingSheet, Footer.
- Everything must work at 360 px without horizontal scroll (except intentional carousels).

## Acceptance checklist
- [ ] Mobile and desktop artboards, full length.
- [ ] Booking CTA visible at every scroll position.
- [ ] House facts and the gallery come before cycling content; cycling appears by the second scroll on desktop.
- [ ] No section has more empty space than content.
- [ ] Only design-system colors, type and radii (plus the 3 approved deviations).
- [ ] Booking states 1–4 shown.
- [ ] Text contrast at least 4.5:1.
