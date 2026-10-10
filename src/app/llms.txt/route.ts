import { NextResponse } from "next/server";
import { stories } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const baseUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

  const lines = [
    "# The Accidental Man",
    "",
    "> A factory for the modern man. A practical, thoughtful publication and platform helping men learn, reflect, practice, maintain, and evolve across everyday life. A man isn't born. He's built.",
    "",
    "## Core Philosophy: Three Tenets",
    "- **01 Become**: Starting where you are without shame. Unlearning inherited noise, facing tough questions, and accepting that being unfinished is where real growth begins.",
    "- **02 Maintain**: The daily architecture. Grounded routines, physical vitality, mental clarity, emotional literacy, and showing up for the commitments you made.",
    "- **03 Evolve**: Expanding your capacity over time. Deepening your craft, cultivating dependable relationships, and defining a life you respect.",
    "",
    "## The Nine Pillars",
    "1. **Mind**: Learning, attention, habits, judgment, confidence, and mental clarity.",
    "2. **Emotions**: Emotional literacy, resilience, self-respect, asking for help, and coping skills.",
    "3. **Body**: Movement, strength, sleep, nutrition, health, and sustainable physical care.",
    "4. **Spirit & Purpose**: Values, meaning, identity, reflection, and guiding principles.",
    "5. **Grooming**: Simple, inclusive routines, practical self-care, and daily maintenance.",
    "6. **Style**: Fit, function, self-expression, and dressing for real situations and budgets.",
    "7. **Career & Money**: Work, craft, financial fundamentals, decisions, and long-term stability.",
    "8. **Relationships**: Friendship, family, partnership, communication, boundaries, and care.",
    "9. **Life**: Home, time, responsibility, transitions, culture, leisure, and whole living.",
    "",
    "## Flagship Essays & Field Notes",
    ...stories.map(
      (s) =>
        `- [${s.title}](${baseUrl}/journal/${s.slug}): ${s.excerpt} (Category: ${s.category}, ${s.readingTimeMinutes} min read)`,
    ),
    "",
    "## Primary Pages & Resources",
    `- [Home](${baseUrl}/): Overview of brand philosophy, three tenets, nine pillars, and newsletter.`,
    `- [The Journal](${baseUrl}/journal): Collection of field notes, reflections, and essays.`,
    `- [Privacy Notice](${baseUrl}/privacy): Data protection, optional analytics consent, and newsletter preferences.`,
    `- [Full LLM Context](${baseUrl}/llms-full.txt): Comprehensive background, brand creed, and complete essay texts.`,
    "",
    "## Editorial Contact",
    "- Editorial Desk: hello@theaccidentalman.com",
    "- Publisher: The Accidental Man",
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
