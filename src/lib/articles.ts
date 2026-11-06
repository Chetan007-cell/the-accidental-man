import { desc, eq, inArray } from "drizzle-orm";
import { type Story, stories as seedStories } from "@/lib/content";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { processImageInput } from "@/lib/images";

export interface CreateArticleInput {
  title: string;
  slug?: string;
  excerpt?: string;
  dek?: string;
  category?: string | string[];
  tags?: string[] | string;
  author?: string;
  authorName?: string;
  image?: string;
  imageAlt?: string;
  articleImage?: string;
  articleImageAlt?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  imageBase64?: string;
  file?: unknown;
  body?: string;
  content?: string;
  introduction?: string[];
  sections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  readingTimeMinutes?: number;
  publishedAt?: string | Date;
  status?: "published" | "draft";
  broadcast?: boolean;
}

/**
 * Generate a clean, URL-safe slug from a title
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate reading time in minutes based on total word count (~200 words/min)
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Formats a Date or ISO string into editorial style: e.g. "6 NOVEMBER 2026"
 */
export function formatEditorialDate(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    return `${now.getDate()} ${now.toLocaleString("en-US", { month: "long" }).toUpperCase()} ${now.getFullYear()}`;
  }
  return `${date.getDate()} ${date.toLocaleString("en-US", { month: "long" }).toUpperCase()} ${date.getFullYear()}`;
}

/**
 * Parses markdown or plain text body into structured introduction and sections
 */
export function parseArticleBody(
  bodyText = "",
  providedIntro?: string[],
  providedSections?: Array<{ heading: string; paragraphs: string[] }>,
): {
  introduction: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
} {
  if (
    providedIntro &&
    providedIntro.length > 0 &&
    providedSections &&
    providedSections.length > 0
  ) {
    return {
      introduction: providedIntro,
      sections: providedSections,
    };
  }

  const cleanBody = bodyText.replace(/\r\n/g, "\n").trim();
  if (!cleanBody) {
    return {
      introduction: providedIntro ?? [],
      sections: providedSections ?? [],
    };
  }

  // Split by double newline into block chunks
  const blocks = cleanBody
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const intro: string[] = [];
  const sections: Array<{ heading: string; paragraphs: string[] }> = [];

  let currentHeading: string | null = null;
  let currentParagraphs: string[] = [];

  for (const block of blocks) {
    // Check if block starts with markdown heading (# or ## or ###)
    const headingMatch = block.match(/^(#{1,4})\s+(.+)$/m);
    if (headingMatch) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          paragraphs: currentParagraphs,
        });
      } else if (currentParagraphs.length > 0) {
        intro.push(...currentParagraphs);
      }
      currentHeading = headingMatch[2].trim();
      currentParagraphs = [];

      // Check if there is body content after heading in the same block
      const remaining = block.replace(headingMatch[0], "").trim();
      if (remaining) {
        currentParagraphs.push(remaining);
      }
    } else if (currentHeading) {
      currentParagraphs.push(block);
    } else {
      currentParagraphs.push(block);
    }
  }

  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      paragraphs: currentParagraphs,
    });
  } else if (currentParagraphs.length > 0) {
    // If no headings found, split nicely
    if (currentParagraphs.length <= 2) {
      intro.push(...currentParagraphs);
    } else {
      intro.push(...currentParagraphs.slice(0, 2));
      sections.push({
        heading: "Reflections & Field Notes",
        paragraphs: currentParagraphs.slice(2),
      });
    }
  }

  return {
    introduction:
      providedIntro && providedIntro.length > 0 ? providedIntro : intro,
    sections:
      providedSections && providedSections.length > 0
        ? providedSections
        : sections,
  };
}

/**
 * Transforms a DB record into a front-end Story object
 */
