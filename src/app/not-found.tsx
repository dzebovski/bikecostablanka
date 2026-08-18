import {ButtonLink} from "@/components/button-link";

export default function NotFound() {
  return (
    <main className="not-found page-shell" id="main-content">
      <p className="eyebrow">404 · Wrong turn</p>
      <h1>This road is not in the route book.</h1>
      <p>The page may have moved, or the route name may not be part of this first collection.</p>
      <div className="button-row">
        <ButtonLink href="/routes">Browse the routes</ButtonLink>
        <ButtonLink href="/" variant="text">Return home</ButtonLink>
      </div>
    </main>
  );
}
