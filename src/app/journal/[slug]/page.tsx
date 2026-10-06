import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterForm } from "@/components/newsletter-form";
import { ShareButton } from "@/components/share-button";
import { stories } from "@/lib/content";

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
  return (
    <main id="main" className="article-wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/journal">Journal</Link><span aria-hidden="true">/</span>
        <span aria-current="page">Foundations</span>
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
        {story.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {story.sections.map((section) => (
          <section className="article-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <div className="article-share"><ShareButton title={story.title} /></div>
      </article>
      <section className="newsletter article-newsletter" id="newsletter">
        <div>
          <p className="eyebrow">A LETTER, NOW AND THEN</p>
          <h2>Keep becoming.<br /><em>We’ll write now and then.</em></h2>
          <p>Occasional notes from the journal. No noise, and no pressure.</p>
        </div>
        <NewsletterForm />
      </section>
      <nav className="article-backlinks" aria-label="More from The Accidental Man">
        <Link href="/journal">← Back to the journal</Link>
        <Link href="/">The Accidental Man home</Link>
      </nav>
    </main>
  );
}
