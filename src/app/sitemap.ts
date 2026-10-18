import type { MetadataRoute } from "next";
import { stories } from "@/lib/content";
import { PILLARS } from "@/lib/pillars";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "https://theaccidentalman.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pillars`, changeFrequency: "weekly", priority: 0.8 },
    ...PILLARS.map((pillar) => ({
      url: `${base}/pillars/${pillar.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...stories.map((story) => ({
      url: `${base}/journal/${story.slug}`,
      lastModified: story.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
