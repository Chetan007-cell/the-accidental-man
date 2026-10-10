import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-serif" }),
  Plus_Jakarta_Sans: () => ({ variable: "--font-sans" }),
}));

import { generateMetadata as generateStoryMetadata } from "@/app/journal/[slug]/page";
import { metadata as journalMetadata } from "@/app/journal/page";
import { metadata as rootMetadata } from "@/app/layout";
import { GET as getLlmsTxt } from "@/app/llms.txt/route";
import { metadata as privacyMetadata } from "@/app/privacy/page";
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

describe("SEO: Canonical Tags", () => {
  it("has canonical tag defined on root layout", () => {
    expect(rootMetadata.alternates?.canonical).toBe("/");
  });

  it("has canonical tag defined on journal index", () => {
    expect(journalMetadata.alternates?.canonical).toBe("/journal");
  });

  it("has canonical tag defined on privacy page", () => {
    expect(privacyMetadata.alternates?.canonical).toBe("/privacy");
  });

  it("generates canonical tag on individual story pages", async () => {
    const storyMetadata = await generateStoryMetadata({
      params: Promise.resolve({ slug: "a-man-isnt-born-hes-built" }),
    });

    expect(storyMetadata.alternates?.canonical).toBe(
      "/journal/a-man-isnt-born-hes-built",
    );
  });
});

describe("AI Discovery: llms.txt", () => {
  it("serves llms.txt with text/plain header, platform summary, and story links", async () => {
    const response = await getLlmsTxt();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");

    const content = await response.text();
    expect(content).toContain("# The Accidental Man");
    expect(content).toContain("A man isn't born. He's built.");
    expect(content).toContain("01 Become");
    expect(content).toContain("02 Maintain");
    expect(content).toContain("03 Evolve");
    expect(content).toContain("a-man-isnt-born-hes-built");
  });
});