export function dbArticleToStory(row: typeof articles.$inferSelect): Story {
  let structuredContent: {
    introduction?: string[];
    sections?: Array<{ heading: string; paragraphs: string[] }>;
  } = {};

  if (row.contentJson) {
    try {
      structuredContent = JSON.parse(row.contentJson);
    } catch {
      structuredContent = {};
    }
  }

  const { introduction, sections } = parseArticleBody(
    row.body,
    structuredContent.introduction,
    structuredContent.sections,
  );

  let tagsArray: string[] = [];
  if (row.tags) {
    try {
      const parsed = JSON.parse(row.tags);
      tagsArray = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      tagsArray = row.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  const pubDate = row.publishedAt ?? row.createdAt ?? new Date();
  const dateStr = formatEditorialDate(pubDate);
  const publishedAtIso =
    pubDate instanceof Date ? pubDate.toISOString() : String(pubDate);

  const heroImg = row.heroImageUrl || "/images/home-hero.png";
  const heroAlt = row.heroImageAlt || row.title;

  return {
    slug: row.slug,
    category: row.category || "FOUNDATIONS",
    tags: tagsArray.length > 0 ? tagsArray : [row.category || "Foundations"],
    title: row.title,
    excerpt: row.dek || row.title,
    author: row.authorName || "The Accidental Man",
    date: dateStr,
    publishedAt: publishedAtIso,
    readingTimeMinutes:
      row.readingTimeMinutes ||
      calculateReadingTime(`${row.title} ${row.dek || ""} ${row.body}`),
    image: heroImg,
    imageAlt: heroAlt,
    articleImage: heroImg,
    articleImageAlt: heroAlt,
    introduction:
      introduction.length > 0 ? introduction : [row.dek || row.title],
    sections: sections.length > 0 ? sections : [],
  };
}

/**
 * Sorts stories strictly in descending order of published date (newest first).
 */
export function sortStoriesDescending(list: Story[]): Story[] {
  return [...list].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.date).getTime() || 0;
    const timeB = new Date(b.publishedAt || b.date).getTime() || 0;
    return timeB - timeA;
  });
}

/**
 * Slugs generated during test runs that must never appear in public feeds or persist in DB.
 */
export const KNOWN_TEST_SLUGS = [
  "latest-breaking-editorial-note",
  "the-architecture-of-a-tailored-suit",
  "the-quiet-craftsman",
  "the-timeless-wardrobe",
  "visual-presence-and-proportion",
  "cold-water-and-deep-sleep",
  "broadcast-integration-test-note",
  "the-architecture-of-discipline",
  "the-architecture-of-discipline-revised",
  "unpublished-private-draft-essay",
  "unauthorized-test",
  "unauthorized-edit",
];

// In-memory cache of stories (starts with seed stories from content.ts, sorted descending)
const runtimeStories: Story[] = sortStoriesDescending([...seedStories]);

let hasCleanedTestSlugsFromDb = false;

/**
 * Checks whether database queries should be executed.
 * In test runners (Vitest / NODE_ENV=test), we bypass external databases
 * to ensure deterministic, fast, and hermetic tests that never pollute production data.
 */
function shouldConnectToDb(): boolean {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return false;
  }
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

export function getSynchronousStories(): Story[] {
  return runtimeStories;
}

export function resetRuntimeStories(): void {
  runtimeStories.length = 0;
  runtimeStories.push(
    ...sortStoriesDescending(
      [...seedStories].filter((s) => !KNOWN_TEST_SLUGS.includes(s.slug)),
    ),
  );
}

/**
 * Purges any test-generated articles from PostgreSQL.
 */
export async function purgeTestArticlesFromDb(): Promise<string[]> {
  const hasDb = shouldConnectToDb();
  if (!hasDb) return [];

  try {
    const database = getDb();
    const deleted = await database
      .delete(articles)
      .where(inArray(articles.slug, KNOWN_TEST_SLUGS))
      .returning({ slug: articles.slug });

    for (const testSlug of KNOWN_TEST_SLUGS) {
      const idx = runtimeStories.findIndex((s) => s.slug === testSlug);
      if (idx >= 0) {
        runtimeStories.splice(idx, 1);
      }
    }

    return deleted.map((d) => d.slug);
  } catch (err) {
    console.warn("Could not purge test articles from DB:", err);
    return [];
  }
}

