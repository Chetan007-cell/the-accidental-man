// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JournalFeed } from "@/components/journal-feed";
import { stories } from "@/lib/content";

describe("Button & Filter Functionality: JournalFeed", () => {
  it("renders all category filter buttons and links", () => {
    render(<JournalFeed stories={stories} />);

    expect(screen.getByRole("button", { name: /ALL ESSAYS/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /FOUNDATIONS/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: /MIND & SELF-AWARENESS/i }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: /EMOTIONS/i })).toBeDefined();
    expect(
      screen.getByRole("link", { name: /explore all nine pillars/i }),
    ).toBeDefined();
  });

  it("defaults to ALL ESSAYS filter with all stories visible", () => {
    render(<JournalFeed stories={stories} />);

    const allButton = screen.getByRole("button", { name: /ALL ESSAYS/i });
    expect(allButton.getAttribute("aria-pressed")).toBe("true");

    // All stories should be visible
    for (const story of stories) {
      expect(screen.getByText(story.title)).toBeDefined();
    }
  });

  it("filters stories when clicking category filter buttons", () => {
    render(<JournalFeed stories={stories} />);

    // Click FOUNDATIONS button
    const foundationsButton = screen.getByRole("button", {
      name: /FOUNDATIONS/i,
    });
    fireEvent.click(foundationsButton);

    expect(foundationsButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("A Man Isn’t Born. He’s Built.")).toBeDefined();

    // Click MIND & SELF-AWARENESS button
    const mindButton = screen.getByRole("button", {
      name: /MIND & SELF-AWARENESS/i,
    });
    fireEvent.click(mindButton);

    expect(mindButton.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getByText(
        "Are You Celebrating Yourself, or Seeking Validation From Others?",
      ),
    ).toBeDefined();

    // Click ALL ESSAYS to reset
    const allButton = screen.getByRole("button", { name: /ALL ESSAYS/i });
    fireEvent.click(allButton);
    expect(allButton.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("A Man Isn’t Born. He’s Built.")).toBeDefined();
    expect(
      screen.getByText(
        "Are You Celebrating Yourself, or Seeking Validation From Others?",
      ),
    ).toBeDefined();
  });

  it("renders story card links pointing to valid article slugs", () => {
    render(<JournalFeed stories={stories} />);

    const storyLinks = screen.getAllByRole("link", { name: /read/i });
    expect(storyLinks.length).toBeGreaterThan(0);

    for (const story of stories) {
      const link = screen.getByRole("link", {
        name: new RegExp(story.title, "i"),
      });
      expect(link.getAttribute("href")).toBe(`/journal/${story.slug}`);
    }
  });

  it("displays dynamic story counts on filter buttons that match filtered count exactly", () => {
    render(<JournalFeed stories={stories} />);

    // All essays button should display (3)
    const allButton = screen.getByRole("button", { name: /ALL ESSAYS/i });
    expect(allButton.textContent).toContain("3");

    // Mind button should display (2)
    const mindButton = screen.getByRole("button", {
      name: /MIND & SELF-AWARENESS/i,
    });
    expect(mindButton.textContent).toContain("2");

    // Body button should display (1)
    const bodyButton = screen.getByRole("button", { name: /^BODY/i });
    expect(bodyButton.textContent).toContain("1");
  });
});
