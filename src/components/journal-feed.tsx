"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { stories as allStories } from "@/lib/content";
import { findPillarBySlug } from "@/lib/pillars";

type Story = (typeof allStories)[number];

function storyMatchesFilter(story: Story, filterId: string): boolean {
  if (filterId === "all") return true;

  const category = (story.category || "").toUpperCase();
  const tags = Array.isArray(story.tags)
    ? story.tags.map((t) => t.toUpperCase())
    : [];

  if (filterId === "foundations") {
    return (
      category.includes("FOUNDATIONS") ||
      tags.some((t) => t.includes("FOUNDATION"))
    );
  }

  const pillar = findPillarBySlug(filterId);
  if (pillar) {
    if (pillar.highlightStorySlug && story.slug === pillar.highlightStorySlug) {
      return true;
    }

    const matchesPillar = pillar.tagMatches.some((match) => {
      const matchUpper = match.toUpperCase();
      return (
        category.includes(matchUpper) ||
        tags.some((t) => t.includes(matchUpper) || matchUpper.includes(t))
      );
    });

    if (matchesPillar) return true;
  }

  const upper = filterId.toUpperCase();
  return category.includes(upper) || tags.some((t) => t.includes(upper));
}

export function JournalFeed({ stories }: { stories: Story[] }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = useMemo(() => {
    // 1. Primary flagship categories
    const baseFilters = [
      { id: "all", label: "ALL ESSAYS" },
      { id: "foundations", label: "FOUNDATIONS" },
      { id: "mind", label: "MIND & SELF-AWARENESS" },
      { id: "body", label: "BODY" },
      { id: "spirit", label: "SPIRIT & PURPOSE" },
      { id: "emotions", label: "EMOTIONS" },
    ];

    // 2. Discover additional active pillar filters (Style, Grooming, Career, Relationships, Life)
    const otherPillars = [
      { id: "grooming", label: "GROOMING" },
      { id: "style", label: "STYLE" },
      { id: "career-money", label: "CAREER & MONEY" },
      { id: "relationships", label: "RELATIONSHIPS" },
      { id: "life", label: "LIFE" },
    ];

    const activeOtherPillars = otherPillars.filter((p) =>
      stories.some((s) => storyMatchesFilter(s, p.id)),
    );

    const allFilters = [...baseFilters, ...activeOtherPillars];

    return allFilters.map((f) => ({
      ...f,
      count: stories.filter((s) => storyMatchesFilter(s, f.id)).length,
    }));
  }, [stories]);

  const filteredStories = useMemo(() => {
    const list = stories.filter((s) => storyMatchesFilter(s, selectedFilter));

    // Always sort descending by date (newest first)
    return [...list].sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.date).getTime() || 0;
      const timeB = new Date(b.publishedAt || b.date).getTime() || 0;
      return timeB - timeA;
    });
  }, [selectedFilter, stories]);

  return (
    <>
      {/* Category filter buttons with dynamic counts */}
      <nav
        className="journal-filters"
        aria-label="Filter journal stories by pillar"
      >
        {filterOptions.map((filter) => {
          const isActive = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              className={`filter-pill ${isActive ? "filter-pill-active" : ""}`}
              onClick={() => setSelectedFilter(filter.id)}
              aria-pressed={isActive}
            >
              <span>{filter.label}</span>
              <span className="filter-count">({filter.count})</span>
            </button>
          );
        })}

        <Link
          href="/#pillars"
          className="filter-pill"
          aria-label="Explore all nine pillars"
        >
          <span>THE 9 PILLARS</span> <span aria-hidden="true">↗</span>
        </Link>
      </nav>

      <section
        className="story-grid journal-grid journal-grid-featured"
        aria-label="Journal stories"
      >
        {filteredStories.map((story) => (
          <article className="story-card reveal-on-scroll" key={story.slug}>
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
