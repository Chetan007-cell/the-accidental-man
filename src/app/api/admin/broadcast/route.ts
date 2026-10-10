import { NextResponse } from "next/server";
import { z } from "zod";
import { broadcastBlogPost } from "@/lib/email/send-broadcast";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";

const schema = z.object({
  articleSlug: z.string().min(1),
});

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_API_KEY ?? process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "articleSlug is required" },
      { status: 400 },
    );
  }

  try {
    const result = await broadcastBlogPost(parsed.data.articleSlug);
    return NextResponse.json({
      ok: true,
      message: `Broadcast completed. Sent ${result.sentCount} of ${result.totalSubscribers} emails.`,
      result,
    });
  } catch (error) {
    logError("broadcast_post_failed", "admin-broadcast", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Broadcast failed",
      },
      { status: 500 },
    );
  }
}
