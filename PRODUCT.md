# Product

Written on 2026-10-08 from `docs/CONTEXT.md`, `docs/PROJECT_SUMMARY.md`, `docs/BUILD_PROMPT.md` and the code, without an interview (the owner asked for it this way). Facts live in `docs/CONTEXT.md`; this file only records what future design work must preserve.

## What it is
A one-page conversion landing for one Airbnb townhouse in Ondara (Marina Alta, Costa Blanca, Spain), sold as a winter base for road cyclists. Entire home, 5 guests, 3 bedrooms, 3.5 bathrooms, indoor bike storage, rides start at the door.

## Who it is for
Road cyclists and people who winter in the sun, from Northern Europe (first wave: UK and IE, the Nordics, Benelux; second wave: DACH in German). They come from paid Meta and Google ads, compare with other houses and decide on facts first, then mood.

## The job of the page
Fill the house in the shoulder season (November to April) with stays of **11 nights or more**.

- Main conversion: the visitor picks 11+ nights, presses **Check availability →** and goes to Airbnb with dates and guests prefilled (`LongStayIntent`, plus `click_book_airbnb` / Meta `InitiateCheckout`).
- Second action: message the host (WhatsApp or email, `contact_host`).
- Booking itself happens on Airbnb. The page never takes payment.

## Durable constraints
- Minimum stay 11 nights; prices are Airbnb prices (dynamic), shown as a dated snapshot in `src/data/prices.ts`.
- Availability comes from the Airbnb iCal feed through `/api/availability`; the feed URL is a secret.
- Booking rules (`src/lib/booking.ts`), the Airbnb URL builder (`src/lib/airbnb.ts`) and the analytics events with their params are the money path: change them only on purpose.
- Consent first: no tags or non-necessary cookies before a choice (Google Consent Mode v2).
- Languages: English now, then Ukrainian and German through the same dictionaries (`src/i18n`).
- Copy and facts come from `docs/CONTEXT.md` and the dictionary; never invent reviews, prices or claims.

## The owner's working style
- Wants Airbnb-like order and calm: facts, then mood; compact, no empty filler.
- Refines in many small, reversible steps. Rejects passes that add several new visual devices at once (serif type, dark bands, extra colour strips, odd corners, overlays were all rejected together).
- `main` deploys production; work happens on branches with Vercel previews.

## Platform
web (Next.js 16 App Router on Vercel), mobile first for ad traffic, desktop at 1440.

## Open
- Host photo, WhatsApp number and email (env), Bernia route photo, map tile, final AEMET temperature figures.
