import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { stories } from "@/lib/content";

export default function HomePage() {
  return (
    <main id="main">
      <section className="hero">
        <Image
          src="/images/editorial-morning.svg"
          alt="A quiet morning light falling into a room"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">A JOURNAL FOR THE IN-BETWEEN</p>
          <h1>
            A man isn’t born.
            <br />
            He’s built.
          </h1>
          <p className="hero-dek">
            Notes on growing into yourself—one honest day at a time.
          </p>
          <Link className="button button-light" href="/journal">
            Read the journal <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <span className="hero-index">VOL. 01&nbsp; / &nbsp;THE BEGINNING</span>
      </section>
      <section className="intro section-wrap" id="about">
        <p className="eyebrow">A PLACE TO BEGIN</p>
        <h2>
          No finished versions.
          <br />
          <em>Just the work of becoming.</em>
        </h2>
        <p className="intro-copy">
          A thoughtful journal about the things that shape us: perspective,
          personal style, care, relationships and the life we’re figuring out as
          we go.
        </p>
      </section>
      <section className="journal section-wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIELD NOTES</p>
            <h2>From the journal</h2>
          </div>
          <Link className="text-link" href="/journal">
            All stories <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="story-grid">
          {stories.map((story) => (
            <article className="story-card" key={story.slug}>
              <Link
                href={`/journal/${story.slug}`}
                aria-label={`Read ${story.title}`}
              >
                <div className="story-image">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                </div>
                <p className="eyebrow">
                  {story.category} <span>— {story.date}</span>
                </p>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="newsletter" id="newsletter">
        <div>
          <p className="eyebrow">A LETTER, NOW AND THEN</p>
          <h2>
            Good things take
            <br />
            <em>a little becoming.</em>
          </h2>
          <p>Occasional notes from the journal. No noise, and no pressure.</p>
        </div>
        <NewsletterForm />
      </section>
    </main>
  );
}
