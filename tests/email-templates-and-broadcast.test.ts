import { beforeEach, describe, expect, it } from "vitest";
import { POST as broadcastPost } from "@/app/api/admin/broadcast/route";
import {
  renderBlogBroadcastEmail,
  renderWelcomeEmail,
} from "@/lib/email/templates";

describe("Email Templates & Rendering", () => {
  const dummyAppUrl = "https://theaccidentalman.com";
  const dummyArticleUrl =
    "https://theaccidentalman.com/journal/a-man-isnt-born-hes-built";
  const dummyUnsubscribeUrl =
    "https://theaccidentalman.com/newsletter/unsubscribe?token=abc123token";

  it("renders a luxury welcome email with proper header, tenets, and footer", () => {
    const { subject, html, text } = renderWelcomeEmail({
      articleUrl: dummyArticleUrl,
      unsubscribeUrl: dummyUnsubscribeUrl,
      appUrl: dummyAppUrl,
    });

    // Subject
    expect(subject).toContain("Welcome to The Accidental Man");
    expect(subject).toContain("A man isn’t born. He’s built.");

    // Header & Brand
    expect(html).toContain("THE ACCIDENTAL MAN");
    expect(html).toContain("A FACTORY FOR THE MODERN MAN");

    // Three Tenets
    expect(html).toContain("01 Become");
    expect(html).toContain("02 Maintain");
    expect(html).toContain("03 Evolve");

    // Article Link
    expect(html).toContain(dummyArticleUrl);

    // Footer with editorial contact and unsubscribe
    expect(html).toContain("hello@theaccidentalman.com");
    expect(html).toContain(dummyUnsubscribeUrl);

    // Text fallback
    expect(text).toContain("OUR THREE TENETS");
    expect(text).toContain(dummyArticleUrl);
    expect(text).toContain(dummyUnsubscribeUrl);
  });

  it("renders a luxury blog announcement email with proper metadata and link", () => {
    const { subject, html, text } = renderBlogBroadcastEmail({
      title: "Are You Celebrating Yourself, or Seeking Validation?",
      excerpt:
        "Two people can do the same thing for completely different reasons.",
      category: "Mind & Self-Awareness",
      readingTimeMinutes: 5,
      slug: "celebrating-yourself-or-seeking-validation",
      unsubscribeUrl: dummyUnsubscribeUrl,
      appUrl: dummyAppUrl,
    });

    expect(subject).toBe(
      "New Essay: Are You Celebrating Yourself, or Seeking Validation? — The Accidental Man",
    );
    expect(html).toContain("NEW ESSAY DISPATCH");
    expect(html).toContain("MIND & SELF-AWARENESS");
    expect(html).toContain("5 MIN READ");
    expect(html).toContain(
      "Two people can do the same thing for completely different reasons.",
    );
    expect(html).toContain(
      `${dummyAppUrl}/journal/celebrating-yourself-or-seeking-validation`,
    );
    expect(html).toContain("hello@theaccidentalman.com");
    expect(html).toContain(dummyUnsubscribeUrl);
    expect(text).toContain(dummyUnsubscribeUrl);
  });
});

describe("Admin Broadcast API: /api/admin/broadcast", () => {
  beforeEach(() => {
    process.env.ADMIN_API_KEY = "test_super_secret_key";
  });

  it("returns 401 when Authorization header is missing or invalid", async () => {
    const req = new Request("http://localhost:3000/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleSlug: "a-man-isnt-born-hes-built" }),
    });

    const res = await broadcastPost(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when articleSlug is missing", async () => {
    const req = new Request("http://localhost:3000/api/admin/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_super_secret_key",
      },
      body: JSON.stringify({}),
    });

    const res = await broadcastPost(req);
    expect(res.status).toBe(400);
  });
});
