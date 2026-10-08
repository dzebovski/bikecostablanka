import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canCheckOut,
  dayInfo,
  estimateTotal,
  firstBookedAfter,
  fromOrd,
  isBooked,
  isIsoDate,
  nextFreeWindow,
  pick,
  selectionStatus,
  setGuests,
  toOrd,
  toOrdRanges,
  todayInMadrid,
  type Guests,
} from "./booking.ts";

// The 2026-10-08 snapshot: booked 28 Dec – 11 Jan and 24 Jan – 19 Mar (nights), `to` exclusive.
const booked = toOrdRanges([
  { from: "2027-01-24", to: "2027-03-20" },
  { from: "2026-12-28", to: "2027-01-12" },
]);
const today = toOrd("2026-10-08");
const d = toOrd;

test("ordinals round-trip", () => {
  assert.equal(fromOrd(d("2026-12-01")), "2026-12-01");
  assert.equal(d("2027-01-01") - d("2026-12-31"), 1);
  assert.equal(d("2027-03-28") - d("2027-03-27"), 1, "DST change does not shift days");
  assert.ok(isIsoDate("2026-12-01"));
  assert.ok(!isIsoDate("2026-02-30"));
  assert.ok(!isIsoDate("1 Dec"));
});

test("today is computed in Madrid", () => {
  // 23:30 UTC on 31 Dec is already 1 Jan in Madrid (UTC+1).
  assert.equal(fromOrd(todayInMadrid(new Date("2026-12-31T23:30:00Z"))), "2027-01-01");
  assert.equal(fromOrd(todayInMadrid(new Date("2026-07-15T21:59:00Z"))), "2026-07-15");
});

test("booked ranges are [from, to)", () => {
  assert.ok(isBooked(d("2026-12-28"), booked));
  assert.ok(isBooked(d("2027-01-11"), booked));
  assert.ok(!isBooked(d("2027-01-12"), booked));
  assert.ok(!isBooked(d("2026-12-27"), booked));
});

test("check-out on the first booked night is valid (1 Dec → 28 Dec)", () => {
  assert.ok(canCheckOut(d("2026-12-01"), d("2026-12-28"), booked));
  assert.equal(firstBookedAfter(d("2026-12-01"), booked), d("2026-12-28"));
  const info = dayInfo(d("2026-12-28"), { start: d("2026-12-01"), end: null }, today, booked);
  assert.ok(info.checkoutOnly && info.selectable && !info.booked);
});

test("minimum stay is 11 nights", () => {
  assert.ok(!canCheckOut(d("2026-12-01"), d("2026-12-11"), booked));
  assert.ok(canCheckOut(d("2026-12-01"), d("2026-12-12"), booked));
  const info = dayInfo(d("2026-12-05"), { start: d("2026-12-01"), end: null }, today, booked);
  assert.ok(info.short && !info.selectable);
});

test("days beyond the next booked night are unreachable", () => {
  const info = dayInfo(d("2026-12-29"), { start: d("2026-12-01"), end: null }, today, booked);
  assert.ok(!info.selectable);
  const later = dayInfo(d("2027-01-15"), { start: d("2026-12-01"), end: null }, today, booked);
  assert.ok(later.unreachable && !later.selectable);
});

test("past and booked days cannot be check-in", () => {
  assert.ok(!dayInfo(d("2026-10-07"), { start: null, end: null }, today, booked).selectable);
  assert.ok(!dayInfo(d("2026-12-30"), { start: null, end: null }, today, booked).selectable);
  assert.ok(dayInfo(d("2026-10-08"), { start: null, end: null }, today, booked).selectable);
});

test("pick: check-in, then check-out, then start over", () => {
  let sel = pick({ start: null, end: null }, d("2026-12-01"), today, booked);
  assert.deepEqual(sel, { start: d("2026-12-01"), end: null });
  assert.deepEqual(pick(sel, d("2026-12-05"), today, booked), sel, "too short is ignored");
  sel = pick(sel, d("2026-12-15"), today, booked);
  assert.deepEqual(sel, { start: d("2026-12-01"), end: d("2026-12-15") });
  sel = pick(sel, d("2026-12-03"), today, booked);
  assert.deepEqual(sel, { start: d("2026-12-03"), end: null });
  assert.deepEqual(pick(sel, d("2026-11-20"), today, booked), { start: d("2026-11-20"), end: null }, "earlier day restarts");
});

test("status: the six booking states", () => {
  assert.equal(selectionStatus({ start: null, end: null }, booked), "empty");
  assert.equal(selectionStatus({ start: d("2026-12-01"), end: null }, booked), "picking");
  assert.equal(selectionStatus({ start: d("2026-12-01"), end: d("2026-12-15") }, booked), "valid");
  assert.equal(selectionStatus({ start: d("2027-01-12"), end: d("2027-01-19") }, booked), "short");
  assert.equal(selectionStatus({ start: d("2026-12-20"), end: d("2027-01-03") }, booked), "conflict");
  // Calendar unavailable: no booked data, only the 11-night rule.
  assert.equal(selectionStatus({ start: d("2027-03-20"), end: d("2027-04-03") }, []), "valid");
});

test("next free window after a conflict is 12 Jan", () => {
  assert.equal(nextFreeWindow(d("2026-12-20"), today, booked, d("2027-12-31")), d("2027-01-12"));
  assert.equal(nextFreeWindow(d("2027-01-14"), today, booked, d("2027-12-31")), d("2027-03-20"));
});

test("price estimate by check-in month", () => {
  const rates = { "2026-12": 999 / 14, "2027-01": 1101 / 11, "2027-03": 105, "2027-04": 2848 / 28 };
  assert.equal(estimateTotal(d("2026-12-01"), 14, rates), 999);
  assert.equal(estimateTotal(d("2027-03-20"), 14, rates), 1470);
  assert.equal(estimateTotal(d("2027-05-01"), 14, rates), null);
});

test("guests: adults ≥ 1, adults + children ≤ 5, infants 0–5", () => {
  const g: Guests = { adults: 2, children: 0, infants: 0, pets: false };
  assert.equal(setGuests(g, { adults: 0 }).adults, 1);
  const full = setGuests(g, { adults: 4, children: 1 });
  assert.deepEqual(setGuests(full, { children: 2 }), full);
  assert.equal(setGuests(full, { infants: 3 }).infants, 3, "infants don't count");
  assert.equal(setGuests(g, { infants: 9 }).infants, 5);
});
