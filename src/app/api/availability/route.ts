import { connection } from "next/server";
import { getBookedRanges, type Availability } from "@/lib/availability";

/** Booked nights only: `{ booked: [{ from, to }], checkedAt }` with `to` exclusive, or `{ booked: null }`. */
export async function GET() {
  await connection();
  let body: Availability;
  try {
    body = await getBookedRanges();
  } catch {
    // Never log the error: it can contain the secret feed URL.
    body = { booked: null };
  }
  return Response.json(body);
}
