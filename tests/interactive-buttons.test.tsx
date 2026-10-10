// @vitest-environment happy-dom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { NewsletterForm } from "@/components/newsletter-form";
import { ShareButton } from "@/components/share-button";

describe("Button & Interactive Controls: ShareButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls navigator.clipboard.writeText and shows 'Link copied.' on click", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    render(<ShareButton title="Test Article" />);

    const shareBtn = screen.getByRole("button", { name: /share this note/i });
    expect(shareBtn).toBeDefined();

    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalled();
      expect(screen.getByText("Link copied.")).toBeDefined();
    });
  });

  it("calls native navigator.share when available", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
      writable: true,
    });

    render(<ShareButton title="Test Article" />);

    const shareBtn = screen.getByRole("button", { name: /share this note/i });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Article" }),
      );
    });
  });
});

describe("Button & Interactive Controls: AnalyticsConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("allows user to accept analytics with the Allow button", async () => {
    render(<AnalyticsConsent />);

    const allowButton = screen.getByRole("button", {
      name: /allow analytics/i,
    });
    expect(allowButton).toBeDefined();

    fireEvent.click(allowButton);

    expect(localStorage.getItem("tam-analytics-consent-v1")).toBe("accepted");
    // Banner should close
    expect(
      screen.queryByRole("button", { name: /allow analytics/i }),
    ).toBeNull();
  });

  it("allows user to decline analytics with the Reject button", async () => {
    render(<AnalyticsConsent />);

    const rejectButton = screen.getByRole("button", {
      name: /reject analytics/i,
    });
    expect(rejectButton).toBeDefined();

    fireEvent.click(rejectButton);

    expect(localStorage.getItem("tam-analytics-consent-v1")).toBe("declined");

    // Banner should close, and privacy settings trigger button should be visible
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /open privacy settings/i }),
      ).toBeDefined();
    });
  });

  it("re-opens consent dialog when clicking Privacy settings button", async () => {
    localStorage.setItem("tam-analytics-consent-v1", "declined");
    render(<AnalyticsConsent />);

    const settingsBtn = screen.getByRole("button", {
      name: /open privacy settings/i,
    });
    fireEvent.click(settingsBtn);

    expect(
      screen.getByRole("button", { name: /allow analytics/i }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /reject analytics/i }),
    ).toBeDefined();
  });
});

describe("Button & Interactive Controls: NewsletterForm", () => {
  it("renders email input, required consent checkbox, and submit button", () => {
    render(<NewsletterForm />);

    const emailInput = screen.getByLabelText(/your email address/i);
    expect(emailInput).toBeDefined();
    expect(emailInput.getAttribute("type")).toBe("email");
    expect(emailInput.getAttribute("required")).not.toBeNull();

    const consentCheckbox = screen.getByRole("checkbox");
    expect(consentCheckbox).toBeDefined();
    expect(consentCheckbox.getAttribute("required")).not.toBeNull();

    const submitBtn = screen.getByRole("button", { name: /join the list/i });
    expect(submitBtn).toBeDefined();
    expect(submitBtn.getAttribute("type")).toBe("submit");
  });

  it("handles successful newsletter subscription flow", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ emailSent: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm />);

    const emailInput = screen.getByLabelText(/your email address/i);
    const consentCheckbox = screen.getByRole("checkbox");
    const submitBtn = screen.getByRole("button", { name: /join the list/i });

    fireEvent.change(emailInput, { target: { value: "tester@example.com" } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /thanks for joining us\. your welcome email is on its way\./i,
        ),
      ).toBeDefined();
    });

    vi.unstubAllGlobals();
  });

  it("handles submission failure with graceful error state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Subscription failed" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<NewsletterForm />);

    const emailInput = screen.getByLabelText(/your email address/i);
    const consentCheckbox = screen.getByRole("checkbox");
    const submitBtn = screen.getByRole("button", { name: /join the list/i });

    fireEvent.change(emailInput, { target: { value: "tester@example.com" } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /we couldn’t save that just now\. please try again\./i,
        ),
      ).toBeDefined();
    });

    vi.unstubAllGlobals();
  });
});
