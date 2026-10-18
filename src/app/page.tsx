import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PillarsSection } from "@/components/pillars-section";
import { stories } from "@/lib/content";
import { getHomePageFaqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const foundationalStory =
    stories.find((s) => s.slug === "a-man-isnt-born-hes-built") ?? stories[0];

  const latestStories = [...stories]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 2);

  return (
    <main id="main">
      <script type="application/ld+json">
        {JSON.stringify(getHomePageFaqSchema())}
      </script>
      {/* Editorial Hero */}
      <section className="hero">
        <Image
          src="/images/home-hero.png"
          alt="A thoughtful man writing in an open journal at a sunlit wooden workshop table with morning coffee"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">A FACTORY FOR THE MODERN MAN · VOL. 01</p>
          <h1>
            A man isn’t born.
            <br />
            <em>He’s built.</em>
          </h1>
          <p className="hero-dek">
            An independent journal on character, mind, body, and modern life.
            Practical essays, field notes, and honest perspectives for men
            building a life they respect.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href="/journal">
              Read the journal <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-outline-light" href="#pillars">
              Explore the 9 Pillars <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>

        {/* 5-Second Clarity Orientation Bar */}
        {/* <div className="hero-orientation-bar">
          <div className="orientation-col">
            <span className="orientation-label">WHAT WE ARE</span>
            <p>An editorial publication for character & modern living</p>
          </div>
          <div className="orientation-col">
            <span className="orientation-label">WHAT WE COVER</span>
            <p>Mind · Character · Style · Grooming · Career · Relationships</p>
          </div>
          <div className="orientation-col">
            <span className="orientation-label">OUR CREED</span>
            <p>Practical guidance without empty hustle or alpha posturing</p>
          </div>
        </div> */}

        <span className="hero-index">VOL. 01&nbsp; / &nbsp;THE BEGINNING</span>
      </section>

      {/* Latest Articles Section — Shown Prominently at the Top */}
      <section className="journal section-wrap" id="journal">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST DISPATCHES & ESSAYS</p>
            <h2>Fresh from the journal</h2>
          </div>
          <Link className="text-link" href="/journal">
            All stories <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="story-grid story-grid-featured">
          {latestStories.map((story) => (
            <article className="story-card" key={story.slug}>
              <Link
                href={`/journal/${story.slug}`}
                aria-label={`Read ${story.title}`}
              >
                <div className="story-image">
                  <Image
                    src={story.image}
                    alt={story.imageAlt || ""}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                  <span className="story-read-badge">
                    {story.readingTimeMinutes} min
                  </span>
                </div>
                <div className="story-card-body">
                  <p className="eyebrow">
                    {story.category} <span>— {story.date}</span>
                  </p>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                  <span className="story-cta">
                    Read essay <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Foundational Essay Spotlight */}
      {foundationalStory && (
        <section className="foundational-spotlight section-wrap">
          <div className="foundational-card">
            <div className="foundational-image-wrap">
              <Image
                src={foundationalStory.image}
                alt={foundationalStory.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="foundational-image"
              />
            </div>
            <div className="foundational-content">
              <div className="foundational-badge">
                FOUNDATIONAL MANIFESTO · VOL. 01
              </div>
              <p className="eyebrow">
                {foundationalStory.category} —{" "}
                {foundationalStory.readingTimeMinutes} MIN READ
              </p>
              <h2>{foundationalStory.title}</h2>
              <p className="foundational-excerpt">
                {foundationalStory.excerpt}
              </p>
              <p className="foundational-quote">
                “Becoming a man is not about having everything figured out; it
                is about becoming more willing and able to figure things out.”
              </p>
              <Link
                href={`/journal/${foundationalStory.slug}`}
                className="button button-editorial"
              >
                Read the foundational essay <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Brand Philosophy: Become, Maintain, Evolve */}
      <section className="intro section-wrap" id="about">
        <p className="eyebrow">BRAND PHILOSOPHY</p>
        <h2>
          No finished versions.
          <br />
          <em>Just the quiet work of becoming.</em>
        </h2>
        <p className="intro-copy">
          Manhood is not a fixed status, performance, or checklist. It is built
          through choices, habits, responsibility, self-knowledge,
          relationships, and the willingness to keep learning. Men do not need
          to be perfect to begin; they need useful tools and room to grow.
        </p>

        <div className="tenets-grid">
          <div className="tenet-card">
            <span className="tenet-num">01</span>
            <h3>Become</h3>
            <p>
              Starting where you are without shame. Unlearning inherited habits,
              facing tough questions, and accepting that being unfinished is
              where real growth begins.
            </p>
          </div>
          <div className="tenet-card">
            <span className="tenet-num">02</span>
            <h3>Maintain</h3>
            <p>
              The daily architecture. Grounded routines, physical vitality,
              mental clarity, emotional literacy, and showing up for the
              commitments you made.
            </p>
          </div>
          <div className="tenet-card">
            <span className="tenet-num">03</span>
            <h3>Evolve</h3>
            <p>
              Expanding your capacity over time. Deepening your craft,
              cultivating dependable relationships, and defining a life you
              respect.
            </p>
          </div>
        </div>
      </section>

      {/* The 9 Pillars / Content Universe */}
      <PillarsSection />

      {/* Brand Promise / Editorial Creed */}
      <section className="creed-section section-wrap">
        <div className="creed-card">
          <p className="eyebrow">OUR EDITORIAL COMMITMENT</p>
          <blockquote>
            “Every piece should leave the reader with at least one of these: a
            clearer perspective, a useful next step, a question worth
            considering, or the feeling that growth is possible.”
          </blockquote>
          <div className="creed-points">
            <div className="creed-point">
              <strong>Considered & Human</strong>
              <span>
                Grounded in real life, not alpha posturing or empty hustle
                culture.
              </span>
            </div>
            <div className="creed-point">
              <strong>Practical Guidance</strong>
              <span>
                Proportionate steps that respect your intelligence, time, and
                circumstance.
              </span>
            </div>
            <div className="creed-point">
              <strong>Room to Grow</strong>
              <span>
                A welcoming place to ask basic questions and build quiet
                confidence.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Letters / Newsletter */}
      <section className="newsletter" id="newsletter">
        <div className="newsletter-copy">
          <p className="eyebrow">A LETTER, NOW AND THEN</p>
          <h2>
            Good things take
            <br />
            <em>a little becoming.</em>
          </h2>
          <p>
            Occasional dispatches from the journal. Thoughtful reflections,
            field notes, and practical guidance for building a fuller life. No
            noise, no spam, and no pressure.
          </p>
        </div>
        <NewsletterForm />
      </section>
    </main>
  );
}
