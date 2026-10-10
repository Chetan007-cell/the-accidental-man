import type { Metadata } from "next";
import Link from "next/link";
import { JournalFeed } from "@/components/journal-feed";
import { stories } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Journal — Notes on Becoming",
  description:
    "Flagship essays, field notes, and practical guidance on building and caring for a fuller life.",
  alternates: {
    canonical: "/journal",
  },
};

export default function JournalPage() {
  return (
    <main id="main" className="page-wrap journal-index-wrap">
      <header className="journal-header">
        <p className="eyebrow">THE ACCIDENTAL MAN / FIELD NOTES</p>
        <h1 className="page-title">
          Notes on
          <br />
          <em>becoming.</em>
        </h1>
        <p className="page-intro">
          A collection of essays, practical reflections, and field notes
          exploring what it means to become, maintain, and evolve into a
          grounded, intentional man.
        </p>
      </header>

      <JournalFeed stories={stories} />

      {/* Editorial Expansion Note */}
      <section className="journal-expansion-note">
        <div className="expansion-inner">
          <p className="eyebrow">CONTINUOUS WORK</p>
          <h3>Expanding across all nine pillars.</h3>
          <p>
            We are writing and publishing new field notes regularly. Future
            installments will cover deep explorations into physical health,
            daily grooming, personal style, financial independence, and
            relationship stewardship.
          </p>
          <Link href="/#newsletter" className="button button-light">
            Receive New Dispatches ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
