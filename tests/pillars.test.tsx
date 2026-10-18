// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PillarPage from "@/app/pillars/[slug]/page";
import { PillarsSection } from "@/components/pillars-section";
import { findPillarBySlug, getStoriesForPillar, PILLARS } from "@/lib/pillars";

describe("Pillars Library & Tagging", () => {
  it("should have all 9 defined pillars with valid metadata", () => {
    expect(PILLARS).toHaveLength(9);
    for (const pillar of PILLARS) {
      expect(pillar.number).toMatch(/^\d{2}$/);
      expect(pillar.slug.length).toBeGreaterThan(0);
      expect(pillar.name.length).toBeGreaterThan(0);
      expect(pillar.description.length).toBeGreaterThan(0);
      expect(pillar.summary.length).toBeGreaterThan(0);
    }
  });

  it("finds pillars by slug and aliases", () => {
    expect(findPillarBySlug("mind")?.name).toBe("Mind");
    expect(findPillarBySlug("body")?.name).toBe("Body");
    expect(findPillarBySlug("spirit")?.name).toBe("Spirit & Purpose");
    expect(findPillarBySlug("spirit-purpose")?.name).toBe("Spirit & Purpose");
    expect(findPillarBySlug("emotions")?.name).toBe("Emotions");
  });

  it("correctly maps tagged articles to each pillar", () => {
    const mindStories = getStoriesForPillar("mind");
    expect(mindStories.map((s) => s.slug)).toContain(
      "celebrating-yourself-or-seeking-validation",
    );
    expect(mindStories.map((s) => s.slug)).toContain(
      "the-world-is-governed-by-energy",
    );

    const bodyStories = getStoriesForPillar("body");
    expect(bodyStories.map((s) => s.slug)).toContain(
      "the-world-is-governed-by-energy",
    );

    const spiritStories = getStoriesForPillar("spirit-purpose");
    expect(spiritStories.map((s) => s.slug)).toContain(
      "the-world-is-governed-by-energy",
    );

    const emotionsStories = getStoriesForPillar("emotions");
    expect(emotionsStories.map((s) => s.slug)).toContain(
      "a-man-isnt-born-hes-built",
    );
  });
});

describe("Pillars Section Links", () => {
  it("links each of the 9 pillars to its dedicated pillar page", () => {
    render(<PillarsSection />);

    for (const pillar of PILLARS) {
      const pillarTitleLink = screen.getByRole("link", { name: pillar.name });
      expect(pillarTitleLink.getAttribute("href")).toBe(
        `/pillars/${pillar.slug}`,
      );
    }
  });
});

describe("Pillar Single Page Component", () => {
  it("renders all tagged articles on a pillar page", async () => {
    const pageComponent = await PillarPage({
      params: Promise.resolve({ slug: "mind" }),
    });
    render(pageComponent);

    expect(
      screen.getByRole("heading", { level: 1, name: "Mind" }),
    ).toBeDefined();
    expect(screen.getByText("The World is Governed by Energy")).toBeDefined();
    expect(
      screen.getByText(
        "Are You Celebrating Yourself, or Seeking Validation From Others?",
      ),
    ).toBeDefined();
  });

  it("renders the expansion notice when a pillar has no published articles yet", async () => {
    const pageComponent = await PillarPage({
      params: Promise.resolve({ slug: "grooming" }),
    });
    render(pageComponent);

    expect(
      screen.getByRole("heading", { level: 1, name: "Grooming" }),
    ).toBeDefined();
    expect(
      screen.getByText(
        /field notes & practical guides in editorial development/i,
      ),
    ).toBeDefined();
  });
});
