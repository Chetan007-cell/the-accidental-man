import type { MetadataRoute } from "next";
import { stories } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_URL ?? "https://theaccidentalman.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.8 },
    ...stories.map((story) => ({
      url: `${base}/journal/${story.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
