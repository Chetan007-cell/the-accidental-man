import type { Metadata } from "next";
import Link from "next/link";
import { getStoriesForPillar, PILLARS } from "@/lib/pillars";
import { getBreadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Nine Pillars of Becoming — The Accidental Man",
  description:
    "Explore the nine interconnected pillars that shape a grounded, capable life: Mind, Emotions, Body, Spirit & Purpose, Grooming, Style, Career & Money, Relationships, and Life.",
  alternates: {
    canonical: "/pillars",
  },
};

export default function PillarsIndexPage() {
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", item: "/" },
    { name: "The 9 Pillars", item: "/pillars" },
  ]);

  return (
    <main id="main" className="page-wrap pillars-index-wrap">
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">The 9 Pillars</span>
      </nav>

      <header className="pillars-page-header">
        <p className="eyebrow">THE CONTENT UNIVERSE</p>
        <h1 className="page-title">
          The Nine Pillars
          <br />
          <em>of Becoming.</em>
        </h1>
        <p className="page-intro">
          A man isn’t built through a single checklist. We explore nine
          interconnected dimensions that shape a grounded, intentional life.
          Select any pillar to view all associated field notes and guides.
        </p>
      </header>

      <div className="pillars-page-grid">
        {PILLARS.map((pillar) => {
          const taggedStories = getStoriesForPillar(pillar.slug);
          const hasStories = taggedStories.length > 0;

          return (
            <article
              key={pillar.number}
              className={`pillar-directory-card ${
                hasStories ? "card-has-stories" : "card-expanding"
              }`}
            >
              <div className="pillar-header">
                <span className="pillar-num">{pillar.number}</span>
                <span className="pillar-badge">
                  {hasStories
                    ? `${taggedStories.length} ${
                        taggedStories.length === 1 ? "Essay" : "Essays"
                      } Active`
                    : "Expanding Soon"}
                </span>
              </div>

              <h2 className="pillar-name">
                <Link href={`/pillars/${pillar.slug}`}>{pillar.name}</Link>
              </h2>

              <p className="pillar-desc">{pillar.description}</p>
              <p className="pillar-summary-text">{pillar.summary}</p>

              <div className="pillar-card-actions">
                <Link
                  href={`/pillars/${pillar.slug}`}
                  className="button button-editorial button-sm"
                >
                  {hasStories
                    ? `View All ${pillar.name} Essays (${taggedStories.length}) →`
                    : `Explore ${pillar.name} →`}
                </Link>

                {pillar.highlightStorySlug && (
                  <Link
                    href={`/journal/${pillar.highlightStorySlug}`}
                    className="pillar-story-link"
                  >
                    <span className="story-arrow">↗</span>
                    <span className="story-label">
                      Read: {pillar.highlightStoryTitle}
                    </span>
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
