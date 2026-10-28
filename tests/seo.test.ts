import fs from "node:fs";
import path from "node:path";
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

import {
  getArticleSchema,
  getBreadcrumbListSchema,
  getHomePageFaqSchema,
  getJournalCollectionSchema,
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/schema";

describe("JSON-LD: Structured Data & Schema.org", () => {
  it("generates valid site-wide Organization schema with brand, logo, and social sameAs", () => {
    const org = getOrganizationSchema("https://theaccidentalman.com");
    expect(org["@context"]).toBe("https://schema.org");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("The Accidental Man");
    expect(org.url).toBe("https://theaccidentalman.com");
    expect(org.logo.url).toContain("/images/logo-mark.png");
    expect(org.email).toBe("hello@theaccidentalman.com");
    expect(Array.isArray(org.sameAs)).toBe(true);
    expect(org.sameAs.length).toBeGreaterThanOrEqual(4);
    expect(org.sameAs).toContain(
      "https://www.linkedin.com/company/theaccidentalman/",
    );
    expect(org.sameAs).toContain("https://www.instagram.com/theaccidentalman/");
  });

  it("generates valid WebSite schema linking to organization publisher", () => {
    const site = getWebsiteSchema("https://theaccidentalman.com");
    expect(site["@context"]).toBe("https://schema.org");
    expect(site["@type"]).toBe("WebSite");
    expect(site.publisher["@id"]).toBe(
      "https://theaccidentalman.com/#organization",
    );
  });

  it("generates valid Article schema matching Rich Results requirements for every story", () => {
    for (const story of stories) {
      const article = getArticleSchema(story, "https://theaccidentalman.com");
      expect(article["@context"]).toBe("https://schema.org");
      expect(article["@type"]).toBe("Article");
      expect(article.headline).toBe(story.title);
      expect(article.description).toBe(story.excerpt);
      expect(article.datePublished).toBe(story.publishedAt);
      expect(article.dateModified).toBe(story.publishedAt);
      expect(article.author.name).toBe(story.author);
      expect(article.publisher["@id"]).toBe(
        "https://theaccidentalman.com/#organization",
      );
      expect(article.mainEntityOfPage["@id"]).toBe(
        `https://theaccidentalman.com/journal/${story.slug}`,
      );
      expect(article.image.length).toBeGreaterThan(0);
    }
  });

  it("generates valid BreadcrumbList schema with sequential positions and absolute URLs", () => {
    const breadcrumbs = getBreadcrumbListSchema(
      [
        { name: "Home", item: "/" },
        { name: "Journal", item: "/journal" },
        {
          name: "A Man Isn’t Born. He’s Built.",
          item: "/journal/a-man-isnt-born-hes-built",
        },
      ],
      "https://theaccidentalman.com",
    );

    expect(breadcrumbs["@context"]).toBe("https://schema.org");
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbs.itemListElement).toHaveLength(3);
    expect(breadcrumbs.itemListElement[0].position).toBe(1);
    expect(breadcrumbs.itemListElement[0].item).toBe(
      "https://theaccidentalman.com/",
    );
    expect(breadcrumbs.itemListElement[2].position).toBe(3);
    expect(breadcrumbs.itemListElement[2].item).toBe(
      "https://theaccidentalman.com/journal/a-man-isnt-born-hes-built",
    );
  });

  it("generates valid CollectionPage schema with ItemList for Journal index", () => {
    const collection = getJournalCollectionSchema(
      stories,
      "https://theaccidentalman.com",
    );
    expect(collection["@context"]).toBe("https://schema.org");
    expect(collection["@type"]).toBe("CollectionPage");
    expect(collection.mainEntity["@type"]).toBe("ItemList");
    expect(collection.mainEntity.itemListElement).toHaveLength(stories.length);
  });

  it("generates FAQPage schema providing instant AI answers for core tenets and pillars", () => {
    const faq = getHomePageFaqSchema("https://theaccidentalman.com");
    expect(faq["@context"]).toBe("https://schema.org");
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(3);
    for (const q of faq.mainEntity) {
      expect(q["@type"]).toBe("Question");
      expect(q.name).toBeDefined();
      expect(q.acceptedAnswer.text).toBeDefined();
    }
  });
});

describe("SEO: Favicon & Search Icons", () => {
  it("defines favicon, icon, and apple-touch-icon in root layout metadata", () => {
    expect(rootMetadata.icons).toBeDefined();
    const icons = rootMetadata.icons as {
      icon: Array<{ url: string; sizes?: string; type?: string }>;
      shortcut: string;
      apple: Array<{ url: string; sizes?: string }>;
    };

    expect(icons.shortcut).toBe("/favicon.ico");
    const iconUrls = icons.icon.map((i) => i.url);
    expect(iconUrls).toContain("/favicon.ico");
    // Google Search explicitly requires multiples of 48px square
    expect(iconUrls).toContain("/icon-48x48.png");
    expect(iconUrls).toContain("/icon-192x192.png");
    expect(iconUrls).toContain("/icon-512x512.png");

    const appleUrls = icons.apple.map((a) => a.url);
    expect(appleUrls).toContain("/apple-touch-icon.png");
  });

  it("links to site webmanifest in root metadata", () => {
    expect(rootMetadata.manifest).toBe("/site.webmanifest");
  });

  it("has physical favicon and icon files in public and app directories", () => {
    const publicFiles = [
      "favicon.ico",
      "icon.png",
      "icon-48x48.png",
      "icon-96x96.png",
      "icon-144x144.png",
      "icon-192x192.png",
      "icon-512x512.png",
      "apple-touch-icon.png",
      "site.webmanifest",
    ];

    for (const file of publicFiles) {
      const filePath = path.join(process.cwd(), "public", file);
      expect(fs.existsSync(filePath), `Expected public/${file} to exist`).toBe(
        true,
      );
    }

    const appFiles = ["favicon.ico", "icon.png", "apple-icon.png"];
    for (const file of appFiles) {
      const filePath = path.join(process.cwd(), "src", "app", file);
      expect(fs.existsSync(filePath), `Expected src/app/${file} to exist`).toBe(
        true,
      );
    }
  });
});
