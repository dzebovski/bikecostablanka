# Context: Bike Costa Blanca

Single source of facts for people and AI agents. Collected from the owner, the Airbnb listing, the old site bikecostablanca.com and the earlier prototype (old.zip).
Last update: 2026-10-08. Items marked ⚠️ still need the owner's confirmation before they go on a page.

## Links
| What | Where |
|---|---|
| Airbnb listing | https://www.airbnb.com/rooms/1692875983935079214 |
| Direct booking (Lodgify) | https://bikecostablanka.lodgify.com/ |
| Old site | https://www.bikecostablanka.com |
| Instagram / TikTok | https://www.instagram.com/bikecostablanca/ · https://www.tiktok.com/@bikecostablanca |
| Repo | https://github.com/dzebovski/bikecostablanka |
| Live site (temporary) | https://bikecostablanka.vercel.app |
| Design system "Cabin Journal" (from raus.life) | https://claude.ai/artifact/L86s9zkwAQpujtyk35g2Mt |
| Design canvas (v1–v9 accepted, v10–12 rejected) | https://claude.ai/artifact/8UvkEJrYN93wv68mC6zvfn |
| Style reference | https://www.raus.life (home + /locations/waldrand) |
| Project summary & decisions | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| Prompt for the new landing | [LANDING_PROMPT_V2.md](LANDING_PROMPT_V2.md) |
| Task tracker | [../TASKS.md](../TASKS.md) |

## The house
- Ondara, Marina Alta, Costa Blanca, Spain (near Dénia). Registration: Valencia region, exempt (seasonal rental).
- Airbnb title: "Townhouse•Private Terrace". Entire home, private entrance, no shared areas. Newly renovated, two floors, terrazzo staircase.
- 5 guests · 3 bedrooms · 3 beds · 3.5 bathrooms (3 full bathrooms incl. 2 en-suite + guest WC).
- Rooms: Bedroom 1 king, en-suite · Bedroom 2 king, en-suite · Bedroom 3 king · single room with desk and office chair · **loft room**: private, lockable, two-level, own bathroom, A/C and kitchenette with fridge, glass railing, a restored **1970s Bianchi** on the wall (Airbnb calls it a "theme room").
- Outdoor: large roof terrace with awning, sun loungers, dining set, cacti; private inner courtyard with table, visible from the dining area; floor-to-ceiling glass walls onto both.
- Winter comfort: wood-burning fireplace in the dining area, split heating + A/C in every room, electric underfloor heating and heated towel rail in a bathroom, bath, room-darkening blinds, quality bed linen, extra pillows and blankets.
- Work: fibre Wi-Fi **302 Mbps** (speed-tested by Airbnb), dedicated workspace.
- Kitchen & living: island with seating for three, oven, microwave, dishwasher, Liebherr fridge, freezer, kettle, filter coffee maker, drinking water filter, dining for five, living room with wooden beams, 65" TV, record player, Bluetooth speaker.
- Bikes: secure indoor bike storage (wall rack in the hallway), separate laundry room with washer, tumble dryer and water heater.
- Practical: self check-in, lockbox behind the gate under the BikeCostaBlanca sign; parking space **No. 30** in an underground car park ~350 m / 4–5 min walk (you can stop outside the house to unload); pets allowed.
- ⚠️ The Airbnb amenities list says "parking on premises" while the description says 350 m away: align on Airbnb.
- ⚠️ Airbnb shows smoke alarm, CO alarm and "Essentials" as unavailable: fix on Airbnb.

## Stay rules and prices
- **Minimum stay: 11 nights** (owner, 2026-10-08).
- **Prices = Airbnb prices** (dynamic). Weekly and monthly discounts on. Free cancellation shows for an 11-night stay.
- Up to 5 guests; infants don't count (Airbnb rule); pets allowed; only registered guests.
- Stays of 1 month+: electricity included up to €3.33/night, then €0.30/kWh (i-DE smart meter), paid by bank transfer after check-out.
- Lodgify direct booking: up to 5% cheaper than Airbnb + complimentary local welcome pack (old site). ⚠️ Not used on the landing so far.

### Price & availability snapshot (2026-10-08, EUR, 2 guests, all fees)
| Dates | Nights | Total | Per night |
|---|---|---|---|
| 1–12 Dec 2026 | 11 | €785 | ≈ €71 |
| 1–15 Dec 2026 | 14 | €999 (weekly discount, was €1,218) | ≈ €71 |
| 12–23 Jan 2027 | 11 | €1,101 | ≈ €100 |
| Feb 2027 | — | fully booked | — |
| 20–31 Mar 2027 | 11 | €1,155 | ≈ €105 |
| 20 Mar – 3 Apr 2027 | 14 | €1,470 | ≈ €105 |
| 1–29 Apr 2027 | 28 | €2,848 (monthly discount, was €3,584, −20%) | ≈ €102 |

Booked: 28 Dec – 11 Jan, 24 Jan – 19 Mar. Free: 1–27 Dec, 12–23 Jan, from 20 Mar.
Live availability: Airbnb iCal feed in Vercel env `AIRBNB_ICAL_URL` (Production, secret; never commit or print it).