export function registerStoryInMemory(story: Story): void {
  const existingIdx = runtimeStories.findIndex((s) => s.slug === story.slug);
  if (existingIdx >= 0) {
    runtimeStories[existingIdx] = story;
  } else {
    // New articles are added to the list
    runtimeStories.push(story);
  }
  const sorted = sortStoriesDescending(runtimeStories);
  runtimeStories.length = 0;
  runtimeStories.push(...sorted);
}

/**
 * Fetch all published stories (PostgreSQL database + seed stories), sorted newest first
 */
export async function getAllStories(): Promise<Story[]> {
  const hasDb = shouldConnectToDb();

  if (hasDb) {
    try {
      const database = getDb();

      // Automatically purge leftover test articles on server boot / build
      if (!hasCleanedTestSlugsFromDb) {
        hasCleanedTestSlugsFromDb = true;
        try {
          await database
            .delete(articles)
            .where(inArray(articles.slug, KNOWN_TEST_SLUGS));
        } catch {
          // ignore error if network momentarily blips
        }
      }

      const rows = await database
        .select()
        .from(articles)
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt), desc(articles.createdAt));

      // Filter out any stray test slugs
      const cleanRows = rows.filter((r) => !KNOWN_TEST_SLUGS.includes(r.slug));
      const dbStories = cleanRows.map(dbArticleToStory);

      // Merge database stories with seed stories (DB takes priority on matching slug)
      const combined: Story[] = [...dbStories];
      for (const seed of seedStories) {
        if (!combined.some((s) => s.slug === seed.slug)) {
          combined.push(seed);
        }
      }

      // Sort strictly descending by publication date
      const sorted = sortStoriesDescending(combined);

      // Keep synchronous in-memory list synchronized
      runtimeStories.length = 0;
      runtimeStories.push(...sorted);

      return sorted;
    } catch (error) {
      console.warn(
        "Could not query database for articles, using in-memory stories:",
        error,
      );
    }
  }

  return sortStoriesDescending(runtimeStories);
}

/**
 * Find single story by slug
 */
export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  // Check in-memory first for instant speed
  const inMemory = runtimeStories.find((s) => s.slug === slug);
  if (inMemory) return inMemory;

  const hasDb = shouldConnectToDb();
  if (hasDb) {
    try {
      const database = getDb();
      const [row] = await database
        .select()
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (row && row.status === "published") {
        const story = dbArticleToStory(row);
        registerStoryInMemory(story);
        return story;
      }
    } catch (error) {
      console.warn(`Error querying DB for story ${slug}:`, error);
    }
  }

  return undefined;
}

/**
 * Create or update a blog post in the database
 */
