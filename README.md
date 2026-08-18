# Bike Costa Blanca prototype

A local Next.js 16 prototype for a premium long-stay house in Ondara, Marina Alta. It tests the information architecture, visual direction and enquiry journey without changing the existing Wix site.

## Included

- Home, house, winter, routes, explore, getting-here and enquiry pages.
- Three typed route pages with local imagery or a branded editorial placeholder.
- Local English content and a `next-intl` scaffold for future locales.
- A Zod-validated mock enquiry form that never sends or stores data.
- Static metadata with `noindex, nofollow` and a blocked `robots.txt`.
- Playwright smoke and responsive tests.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The build uses Next.js’s supported Webpack fallback because the current local sandbox blocks a Turbopack helper process. The application itself remains standard Next.js App Router.

## Prototype boundaries

There is no CMS, API route, Server Action, payment, CRM, availability calendar, analytics or data persistence. Demo pricing is visibly labelled, and unconfirmed house details remain TBC or are omitted.
