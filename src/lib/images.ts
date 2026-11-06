import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Ensures the uploads directory exists on disk.
 */
export async function ensureUploadsDir(): Promise<string> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
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
 * Saves a Buffer to public/uploads and returns the public relative URL (/uploads/...).
 */
export async function saveBufferToUploads(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  // In test environment, skip writing physical files to disk so test runs stay clean
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return `/uploads/${filename}`;
  }

  await ensureUploadsDir();
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

/**
 * Saves a Web API File (from multipart/form-data) to disk.
 */
export async function saveUploadedFile(
  file: File,
  prefix = "upload",
): Promise<string> {
  const ext = getExtension(file.type, file.name);
  const filename = generateFilename(prefix, ext);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return saveBufferToUploads(buffer, filename);
}

/**
 * Saves a Base64-encoded image string to disk.
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
  let base64Data = trimmed;

  const dataUrlMatch = trimmed.match(
    /^data:image\/([a-zA-Z0-9+.-]+);base64,([\s\S]+)$/,
  );
  if (dataUrlMatch) {
    ext = getExtension(dataUrlMatch[1]);
    base64Data = dataUrlMatch[2];
  }

  const buffer = Buffer.from(base64Data, "base64");
  const filename = generateFilename(prefix, ext);
  return saveBufferToUploads(buffer, filename);
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
