# The Accidental Man

A content-first men's lifestyle journal designed to grow into a considered commerce brand. The first release is a fast public editorial site with an email signup. The codebase keeps content, API handling and data access in one deployable app; add services only when a real need appears.

## Start locally

Requirements: Node.js 20.9+ and Docker (or a PostgreSQL 16+ database).

1. Copy `.env.example` to `.env.local` (PowerShell: `Copy-Item .env.example .env.local`). The example already has local `DATABASE_URL` and `APP_URL` values.
2. Start PostgreSQL with `docker compose up -d db` (or point `DATABASE_URL` at a running PostgreSQL 16+ instance).
3. Run `npm ci`.
4. Run `npm run db:migrate`.
5. Run `npm run dev` and open http://localhost:3000.

The public journal content is a small TypeScript fixture in `src/lib/content.ts`. The database already has article and subscriber tables; admin publishing comes in the next phase. The newsletter API returns 503 until PostgreSQL is reachable and the migrations have been applied. In local development, same-origin checks use the request host when `APP_URL` is unset; production still requires an explicit `APP_URL`.

## Architecture

- **Web and API:** Next.js App Router, React and TypeScript. Server components render public pages; client components are limited to newsletter/signup controls, share, and privacy preferences. Route handlers are the narrow API boundary.
- **Data:** PostgreSQL with Drizzle ORM and committed SQL migrations. Use managed PostgreSQL with automated point-in-time backups in production. The app does not connect to the database during static page rendering.
- **Content:** Start with typed content fixtures. Move to a small admin/editor workflow backed by `articles` when publication volume warrants it. Keep content queries in a repository module; do not spread SQL through pages.
- **Email:** Store each consenting subscriber in PostgreSQL with consent time/source, an unsubscribe token, and welcome-email delivery time. A Resend API adapter sends a brand welcome message from `hello@theaccidentalman.com`. Set `RESEND_API_KEY` and verify the sender domain in Resend before expecting delivery. Submitting the same address again safely retries a failed welcome email.
- **Authentication/admin:** No public accounts are needed for a journal. Add Auth.js with a managed OAuth provider for a short allowlist of editors. Check the session and active `admin_users` record in every server action/route. Use roles only when there are genuinely different permissions. Never trust middleware alone as authorization.
- **Commerce:** Add a hosted checkout/provider integration when products are ready. Treat signed provider webhooks as authoritative for order state; verify signature, deduplicate event IDs, and never store card data. Commerce should be a separate domain module, not scattered through editorial pages.
- **Images:** Use a managed object store/CDN for uploaded originals. Validate file type by content, size and dimensions; strip metadata, create responsive AVIF/WebP renditions, use immutable asset keys and serve through `next/image`. Never accept arbitrary remote image URLs from editors. The homepage, journal cards and first article use optimized local WebP editorial photography.
- **Search:** Begin with PostgreSQL full-text search and indexed published content if readers need it. Consider a hosted search service only when relevance or scale requires it.
- **Analytics/privacy:** GA4 (`G-4PD1WZ0YC9`) loads only after a visitor allows analytics in the privacy banner. Declined visitors are not sent to Google. Visitors who decline can reopen preferences from the Privacy settings button. Review the privacy notice and applicable local consent requirements before launch.

## Main flows

1. **Reader:** request → server-rendered homepage/journal/article → metadata and sitemap → CDN/browser cache. Published-only content must be enforced in server queries.
2. **Newsletter:** consent checkbox + email → same-origin JSON request → schema/origin validation → edge rate limit → honeypot → active subscriber row → idempotent Resend welcome email → record send time. The email contains a high-entropy unsubscribe token; its preference page immediately marks the subscriber unsubscribed.
3. **Editor (phase 2):** OAuth login → server-side allowlist/session check → draft edit with validated fields → preview → publish transaction → revalidate affected paths → audit record. Keep all mutations server-side and CSRF protected.
4. **Order (future):** catalog → hosted checkout → signed/deduplicated webhook → order record → email/fulfillment provider. The browser redirect is not proof of payment.

## Repository map

```text
src/
  app/                 Public routes, route handlers, metadata, error boundaries
  components/          Reusable, accessible UI
  lib/
    db/                Drizzle connection and schema
    content.ts         Temporary typed editorial fixture
    validation/        Request schemas (add by domain as flows grow)
    services/          Provider adapters (email, storage, payments)
drizzle/               Versioned SQL migrations
.github/workflows/     CI quality gates
```

Keep feature code close to its route until there is meaningful reuse. Avoid a monorepo, microservices, event bus, Redis, Kubernetes and a headless CMS until a concrete operational need justifies them.

## Security and operations checklist

