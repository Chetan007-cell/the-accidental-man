# The Accidental Man D2C Commerce Platform

## Implementation specification for the existing Next.js website

**Status:** Product discovery and commerce foundation; products are not ready for sale  
**Audience:** AI coding agent implementing this specification in the existing repository  
**Decision:** Build a server-side modular monolith in the current Next.js App Router application. Preserve the journal and current site. Deliver catalogue, product variants, inventory visibility, admin product operations, and a guest-first cart foundation. Do not enable payment, shipping, customer accounts, or live checkout until products and operations are ready.

## 1. Purpose and project goals

The Accidental Man is an owned-brand direct-to-consumer business across grooming, clothing, accessories, and wellness. Commerce should live on the existing domain and complement the content-first journal. Keep deployment and operating costs minimal by extending the current application rather than creating a second service.

The implementation should:

- Add a discoverable `/shop` with four category routes and product detail pages.
- Support products with one or more purchasable variants, each with a unique SKU and stock count.
- Provide secure, authenticated admin workflows for product and inventory management.
- Establish validated, server-only data access and versioned PostgreSQL migrations.
- Provide a guest-first cart foundation that can be enabled for purchase later.
- Preserve editorial routes, content, visual identity, newsletter behavior, SEO, and analytics consent.
- Make each phase independently reviewable, deployable, and reversible.

## 2. Non-goals and launch gates

Do not build a marketplace, microservices, a separate Express API, multi-warehouse allocation, subscriptions, loyalty, wishlists, customer accounts, reviews, recommendation engines, or elaborate search. Do not add Redis, Kafka, Kubernetes, or paid infrastructure without a demonstrated need.

Products are explicitly not ready. Until the owner approves a separate launch-readiness gate, do not connect or activate payment providers, shipping labels/rates/tracking, customer accounts, transactional order emails, or public checkout. Never present a simulated payment as a completed sale. A future payment integration must be provider-hosted/tokenized or use a provider SDK; raw card data must never enter this app.

The initial commerce phases may include a cart UX in disabled or preview mode. Public purchase controls must remain disabled unless an explicit server-side feature flag is enabled after product, legal/compliance, fulfilment, payment, and operational readiness checks.

## 3. Repository-first implementation instructions

Before changing anything, the coding agent must inspect the repository tree, `AGENTS.md`, `README.md`, package scripts and dependencies, current routes/layout/navigation/styles, database schema and migrations, environment examples, tests, deployment configuration, and Git working-tree changes. Treat `sources/` as read-only reference material. Do not edit, rename, move, or delete anything under `sources/`.

The current repository is an existing Next.js App Router and TypeScript application. It already has PostgreSQL via `postgres`, Drizzle ORM, Zod, versioned migrations in `drizzle/`, journal pages/content, newsletter endpoints, SEO metadata, privacy-consent analytics, Vitest tests, and Playwright coverage. Reuse these existing foundations. Verify exact current state before relying on this summary.

Do not scaffold a replacement app, rewrite the journal, move routes wholesale, replace the styling system, or make unrelated cleanup. Prefer additive, narrowly scoped changes. Preserve existing public URLs and editorial behavior. If a required decision conflicts with existing code, document the conflict and choose the smallest compatible adjustment. Do not overwrite the user’s uncommitted work. Do not deploy, change production data, or rotate external credentials as part of implementation.

Before coding, provide a short repository assessment and proposed file/migration list. Work in small phases; after each, report changed files, migration impact, checks performed, and any unresolved assumption. Follow repository-specific instructions and scripts.

## 4. Architecture decisions

| Area | Decision |
|---|---|
| Web and backend | Existing Next.js App Router, TypeScript, server components, Route Handlers for HTTP APIs |
| Structure | Modular monolith in one deployable application |
| Database | PostgreSQL, hosted on Supabase when configured; retain local PostgreSQL workflow |
| Data access | Existing Drizzle ORM and `postgres` driver; database access is server-only |
| Validation | Existing Zod version for request, form, and environment validation |
| Admin authentication | Supabase Auth for admin identities, with server-verified sessions and explicit admin allowlist/role checks |
| Product media | Supabase Storage when configured; store object paths/URLs and metadata in PostgreSQL |
| Hosting | Keep the existing deployment provider (Vercel per architecture decision); do not migrate hosting |
| Customer surface | Existing domain, `/shop`, `/cart`; no shop subdomain |
| Payments/shipping | Deferred until products are ready and launch gate is approved |

