import { beforeAll, describe, expect, it } from "vitest";
import { POST } from "@/app/api/newsletter/unsubscribe/route";

describe("API: /api/newsletter/unsubscribe", () => {
  beforeAll(() => {
    process.env.APP_URL = "http://localhost:3000";
  });

  const baseHeaders = {
    "content-type": "application/json",
    origin: "http://localhost:3000",
  };

  it("should return 415 when Content-Type is not application/json", async () => {
    const request = new Request(
      "http://localhost:3000/api/newsletter/unsubscribe",
      {
        method: "POST",
        headers: {
          "content-type": "text/plain",
          origin: "http://localhost:3000",
        },
        body: "token=abc",
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(415);
  });

  it("should return 403 when Origin header does not match expected origin", async () => {
    const request = new Request(
      "http://localhost:3000/api/newsletter/unsubscribe",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://malicious-site.com",
        },
        body: JSON.stringify({ token: "a".repeat(64) }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it("should return 400 when token format is invalid", async () => {
    const invalidTokens = [
      "", // empty
      "short-token", // not 64 chars
      "g".repeat(64), // not hex
      "12345", // too short
      "a".repeat(65), // too long
    ];

    for (const token of invalidTokens) {
      const request = new Request(
        "http://localhost:3000/api/newsletter/unsubscribe",
        {
          method: "POST",
          headers: baseHeaders,
          body: JSON.stringify({ token }),
        },
      );

      const response = await POST(request);
      expect(response.status).toBe(400);
    }
  });

  it("should return 413 when Content-Length exceeds 1024 bytes", async () => {
    const request = new Request(
      "http://localhost:3000/api/newsletter/unsubscribe",
      {
        method: "POST",
        headers: {
          ...baseHeaders,
          "content-length": "2048",
        },
        body: JSON.stringify({ token: "a".repeat(64) }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(413);
  });
});
