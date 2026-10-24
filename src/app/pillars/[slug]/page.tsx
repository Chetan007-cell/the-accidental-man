import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findPillarBySlug, getStoriesForPillar, PILLARS } from "@/lib/pillars";
import { getBreadcrumbListSchema } from "@/lib/schema";

interface PillarPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PillarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = findPillarBySlug(slug);

  if (!pillar) {
    return {
      title: "Pillar Not Found — The Accidental Man",
    };
  }

  return {
    title: `${pillar.name} — The Accidental Man`,
    description: `${pillar.description} Explore field notes and essays on ${pillar.name}.`,
    alternates: {
      canonical: `/pillars/${pillar.slug}`,
    },
    openGraph: {
      title: `${pillar.name} · The Nine Pillars — The Accidental Man`,
      description: pillar.summary,
      url: `/pillars/${pillar.slug}`,
    },
  };
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { slug } = await params;
  const pillar = findPillarBySlug(slug);

  if (!pillar) {
    notFound();
  }

  const taggedStories = getStoriesForPillar(pillar.slug);

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", item: "/" },
    { name: "The 9 Pillars", item: "/pillars" },
    { name: pillar.name, item: `/pillars/${pillar.slug}` },
  ]);

  return (
    <main id="main" className="page-wrap pillar-page-wrap">
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/pillars">The 9 Pillars</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{pillar.name}</span>
      </nav>

      {/* Pillar Hero Header */}
      <header className="pillar-hero">
        <div className="pillar-hero-meta">
          <span className="pillar-hero-number">PILLAR {pillar.number}</span>
          <span className="pillar-badge">
            {taggedStories.length > 0
              ? `${taggedStories.length} ${taggedStories.length === 1 ? "Essay" : "Essays"} In The Journal`
              : "Expanding Soon"}
          </span>
        </div>

        <h1 className="pillar-hero-title">{pillar.name}</h1>
        <p className="pillar-hero-desc">{pillar.description}</p>
        <p className="pillar-hero-summary">{pillar.summary}</p>
      </header>

      {/* Tagged Articles Section */}
      <section
        className="pillar-articles-section"
        aria-labelledby="articles-heading"
      >
        <div className="pillar-articles-header">
          <p className="eyebrow">TAGGED IN THIS PILLAR</p>
          <h2 id="articles-heading">
            {taggedStories.length > 0
              ? `Field Notes & Essays on ${pillar.name}`
              : `Upcoming Essays on ${pillar.name}`}
          </h2>
        </div>

        {taggedStories.length > 0 ? (
          <div className="pillar-articles-grid">
            {taggedStories.map((story) => (
              <article key={story.slug} className="pillar-article-card">
                <Link
                  href={`/journal/${story.slug}`}
                  className="pillar-article-link"
                  aria-label={`Read ${story.title}`}
                >
                  <div className="pillar-article-image-wrap">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                      className="pillar-article-image"
                    />
                    <span className="story-read-badge">
                      {story.readingTimeMinutes} min
                    </span>
                  </div>

                  <div className="pillar-article-body">
                    <div className="pillar-article-meta">
                      <span className="pillar-article-category">
                        {story.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={story.publishedAt}>{story.date}</time>
                    </div>

                    <h3 className="pillar-article-title">{story.title}</h3>

                    <p className="pillar-article-excerpt">{story.excerpt}</p>

                    <div className="pillar-article-footer">
                      <span className="pillar-read-link">
                        Read field note <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="pillar-empty-state">
            <div className="pillar-empty-icon" aria-hidden="true">
              ✦
            </div>
            <h3>Field notes & practical guides in editorial development.</h3>
            <p>
              We are actively developing flagship writing, foundational
              toolkits, and curated guidance for <strong>{pillar.name}</strong>.
              Join the private dispatch list to be notified the moment the first
              guide drops.
            </p>
            <Link href="/#newsletter" className="button button-editorial">
              Receive New Dispatches <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </section>

      {/* Other Pillars Switcher */}
      <section
        className="pillar-nav-section"
        aria-labelledby="other-pillars-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CONTENT UNIVERSE</p>
            <h2 id="other-pillars-heading">Explore Other Pillars</h2>
          </div>
          <Link href="/pillars" className="button button-outline-dark">
            All 9 Pillars <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