If Supabase Auth is not yet configured, Phase 1 must use a documented, secure admin-auth adapter boundary and keep admin routes inaccessible by default; do not implement a home-grown password/session system. Do not add a second database client or expose Supabase service credentials to browser code. Evaluate Supabase connection pooling/serverless limits before production configuration; keep migrations as an explicit release action, never run them on each request or instance boot.

## 5. URL and feature map

Existing journal and homepage paths remain untouched. Add only what fits the inspected routing structure:

| Route | Purpose | Phase |
|---|---|---|
| `/shop` | Store introduction and available products | Catalogue |
| `/shop/grooming` | Grooming category | Catalogue |
| `/shop/clothing` | Clothing category | Catalogue |
| `/shop/accessories` | Accessories category | Catalogue |
| `/shop/wellness` | Wellness category | Catalogue |
| `/shop/products/[slug]` | Product detail and variant selection | Catalogue |
| `/cart` | Guest cart review | Cart foundation |
| `/admin` | Protected admin home | Admin |
| `/admin/products` | Product listing and editing | Admin |
| `/admin/inventory` | Variant stock and adjustment history | Admin |
| `/api/v1/products` | Public, published product listing | Catalogue |
| `/api/v1/products/[slug]` | Public published product details | Catalogue |
| `/api/v1/cart` | Guest cart validation/update | Cart foundation, optional until enabled |
| `/api/v1/admin/products` | Protected product management | Admin |
| `/api/v1/admin/inventory/adjustments` | Protected inventory adjustment | Admin |

Use the current route conventions if they differ. Public catalogue responses must never expose internal cost, private notes, unpublished products, admin identities, or inventory adjustment details.

## 6. Suggested folder structure

Adapt to the existing tree instead of forcing a restructure. Keep the current journal, `src/lib/db/schema.ts`, database connection, and migration workflow in place.

```text
src/
  app/
    shop/                         # Public commerce pages
    cart/                         # Guest cart surface
    admin/                        # Protected admin pages
    api/v1/products/              # Public catalogue Route Handlers
    api/v1/cart/                  # Guest cart API, when enabled
    api/v1/admin/products/        # Admin product APIs
    api/v1/admin/inventory/       # Admin inventory APIs
  components/
    commerce/                     # Product card, gallery, variant picker, cart controls
    admin/                        # Admin forms and tables
  lib/
    commerce/
      products/                   # Product domain/service/repository
      inventory/                  # Stock adjustment and availability rules
      cart/                       # Cart validation and persistence adapter
      auth/                       # Admin session and authorization guards
      validation/                 # Zod request schemas
    db/
      schema.ts                   # Extend existing Drizzle schema
      index.ts                    # Reuse existing database connection
```

Keep business rules out of React components and Route Handlers. Route Handlers parse input, authorize, call a service, and map results/errors to HTTP. Services own invariants and transactions. Repositories isolate Drizzle queries where that improves clarity; avoid abstraction for abstraction’s sake.

## 7. Data model and relationships

Use UUID primary keys, `timestamptz` timestamps, explicit foreign keys, indexes for lookups, and database constraints for invariants. Use integer minor currency units (for example paise) and an ISO 4217 currency code. Never use floating point for money. Use restrictive deletion or soft deletion for records needed by order history.

### `categories`

- `id uuid primary key`
- `slug varchar(80) unique not null` (`grooming`, `clothing`, `accessories`, `wellness` initially)
- `name varchar(120) not null`
- `description text null`
- `is_active boolean not null default true`
- `sort_order integer not null default 0`
- `created_at`, `updated_at timestamptz not null`

### `products`

- `id uuid primary key`
- `category_id uuid not null references categories(id)`
- `slug varchar(160) unique not null`
- `name varchar(200) not null`
- `summary varchar(500) not null`
- `description text not null`
- `status` enum: `draft`, `active`, `archived`; default `draft`
- `currency char(3) not null` (default may be configured; do not assume tax treatment)
- `metadata jsonb not null default '{}'` for carefully bounded presentation attributes only
- `created_at`, `updated_at`, `published_at timestamptz null`
- Add indexes on `(status, category_id)`, `slug`, and update/publication ordering.
- Add optional `seo_title` and `seo_description` only if the current metadata system benefits from per-product overrides; otherwise derive safe defaults from name/summary.
- Since the first release has four primary store departments, one `category_id` per product is sufficient. Add a many-to-many product/collection join only if the inspected catalogue requirements demonstrate multiple collections; do not add it speculatively.
- Keep category-specific attributes structured and validated by category. Examples: grooming ingredients, skin/hair suitability, size/volume and directions; clothing size chart, fit, fabric, colour and care; accessories material, dimensions and care; wellness ingredients, serving/quantity, directions, warnings and required declarations. Do not use unrestricted JSON as a replacement for required, typed, validated fields.

