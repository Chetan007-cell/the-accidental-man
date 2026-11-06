// @vitest-environment happy-dom
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

// Mock next/cache revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  POST as createArticles,
  GET as getArticles,
} from "@/app/api/articles/route";
import {
  DELETE,
  GET as getSinglePost,
  PUT,
} from "@/app/api/posts/[slug]/route";
import { POST as createPost, GET as getPosts } from "@/app/api/posts/route";
import { POST as uploadImage } from "@/app/api/upload/route";
import HomePage from "@/app/page";
import {
  calculateReadingTime,
  getAllStories,
  parseArticleBody,
  resetRuntimeStories,
  slugify,
} from "@/lib/articles";
import { getStoriesForPillar } from "@/lib/pillars";

describe("Blog Post Parsing Utilities", () => {
  it("slugifies titles cleanly without punctuation", () => {
    expect(slugify("A Man Isn't Born. He's Built!")).toBe(
      "a-man-isnt-born-hes-built",
    );
    expect(slugify("The 9 Pillars of 2026: A Modern Guide")).toBe(
      "the-9-pillars-of-2026-a-modern-guide",
    );
    expect(slugify("   Quiet Confidence   ")).toBe("quiet-confidence");
  });

  it("calculates reading time reasonably (~200 words/min)", () => {
    const text100 = new Array(100).fill("word").join(" ");
    expect(calculateReadingTime(text100)).toBe(1);

    const text500 = new Array(500).fill("word").join(" ");
    expect(calculateReadingTime(text500)).toBe(3);
  });

  it("parses markdown with headings into intro and sections", () => {
    const markdown = `
At some point, most of us realise that adulthood doesn't arrive as a clean moment.

We have to build our own lives.

## The Boy We Were
Most of us enter adulthood with pieces of a plan.

They do not teach us how to live.

## You Become What You Repeatedly Do
Character is rarely built in one dramatic moment.
It takes shape through repetition.
`;

    const { introduction, sections } = parseArticleBody(markdown);

    expect(introduction.length).toBe(2);
    expect(introduction[0]).toContain("adulthood doesn't arrive");
    expect(sections.length).toBe(2);
    expect(sections[0].heading).toBe("The Boy We Were");
    expect(sections[0].paragraphs.length).toBe(2);
    expect(sections[1].heading).toBe("You Become What You Repeatedly Do");
  });

  it("preserves explicit introduction and sections if provided", () => {
    const explicitIntro = ["Custom intro paragraph"];
    const explicitSections = [
      { heading: "Custom Heading", paragraphs: ["Custom paragraph"] },
    ];

    const result = parseArticleBody(
      "Some raw text",
      explicitIntro,
      explicitSections,
    );

    expect(result.introduction).toEqual(explicitIntro);
    expect(result.sections).toEqual(explicitSections);
  });
});

