import { beforeAll, describe, expect, it } from "vitest";
import { POST } from "@/app/api/newsletter/route";

describe("API: /api/newsletter", () => {
  beforeAll(() => {
    process.env.APP_URL = "http://localhost:3000";
  });

  const baseHeaders = {
    "content-type": "application/json",
    origin: "http://localhost:3000",
  };

  it("should return 415 when Content-Type is not application/json", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        origin: "http://localhost:3000",
      },
      body: "email=test@example.com",
    });

    const response = await POST(request);
    expect(response.status).toBe(415);
  });

  it("should return 403 when Origin header does not match expected origin", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://malicious-site.com",
      },
      body: JSON.stringify({ email: "test@example.com", consent: "yes" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it("should return 400 when request body contains invalid JSON", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: baseHeaders,
      body: "{ bad json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("should return 400 when email is invalid or missing", async () => {
    const invalidPayloads = [
      { consent: "yes" }, // missing email
      { email: "not-an-email", consent: "yes" },
      { email: "@missingusername.com", consent: "yes" },
      { email: "missingdomain@", consent: "yes" },
      { email: `${"a".repeat(250)}@example.com`, consent: "yes" }, // too long (> 254)
    ];

    for (const body of invalidPayloads) {
      const request = new Request("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    }
  });

  it("should return 400 when consent is missing or not 'yes'", async () => {
    const invalidPayloads = [
      { email: "valid@example.com" }, // missing consent
      { email: "valid@example.com", consent: "no" },
      { email: "valid@example.com", consent: true },
    ];

    for (const body of invalidPayloads) {
      const request = new Request("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    }
  });

  it("should return 400 when honeypot field 'website' is filled", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: baseHeaders,
      body: JSON.stringify({
        email: "valid@example.com",
        consent: "yes",
        website: "https://spam-bot.com",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("should return 413 when Content-Length exceeds allowed limit", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: {
        ...baseHeaders,
        "content-length": "5000",
      },
      body: JSON.stringify({ email: "valid@example.com", consent: "yes" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(413);
  });
});
