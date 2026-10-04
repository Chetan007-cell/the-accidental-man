import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
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
  return story ? { title: story.title, description: story.excerpt } : {};
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
      <p className="eyebrow">
        {story.category} &nbsp; / &nbsp; {story.date}
      </p>
      <h1>{story.title}</h1>
      <p className="article-dek">{story.excerpt}</p>
      <div className="article-hero">
        <Image
          src={story.image}
          alt=""
          fill
          priority
          sizes="(max-width: 800px) 100vw, 900px"
        />
      </div>
      <article className="prose">
        <p className="eyebrow">A FIELD NOTE FROM THE ACCIDENTAL MAN</p>
        <p>
          There is no single moment when it all comes together. Most of the
          time, becoming happens quietly: in the promises we keep, the questions
          we are willing to ask, and the small choices we make when nobody is
          watching.
        </p>
        <p>
          We are allowed to be works in progress. We can keep what serves us,
          question what does not, and make room for a more considered way
          forward.
        </p>
        <p>
          This journal is a place for that kind of reflection. Start wherever
          you are.
        </p>
      </article>
    </main>
  );
}
