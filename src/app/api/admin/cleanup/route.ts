import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { purgeTestArticlesFromDb, resetRuntimeStories } from "@/lib/articles";

export const runtime = "nodejs";

function checkAuth(request: Request): boolean {
  const adminSecret = process.env.ADMIN_API_KEY ?? process.env.CRON_SECRET;
  if (!adminSecret) return false;

  const authHeader = request.headers.get("authorization");
  const xApiKey = request.headers.get("x-api-key");

  return (
    authHeader === `Bearer ${adminSecret}` ||
    authHeader === adminSecret ||
    xApiKey === adminSecret
  );
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purgedSlugs = await purgeTestArticlesFromDb();
  resetRuntimeStories();

  // Invalidate Next.js cache so feeds refresh immediately
  revalidatePath("/");
  revalidatePath("/journal");
  revalidatePath("/pillars");

  return NextResponse.json({
    ok: true,
    message: "Test articles purged successfully",
    purgedSlugs,
  });
}

export async function DELETE(request: Request) {
  return POST(request);
}

export async function GET(request: Request) {
  return POST(request);
}
