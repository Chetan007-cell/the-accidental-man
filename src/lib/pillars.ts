import { type Story, stories } from "@/lib/content";

export interface PillarDefinition {
  number: string;
  slug: string;
  name: string;
  description: string;
  status: "active" | "expanding";
  summary: string;
  tagMatches: string[];
  highlightStorySlug?: string;
  highlightStoryTitle?: string;
}

export const PILLARS: PillarDefinition[] = [
  {
    number: "01",
    slug: "mind",
    name: "Mind",
    description:
      "Learning, attention, habits, judgment, confidence, and mental clarity.",
    summary:
      "Cultivating mental clarity, focus, discipline, and emotional intelligence in a world designed to distract and overstimulate.",
    status: "active",
    tagMatches: ["Mind", "Self-Awareness", "Energy & Frequency"],
    highlightStorySlug: "celebrating-yourself-or-seeking-validation",
    highlightStoryTitle: "Are You Celebrating Yourself, or Seeking Validation?",
  },
  {
    number: "02",
    slug: "emotions",
    name: "Emotions",
    description:
      "Emotional literacy, resilience, self-respect, asking for help, and coping skills.",
    summary:
      "Building emotional resilience, understanding vulnerability as quiet strength, and mastering emotional literacy without suppression.",
    status: "active",
    tagMatches: ["Emotions", "Foundations"],
    highlightStorySlug: "a-man-isnt-born-hes-built",
    highlightStoryTitle: "A Man Isn’t Born. He’s Built.",
  },
  {
    number: "03",
    slug: "body",
    name: "Body",
    description:
      "Movement, strength, sleep, nutrition, health, and sustainable physical care.",
    summary:
      "Developing physical capability, energy flow, restorative recovery, and long-term vitality that stands the test of time.",
    status: "active",
    tagMatches: ["Body", "Health", "Movement", "Physical"],
    highlightStorySlug: "the-world-is-governed-by-energy",
    highlightStoryTitle: "The World is Governed by Energy",
  },
  {
    number: "04",
    slug: "spirit-purpose",
    name: "Spirit & Purpose",
    description:
      "Values, meaning, identity, reflection, and the questions that guide a life.",
    summary:
      "Discovering what gives your life substance, aligning with deeper universal laws, and living according to principles rather than impulse.",
    status: "active",
    tagMatches: ["Spirit & Purpose", "Spirit", "Purpose"],
    highlightStorySlug: "the-world-is-governed-by-energy",
    highlightStoryTitle: "The World is Governed by Energy",
  },
  {
    number: "05",
    slug: "grooming",
    name: "Grooming",
    description:
      "Simple, inclusive routines, practical self-care, and daily maintenance.",
    summary:
      "The discipline of everyday self-respect: clean, honest grooming routines that elevate presence without vanity.",
    status: "expanding",
    tagMatches: ["Grooming"],
  },
  {
    number: "06",
    slug: "style",
    name: "Style",
    description:
      "Fit, function, self-expression, and dressing for real situations and budgets.",
    summary:
      "Intentional dressing built on fit, proportion, timeless craftsmanship, and quiet confidence.",
    status: "expanding",
    tagMatches: ["Style"],
  },
  {
    number: "07",
    slug: "career-money",
    name: "Career & Money",
    description:
      "Work, craft, financial fundamentals, decisions, and long-term stability.",
    summary:
      "Building meaningful craft, financial independence, professional integrity, and generational resilience.",
    status: "expanding",
    tagMatches: ["Career & Money", "Career", "Money"],
  },
  {
    number: "08",
    slug: "relationships",
    name: "Relationships",
    description:
      "Friendship, family, partnership, communication, boundaries, and care.",
    summary:
      "Stewardship of the bonds that matter: honest communication, clear boundaries, and being a man others can count on.",
    status: "expanding",
    tagMatches: ["Relationships", "Friendship", "Family"],
  },
  {
    number: "09",
    slug: "life",
    name: "Life",
    description:
      "Home, time, responsibility, transitions, culture, leisure, and whole living.",
    summary:
      "Harmonizing work, rest, home environment, and personal time into a coherent, dignified way of living.",
    status: "expanding",
    tagMatches: ["Life"],
  },
];

/**
 * Normalizes a slug or tag name to find its matching pillar
 */
export function findPillarBySlug(
  rawSlug: string,
): PillarDefinition | undefined {
  const normalized = rawSlug
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  // Direct slug match
  const direct = PILLARS.find((p) => p.slug === normalized);
  if (direct) return direct;

  // Alternate slug aliases
  if (
    normalized === "spirit" ||
    normalized === "purpose" ||
    normalized === "spirit-and-purpose"
  ) {
    return PILLARS.find((p) => p.slug === "spirit-purpose");
  }
  if (
    normalized === "career" ||
    normalized === "money" ||
    normalized === "career-and-money"
  ) {
    return PILLARS.find((p) => p.slug === "career-money");
  }

  // Name match
  return PILLARS.find(
    (p) =>
      p.name.toLowerCase() === rawSlug.trim().toLowerCase() ||
      p.tagMatches.some(
        (t) => t.toLowerCase() === rawSlug.trim().toLowerCase(),
      ),
  );
}

/**
 * Returns all articles tagged into a specific pillar
 */
export function getStoriesForPillar(pillarSlugOrName: string): Story[] {
  const pillar = findPillarBySlug(pillarSlugOrName);
  if (!pillar) return [];

  return stories.filter((story) => {
    // 1. Check highlight slug
    if (pillar.highlightStorySlug && story.slug === pillar.highlightStorySlug) {
      return true;
    }

    // 2. Check explicit story tags
    if ("tags" in story && Array.isArray(story.tags)) {
      const hasTagMatch = story.tags.some((tag: string) =>
        pillar.tagMatches.some(
          (match) =>
            tag.toLowerCase().includes(match.toLowerCase()) ||
            match.toLowerCase().includes(tag.toLowerCase()),
        ),
      );
      if (hasTagMatch) return true;
    }

    // 3. Check story category string
    const categoryUpper = story.category.toUpperCase();
    return pillar.tagMatches.some((match) =>
      categoryUpper.includes(match.toUpperCase()),
    );
  });
}
