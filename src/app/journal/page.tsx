import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { stories } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Essays and field notes on becoming a man.",
};
export default function JournalPage() {
  return (
    <main id="main" className="page-wrap">
      <p className="eyebrow">THE ACCIDENTAL MAN / JOURNAL</p>
      <h1 className="page-title">
        Notes on
        <br />
        <em>becoming.</em>
      </h1>
      <p className="page-intro">
        Perspective, personal style, care and everything we learn along the way.
      </p>
      <div className="story-grid journal-grid journal-grid-featured">
        {stories.map((story) => (
          <article className="story-card" key={story.slug}>
            <Link href={`/journal/${story.slug}`}>
              <div className="story-image">
                <Image
                  src={story.image}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <p className="eyebrow">{story.category} <span>— {story.readingTimeMinutes} MIN READ</span></p>
              <h2>{story.title}</h2>
              <p>{story.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