export async function createOrUpdateArticle(
  input: CreateArticleInput,
): Promise<{
  story: Story;
  created: boolean;
  rowId: string;
}> {
  const title = input.title?.trim();
  if (!title) {
    throw new Error("Article 'title' is required");
  }

  const slug = input.slug ? slugify(input.slug) : slugify(title);
  if (!slug) {
    throw new Error("Valid 'slug' could not be determined from title");
  }

  const rawBody = input.body || input.content || "";
  const { introduction, sections } = parseArticleBody(
    rawBody,
    input.introduction,
    input.sections,
  );

  const excerpt =
    input.excerpt?.trim() ||
    input.dek?.trim() ||
    introduction[0]?.slice(0, 180) ||
    title;

  // Unify category and tags so they can be used interchangeably
  let rawTags: string[] = [];
  if (Array.isArray(input.tags)) {
    rawTags = input.tags;
  } else if (typeof input.tags === "string" && input.tags.trim()) {
    rawTags = input.tags
      .split(/[,/]/)
      .map((t) => t.trim())
      .filter(Boolean);
  } else if (Array.isArray(input.category)) {
    rawTags = input.category;
  } else if (typeof input.category === "string" && input.category.trim()) {
    rawTags = input.category
      .split(/[,/]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  if (rawTags.length === 0) {
    rawTags = ["Foundations"];
  }

  // Format category display string (e.g. "MIND" or "MIND / EMOTIONS")
  let category = "FOUNDATIONS";
  if (typeof input.category === "string" && input.category.trim()) {
    category = input.category.trim().toUpperCase();
  } else if (rawTags.length > 0) {
    category = rawTags.join(" / ").toUpperCase();
  }

  const tagsArray = rawTags;

  const authorName =
    input.author?.trim() || input.authorName?.trim() || "The Accidental Man";

  const rawImageCandidate =
    input.image ||
    input.articleImage ||
    input.heroImageUrl ||
    input.imageBase64 ||
    input.file;

  let heroImageUrl = "/images/home-hero.png";
  if (rawImageCandidate) {
    const processed = await processImageInput(rawImageCandidate, slug);
    if (processed) {
      heroImageUrl = processed;
    }
  }

  const heroImageAlt =
    input.imageAlt || input.articleImageAlt || input.heroImageAlt || title;

  const readingTime =
    input.readingTimeMinutes && input.readingTimeMinutes > 0
      ? input.readingTimeMinutes
      : calculateReadingTime(`${title} ${excerpt} ${rawBody}`);

  const pubDate = input.publishedAt ? new Date(input.publishedAt) : new Date();
  const status = input.status || "published";

  const contentJson = JSON.stringify({ introduction, sections });

  let rowId = `local-${slug}`;
  let isCreated = !runtimeStories.some((s) => s.slug === slug);

  const hasDb = shouldConnectToDb();
  if (hasDb) {
    try {
      const database = getDb();

      // Check if article with slug already exists
      const [existing] = await database
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.slug, slug))
        .limit(1);

      if (existing) {
        // Update existing article
        await database
          .update(articles)
          .set({
            title,
            dek: excerpt,
            body: rawBody,
            status,
            authorName,
            heroImageUrl,
            heroImageAlt,
            category,
            tags: JSON.stringify(tagsArray),
            readingTimeMinutes: readingTime,
            contentJson,
            publishedAt: pubDate,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, existing.id));

        rowId = existing.id;
        isCreated = false;
      } else {
        // Insert new article
        const [inserted] = await database
          .insert(articles)
          .values({
            slug,
            title,
            dek: excerpt,
            body: rawBody,
            status,
            authorName,
            heroImageUrl,
            heroImageAlt,
            category,
            tags: JSON.stringify(tagsArray),
            readingTimeMinutes: readingTime,
            contentJson,
            publishedAt: pubDate,
          })
          .returning({ id: articles.id });

        rowId = inserted.id;
        isCreated = true;
      }
    } catch (dbError) {
      console.warn(
        "Could not persist article to database, keeping in memory:",
        dbError,
      );
    }
  }

  const story: Story = {
    slug,
    category,
    tags: tagsArray,
    title,
    excerpt,
    author: authorName,
    date: formatEditorialDate(pubDate),
    publishedAt: pubDate.toISOString(),
    readingTimeMinutes: readingTime,
    image: heroImageUrl,
    imageAlt: heroImageAlt,
    articleImage: heroImageUrl,
    articleImageAlt: heroImageAlt,
    introduction,
    sections,
  };

  if (status === "published") {
    registerStoryInMemory(story);
  } else {
    // If draft, ensure it is not in the published feed
    const existingIdx = runtimeStories.findIndex((s) => s.slug === slug);
    if (existingIdx >= 0) {
      runtimeStories.splice(existingIdx, 1);
    }
  }

  return {
    story,
    created: isCreated,
    rowId,
  };
}

/**
 * Delete an article by slug from DB and memory
 */
export async function deleteArticleBySlug(slug: string): Promise<boolean> {
  let dbDeleted = false;
  const hasDb = shouldConnectToDb();

  if (hasDb) {
    try {
      const database = getDb();
      const deleted = await database
        .delete(articles)
        .where(eq(articles.slug, slug))
        .returning({ id: articles.id });

      dbDeleted = deleted.length > 0;
    } catch (dbError) {
      console.warn("Could not delete article from database:", dbError);
    }
  }

  const inMemoryIdx = runtimeStories.findIndex((s) => s.slug === slug);
  if (inMemoryIdx >= 0) {
    runtimeStories.splice(inMemoryIdx, 1);
    return true;
  }

  return dbDeleted;
}
