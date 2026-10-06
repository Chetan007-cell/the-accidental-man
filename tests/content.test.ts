import { describe, expect, it } from "vitest";
import { stories } from "@/lib/content";

describe("Content: Journal Stories", () => {
  it("should have at least one published story", () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  it("should have unique slugs for all stories", () => {
    const slugs = stories.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("should validate that all stories have required fields and formatting", () => {
    for (const story of stories) {
      // Slug format: URL-friendly lowercase alphanumeric and hyphens
      expect(story.slug).toMatch(/^[a-z0-9-]+$/);

      // Basic fields
      expect(story.title.trim().length).toBeGreaterThan(0);
      expect(story.category.trim().length).toBeGreaterThan(0);
      expect(story.excerpt.trim().length).toBeGreaterThan(0);
      expect(story.author.trim().length).toBeGreaterThan(0);

      // Reading time
      expect(story.readingTimeMinutes).toBeGreaterThan(0);
      expect(Number.isInteger(story.readingTimeMinutes)).toBe(true);

      // Published date format (YYYY-MM-DD)
      expect(story.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(story.publishedAt).toString()).not.toBe("Invalid Date");

      // Images
      expect(story.image).toMatch(/^\/images\/.+\.(webp|png|jpg|svg)$/);
      expect(story.articleImage).toMatch(/^\/images\/.+\.(webp|png|jpg|svg)$/);
      expect(story.imageAlt.trim().length).toBeGreaterThan(0);
      expect(story.articleImageAlt.trim().length).toBeGreaterThan(0);

      // Content paragraphs
      expect(Array.isArray(story.introduction)).toBe(true);
      expect(story.introduction.length).toBeGreaterThan(0);
      for (const p of story.introduction) {
        expect(p.trim().length).toBeGreaterThan(0);
      }

      // Sections
      expect(Array.isArray(story.sections)).toBe(true);
      expect(story.sections.length).toBeGreaterThan(0);
      for (const section of story.sections) {
        expect(section.heading.trim().length).toBeGreaterThan(0);
        expect(Array.isArray(section.paragraphs)).toBe(true);
        expect(section.paragraphs.length).toBeGreaterThan(0);
        for (const p of section.paragraphs) {
          expect(p.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
