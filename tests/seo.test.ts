import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { stories } from "@/lib/content";

describe("SEO: Sitemap & Robots", () => {
  it("should generate sitemap containing home, journal, and all story slugs", () => {
    const map = sitemap();
    expect(Array.isArray(map)).toBe(true);

    const urls = map.map((item) => item.url);
    const baseUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

    // Should include home and journal index
    expect(urls).toContain(baseUrl);
    expect(urls).toContain(`${baseUrl}/journal`);

    // Should include each story slug
    for (const story of stories) {
      expect(urls).toContain(`${baseUrl}/journal/${story.slug}`);
    }
  });

  it("should generate valid robots configuration", () => {
    const config = robots();
    expect(config.rules).toBeDefined();
    expect(config.sitemap).toMatch(/sitemap\.xml$/);
  });
});
