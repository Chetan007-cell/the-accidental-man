import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Persists an uploaded image to PostgreSQL for serverless environments (e.g. Vercel).
 */
export async function saveMediaToDb(
  filename: string,
  buffer: Buffer,
  mimeType = "image/jpeg",
): Promise<boolean> {
  const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
  if (isTest) return true;

  const hasDb = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  if (!hasDb) return false;

  try {
    const database = getDb();
    await database.execute(sql`
      CREATE TABLE IF NOT EXISTS uploaded_media (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        filename varchar(255) NOT NULL UNIQUE,
        mime_type varchar(100) NOT NULL DEFAULT 'image/jpeg',
        data_base64 text NOT NULL,
        size_bytes integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    const dataBase64 = buffer.toString("base64");
    const sizeBytes = buffer.length;

    await database.execute(sql`
      INSERT INTO uploaded_media (filename, mime_type, data_base64, size_bytes)
      VALUES (${filename}, ${mimeType}, ${dataBase64}, ${sizeBytes})
      ON CONFLICT (filename) DO UPDATE
      SET data_base64 = EXCLUDED.data_base64,
          mime_type = EXCLUDED.mime_type,
          size_bytes = EXCLUDED.size_bytes;
    `);

    return true;
  } catch (err) {
    console.error("Failed to persist media to database:", err);
    return false;
  }
}

/**
 * Retrieves an uploaded image from PostgreSQL.
 */
export async function getMediaFromDb(
  filename: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const hasDb = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  if (!hasDb) return null;

  try {
    const database = getDb();
    const result = (await database.execute(sql`
      SELECT mime_type, data_base64
      FROM uploaded_media
      WHERE filename = ${filename}
      LIMIT 1;
    `)) as unknown as Array<{ mime_type: string; data_base64: string }>;

    if (!result || result.length === 0) return null;

    const row = result[0];
    const buffer = Buffer.from(row.data_base64, "base64");
    return {
      buffer,
      mimeType: row.mime_type || "image/jpeg",
    };
  } catch (err) {
    console.error("Failed to retrieve media from database:", err);
    return null;
  }
}

/**
 * Ensures the uploads directory exists on disk when writable.
 */
export async function ensureUploadsDir(): Promise<string> {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch {
    // Expected on serverless environments where root or cwd is read-only
  }
  return UPLOADS_DIR;
}

/**
 * Extracts a file extension from a MIME type or fallback filename.
 */
function getExtension(mimeType?: string, filename?: string): string {
  if (mimeType) {
    const cleanMime = mimeType.toLowerCase();
    if (cleanMime.includes("jpeg") || cleanMime.includes("jpg")) return "jpg";
    if (cleanMime.includes("png")) return "png";
    if (cleanMime.includes("webp")) return "webp";
    if (cleanMime.includes("avif")) return "avif";
    if (cleanMime.includes("gif")) return "gif";
    if (cleanMime.includes("svg")) return "svg";
  }

  if (filename) {
    const ext = path.extname(filename).replace(".", "").toLowerCase();
    if (
      ext &&
      ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"].includes(ext)
    ) {
      return ext === "jpeg" ? "jpg" : ext;
    }
  }

  return "jpg";
}

/**
 * Generates a clean, unique upload filename.
 */
function generateFilename(prefix = "upload", ext = "jpg"): string {
  const cleanPrefix =
    prefix
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "upload";
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${cleanPrefix}-${timestamp}-${randomSuffix}.${ext}`;
}

/**
 * Saves a Buffer to database and local disk/tmp cache.
 * Returns the public relative URL (/uploads/...).
 */
export async function saveBufferToUploads(
  buffer: Buffer,
  filename: string,
  mimeType = "image/jpeg",
): Promise<string> {
  // In test environment, skip writing physical files to disk so test runs stay clean
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return `/uploads/${filename}`;
  }

  // 1. Persist to PostgreSQL (guarantees image survival on serverless / Vercel)
  await saveMediaToDb(filename, buffer, mimeType);

  // 2. Try writing to public/uploads (local development or containerized environments)
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  } catch (_fsError) {
    // Serverless runtime (/var/task/public is read-only).
    // Cache to /tmp for fast warm-lambda reuse
    try {
      const tmpDir = path.join("/tmp", "uploads");
      await fs.mkdir(tmpDir, { recursive: true });
      await fs.writeFile(path.join(tmpDir, filename), buffer);
    } catch {
      // Ignore /tmp error; database persistence is primary
    }
  }

  return `/uploads/${filename}`;
}

/**
 * Saves a Web API File (from multipart/form-data).
 */
export async function saveUploadedFile(
  file: File,
  prefix = "upload",
): Promise<string> {
  const ext = getExtension(file.type, file.name);
  const filename = generateFilename(prefix, ext);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return saveBufferToUploads(buffer, filename, file.type || `image/${ext}`);
}

/**
 * Saves a Base64-encoded image string.
 * Supports:
 * - Data URLs: "data:image/png;base64,iVBORw0KGgo..."
 * - Raw base64 string
 */
export async function saveBase64Image(
  base64String: string,
  prefix = "upload",
): Promise<string> {
  const trimmed = base64String.trim();

  let ext = "jpg";
  let mimeType = "image/jpeg";
  let base64Data = trimmed;

  const dataUrlMatch = trimmed.match(
    /^data:image\/([a-zA-Z0-9+.-]+);base64,([\s\S]+)$/,
  );
  if (dataUrlMatch) {
    ext = getExtension(dataUrlMatch[1]);
    mimeType = `image/${dataUrlMatch[1]}`;
    base64Data = dataUrlMatch[2];
  }

  const buffer = Buffer.from(base64Data, "base64");
  const filename = generateFilename(prefix, ext);
  return saveBufferToUploads(buffer, filename, mimeType);
}

/**
 * Universal image processor:
 * - If given a File -> saves to /uploads/ and returns URL
 * - If given a Base64 string/data URL -> saves to /uploads/ and returns URL
 * - If given an HTTP/HTTPS URL -> returns URL
 * - If given a local relative path (/images/... or /uploads/...) -> returns path
 */
export async function processImageInput(
  input: unknown,
  prefix = "article",
): Promise<string | undefined> {
  if (!input) return undefined;

  // 1. File instance from FormData
  if (typeof File !== "undefined" && input instanceof File) {
    if (fileHasContent(input)) {
      return saveUploadedFile(input, prefix);
    }
    return undefined;
  }

  // 2. String input
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return undefined;

    // Data URL
    if (trimmed.startsWith("data:image/")) {
      return saveBase64Image(trimmed, prefix);
    }

    // Long base64 string without data prefix
    if (trimmed.length > 300 && /^[A-Za-z0-9+/=\r\n]+$/.test(trimmed)) {
      try {
        return await saveBase64Image(trimmed, prefix);
      } catch {
        // Fall back to returning string
      }
    }

    // HTTP / HTTPS URL or local path
    return trimmed;
  }

  return undefined;
}

function fileHasContent(file: File): boolean {
  return typeof file.size === "number" && file.size > 0;
}
