import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getMediaFromDb } from "@/lib/images";

export const runtime = "nodejs";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  if (ext === "gif") return "image/gif";
  if (ext === "svg") return "image/svg+xml";
  return "image/jpeg";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!filename || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // 1. Check local public/uploads directory (if present on local disk)
  try {
    const publicPath = path.join(process.cwd(), "public", "uploads", filename);
    const data = await fs.readFile(publicPath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": getMimeType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Continue to temporary directory / DB
  }

  // 2. Check /tmp/uploads (warm serverless container cache)
  try {
    const tmpPath = path.join("/tmp", "uploads", filename);
    const data = await fs.readFile(tmpPath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": getMimeType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Continue to database
  }

  // 3. Retrieve from PostgreSQL database
  const media = await getMediaFromDb(filename);
  if (media) {
    // Cache to /tmp for faster future reads in the same warm lambda
    try {
      const tmpDir = path.join("/tmp", "uploads");
      await fs.mkdir(tmpDir, { recursive: true });
      await fs.writeFile(path.join(tmpDir, filename), media.buffer);
    } catch {
      // Non-fatal
    }

    return new Response(new Uint8Array(media.buffer), {
      headers: {
        "Content-Type": media.mimeType || getMimeType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
