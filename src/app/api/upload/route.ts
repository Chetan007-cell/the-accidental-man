import { NextResponse } from "next/server";
import { processImageInput } from "@/lib/images";
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

  try {
    const contentType = request.headers.get("content-type") || "";
    let savedUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file =
        formData.get("file") || formData.get("image") || formData.get("upload");

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided in 'file' or 'image' form field" },
          { status: 400 },
        );
      }

      savedUrl = await processImageInput(file, "upload");
    } else {
      // JSON payload
      let body: Record<string, unknown> = {};
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON or form payload" },
          { status: 400 },
        );
      }

      const imageInput =
        body.image ?? body.file ?? body.base64 ?? body.data ?? body.url;

      if (!imageInput) {
        return NextResponse.json(
          {
            error: "Missing image field ('image', 'file', 'base64', or 'url')",
          },
          { status: 400 },
        );
      }

      const prefix = typeof body.prefix === "string" ? body.prefix : "upload";
      savedUrl = await processImageInput(imageInput, prefix);
    }

    if (!savedUrl) {
      return NextResponse.json(
        { error: "Failed to process image file or payload" },
        { status: 400 },
      );
    }

    const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";
    const fullUrl = savedUrl.startsWith("http")
      ? savedUrl
      : `${siteUrl}${savedUrl}`;

    return NextResponse.json(
      {
        ok: true,
        url: savedUrl,
        fullUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    logError("upload_image_failed", "api-upload", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image upload failed",
      },
      { status: 500 },
    );
  }
}