### `product_variants`

- `id uuid primary key`
- `product_id uuid not null references products(id) on delete restrict`
- `sku varchar(80) unique not null`
- `name varchar(160) not null` (for example size, color, volume)
- `option_values jsonb not null default '{}'` (validated shape such as `{"size":"M","color":"Black"}`)
- `price_minor integer not null check (price_minor >= 0)`
- `compare_at_price_minor integer null check (compare_at_price_minor >= price_minor)`
- `stock_on_hand integer not null default 0 check (stock_on_hand >= 0)`
- `stock_reserved integer not null default 0 check (stock_reserved >= 0 and stock_reserved <= stock_on_hand)`
- `is_active boolean not null default true`
- `created_at`, `updated_at timestamptz not null`
- `available = stock_on_hand - stock_reserved` is derived; do not persist a separately writable available count.
- Index `product_id`, unique `sku`, and `(product_id, is_active)`.

### `product_images`

- `id uuid primary key`
- `product_id uuid not null references products(id) on delete restrict`
- `variant_id uuid null references product_variants(id) on delete set null`
- `storage_key varchar(500) not null`, `alt_text varchar(300) not null`
- `sort_order integer not null default 0`, `created_at timestamptz not null`
- Validate storage keys server-side; do not accept arbitrary executable or unsafe remote media URLs.

### Product content and compliance

Product details must support accessibility and informed decisions: clear image alt text, descriptive product copy, variant-specific options, care/use instructions, ingredients/materials, dimensions or sizing where relevant, and caution/declaration fields where applicable. Do not fabricate efficacy claims, certifications, regulatory identifiers, origin, ingredients, manufacturing facts, or returns terms. Product category alone does not determine the law that applies. Keep product-specific compliance readiness as a publish checklist, and require owner-supplied evidence/approval for any regulated or health-related claims before publication. If there is a future product-content schema, keep category extensions typed and versionable and avoid exposing private supplier or internal notes publicly.

### `inventory_movements`

- `id uuid primary key`
- `variant_id uuid not null references product_variants(id) on delete restrict`
- `delta integer not null check (delta <> 0)`
- `reason` enum: `opening_balance`, `restock`, `correction`, `damage`, `reservation`, `release`, `sale`, `return`
- `reference_type varchar(40) null`, `reference_id uuid null`
- `actor_user_id uuid null` (identity from verified admin auth)
- `note varchar(500) null`
- `created_at timestamptz not null`
- Append-only audit log. Corrections are new rows; never edit prior movements to conceal history.

### `carts` and `cart_items` (only if durable server-side cart is chosen)

`carts`: `id uuid primary key`, opaque high-entropy `token_hash` unique, `currency char(3)`, `expires_at timestamptz`, created/updated timestamps. Store only the hash of the guest token; send the raw token only as a Secure, HttpOnly, SameSite=Lax cookie. `cart_items`: `id uuid primary key`, `cart_id uuid references carts(id) on delete cascade`, `variant_id uuid references product_variants(id) on delete restrict`, `quantity integer check (quantity between 1 and configured maximum)`, unique `(cart_id, variant_id)`, timestamps. Cart price is always re-read from the server catalogue; never trust browser price fields.

For a minimal pre-launch preview, client-side cart state may be used if no checkout or reservation is possible. Document the choice and avoid collecting personal data. Do not reserve stock for an abandoned guest cart.

### Deferred order tables

Do not create checkout-ready order/payment/shipment flows in the initial phases. When separately approved, implement `orders`, `order_items`, `order_events`, `payment_attempts`, and `shipments`. `order_items` must snapshot SKU, title/variant description, unit price, currency, quantity, discounts, and tax components at order creation, so catalogue edits do not rewrite historical orders. Keep provider references and status transitions auditable. Store no card data.

### Relationship summary

```text
categories 1 ── * products 1 ── * product_variants 1 ── * inventory_movements
                              └── * product_images
carts 1 ── * cart_items * ── 1 product_variants
```

## 8. API contracts

