import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrUpdateArticle, getAllStories } from "@/lib/articles";
import { broadcastBlogPost } from "@/lib/email/send-broadcast";
import { processImageInput } from "@/lib/images";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

const postSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  dek: z.string().optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  author: z.string().optional(),
  authorName: z.string().optional(),
  image: z.any().optional(),
  imageAlt: z.string().optional(),
  articleImage: z.any().optional(),
  articleImageAlt: z.string().optional(),
  heroImageUrl: z.any().optional(),
  heroImageAlt: z.string().optional(),
  imageBase64: z.string().optional(),
  file: z.any().optional(),
  body: z.string().optional(),
  content: z.string().optional(),
  introduction: z.array(z.string()).optional(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()),
      }),
    )
    .optional(),
  readingTimeMinutes: z.coerce.number().int().positive().optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["published", "draft"]).optional(),
  broadcast: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true")
    .optional(),
});

function verifyAuth(request: Request): boolean {
  const adminSecret = process.env.ADMIN_API_KEY ?? process.env.CRON_SECRET;
  if (!adminSecret) return false;

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  if (authHeader === `Bearer ${adminSecret}`) return true;
  if (apiKeyHeader === adminSecret) return true;

  return false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10);

    const allStories = await getAllStories();
    const paginated = allStories.slice(offset, offset + limit);

    const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

    return NextResponse.json({
      ok: true,
      total: allStories.length,
      limit,
      offset,
      posts: paginated.map((story) => ({
        ...story,
        url: `${siteUrl}/journal/${story.slug}`,
      })),
    });
  } catch (error) {
    logError("get_posts_failed", "api-posts", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Pass your API key via 'Authorization: Bearer <ADMIN_API_KEY>' or 'x-api-key: <ADMIN_API_KEY>' header.",
      },
      { status: 401 },
    );
  }

  const contentType = request.headers.get("content-type") || "";
  let rawData: Record<string, unknown> = {};

  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        rawData[key] = value;
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid form data in request body" },
        { status: 400 },
      );
    }
  } else {
    try {
      rawData = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }
  }

  const parsed = postSchema.safeParse(rawData);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.format(),
      },
      { status: 400 },
    );
  }

  try {
    // Process image file or base64 if provided directly in the request
    const rawImage =
      parsed.data.image ??
      parsed.data.heroImageUrl ??
      parsed.data.articleImage ??
      parsed.data.imageBase64 ??
      parsed.data.file;

    const slugCandidate = parsed.data.slug || parsed.data.title;
    let resolvedImageUrl: string | undefined;

    if (rawImage) {
      resolvedImageUrl = await processImageInput(rawImage, slugCandidate);
    }

    const articleInput = {
      ...parsed.data,
      ...(resolvedImageUrl
        ? {
            image: resolvedImageUrl,
            heroImageUrl: resolvedImageUrl,
            articleImage: resolvedImageUrl,
          }
        : {}),
    };

    const { story, created, rowId } = await createOrUpdateArticle(articleInput);

    // Revalidate paths for instant Next.js cache freshness
    try {
      revalidatePath("/");
      revalidatePath("/journal");
      revalidatePath(`/journal/${story.slug}`);
      revalidatePath("/pillars");
      revalidatePath("/sitemap.xml");
    } catch {
      // Revalidation may fail in test environments, safe to ignore
    }

    let broadcastResult = null;
    if (parsed.data.broadcast) {
      try {
        broadcastResult = await broadcastBlogPost(story.slug);
      } catch (broadcastErr) {
        logError("post_creation_broadcast_failed", "api-posts", broadcastErr);
        broadcastResult = {
          sentCount: 0,
          error:
            broadcastErr instanceof Error
              ? broadcastErr.message
              : "Broadcast failed",
        };
      }
    }

    const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";
    const postUrl = `${siteUrl}/journal/${story.slug}`;

    return NextResponse.json(
      {
        ok: true,
        message: created
          ? `Blog post created successfully: ${story.title}`
          : `Blog post updated successfully: ${story.title}`,
        id: rowId,
        url: postUrl,
        post: story,
        broadcast: broadcastResult,
      },
      { status: created ? 201 : 200 },
    );
  } catch (error) {
    logError("create_post_failed", "api-posts", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create blog post",
      },
      { status: 500 },
    );
  }
}
