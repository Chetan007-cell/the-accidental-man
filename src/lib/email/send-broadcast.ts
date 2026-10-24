import { eq } from "drizzle-orm";
import { stories } from "@/lib/content";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { renderBlogBroadcastEmail } from "./templates";

export interface BroadcastResult {
  sentCount: number;
  totalSubscribers: number;
  errors: string[];
}

export async function broadcastBlogPost(
  articleSlug: string,
): Promise<BroadcastResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("resend_not_configured");

  const appUrl =
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://theaccidentalman.com");

  const from =
    process.env.NEWSLETTER_FROM_EMAIL ??
    "The Accidental Man <hello@theaccidentalman.com>";

  const story = stories.find((s) => s.slug === articleSlug);
  if (!story) {
    throw new Error(`story_not_found: ${articleSlug}`);
  }

  const database = getDb();
  const activeSubscribers = await database
    .select({
      id: subscribers.id,
      email: subscribers.email,
      unsubscribeToken: subscribers.unsubscribeToken,
    })
    .from(subscribers)
    .where(eq(subscribers.status, "active"));

  if (activeSubscribers.length === 0) {
    return { sentCount: 0, totalSubscribers: 0, errors: [] };
  }

  let sentCount = 0;
  const errors: string[] = [];

  for (const subscriber of activeSubscribers) {
    const unsubscribeUrl = new URL(
      `/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`,
      appUrl,
    ).toString();

    const { subject, html, text } = renderBlogBroadcastEmail({
      title: story.title,
      excerpt: story.excerpt,
      category: story.category,
      readingTimeMinutes: story.readingTimeMinutes,
      slug: story.slug,
      unsubscribeUrl,
      appUrl,
    });

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `broadcast/${story.slug}/${subscriber.id}`,
        },
        body: JSON.stringify({
          from,
          to: [subscriber.email],
          subject,
          text,
          html,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (response.ok) {
        sentCount++;
      } else {
        const errorData = await response.json().catch(() => null);
        const detail =
          errorData && typeof errorData === "object" && "message" in errorData
            ? String(errorData.message)
            : `status ${response.status}`;
        errors.push(`${subscriber.email}: ${detail}`);
      }
    } catch (err) {
      errors.push(
        `${subscriber.email}: ${err instanceof Error ? err.message : "unknown error"}`,
      );
    }
  }

  return {
    sentCount,
    totalSubscribers: activeSubscribers.length,
    errors,
  };
}
