"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { stories as allStories } from "@/lib/content";

type Story = (typeof allStories)[number];

const FILTER_OPTIONS = [
  { id: "all", label: "ALL ESSAYS" },
  { id: "foundations", label: "FOUNDATIONS" },
  { id: "mind", label: "MIND & SELF-AWARENESS" },
  { id: "emotions", label: "EMOTIONS" },
  { id: "pillars", label: "THE 9 PILLARS" },
];

export function JournalFeed({ stories }: { stories: Story[] }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredStories = useMemo(() => {
    if (selectedFilter === "all") return stories;
    if (selectedFilter === "foundations") {
      return stories.filter((s) =>
        s.category.toUpperCase().includes("FOUNDATIONS"),
      );
    }
    if (selectedFilter === "mind") {
      return stories.filter((s) => s.category.toUpperCase().includes("MIND"));
    }
    if (selectedFilter === "emotions") {
      return stories.filter(
        (s) =>
          s.category.toUpperCase().includes("EMOTIONS") ||
          s.slug.includes("built"),
      );
    }
    return stories;
  }, [selectedFilter, stories]);

  return (
    <>
      {/* Category filter buttons */}
      <nav
        className="journal-filters"
        aria-label="Filter journal stories by pillar"
      >
        {FILTER_OPTIONS.map((filter) => {
          const isActive = selectedFilter === filter.id;
          if (filter.id === "pillars") {
            return (
              <Link
                key={filter.id}
                href="/#pillars"
                className="filter-pill"
                aria-label="Explore all nine pillars"
              >
                {filter.label} <span aria-hidden="true">↗</span>
              </Link>
            );
          }
          return (
            <button
              key={filter.id}
              type="button"
              className={`filter-pill ${isActive ? "filter-pill-active" : ""}`}
              onClick={() => setSelectedFilter(filter.id)}
              aria-pressed={isActive}
            >
              {filter.label}
            </button>
          );
        })}
      </nav>

      <section
        className="story-grid journal-grid journal-grid-featured"
        aria-label="Journal stories"
      >
        {filteredStories.map((story) => (
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
                  {story.readingTimeMinutes} min read
                </span>
              </div>
              <div className="story-card-body">
                <p className="eyebrow">
                  {story.category} <span>— {story.date}</span>
                </p>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <div className="story-card-footer">
                  <span className="story-author">By {story.author}</span>
                  <span className="story-cta-text">Read story ↗</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