All JSON endpoints use same-origin HTTPS, JSON request/response bodies, strict Zod parsing, consistent error envelopes, and no stack traces. Use UUIDs in path params. Set `Cache-Control: no-store` for admin/cart responses; public published catalogue may use short revalidation. Paginate lists with bounded `limit` (default 20, max 100) and opaque cursor or stable offset where appropriate.

### Response and error shape

Success: `{ "data": ..., "meta": { "nextCursor": null } }` where pagination applies. Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "Request could not be processed.", "fieldErrors": {} } }`. Use appropriate HTTP codes: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 missing/unpublished resource, 409 conflict/insufficient stock, 429 rate limited, 500 generic unexpected error. Do not leak whether an admin email exists.

### Public catalogue

- `GET /api/v1/products?category=grooming&limit=20&cursor=...` returns active products and active variants suitable for display, with `id`, `slug`, `name`, `summary`, category, images, and variant `id/name/options/sku?` (do not expose SKU unless product UX requires it), `priceMinor`, `currency`, and `available` boolean. Do not expose exact inventory by default.
- `GET /api/v1/products/{slug}` returns a single active product, description, ordered image metadata, and active variant options/prices/availability.
- Unknown category filters return 400; nonexistent or non-public slug returns 404.

### Admin products

All routes require an authenticated session and server-side admin role/allowlist verification.

- `GET /api/v1/admin/products?status=draft&limit=20&cursor=...`
- `POST /api/v1/admin/products` body: `{ categoryId, slug, name, summary, description, currency, status?, variants: [{ sku, name, optionValues, priceMinor, compareAtPriceMinor?, openingStock? }], images?: [{ storageKey, altText, sortOrder? }] }`. Validate SKU uniqueness, category, money, variant options, and status. Draft is default.
- `GET /api/v1/admin/products/{id}` returns editable product and variant data.
- `PATCH /api/v1/admin/products/{id}` accepts only explicit editable fields plus a version/update timestamp for optimistic concurrency. Return 409 on stale writes.
- `POST /api/v1/admin/products/{id}/publish` validates required product details, category, at least one active variant, valid price, and image/alt requirements before setting `active` and `published_at`.
- `POST /api/v1/admin/products/{id}/archive` archives without deleting order-relevant records.

### Admin inventory

- `GET /api/v1/admin/inventory?sku=...&limit=...` returns variant, on-hand, reserved, derived available, and movement history.
- `POST /api/v1/admin/inventory/adjustments` body: `{ variantId, delta, reason: "restock"|"correction"|"damage", note?, idempotencyKey }`. Require a nonzero integer delta, valid reason, bounded note, and unique idempotency key. In one DB transaction, lock/update the variant, reject resulting negative on-hand or reserved greater than on-hand, update stock, and append movement with verified actor. Return updated counts and movement id.

### Guest cart (enable only when approved)

- `GET /api/v1/cart` returns current lines with server-resolved product/variant labels, current unit prices, quantity, availability, and totals.
- `PUT /api/v1/cart/items/{variantId}` body `{ quantity }`; quantity 1..configured per-line maximum. Quantity zero is not accepted; use DELETE to remove.
- `DELETE /api/v1/cart/items/{variantId}` removes a line idempotently.
- Validate active product/variant, currency consistency, current availability, and request origin. A cart is not an order and does not reserve inventory.

## 9. Security and privacy requirements

- Admin routes and mutations must default deny. Verify Supabase Auth tokens/session server-side and check an explicit admin allowlist or trusted role claim on every request. Never trust client-supplied role, email, user ID, or middleware alone as authorization.
- Repository-specific authentication gap: an `admin_users` table exists, and current administrative content APIs use a shared `ADMIN_API_KEY`/bearer-key pattern. Neither constitutes a browser admin session. Do not copy that shared key into browser code, reuse it for commerce admin UI, print it, or migrate/remove the existing editorial API auth as part of commerce work. Add a distinct user-session/admin authorization layer and keep existing editorial integrations working unless a separately scoped migration is approved.
- The example environment file contains a placeholder shared admin key, while `.env.local` is present. Never read, print, copy, or include `.env.local` values in logs, reports, generated docs, prompts, commits, or screenshots. It is not evidence that Supabase is configured. Do not make credentials available to client bundles.
- Repository setup discrepancy: `getDb()` accepts `DATABASE_URL` or `POSTGRES_URL`, while `drizzle.config.ts` requires `DATABASE_URL`; align new setup guidance with existing behavior and do not silently change the established connection contract. Local Docker Compose uses simple development-only credentials and must never be treated as production configuration.
- Protect cookie-authenticated mutations against CSRF using same-site cookies plus Origin/Host checks and an appropriate CSRF strategy. Restrict CORS to same-origin; no wildcard credentials.
- Keep database credentials, Supabase service-role keys, storage secrets, and future payment secrets in server-only environment variables. Never use a `NEXT_PUBLIC_` prefix for secrets.
- Apply rate limits to sign-in, admin mutations, and public write endpoints. Use provider/WAF rate limiting if no reliable shared limiter exists; do not claim process-local limits are production-safe on serverless deployments.
- Validate and normalize every input; bound string lengths, arrays, quantities, page sizes, upload types, and JSON size. Reject unknown keys on mutations where practical.
- Use parameterized Drizzle queries. Render user-entered product descriptions safely; sanitize any supported rich text and avoid raw HTML rendering.
- Use least-privilege database credentials. Keep row-level security / Supabase policies restrictive if browser clients are ever introduced; this architecture keeps direct DB access server-side.
- Log request IDs, actor ID, route, outcome, and duration. Do not log cookies, auth headers, raw tokens, email addresses, addresses, or other PII. Avoid placing secrets or personal data in error messages.
- Use private buckets or validated public product-image delivery as appropriate. Restrict uploads by MIME sniffing, size, dimensions, and allowed formats; strip metadata when feasible.
- Ensure product content and commerce flows do not make unsupported health or efficacy claims, particularly for wellness products. The owner remains responsible for product, labeling, consumer, tax, privacy, and other applicable compliance before launch.

## 10. Commerce invariants

### SKU and catalogue

- Every variant has exactly one immutable unique SKU. SKU changes require an explicit audited operation; never silently reuse an old SKU.
- Only active products with active variants are public. Draft and archived products are not discoverable through public APIs, pages, sitemap, or structured data.
- Price and currency are authoritative on the server. Use integer minor units; a product’s variants share one currency in the initial release.

### Inventory

- `on_hand >= 0`, `reserved >= 0`, `reserved <= on_hand`, and `available = on_hand - reserved` always hold.
- Stock adjustments and movement audit insert occur in the same transaction. Use row locking or an atomic conditional update to prevent concurrent overselling.
- A guest cart does not reserve stock. Do not decrement stock at cart-add time.
- Future checkout must atomically reserve stock with a bounded expiry; successful verified payment converts reservation to sale exactly once; failed/expired/cancelled checkout releases it exactly once. Duplicate requests/webhooks must be idempotent.
- Refunds, returns, cancellations, and restocks require explicit state transitions and movement reasons; no direct unaudited stock edits.

### Payment and order (deferred)

- Never mark an order paid based only on a browser redirect or client response. Verify provider signatures/webhooks server-side, validate amount/currency/order reference, persist provider event id uniquely, and process idempotently.
- Create immutable item price snapshots at order placement. Order totals must reconcile from line items, discounts, shipping, and taxes using integer minor units.
- Separate payment status from fulfilment status. A payment success does not imply shipment, and a shipment does not imply payment.
- Do not store PAN, CVV, or raw payment credentials. Use provider tokens/hosted checkout.

## 11. Testing and acceptance criteria

The coding agent must extend the repository’s existing Vitest and Playwright patterns; do not add a second test framework. Tests are part of implementation acceptance (the task request authorizes checks for the implementation), but keep tests focused on commerce behavior and preserve current suites.

### Unit and integration coverage

- Zod accepts valid product/variant requests and rejects malformed slugs, duplicate/invalid options, invalid currency, negative or fractional money/stock, oversized inputs, and unknown mutation keys.
- Public queries exclude drafts/archived products and never return internal inventory movements or admin-only fields.
- Inventory adjustment handles valid restock/correction, rejects negative stock and reserved violations, writes movement atomically, and is idempotent under repeated key.
- Admin authorization rejects unauthenticated and non-admin users for every admin endpoint.
- Cart recalculates prices server-side, rejects inactive variants and excessive quantities, and does not reserve stock.
- Migration can be applied to a clean local PostgreSQL database and supports the existing subscriber/article schema without destructive changes.

### Browser coverage

- Existing homepage, journal, newsletter, privacy-consent, metadata, sitemap, and navigation flows continue to work.
- Shop/category/product pages render only published catalogue data and remain usable at mobile widths and with keyboard navigation.
- Variant selection updates displayed price and availability; unavailable variants cannot be added to the cart.
- Admin pages redirect or return 401/403 for non-admin sessions; authorized admin can create/edit draft product and adjust stock.
- Cart (when enabled) persists as designed, shows current server prices, and removes items correctly.
- No checkout/payment/shipping/customer-account UI is exposed while the launch feature flag is disabled.

### Definition of done

- Existing journal and newsletter behavior is preserved.
- Migrations are additive, reviewed, and reversible where practical; no destructive production migration.
- All required checks in the repository scripts pass, including lint/type checks and focused unit/e2e coverage.
- Public commerce pages have titles, descriptions, canonical handling, accessible labels/alt text, and noindex treatment for admin/cart.
- Environment examples are updated with names and descriptions only; no secrets are committed.
- A deployment note documents migration/release order, feature flags, rollback, and monitoring.
- A human owner can review the repository assessment, file list, data model, and launch gate before any production activation.

## 12. Environment variables

Keep `.env.example` descriptive and secret-free. Validate configuration on the server at startup or use site conventions.

| Variable | Purpose | Required when |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection used by existing Drizzle adapter | Database-backed commerce |
| `APP_URL` | Canonical site URL and trusted-origin comparison | All environments |
| `SUPABASE_URL` | Supabase project endpoint | Supabase Auth/Storage enabled |
| `SUPABASE_ANON_KEY` | Public/anon Supabase key; only if a client SDK needs it | Optional; never grants admin access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged Supabase operations | Only if strictly required by server adapter |
| `ADMIN_EMAIL_ALLOWLIST` | Server-side initial admin allowlist, securely parsed | Admin enabled |
| `COMMERCE_ENABLED` | Master server-side catalogue feature flag | Default `false` until reviewed |
| `CART_ENABLED` | Guest cart feature flag | Default `false` until reviewed |
| `PRODUCT_STORAGE_BUCKET` | Storage bucket name | Product image uploads enabled |

Reuse existing variables for `APP_URL` and `DATABASE_URL`; do not duplicate them. A publishable catalogue flag may be separate from `COMMERCE_ENABLED` if previews are needed. No payment, shipping, or customer-auth secrets should be added in the initial phases.

## 13. Implementation sequence

Treat sequence as gated phases, not calendar promises. The owner can stop after any phase.

### Phase 0 — Inspect and plan

Read repository instructions and current code, inspect Git changes and deployment/database setup, map existing routes/styles/schema/tests, identify Supabase availability and current admin-auth strategy. Produce assessment and exact additive file/migration plan. No code changes until this is complete.

### Phase 1 — Data foundation and admin security

Add category/product/variant/image/inventory tables and constraints through a new Drizzle migration. Seed the four categories safely and idempotently. Configure server-only auth adapter and admin authorization checks, default deny if not configured. Add environment validation. Verify existing tables and migrations remain intact. No public purchase flow.

### Phase 2 — Admin catalogue and inventory

Build protected product listing/edit/create/publish/archive and stock-adjustment flows. Start all products as drafts. Add immutable SKU and audit log controls. Add focused tests and a clear admin usability path. Product image upload may be deferred; allow metadata entry only if no secure storage configuration exists.

### Phase 3 — Public catalogue

Add `/shop`, category, and product pages plus public read APIs. Integrate site navigation without disturbing journal. Provide empty states; do not invent products or claims. Add metadata and sitemap inclusion only for active products. Keep purchase controls hidden/disabled.

Add low-friction editorial bridges where appropriate: a journal article may link to a relevant category or product, and a product may link to genuinely useful related editorial content. These links must be editorially appropriate, owner-configurable, accessible, and optional; do not auto-insert products into articles or imply that buying a product is necessary for personal development. Keep the journal useful and complete without commerce.

### Phase 4 — Guest cart foundation

Only after catalogue is stable, enable an opt-in cart preview. Choose client state for non-persistent preview or opaque-token server cart if persistence is required. Validate current prices and availability server-side. Do not reserve stock and do not collect shipping/payment details. Keep cart excluded from indexing.

### Phase 5 — Readiness review (no automatic activation)

Owner verifies real products, descriptions/images, SKU, prices, available inventory, product-specific legal/labeling requirements, support/returns policy, fulfilment process, tax/accounting needs, privacy notices, payment provider account, shipping provider, and operational support. Record explicit approval before work on checkout.

### Phase 6 — Future checkout and fulfilment (separate authorization)

After approval, design and implement order snapshots, transactional stock reservation, payment provider integration and webhook verification, idempotency, shipping/fulfilment, notifications, refunds/cancellations, and customer privacy handling. Customer accounts remain optional; guest checkout is preferred unless a demonstrated requirement emerges. Load test and rehearse rollback before launch.

## 14. Deployment safeguards and operations

- Continue the current hosting and database setup until a concrete scaling or reliability need justifies change.
- Use separate development, preview, and production credentials/databases. Never run feature migrations against production during local work.
- Review generated SQL before applying it. Apply migrations as an explicit release step using the intended environment. Take/verify a database backup before production schema changes.
- Do not enable commerce/cart feature flags in production until smoke-tested. Keep purchase features off until Phase 5 readiness approval and Phase 6 implementation.
- Use backward-compatible expand/migrate/contract changes. Avoid dropping or renaming existing editorial tables/columns. Provide rollback steps; if data migration cannot be reversed safely, use a forward-fix plan and backup restore point.
- Verify build and existing site behavior in preview deployment. Smoke-test homepage, journal article, newsletter signup/unsubscribe, `/shop`, admin deny behavior, health/database connectivity, and robots/sitemap.
- Monitor API error rate, database connection exhaustion, migration status, failed admin auth, inventory conflicts, and storage failures. Alerts/logs must not contain secrets or unnecessary personal data.
- Keep dependencies minimal and pinned by lockfile. Avoid adding paid services until required; document any expected recurring cost before activation.

## 15. Repository gaps and implementation choices to resolve

The coding agent must confirm these observations against the working tree at task start, because repository changes can occur:

- Existing product commerce routes, product tables, Supabase Auth, Supabase Storage, and a browser admin dashboard were not found in the inspected tree. There is a Drizzle/Postgres foundation and an `admin_users` table, but no identified login/session implementation for a commerce admin.
- Existing content write APIs use a shared server secret. Keep those APIs separate from the future session-authenticated commerce admin.
- The project already has local Postgres via Docker Compose and a PostgresJS-backed Drizzle client; Supabase is a selected hosting/auth/storage direction, not proof that a Supabase project or credentials exist. The implementation must work locally and keep provider setup optional/configured only when available.
- `README.md` currently contains some potentially stale claims (for example styling/dependency descriptions may not match the current package). Inspect `package.json` and actual CSS; do not use README text as permission to introduce Tailwind or install duplicate packages.
- Commerce must fit existing structured metadata, sitemap, navigation, analytics consent, image handling, and CSS tokens. The current sitemap and robots rules need review before public product indexing; admin, cart, preview, and any private endpoints must remain excluded.
- A useful first product/admin acceptance path is draft creation, variant/SKU setup, stock adjustment with audit trail, preview, then explicit publish. Provide safe empty states because no genuine products are supplied.
- Define how to back up/export catalogue data and recover from accidental admin edits before production use. Inventory movement is append-only; product lifecycle changes are auditable.
- Initial currency should be configurable and owner-confirmed. Prior discussion proposed Indian rupees/paise and Razorpay as launch candidates, but do not hard-code provider assumptions or claim tax, shipping, or compliance behavior without owner-approved requirements.

## 16. Full handoff prompt for the AI coding agent

```text
You are the implementation agent for The Accidental Man D2C commerce platform. Follow SPECIFICATION.md and repository instructions. The goal is to add a modest commerce foundation to the existing Next.js website for the brand's own products in grooming, clothing, accessories, and wellness. Products are not ready for sale; monthly infrastructure budget is minimal.

