import { notFound } from "next/navigation";

/** Any unknown path under a locale renders the 404 inside the locale layout. */
export default function CatchAll() {
  notFound();
}
