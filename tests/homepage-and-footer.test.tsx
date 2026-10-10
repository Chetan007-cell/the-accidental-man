// @vitest-environment happy-dom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-serif" }),
  Plus_Jakarta_Sans: () => ({ variable: "--font-sans" }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import RootLayout from "@/app/layout";
import HomePage from "@/app/page";
import { PillarsSection } from "@/components/pillars-section";

describe("Button & Link Functionality: Homepage CTAs", () => {
  it("renders hero primary and secondary action buttons", () => {
    render(<HomePage />);

    const journalCta = screen.getByRole("link", { name: /read the journal/i });
    expect(journalCta.getAttribute("href")).toBe("/journal");

    const pillarsCta = screen.getByRole("link", {
      name: /explore the 9 pillars/i,
    });
    expect(pillarsCta.getAttribute("href")).toBe("#pillars");
  });

  it("renders foundational essay spotlight button and journal links", () => {
    render(<HomePage />);

    const foundationalEssayBtn = screen.getByRole("link", {
      name: /read the foundational essay/i,
    });
    expect(foundationalEssayBtn.getAttribute("href")).toBe(
      "/journal/a-man-isnt-born-hes-built",
    );

    const allStoriesLink = screen.getByRole("link", { name: /all stories/i });
    expect(allStoriesLink.getAttribute("href")).toBe("/journal");
  });
});

describe("Button & Link Functionality: PillarsSection", () => {
  it("renders all 9 pillar cards and their status indicators", () => {
    render(<PillarsSection />);

    expect(screen.getByText("Mind")).toBeDefined();
    expect(screen.getByText("Emotions")).toBeDefined();
    expect(screen.getByText("Body")).toBeDefined();
    expect(screen.getByText("Spirit & Purpose")).toBeDefined();
    expect(screen.getByText("Grooming")).toBeDefined();
    expect(screen.getByText("Style")).toBeDefined();
    expect(screen.getByText("Career & Money")).toBeDefined();
    expect(screen.getByText("Relationships")).toBeDefined();
    expect(screen.getByText("Life")).toBeDefined();

    // Active pillars have links to journal stories
    const mindStoryLink = screen.getByRole("link", {
      name: /read: are you celebrating yourself/i,
    });
    expect(mindStoryLink.getAttribute("href")).toBe(
      "/journal/celebrating-yourself-or-seeking-validation",
    );

    const emotionsStoryLink = screen.getByRole("link", {
      name: /read: a man isn’t born\. he’s built\./i,
    });
    expect(emotionsStoryLink.getAttribute("href")).toBe(
      "/journal/a-man-isnt-born-hes-built",
    );

    // Call to action button at the bottom of the section
    const exploreEssaysBtn = screen.getByRole("link", {
      name: /explore current essays/i,
    });
    expect(exploreEssaysBtn.getAttribute("href")).toBe("/journal");
  });
});

describe("Footer Links & Social Channels", () => {
  it("renders footer contact email and social channels including Pinterest", () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>,
    );

    // Editorial email
    const emailLink = screen.getByRole("link", {
      name: "hello@theaccidentalman.com",
    });
    expect(emailLink.getAttribute("href")).toBe(
      "mailto:hello@theaccidentalman.com",
    );

    // Social channel links
    const linkedIn = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedIn.getAttribute("href")).toBe(
      "https://www.linkedin.com/company/theaccidentalman/",
    );

    const instagram = screen.getByRole("link", { name: /instagram/i });
    expect(instagram.getAttribute("href")).toBe(
      "https://www.instagram.com/theaccidentalman/",
    );

    const youtube = screen.getByRole("link", { name: /youtube/i });
    expect(youtube.getAttribute("href")).toBe(
      "https://www.youtube.com/@theaccidentalman",
    );

    const pinterest = screen.getByRole("link", { name: /pinterest/i });
    expect(pinterest.getAttribute("href")).toBe("https://pin.it/ixKK7ireQ");
    expect(pinterest.getAttribute("target")).toBe("_blank");
  });
});
