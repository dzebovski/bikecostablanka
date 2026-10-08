---
name: Bike Costa Blanca
description: Calm, factual landing for a winter cycling house; paper and charcoal with one marigold picker.
colors:
  paper: "#f7f0e1"
  snow: "#ffffff"
  charcoal: "#23212c"
  line: "rgba(35, 33, 44, 0.16)"
  marigold: "#fcbd1c"
  pine: "#006434"
  morning-sky: "#a6dfff"
typography:
  h1:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.8px"
  h2:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  h3:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.06em"
  number:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 300
    lineHeight: 1
    fontFeature: "tnum, lnum"
rounded:
  photo: "20px"
  hero: "40px"
  button: "20px"
  pill: "99px"
  chip: "12px"
spacing:
  "4": "4px"
  "8": "8px"
  "16": "16px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
  "56": "56px"
  "96": "96px"
components:
  button-primary:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.snow}"
    rounded: "{rounded.button}"
    height: "48px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.button}"
    height: "48px"
  booking-bar:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.pill}"
    height: "72px"
    width: "960px"
  card:
    backgroundColor: "{colors.snow}"
    rounded: "{rounded.photo}"
    padding: "24px"
  chip:
    textColor: "{colors.charcoal}"
    rounded: "{rounded.chip}"
    height: "28px"
  popover:
    backgroundColor: "{colors.snow}"
    rounded: "{rounded.photo}"
---

## Overview
Airbnb's order with a quieter hand: facts first, then mood. Warm paper page, charcoal type in one family (Inter 300/400/500), photos with soft 20px corners, and exactly one loud colour, marigold, which always means "pick your dates". The owner refines in small steps; adding new devices (serif, dark bands, colour strips, odd corners, overlays) is out.

## Colors
Each colour has one role and only that role.
- **paper**: page background.
- **snow**: cards, popovers, modals, the message panel; the only full-width bands are Prices and the Final CTA card.
- **charcoal**: text, primary button, strong borders and the dividers in the booking bar.
- **line**: hairlines between sections inside a chapter and between rows.
- **marigold**: date and guest picker fields, the booking bar (desktop and mobile), selected dates.
- **pine**: wordmark and text links.
- **morning-sky**: the single "Free: …" note in Prices.

## Typography
One family, three weights. Light 300 for H1, H2 and big numbers; 400 for body; 500 for emphasis, labels and buttons. Labels are 12px uppercase +0.06em. Numbers in facts, prices and dates are tabular. Running text keeps to `--measure` (33em, at most 72 characters per line).

## Layout
- Container 1200px, side gutter 40px (20px below 768px). Desktop uses one 12-column grid with a 32px gutter (`.cols`, from 1024px): running text spans 7–8 columns and wraps at the measure, media and tables span 12, and the repeated split is 4 + 8 (key facts / highlights, Prices intro / table, rating / reviews, host card / good to know). Location splits 6 + 6.
- **Vertical scale** (tokens `--space-*`): 4, 8, 16, 24, 32, 48, 56, 96. No other vertical values between blocks.
- **Rhythm roles**: `--gap-head` 8 (heading → intro), `--gap-content` 24 (header → content, block → block), `--gap-section` 48 / 32 mobile (sections inside a chapter, hairline in the middle), `--gap-chapter` 96 / 56 mobile (chapters, space only).
- **Four chapters**: The house (title, gallery, facts and highlights, about, sleep, amenities) · Riding (rides and weather facts) · Stay (Prices band, reviews) · Practical (location, host and good to know, FAQ, Final CTA). Classes `.chapter`, `.stack`, `.sec`, `.sh`, `.band`.
- The page reserves `--bar-h` at the bottom so the booking bar never covers the footer.

## Elevation & Depth
Flat. No shadows and no gradients anywhere. Floating surfaces (popovers, message panel, cookie banner, amenities modal) separate from the page with snow plus a 1px charcoal border.

## Shapes
Photos and cards 20px; hero gallery outer corners 40px (mobile carousel 40 40 20 20); buttons 20px; pills 99px (booking bar, nav pills, round steppers); chips and inline messages 12px. Glyphs only: arrow, external arrow, caret, cross.

## Components
- **Booking bar** (desktop, 1024px and wider): fixed, centred, max 960px, 16px from the viewport edges, marigold pill 72px high. Check-in | Check-out | Guests (12px label, 16px medium value, charcoal dividers), a summary ("from €71 / night · 11+ nights · fees included", or "14 nights · ≈ €999 · exact price on Airbnb"), then one charcoal button with the shared labels. Appears after the title block (fade and 8px rise, 200ms; fade only with reduced motion); hides while the Final CTA is on screen, behind modals and while the cookie banner asks. Booking states show in a snow panel above it, not inside.
- **Popovers** (dates 720px, guests 360px): open upwards from the clicked field, inside the bar or the Final CTA; footer carries "You won't be charged yet" and the WhatsApp line.
- **Final CTA**: the place where the bar lands, the same pill at 88px with larger values.
- **Mobile bar** (below 1024px): the same marigold pill, 64px, 8px from the edges plus the safe area; price and "Check dates" open the two-step sheet.
- Primitives: Button (primary, secondary, text link), Chip, Card, PhotoTile, InfoRow, FactStat, SectionHeader, Accordion.

## Do's and Don'ts
- Do keep one label per action: "Check dates" always opens the picker; "Check availability →" appears only for a valid range and is the only way to Airbnb.
- Do take vertical spacing from the scale and the four roles; let space separate chapters and hairlines separate sections.
- Don't add colours, fonts, radii, shadows, gradients, icons, dark sections or new motion.
- Don't add a third snow band.
