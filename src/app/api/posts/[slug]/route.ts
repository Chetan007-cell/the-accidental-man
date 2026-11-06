import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  createOrUpdateArticle,
  deleteArticleBySlug,
  getStoryBySlug,
} from "@/lib/articles";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

function verifyAuth(request: Request): boolean {
  const adminSecret = process.env.ADMIN_API_KEY ?? process.env.CRON_SECRET;
  if (!adminSecret) return false;

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  if (authHeader === `Bearer ${adminSecret}`) return true;
  if (apiKeyHeader === adminSecret) return true;

  return false;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const story = await getStoryBySlug(slug);

    if (!story) {
      return NextResponse.json(
        { error: `Blog post not found: ${slug}` },
        { status: 404 },
      );
    }

    const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

    return NextResponse.json({
      ok: true,
      url: `${siteUrl}/journal/${story.slug}`,
      post: story,
    });
  } catch (error) {
    logError("get_single_post_failed", "api-posts-slug", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch post",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const { story, rowId } = await createOrUpdateArticle({
      ...body,
      title: (body.title as string) || slug,
      slug,
    });

    try {
      revalidatePath("/");
      revalidatePath("/journal");
      revalidatePath(`/journal/${slug}`);
      revalidatePath("/pillars");
      revalidatePath("/sitemap.xml");
    } catch {
      // Revalidation safe ignore in test
    }

    const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

    return NextResponse.json({
      ok: true,
      message: `Blog post updated: ${story.title}`,
      id: rowId,
      url: `${siteUrl}/journal/${story.slug}`,
      post: story,
    });
  } catch (error) {
    logError("update_post_failed", "api-posts-slug", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update post",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const deleted = await deleteArticleBySlug(slug);

    if (!deleted) {
      return NextResponse.json(
        {
          error: `Article with slug '${slug}' not found or could not be deleted`,
        },
        { status: 404 },
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/journal");
      revalidatePath(`/journal/${slug}`);
      revalidatePath("/pillars");
      revalidatePath("/sitemap.xml");
    } catch {
      // Revalidation safe ignore
    }

    return NextResponse.json({
      ok: true,
      message: `Article '${slug}' deleted successfully`,
    });
  } catch (error) {
    logError("delete_post_failed", "api-posts-slug", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete post",
      },
      { status: 500 },
    );
  }
}
