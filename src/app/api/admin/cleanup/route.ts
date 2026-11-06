import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/api-auth";
import { purgeTestArticlesFromDb, resetRuntimeStories } from "@/lib/articles";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!verifyAdminAuth(request)) {
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
