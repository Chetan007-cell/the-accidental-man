// @vitest-environment happy-dom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Button & Navigation Functionality: SiteHeader", () => {
  it("renders desktop navigation links with correct targets", () => {
    render(<SiteHeader />);

    // Brand link
    const brandLink = screen.getByRole("link", { name: /the accidental man/i });
    expect(brandLink.getAttribute("href")).toBe("/");

    // Desktop nav buttons/links
    const journalLinks = screen.getAllByRole("link", { name: "Journal" });
    expect(
      journalLinks.some((l) => l.getAttribute("href") === "/journal"),
    ).toBe(true);

    const pillarLinks = screen.getAllByRole("link", { name: "Pillars" });
    expect(
      pillarLinks.some((l) => l.getAttribute("href") === "/#pillars"),
    ).toBe(true);

    const philosophyLinks = screen.getAllByRole("link", { name: "Philosophy" });
    expect(
      philosophyLinks.some((l) => l.getAttribute("href") === "/#about"),
    ).toBe(true);

    const lettersLinks = screen.getAllByRole("link", { name: "Letters" });
    expect(
      lettersLinks.some((l) => l.getAttribute("href") === "/#newsletter"),
    ).toBe(true);
  });

  it("handles mobile menu button toggle and state changes", () => {
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeDefined();
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(menuButton.textContent).toBe("MENU");

    // Click to open menu
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");
    expect(menuButton.getAttribute("aria-label")).toBe("Close menu");
    expect(menuButton.textContent).toBe("CLOSE");
    expect(document.body.style.overflow).toBe("hidden");

    // Click to close menu
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(menuButton.getAttribute("aria-label")).toBe("Open menu");
    expect(menuButton.textContent).toBe("MENU");
    expect(document.body.style.overflow).toBe("");
  });

  it("closes mobile menu when pressing Escape key", () => {
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.style.overflow).toBe("");
  });

  it("closes mobile menu when clicking backdrop overlay", () => {
    const { container } = render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    const overlay = container.querySelector("#mobile-navigation");
    expect(overlay).not.toBeNull();

    // Click backdrop overlay directly
    if (overlay) {
      fireEvent.click(overlay);
      expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("closes mobile menu when a mobile nav link is clicked", () => {
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    // Click on mobile 'Pillars' link
    const mobilePillarsLink = screen.getAllByRole("link", {
      name: "Pillars",
    })[1];
    fireEvent.click(mobilePillarsLink);

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(document.body.style.overflow).toBe("");
  });

  it("ensures mobile navigation overlay is inert and links have tabIndex=-1 when closed", () => {
    const { container } = render(<SiteHeader />);

    const overlay = container.querySelector("#mobile-navigation");
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute("aria-hidden")).toBe("true");
    expect(overlay?.hasAttribute("inert")).toBe(true);

    const mobileLinks = overlay?.querySelectorAll("a");
    expect(mobileLinks && mobileLinks.length > 0).toBe(true);
    mobileLinks?.forEach((link) => {
      expect(link.getAttribute("tabIndex")).toBe("-1");
    });

    // Open menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    expect(overlay?.getAttribute("aria-hidden")).toBe("false");
    expect(overlay?.hasAttribute("inert")).toBe(false);
    mobileLinks?.forEach((link) => {
      expect(link.getAttribute("tabIndex")).toBe("0");
    });
  });
});
