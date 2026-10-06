import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";

export const runtime = "nodejs";
const bodySchema = z
  .object({ token: z.string().regex(/^[a-f0-9]{64}$/i) })
  .strict();

export async function POST(request: Request) {
  const expectedOrigin = process.env.APP_URL;
  const origin = request.headers.get("origin");
  if (!expectedOrigin) {
    return NextResponse.json(
      { error: "Service is not configured" },
      { status: 503 },
    );
  }
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(expectedOrigin).origin) {
        return NextResponse.json({ error: "Invalid request" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 1024) {
    return NextResponse.json(
      { error: "Request is too large" },
      { status: 413 },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await getDb()
      .update(subscribers)
      .set({ status: "unsubscribed", updatedAt: new Date() })
      .where(eq(subscribers.unsubscribeToken, parsed.data.token));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to update subscription" },
      { status: 503 },
    );
  }
}
