import type {Metadata} from "next";

import {EnquiryForm} from "@/components/enquiry-form";
import type {EnquiryInterest} from "@/types";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Try the Bike Costa Blanca prototype enquiry flow. No information is sent or stored.",
};

const interests: readonly EnquiryInterest[] = ["house", "winter", "cycling", "explore"];

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{interest?: string | string[]}>;
}) {
  const query = await searchParams;
  const candidate = Array.isArray(query.interest) ? query.interest[0] : query.interest;
  const defaultInterest = interests.includes(candidate as EnquiryInterest)
    ? (candidate as EnquiryInterest)
    : "house";

  return (
    <main id="main-content">
      <section className="enquire-hero page-shell">
        <div>
          <p className="eyebrow">Start the conversation</p>
          <h1>Tell us what a good winter would look like.</h1>
        </div>
        <div>
          <p>
            Dates, group shape and practical details are enough for a useful first enquiry. In this prototype, the form is entirely local.
          </p>
          <div className="prototype-notice" role="note">
            <span aria-hidden="true">i</span>
            <p><strong>Demonstration only.</strong> Your data will not be transmitted, emailed or saved.</p>
          </div>
        </div>
      </section>
      <section className="form-wrap page-shell">
        <EnquiryForm defaultInterest={defaultInterest} />
        <aside className="form-aside">
          <p className="eyebrow">Before you begin</p>
          <ul>
            <li>Minimum 15-night stay</li>
            <li>Two to five guests</li>
            <li>Demo pricing only</li>
            <li>No payment or availability calendar</li>
          </ul>
          <p>Exact house details and practical arrangements remain subject to direct confirmation.</p>
        </aside>
      </section>
    </main>
  );
}
