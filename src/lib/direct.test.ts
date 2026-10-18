import { test } from "node:test";
import assert from "node:assert/strict";
import { directBookingBaseUrl, directBookingUrl } from "./direct.ts";

const base = "https://bikecostablanka.lodgify.com/en/casa-adosada-3-hab-parking-35-banos";
const stay = { checkIn: "2026-12-01", checkOut: "2026-12-15", guests: { adults: 2, children: 1, infants: 0, pets: true } };

test("no direct booking URL configured: nothing to render", () => {
  assert.equal(directBookingBaseUrl(undefined), null);
  assert.equal(directBookingBaseUrl("   "), null);
  assert.equal(directBookingUrl(stay, null), null);
});

test("Lodgify URL carries dates (YYYYMMDD) and guests", () => {
  assert.equal(directBookingBaseUrl(` ${base} `), base);
  assert.equal(
    directBookingUrl(stay, base),
    `${base}?arrival=20261201&departure=20261215&adults=2&children=1&pets=1&infants=0`,
  );
});

test("parameters already in the base URL are replaced, not duplicated", () => {
  const url = new URL(directBookingUrl(stay, `${base}?adults=5&sort=price`)!);
  assert.equal(url.searchParams.getAll("adults").join(), "2");
  assert.equal(url.searchParams.get("sort"), "price");
});
