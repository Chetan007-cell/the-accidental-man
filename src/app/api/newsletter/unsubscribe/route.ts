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
  const origin = request.headers.get("origin");
  const configuredOrigin =
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);

  if (origin) {
    try {
      const incomingOrigin = new URL(origin).origin;
      const allowedOrigins = new Set<string>([
        "https://theaccidentalman.com",
        "https://www.theaccidentalman.com",
      ]);
      if (configuredOrigin) {
        allowedOrigins.add(new URL(configuredOrigin).origin);
      }
      try {
        const requestOrigin = new URL(request.url).origin;
        if (requestOrigin && requestOrigin !== "null") {
          allowedOrigins.add(requestOrigin);
        }
      } catch {}

      if (!allowedOrigins.has(incomingOrigin)) {
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
