import Link from "next/link";

interface Pillar {
  number: string;
  name: string;
  description: string;
  status: "active" | "expanding";
  activeCount?: number;
  highlightStorySlug?: string;
  highlightStoryTitle?: string;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    name: "Mind",
    description:
      "Learning, attention, habits, judgment, confidence, and mental clarity.",
    status: "active",
    activeCount: 1,
    highlightStorySlug: "celebrating-yourself-or-seeking-validation",
    highlightStoryTitle: "Are You Celebrating Yourself, or Seeking Validation?",
  },
  {
    number: "02",
    name: "Emotions",
    description:
      "Emotional literacy, resilience, self-respect, asking for help, and coping skills.",
    status: "active",
    activeCount: 1,
    highlightStorySlug: "a-man-isnt-born-hes-built",
    highlightStoryTitle: "A Man Isn’t Born. He’s Built.",
  },
  {
    number: "03",
    name: "Body",
    description:
      "Movement, strength, sleep, nutrition, health, and sustainable physical care.",
    status: "expanding",
  },
  {
    number: "04",
    name: "Spirit & Purpose",
    description:
      "Values, meaning, identity, reflection, and the questions that guide a life.",
    status: "expanding",
  },
  {
    number: "05",
    name: "Grooming",
    description:
      "Simple, inclusive routines, practical self-care, and daily maintenance.",
    status: "expanding",
  },
  {
    number: "06",
    name: "Style",
    description:
      "Fit, function, self-expression, and dressing for real situations and budgets.",
    status: "expanding",
  },
  {
    number: "07",
    name: "Career & Money",
    description:
      "Work, craft, financial fundamentals, decisions, and long-term stability.",
    status: "expanding",
  },
  {
    number: "08",
    name: "Relationships",
    description:
      "Friendship, family, partnership, communication, boundaries, and care.",
    status: "expanding",
  },
  {
    number: "09",
    name: "Life",
    description:
      "Home, time, responsibility, transitions, culture, leisure, and whole living.",
    status: "expanding",
  },
];

export function PillarsSection() {
  return (
    <section className="pillars-section section-wrap" id="pillars">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE CONTENT UNIVERSE</p>
          <h2>The Nine Pillars of Becoming</h2>
        </div>
        <div className="pillars-meta-note">
          <span>Active in Journal & Expanding Soon</span>
        </div>
      </div>

      <p className="pillars-intro">
        A man isn’t built through one narrow checklist. We explore nine
        interconnected dimensions that shape a grounded, capable life—publishing
        deep-dive field notes today, and expanding into practical guides,
        toolkits, and audio conversations.
      </p>

      <div className="pillars-grid">
        {PILLARS.map((pillar) => (
          <article
            key={pillar.number}
            className={`pillar-card ${
              pillar.status === "active" ? "pillar-active" : "pillar-expanding"
            }`}
          >
            <div className="pillar-header">
              <span className="pillar-num">{pillar.number}</span>
              <span className="pillar-badge">
                {pillar.status === "active"
                  ? "In The Journal"
                  : "Expanding Soon"}
              </span>
            </div>
            <h3 className="pillar-name">{pillar.name}</h3>
            <p className="pillar-desc">{pillar.description}</p>

            {pillar.status === "active" && pillar.highlightStorySlug ? (
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
            ) : (
              <div className="pillar-upcoming">
                <span className="upcoming-dot" />
                <span>Field guides & essays in development</span>
              </div>
            )}
          </article>
        ))}
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
