import type { NextConfig } from "next";

const scriptPolicy =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; img-src 'self' data: blob: https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; script-src ${scriptPolicy} https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
