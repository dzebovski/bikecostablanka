import { test } from "node:test";
import assert from "node:assert/strict";
import { directBookingBaseUrl, directBookingUrl } from "./direct.ts";

const stay = { checkIn: "2026-12-01", checkOut: "2026-12-15", guests: { adults: 2, children: 0, infants: 0, pets: false } };

test("no direct booking URL configured: nothing to render", () => {
  assert.equal(directBookingBaseUrl(undefined), null);
  assert.equal(directBookingBaseUrl("   "), null);
  assert.equal(directBookingUrl(stay, null), null);
});

test("configured URL is used as is, also when a stay is passed", () => {
  const base = directBookingBaseUrl(" https://example.lodgify.com/en/ ");
  assert.equal(base, "https://example.lodgify.com/en/");
  assert.equal(directBookingUrl(stay, base), "https://example.lodgify.com/en/");
});