describe("API: /api/posts and /api/posts/[slug]", () => {
  const secretKey = "test-secret-key-12345";

  beforeAll(() => {
    resetRuntimeStories();
  });

  afterAll(() => {
    resetRuntimeStories();
  });

  beforeEach(() => {
    process.env.ADMIN_API_KEY = secretKey;
    process.env.APP_URL = "https://theaccidentalman.com";
  });

  it("GET /api/posts returns 200 with list of posts and URLs", async () => {
    const request = new Request("http://localhost:3000/api/posts");
    const response = await getPosts(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.posts)).toBe(true);
    expect(data.posts.length).toBeGreaterThanOrEqual(3);

    const first = data.posts[0];
    expect(first.slug).toBeDefined();
    expect(first.title).toBeDefined();
    expect(first.url).toContain("https://theaccidentalman.com/journal/");
  });

  it("POST /api/posts rejects unauthorized requests with 401", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Unauthorized Test" }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toContain("Unauthorized");
  });

  it("POST /api/posts rejects invalid JSON with 400", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: "invalid-json-content",
    });

    const response = await createPost(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid JSON in request body");
  });

  it("POST /api/posts rejects missing title with 400", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({ category: "MIND" }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Validation failed");
  });

  it("POST /api/posts creates a new post with x-api-key header", async () => {
    const payload = {
      title: "The Architecture of Discipline",
      category: "MIND",
      tags: ["Mind", "Emotions"],
      body: `Discipline is not self-punishment; it is self-respect.

When you keep a promise to yourself, your self-esteem solidifies.

## Morning Standard
Never start the day in emergency mode.

Step outside, take in daylight, and set one clear intention before checking the feed.

## The Quiet Work
Real progress is rarely dramatic. It is quiet and daily.`,
    };

    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secretKey,
      },
      body: JSON.stringify(payload),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);
    const data = await response.json();

    expect(data.ok).toBe(true);
    expect(data.post.slug).toBe("the-architecture-of-discipline");
    expect(data.post.title).toBe("The Architecture of Discipline");
    expect(data.post.category).toBe("MIND");
    expect(data.post.tags).toContain("Mind");
    expect(data.post.introduction.length).toBe(2);
    expect(data.post.sections.length).toBe(2);
    expect(data.url).toBe(
      "https://theaccidentalman.com/journal/the-architecture-of-discipline",
    );
  });

  it("POST /api/posts seamlessly unifies category and tags when only one is provided", async () => {
    // 1. Pass only category: "Body / Vitality"
    const req1 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secretKey,
      },
      body: JSON.stringify({
        title: "Cold Water and Deep Sleep",
        category: "Body / Vitality",
        body: "Rest is not laziness. It is the soil of recovery.",
      }),
    });

    const res1 = await createPost(req1);
    expect(res1.status).toBe(201);
    const data1 = await res1.json();
    expect(data1.post.category).toBe("BODY / VITALITY");
    expect(data1.post.tags).toEqual(["Body", "Vitality"]);

    // 2. Pass only tags: ["Style", "Wardrobe"]
    const req2 = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secretKey,
      },
      body: JSON.stringify({
        title: "The Timeless Wardrobe",
        tags: ["Style", "Wardrobe"],
        body: "Dressing well is a form of good manners.",
      }),
    });

    const res2 = await createPost(req2);
    expect(res2.status).toBe(201);
    const data2 = await res2.json();
    expect(data2.post.category).toBe("STYLE / WARDROBE");
    expect(data2.post.tags).toEqual(["Style", "Wardrobe"]);
  });

  it("GET /api/posts/[slug] retrieves created post", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/the-architecture-of-discipline",
    );
    const response = await getSinglePost(request, {
      params: Promise.resolve({ slug: "the-architecture-of-discipline" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.post.title).toBe("The Architecture of Discipline");
  });

  it("GET /api/posts/[slug] returns 404 for unknown slug", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/non-existent-article-xyz",
    );
    const response = await getSinglePost(request, {
      params: Promise.resolve({ slug: "non-existent-article-xyz" }),
    });

    expect(response.status).toBe(404);
  });

  it("PUT /api/posts/[slug] updates post details", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/the-architecture-of-discipline",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          title: "The Architecture of Discipline (Revised)",
          body: "Updated introduction.\n\n## New Heading\nUpdated section text.",
        }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ slug: "the-architecture-of-discipline" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.post.title).toBe("The Architecture of Discipline (Revised)");
  });

  it("DELETE /api/posts/[slug] deletes post with authorization", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/the-architecture-of-discipline",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ slug: "the-architecture-of-discipline" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.message).toContain("deleted successfully");
  });

  it("POST /api/posts accepts base64 image data directly in JSON and saves to /uploads/", async () => {
    // 1x1 transparent PNG in base64
    const tinyPngBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "The Solitary Walk",
        tags: ["Mind", "Nature"],
        image: tinyPngBase64,
        body: "Walking alone with clarity.\n\n## Solitude\nA man needs room to think.",
      }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.post.image).toMatch(
      /^\/uploads\/the-solitary-walk-\d+-[a-f0-9]+\.png$/,
    );
  });

  it("POST /api/posts accepts multipart/form-data with image file upload", async () => {
    const formData = new FormData();
    formData.append("title", "Strength in Stillness");
    formData.append("tags", "Body / Health");
    formData.append(
      "body",
      "Calm beneath pressure.\n\n## Deep Breath\nRegulate heart rate.",
    );

    const fakeFile = new File(["dummy image buffer content"], "stillness.jpg", {
      type: "image/jpeg",
    });
    formData.append("image", fakeFile);

    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      body: formData,
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.post.image).toMatch(
      /^\/uploads\/strength-in-stillness-\d+-[a-f0-9]+\.jpg$/,
    );
  });

  it("POST /api/upload uploads standalone image file and returns public URL", async () => {
    const formData = new FormData();
    const file = new File(["banner data"], "hero-banner.webp", {
      type: "image/webp",
    });
    formData.append("file", file);

    const request = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      body: formData,
    });

    const response = await uploadImage(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.url).toMatch(/^\/uploads\/upload-\d+-[a-f0-9]+\.webp$/);
  });

  it("newly created recent posts appear in the home screen latest 2 stories", async () => {
    // Post a brand new recent article
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "Latest Breaking Editorial Note",
        tags: ["Mind"],
        publishedAt: new Date(Date.now() + 100000).toISOString(),
        body: "The newest publication on the journal.",
      }),
    });

    const postResponse = await createPost(request);
    expect(postResponse.status).toBe(201);

    // Render HomePage
    const page = await HomePage();
    expect(page).toBeDefined();

    // Verify all stories list contains it at the top
    const allStories = await getAllStories();
    expect(allStories[0].title).toBe("Latest Breaking Editorial Note");
    expect(allStories[0].slug).toBe("latest-breaking-editorial-note");
  });

  it("getAllStories returns all articles strictly sorted in descending order of published date", async () => {
    const stories = await getAllStories();
    expect(stories.length).toBeGreaterThan(2);

    for (let i = 0; i < stories.length - 1; i++) {
      const current = new Date(
        stories[i].publishedAt || stories[i].date,
      ).getTime();
      const next = new Date(
        stories[i + 1].publishedAt || stories[i + 1].date,
      ).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it("GET /api/posts supports limit and offset pagination", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts?limit=2&offset=1",
    );
    const response = await getPosts(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.limit).toBe(2);
    expect(data.offset).toBe(1);
    expect(data.posts.length).toBe(2);
    expect(data.total).toBeGreaterThanOrEqual(3);
  });

  it("POST and GET /api/articles alias routes behave identically to /api/posts", async () => {
    const getReq = new Request("http://localhost:3000/api/articles?limit=5");
    const getRes = await getArticles(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.ok).toBe(true);

    const postReq = new Request("http://localhost:3000/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "The Quiet Craftsman",
        tags: ["Career", "Mind"],
        body: "Work done with care needs no loud advertisement.",
      }),
    });

    const postRes = await createArticles(postReq);
    expect(postRes.status).toBe(201);
    const postData = await postRes.json();
    expect(postData.ok).toBe(true);
    expect(postData.post.slug).toBe("the-quiet-craftsman");
  });

  it("POST /api/posts preserves external image URLs without modifying them", async () => {
    const externalUrl =
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200";

    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "Visual Presence and Proportion",
        tags: ["Style"],
        image: externalUrl,
        body: "Good dressing begins with understanding proportions.",
      }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.post.image).toBe(externalUrl);
    expect(data.post.articleImage).toBe(externalUrl);
  });

  it("PUT /api/posts/[slug] rejects unauthorized updates with 401", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/the-quiet-craftsman",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Unauthorized Edit" }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ slug: "the-quiet-craftsman" }),
    });
    expect(response.status).toBe(401);
  });

  it("DELETE /api/posts/[slug] rejects unauthorized requests with 401", async () => {
    const request = new Request(
      "http://localhost:3000/api/posts/the-quiet-craftsman",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ slug: "the-quiet-craftsman" }),
    });
    expect(response.status).toBe(401);
  });

  it("POST /api/upload rejects unauthorized upload with 401", async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new File(["sample"], "sample.png", { type: "image/png" }),
    );

    const request = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

    const response = await uploadImage(request);
    expect(response.status).toBe(401);
  });

  it("POST /api/upload rejects missing image data with 400", async () => {
    const request = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({}),
    });

    const response = await uploadImage(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Missing image field");
  });

  it("POST /api/upload accepts base64 data in JSON payload and returns 201 with public URL", async () => {
    const tinyPng =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    const request = new Request("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        image: tinyPng,
        prefix: "hero-cover",
      }),
    });

    const response = await uploadImage(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.url).toMatch(/^\/uploads\/hero-cover-\d+-[a-f0-9]+\.png$/);
    expect(data.fullUrl).toContain(
      "https://theaccidentalman.com/uploads/hero-cover-",
    );
  });

  it("POST /api/posts handles broadcast flag gracefully without throwing", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "Broadcast Integration Test Note",
        tags: ["Mind"],
        broadcast: true,
        body: "Testing broadcast flag handling in API handler.",
      }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.broadcast).toBeDefined();
  });

  it("POST /api/posts dynamically associates new articles with the matching 9 Pillars", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "The Architecture of a Tailored Suit",
        tags: ["Style"],
        body: "Quality tailoring gives structure to presence.",
      }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);

    const allStories = await getAllStories();
    const styleStories = getStoriesForPillar("style", allStories);
    expect(
      styleStories.some(
        (s) => s.slug === "the-architecture-of-a-tailored-suit",
      ),
    ).toBe(true);

    const groomingStories = getStoriesForPillar("grooming", allStories);
    expect(
      groomingStories.some(
        (s) => s.slug === "the-architecture-of-a-tailored-suit",
      ),
    ).toBe(false);
  });

  it("POST /api/posts with status draft is excluded from public published feed", async () => {
    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        title: "Unpublished Private Draft Essay",
        tags: ["Mind"],
        status: "draft",
        body: "This is a private draft in progress.",
      }),
    });

    const response = await createPost(request);
    expect(response.status).toBe(201);

    const allStories = await getAllStories();
    const found = allStories.find(
      (s) => s.slug === "unpublished-private-draft-essay",
    );
    expect(found).toBeUndefined();
  });
});