- **Rate limits:** Configure the hosting edge/WAF to limit `/api/newsletter` by IP and normalized email (for example, 5 requests/minute/IP with a daily cap). The in-process app does not claim to provide distributed rate limiting. Return `429` with `Retry-After`; monitor provider costs and signup abuse.
- **Validation:** Parse every external body with Zod, cap request/body size at the edge, reject unknown keys, normalize email, and use parameterized ORM queries. Keep errors generic to avoid account enumeration.
- **Secrets:** `.env*` is ignored; commit only `.env.example`. Use the deployment platform's secret store, separate values by environment, rotate credentials, and never expose private keys through `NEXT_PUBLIC_*`.
- **Headers:** baseline CSP and browser security headers are in `next.config.ts`, with Google Analytics origins allowed only for the consent-gated tag. Before production, remove inline allowances by using nonces or hashes. Enable HSTS only on HTTPS deployments.
- **Database:** run committed migrations as a deployment release step, not on each web instance start. Use separate least-privilege app and migration credentials. Keep automated encrypted backups and test restores quarterly; set retention to business/legal needs.
- **Logging/observability:** log structured event names and request IDs; never log emails, tokens, cookies or full request bodies. Add hosting error reporting and uptime checks, redact PII, set alerts for elevated 5xx, signup failures and database saturation.
- **Errors:** add `error.tsx` and `not-found.tsx` as route complexity grows. Surface friendly messages; retain detailed stack traces only in protected server-side telemetry.
- **Accessibility:** semantic landmarks, keyboard navigation, visible focus, labels, skip link, alt text, reduced-motion support and sufficient contrast are included as a starting point. Verify contrast and screen-reader flows before launch.
- **Performance:** server-render content, keep client JS limited to interactive islands, optimize image dimensions, avoid autoplay video, use CDN caching, and measure Core Web Vitals on real devices.
- **SEO:** route metadata, Open Graph defaults, `robots.txt` and `sitemap.xml` are included. Add canonical URLs, article structured data, redirects and editorial social images when the publishing flow is connected.
- **Backups/privacy:** minimize collected data, honor unsubscribe/delete requests, define retention and data-subject request handling. Backups are recovery copies, not a reason to retain data indefinitely.

## Delivery plan

1. **Foundation:** branded responsive editorial shell, first journal article, subscriber schema/migration, newsletter signup/welcome/unsubscribe flow, consent-gated GA4, environment template, baseline headers and CI.
2. **Launch hardening:** production database + backups, edge rate limits, verified email domain and Resend key, real content workflow, privacy review, image CDN, CSP tightening, error tracking and accessibility/performance review.
3. **Editorial operations:** protected admin, OAuth + allowlist, drafts/previews/publishing, audit log, search, author profiles and structured data.
4. **Commerce:** product/catalog and inventory needs, hosted checkout, signed webhooks, order/refund lifecycle, support/fulfillment and applicable tax/privacy review.

Do not enable production welcome-email delivery until the Resend API key and verified sender are configured. GA4 remains blocked until each visitor allows analytics. Admin login and checkout are future integrations.

## Environment configuration

`DATABASE_URL` and `APP_URL` are required by their consumers. `NEXT_PUBLIC_GA_MEASUREMENT_ID` is public and defaults to the provided GA4 measurement ID. `RESEND_API_KEY` is private and must only be set in the local server environment or deployment secret store. `NEWSLETTER_FROM_EMAIL` defaults to `The Accidental Man <hello@theaccidentalman.com>`; its domain must be verified with Resend. Production deploys should use separate preview/staging/production databases and secrets. After updating the subscriber schema, run `npm run db:migrate` before starting the application. Use expand-migrate-contract database changes for future breaking schema changes.

## CI/CD and releases

Pull requests run Biome lint/format checks, typecheck and production build on Node 22. Deployment should build once, apply reviewed Drizzle migrations as a release job, then deploy the application. Use platform preview deployments for review and production promotion after approval. Keep a rollback path for application deploys; schema migrations must remain backward compatible with the prior app version. Protect `main`, require CI, use dependency update alerts, and pin GitHub Actions to full commit SHAs before adopting this workflow for a high-assurance production environment.

## Testing strategy

As the flows become real, add focused unit tests for validation and domain rules, database integration tests against an isolated PostgreSQL service, and Playwright browser coverage for reader navigation, keyboard access, newsletter validation/consent, and the editor publish flow. Keep payment webhook signature/idempotency cases in integration tests. CI should run unit and integration suites plus an accessibility smoke check; production smoke checks should verify homepage, sitemap, database readiness and newsletter provider health. This initial scaffold does not include a test runner or test suite yet.
#   t h e - a c c i d e n t a l - m a n  
 