NON-NEGOTIABLE STARTUP AUDIT
1. Inspect AGENTS.md and any nested agent instructions, repository tree, package scripts/dependencies, actual styles/components, routes/navigation, Drizzle schema/migrations, API auth, environment examples, deployment configuration, SEO/sitemap/robots, tests, and current Git status/diffs before editing.
2. Treat every file under sources/ as read-only. Do not edit, rename, move, delete, or reformat it.
3. Preserve all pre-existing user changes. Identify and report existing modifications/untracked files before work. Never reset, clean, overwrite, stage, or revert unrelated files. If requested edits overlap a pre-existing change, make the smallest careful patch and explain it.
4. Do not read or print .env.local, secrets, production data, private keys, or credentials. Never include secret values in output, test fixtures, screenshots, prompts, commits, or generated artifacts. The mere presence of a local env file does not mean a provider is configured.
5. Before coding, report the existing architecture, findings/gaps, conflicts, exact proposed files and migrations, phase scope, checks to run, and assumptions. Then proceed with Phase 1 unless a genuine blocking ambiguity or destructive action is required. Do not ask about choices this specification already makes.

IMPLEMENTATION RULES
- Extend the existing Next.js App Router + TypeScript modular monolith, PostgreSQL, Drizzle, Zod, CSS/design system, and tests. Reuse dependencies and conventions. No new app, separate backend, microservices, wholesale route/layout/style rewrite, unrelated cleanup, or paid service without a clear need and owner approval.
- Keep journal, homepage, existing articles/content, newsletter signup/unsubscribe/broadcast flows, analytics consent, public URLs, metadata, and current user work intact. Add commerce incrementally on the same domain under /shop and versioned same-origin APIs.
- Keep database access server-side. Admin operations must default-deny and require a verified server-side user session plus explicit admin authorization. The existing admin_users table and shared ADMIN_API_KEY used by editorial APIs are not a browser session; do not expose/reuse that key or break existing editorial integrations.
- Keep all public purchase actions off. Do not implement/activate checkout, payment processing, shipping, customer accounts, order emails, or customer PII collection. No Razorpay/Shiprocket account or secrets until products and operations are approved. Payments and shipping are future provider adapters, not current scope.
- Do not invent product data, health/efficacy claims, ingredients, certifications, legal terms, taxes, pricing, stock, delivery promises, or customer testimonials. Use empty/draft states and require owner-supplied content.
- Keep the initial hosting footprint minimal. Reuse local PostgreSQL. Make Supabase Auth/Storage adapters optional and server-only until configured; no unnecessary subscriptions or provider migration.
- Use additive, reviewed, versioned migrations. Do not edit applied migration history. Do not run production migrations or deploy. Use idempotent category seeds. Avoid destructive schema changes and include rollback/recovery notes.
- Keep changes small and phase-scoped. Do not proceed beyond a review gate without reporting the completed phase and next concrete plan.

