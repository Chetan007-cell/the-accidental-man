import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter-form";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButton } from "@/components/share-button";
import { stories } from "@/lib/content";
import { findPillarBySlug } from "@/lib/pillars";
import { getArticleSchema, getBreadcrumbListSchema } from "@/lib/schema";

export function generateStaticParams() {
  return stories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: `/journal/${story.slug}` },
    openGraph: {
      type: "article",
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      authors: [story.author],
      images: [{ url: story.articleImage, alt: story.articleImageAlt }],
    },
  };
}
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();

  const articleSchema = getArticleSchema(story);
  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", item: "/" },
    { name: "Journal", item: "/journal" },
    { name: story.title, item: `/journal/${story.slug}` },
  ]);

  return (
    <main id="main" className="article-wrap">
      <ReadingProgress />
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/journal">Journal</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{story.category}</span>
      </nav>
      <p className="eyebrow article-category">{story.category}</p>
      <h1>{story.title}</h1>
      <p className="article-dek">{story.excerpt}</p>
      <div className="article-byline">
        <span>By {story.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={story.publishedAt}>{story.date}</time>
        <span aria-hidden="true">·</span>
        <span>{story.readingTimeMinutes} min read</span>
      </div>
      <div className="article-hero">
        <Image
          src={story.articleImage}
          alt={story.articleImageAlt}
          fill
          priority
          sizes="(max-width: 800px) 100vw, 900px"
        />
      </div>
      <article className="prose">
        <p className="eyebrow">A FIELD NOTE FROM THE ACCIDENTAL MAN</p>
        {story.introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {story.sections.map((section) => (
          <section className="article-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <div className="article-share">
          {"tags" in story &&
            Array.isArray(story.tags) &&
            story.tags.length > 0 && (
              <div className="article-tags">
                <span className="tags-label">Pillars:</span>
                {story.tags.map((tag: string) => {
                  const pillar = findPillarBySlug(tag);
                  return pillar ? (
                    <Link
                      key={tag}
                      href={`/pillars/${pillar.slug}`}
                      className="tag-pill tag-pill-link"
                      title={`View all essays in ${pillar.name}`}
                    >
                      {tag} <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          <ShareButton title={story.title} />
        </div>
      </article>
      {stories.filter((item) => item.slug !== story.slug).length > 0 && (
        <section
          className="related-articles reveal-on-scroll"
          aria-labelledby="related-heading"
        >
          <div className="related-header">
            <p className="eyebrow">CONTINUE READING</p>
            <h2 id="related-heading">Related Dispatches & Essays</h2>
          </div>
          <div className="related-grid">
            {stories
              .filter((item) => item.slug !== story.slug)
              .map((related) => (
                <article
                  key={related.slug}
                  className="related-card reveal-on-scroll"
                >
                  <Link
                    href={`/journal/${related.slug}`}
                    className="related-card-link"
                    aria-label={`Read ${related.title}`}
                  >
                    <div className="related-image-wrap">
                      <Image
                        src={related.image}
                        alt={related.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="related-image"
                      />
                      <span className="story-read-badge">
                        {related.readingTimeMinutes} min
                      </span>
                    </div>
                    <div className="related-card-content">
                      <p className="eyebrow">
                        {related.category} <span>· {related.date}</span>
                      </p>
                      <h3>{related.title}</h3>
                      <p className="related-excerpt">{related.excerpt}</p>
                      <span className="related-cta">
                        Read article <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
          </div>
        </section>
      )}
      <section
        className="newsletter article-newsletter reveal-on-scroll"
        id="newsletter"
      >
        <div>
          <p className="eyebrow">A LETTER, NOW AND THEN</p>
          <h2>
            Keep becoming.
            <br />
            <em>We’ll write now and then.</em>
          </h2>
          <p>Occasional notes from the journal. No noise, and no pressure.</p>
        </div>
        <NewsletterForm />
      </section>
      <nav
        className="article-backlinks"
        aria-label="More from The Accidental Man"
      >
        <Link href="/journal">← Back to the journal</Link>
        <Link href="/">The Accidental Man home</Link>
      </nav>
    </main>
  );
}
