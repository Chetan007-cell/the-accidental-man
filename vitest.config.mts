import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    environment: "node",
    environmentMatchGlobs: [
      ["tests/**/*.test.tsx", "happy-dom"],
      ["tests/**/*.test.ts", "node"],
    ],
    globals: true,
    env: {
      APP_URL: "http://localhost:3000",
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