PHASE PLAN
Phase 0: repository audit and compatibility plan; no edits.
Phase 1: additive catalogue/inventory schema; safe four-category seed; server-side auth boundary that fails closed; validated env/config; focused schema/domain/auth tests. No public store or purchase controls. Review generated SQL and stop for owner review if database/provider changes or an unresolved risk needs approval.
Phase 2: protected admin draft-product management and inventory adjustments with append-only audit movements, SKU uniqueness, optimistic concurrency where needed, and secure admin identity handling. No customer interface requiring login.
Phase 3: public /shop, the four category pages and product details using real published records only; accessible responsive UI; product metadata and sitemap inclusion for published products only; preserve journal and privacy-consent analytics. Keep cart/purchase controls off.
Phase 4: optional guest cart foundation only if it has a clear product-preview purpose. Prefer client state for a non-purchasing preview; otherwise use opaque random guest tokens stored as hashes server-side. Always re-resolve current price/availability server-side. Never reserve inventory or collect address/payment data.
Phase 5: stop. Produce a readiness checklist for owner review. Checkout, payments, shipping, orders, refunds, customer accounts, and production activation require a separate explicit implementation approval after actual products, compliance, policies, inventory, fulfilment, provider accounts, and support process are ready.

TECHNICAL ACCEPTANCE
- Product category, product, variant, SKU, price/currency, image metadata, inventory movement, publication, and stock invariants match SPECIFICATION.md.
- Use integer minor currency units and a configurable currency; do not assume provider, tax, or regulatory rules. Validate product-specific fields and never expose internal notes or inventory movements publicly.
- Every inventory mutation and movement record is atomic, authorized, validated, non-negative, and idempotent where retries are possible. Guest carts do not reserve stock.
- Admin, cart, preview, and unpublished content are noindex and absent from public sitemap/API responses. Public catalogue returns published active products only.
- All API inputs use Zod, bounded lengths/quantities, consistent generic errors, same-origin protections, and no secrets/PII in logs. Use verified actor identity in audit records.
- Preserve existing tests and add focused unit/integration/browser coverage for commerce behavior and critical non-regression paths. Run relevant repository checks; do not silently skip failures. Review generated SQL and migration order.
- Before completion, inspect the diff and confirm no unrelated or sources/ changes. Report file-by-file changes, migrations and rollback, tests/checks, manual setup still required, unresolved decisions, and a clear statement that no website deployment or production changes were made.

Work in small, reviewable commits only if the user explicitly asks for commits. Do not deploy, publish, create paid resources, or send communications.
```
