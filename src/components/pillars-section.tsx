import Link from "next/link";
import { getStoriesForPillar, PILLARS } from "@/lib/pillars";

export function PillarsSection() {
  return (
    <section className="pillars-section section-wrap" id="pillars">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE CONTENT UNIVERSE</p>
          <h2>The Nine Pillars of Becoming</h2>
        </div>
        <div className="pillars-meta-note">
          <Link href="/pillars" className="pillars-all-link">
            <span>Explore All 9 Pillars Index →</span>
          </Link>
        </div>
      </div>

      <p className="pillars-intro">
        A man isn’t built through one narrow checklist. We explore nine
        interconnected dimensions that shape a grounded, capable life—publishing
        deep-dive field notes today, and expanding into practical guides,
        toolkits, and audio conversations. Click any pillar to explore all
        tagged field notes.
      </p>

      <div className="pillars-grid">
        {PILLARS.map((pillar) => {
          const taggedStories = getStoriesForPillar(pillar.slug);
          const hasStories = taggedStories.length > 0;

          return (
            <article
              key={pillar.number}
              className={`pillar-card ${
                pillar.status === "active"
                  ? "pillar-active"
                  : "pillar-expanding"
              }`}
            >
              <div className="pillar-header">
                <span className="pillar-num">{pillar.number}</span>
                <span className="pillar-badge">
                  {hasStories
                    ? `${taggedStories.length} ${
                        taggedStories.length === 1 ? "Essay" : "Essays"
                      } In The Journal`
                    : "Expanding Soon"}
                </span>
              </div>

              <h3 className="pillar-name">
                <Link
                  href={`/pillars/${pillar.slug}`}
                  className="pillar-title-link"
                >
                  {pillar.name}
                </Link>
              </h3>

              <p className="pillar-desc">{pillar.description}</p>

              <div className="pillar-card-actions">
                <Link
                  href={`/pillars/${pillar.slug}`}
                  className="pillar-explore-link"
                >
                  <span>
                    {hasStories
                      ? `View All ${pillar.name} Essays (${taggedStories.length})`
                      : `Explore ${pillar.name}`}
                  </span>
                  <span className="story-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>

                {pillar.status === "active" && pillar.highlightStorySlug && (
                  <div className="pillar-link-wrap">
                    <Link
                      href={`/journal/${pillar.highlightStorySlug}`}
                      className="pillar-story-link"
                    >
                      <span className="story-arrow">↗</span>
                      <span className="story-label">
                        Read: {pillar.highlightStoryTitle}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="universe-banner">
        <div className="universe-banner-copy">
          <p className="eyebrow">A GROWING PLATFORM</p>
          <h3>From foundational essays to a complete modern toolkit.</h3>
          <p>
            We are actively publishing flagship writings in the Journal and
            preparing structured series, practical audio notes, and curated
            recommendations to serve each pillar.
          </p>
        </div>
        <div className="universe-banner-action">
          <Link href="/journal" className="button button-editorial">
            Explore Current Essays <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
