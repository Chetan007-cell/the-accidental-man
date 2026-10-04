import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { logError } from "@/lib/logger";

export const runtime = "nodejs";
const bodySchema = z
  .object({
    email: z.string().trim().email().max(254),
    consent: z.literal("yes"),
    website: z.string().max(0).optional(),
  })
  .strict();

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.APP_URL;
  if (!expectedOrigin) {
    return NextResponse.json(
      { error: "Service is not configured" },
      { status: 503 },
    );
  }
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(expectedOrigin).origin)
        return NextResponse.json({ error: "Invalid request" }, { status: 403 });
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
  if (contentLength > 4096) {
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
  if (!parsed.success)
    return NextResponse.json(
      { error: "Please check the form and try again" },
      { status: 400 },
    );
  if (parsed.data.website) return NextResponse.json({ ok: true });
  try {
    const email = parsed.data.email.toLowerCase();
    await getDb()
      .insert(subscribers)
      .values({
        email,
        status: "pending",
        consentAt: new Date(),
        consentSource: "website-newsletter",
      })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true });
  } catch (error) {
    logError("newsletter_signup_failed", requestId, error);
    return NextResponse.json(
      { error: "Unable to process subscription", requestId },
      { status: 503, headers: { "X-Request-ID": requestId } },
    );
  }
}
