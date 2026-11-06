import type { MetadataRoute } from "next";
import { getAllStories } from "@/lib/articles";
import { PILLARS } from "@/lib/pillars";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? "https://theaccidentalman.com";
  const stories = await getAllStories();
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