## Reviews (Airbnb, 5.0 from 2; rating summary appears after 3)
- **Anja**, September 2026, 11 years on Airbnb: newly renovated, tasteful, high quality, felt at home right away, loved the roof terrace and the location, very responsive host. Short quote: "Everything is high-quality and well-maintained, and you feel at home right away."
- **Maya**, August 2026, 10 years on Airbnb: easy check-in, clean, well organised and equipped, A/C in each room, terrace with sun beds; restaurant/bar/ice cream 2 min away with live music on Fridays; shops, markets and a bakery (Pastelería Victoria) ~5 min walk; uncrowded beach ~7 min drive. Short quote: "Check in was easy and the place was clean, well organised and well equipped."

## Host
- Eugene ("Eugene BikeCostaBlanca" on Airbnb), hosting since July 2026, 100% response rate, replies within an hour.
- Road cyclist who rides these roads; Coll de Rates Strava PB **19:20** (Tadej Pogačar: **11:57**).
- ⚠️ WhatsApp number and email for "Message Eugene" not provided yet. ⚠️ Host photo and short story.

## What we do NOT offer
No bike rental, no repairs, no guiding, no tour packages. We give routes, practical info and local recommendations, and point to partners.

## Routes from the door (Strava)
| Route | km | m climbing | Level | Strava |
|---|---|---|---|---|
| Coll de Rates | 75 | 1,160 | Hard | https://www.strava.com/routes/3514697316111501132 |
| Ondara–Bernia Loop | 77 | 990 | Medium | https://www.strava.com/routes/3514958094482175874 |
| Vall d'Ebo | 68 | 870 | Medium | https://www.strava.com/routes/3514701466186284876 |

- Coll de Rates: smooth roads, steady ascent, the region's signature climb and pro-team benchmark.
- Bernia: views over Calpe and the Peñón de Ifach; technical descent with steep sections and tight hairpins.
- Vall d'Ebo: through the Pego valley, quiet inland roads, a balanced climbing day.
- Old site also has MTB/gravel routes and cycling cafés (not extracted). ⚠️ No photo for Bernia yet.

## Region, seasons, getting here
- Airports: Alicante (ALC) ~104 km, Valencia (VLC) ~111 km, almost all on the AP-7 (~1 h – 1 h 10).
- Dénia ~10 min, beach ~7 min, La Marina shopping centre (cinema, big supermarket) 5 min drive.
- Dec–Feb: WorldTour teams train locally; mild sunny days; almond blossom Jan–Feb; Three Kings (Jan), carnival in Pego (Feb).
- Mar–Apr: orange blossom; Fallas in Dénia (March). Sep–Nov: warm, quiet. Jun–Sep: summer, Moors & Christians.
- Average daytime highs ~17–21°C Nov–Apr (Alicante climate data). ⚠️ Replace with AEMET monthly figures.
- For non-riders: beaches and coves (Dénia, Jávea), old towns (Altea, Calpe, Alcalalí), hiking (Montgó), markets, valley villages.

## Partners
- **Maxima Bikes**, Ondara: servicing, bike and e-bike rental, parts, accessories, nutrition.
- **Xabia's Bike**, Dénia: workshop, rental, official Specialized dealer and service centre, 25+ years.
- **transfer4u.es**: airport transfers with bike boxes.
- Car hire: SIXT (comfort), Record Go (budget), at ALC or VLC.

## Audience and marketing
- Northern Europe, road cyclists 35–70, stays of 2+ weeks in the off-season (Nov–Apr). Segments: winter base training, couples/friends where not everyone rides, 55+ winterers, remote workers who ride, triathletes.
- Main message: "A great cycling base, even if not everyone in your group rides."
- Ad wave 1 (English): UK + IE · Nordics (NO, SE, DK, FI) · Benelux (NL, BE). Wave 2: DACH with a German version. Languages: EN main, UK backup, DE third.
- Conversion: `LongStayIntent` when a visitor picks ≥ 11 nights and goes to Airbnb (params: nights, guests, check_in, check_out, value, currency, locale).
- Sell the real free windows: December, 12–23 Jan, from 20 March, April–May monthly.

## Media
- Listing photos (30 picked of 56): `public/images/house/*.jpg` (served at https://bikecostablanka.vercel.app/images/house/…). All 56 originals: `../photos/airbnb/` (outside the repo).
- Route photos: `public/images/coll-de-rates.jpeg`, `public/images/vall-debo.jpeg`.
- Owner's WhatsApp media: [reference/media/](reference/media/)
  - `video-local-life-harvest-tractor-roads-21s.mp4`: grape-harvest tractor on a country road, then an empty road with a red bike lane (local life, quiet roads).
  - `video-cycling-cafe-terrace-bikes-5s.mp4`: café terrace under parasols, road bikes on the rack, mountains behind (café stop).
  - `video-group-ride-quiet-road-17s.mp4`: riders on a wide quiet road with mountains, blue sky (best hero/ads clip).
  - `video-group-ride-pine-road-4s.mp4`: group ride through pines, selfie-style (social proof / reels).
  - `photo-january-2025-ride-in-shorts.jpg`: rider in short sleeves and shorts, January 2025 (proof of winter weather).
  - `photo-loft-room-bianchi.jpg`: the loft room with the restored Bianchi.
  - `photo-cafe-velosol-cake-cyclist.jpg`: cake at café Velosol with a cyclist stencil in icing sugar.
- All videos are vertical (576×1024 after rotation), 4–21 s, WhatsApp quality: fine for reels, stories and a muted mobile loop, not for a wide desktop hero.
