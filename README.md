# The Accidental Man

> **A man isn't born. He's built.**  
> *A factory for the modern man — to become, maintain, and evolve.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45+-C5F74F?style=flat-square&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Biome](https://img.shields.io/badge/Biome-2.5+-60A5FA?style=flat-square&logo=biome)](https://biomejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-5+-FCC72B?style=flat-square&logo=vitest)](https://vitest.dev/)

A content-first men's lifestyle journal designed to grow into a considered commerce brand. The first release is a fast, public editorial site with an email signup, structured typography, and pillar-based navigation across 9 core areas of life.

The codebase keeps content, API handling, and data access in one clean deployable application.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: `20.9+` (Node 22 recommended)
- **Docker** (or an existing PostgreSQL 16+ database)

### Installation & Setup

1. **Clone and setup environment variables:**
   ```bash
   # Copy example environment configuration
   cp .env.example .env.local
   # On Windows PowerShell:
   # Copy-Item .env.example .env.local
   ```

2. **Start the local PostgreSQL database:**
   ```bash
   docker compose up -d db
   ```

3. **Install dependencies:**
   ```bash
   npm ci
   ```

4. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

5. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> Public journal content currently renders from typed editorial fixtures in `src/lib/content.ts`. The database schema contains `articles` and `subscribers` ready for the Phase 2 admin publishing workflow.

---

## 🏗️ Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | Server components render editorial content; client components are limited to interactive controls (newsletter signup, drawer navigation, analytics consent). |
| **Language** | TypeScript (strict) | Strict typing across all content models, route parameters, schemas, and database queries. |
| **Styling** | Vanilla CSS Tokens | Editorial typographic scale, responsive grids, reduced-motion awareness, and dark-accents without CSS framework bloat. |
| **Database** | PostgreSQL + Drizzle ORM | Parameterized SQL queries with versioned migrations in `/drizzle`. Prerendered pages avoid DB connections during build time. |
| **Validation** | Zod v4 | Runtime request payload validation with generic errors to avoid account enumeration. |
| **Email** | Resend Adapter | Verified sender integration (`hello@theaccidentalman.com`) with high-entropy unsubscribe tokens. |
| **Analytics** | GA4 (Consent-Gated) | Blocked by default. Loads only if reader grants consent via the privacy banner. |

---

## 🧭 The 9 Pillars

The editorial universe is structured around 9 foundational pillars:

1. **01. Mind:** Learning, attention, habits, judgment, and mental clarity.
2. **02. Emotions:** Emotional literacy, resilience, and self-respect.
3. **03. Body:** Movement, strength, sleep, nutrition, and health.
4. **04. Spirit & Purpose:** Values, identity, and the questions that guide a life.
5. **05. Grooming:** Simple, consistent routines and practical daily care.
6. **06. Style:** Fit, function, and dressing for real situations.
7. **07. Career & Money:** Work craft, financial discipline, and long-term stability.
8. **08. Relationships:** Friendship, family, stewardship, and accountability.
9. **09. Life:** Home, time, responsibility, transitions, and intentional living.

---

## 🔄 Core Flows

- **Editorial Reader Flow:**  
  `Request` → `Server-rendered homepage / journal / pillar page` → `Metadata & sitemap` → `Edge / CDN cache`.
- **Newsletter Signup & Verification:**  
  `Consent checkbox + email` → `Same-origin POST /api/newsletter` → `Zod schema check` → `Honeypot check` → `PostgreSQL insert` → `Idempotent welcome email dispatch`.
- **Unsubscribe Flow:**  
  `Email link with unique token` → `GET /newsletter/unsubscribe` → `Immediate one-click opt-out`.

---

## 📁 Repository Structure

```text
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, metadata, API routes)
│   │   ├── (public)/        # Editorial pages: /, /journal, /pillars, /privacy
│   │   ├── api/             # API boundaries (/api/newsletter, /api/admin/broadcast)
│   │   ├── sitemap.ts       # Dynamic sitemap generation
│   │   └── robots.ts        # Dynamic robots.txt
│   ├── components/          # Reusable UI components (SiteHeader, JournalFeed, NewsletterForm)
│   └── lib/                 # Core domain logic
│       ├── db/              # Drizzle schema and connection pool
│       ├── content.ts       # Typed editorial content fixtures
│       ├── pillars.ts       # 9 pillars metadata and article mapping
│       ├── schema.ts        # Schema.org structured JSON-LD data
│       └── validation/      # Zod request validators
├── drizzle/                 # Versioned SQL migration files
├── tests/                   # Vitest unit and component tests
├── e2e/                     # Playwright end-to-end browser tests
└── public/images/           # Optimized WebP assets and photography
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev           # Start Next.js development server on localhost:3000

# Building & Production
npm run build         # Quality gate check (lint + typecheck + test) and production build
npm run build:fast    # Build without pre-flight checks
npm start             # Start production server

# Quality & Testing
npm run lint          # Run Biome lint checks
npm run typecheck     # Run TypeScript type verification
npm test              # Run unit & component tests with Vitest
npm run test:watch    # Run Vitest in interactive watch mode
npm run audit         # Run npm dependency security audit

# Database Management
npm run db:generate   # Generate Drizzle migration SQL from schema
npm run db:migrate    # Apply migrations to database
```

---

## 🧪 Testing Strategy

The repository uses a dual-layer testing approach:

- **Unit & Component Tests (`tests/`):**  
  Powered by **Vitest** + **Testing Library** (`happy-dom`). Tests validation schemas, sitemap and structured metadata generation, email templating, and isolated React component rendering in milliseconds with zero browser overhead.
- **End-to-End Browser Tests (`e2e/`):**  
  Powered by **Playwright**. Covers real browser interactions: navigation flows, skip-to-content accessibility landmarks, privacy consent toggles, and newsletter form client-side validation.

---

## 🔒 Security & Operations Checklist

- **Rate Limiting:** Edge/WAF rate limiting on `/api/newsletter` (e.g. 5 requests/min per IP).
- **Validation:** Strict Zod parsing on all API endpoints; rejects unknown fields and normalizes emails.
- **Headers & CSP:** Baseline Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` configured in `next.config.ts`.
- **Database Access:** Principle of least privilege with automated encrypted point-in-time backups in production. Migrations run as a deployment release step, never on instance boot.
- **Privacy & Observability:** Strict GDPR/CCPA alignment; Google Analytics is gated until explicit consent is granted. Logs redact all PII, emails, tokens, and authorization headers.

---

## ⚙️ Environment Variables

| Variable | Description | Required | Default / Note |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgres://user:pass@localhost:5432/accidental_man` |
| `APP_URL` | Canonical public application URL | Yes | `http://localhost:3000` (local) |
| `RESEND_API_KEY` | Resend API key for welcome/newsletter emails | Optional in dev | Secret store only |
| `NEWSLETTER_FROM_EMAIL` | Verified sender address | Optional | `The Accidental Man <hello@theaccidentalman.com>` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | Optional | `G-4PD1WZ0YC9` |
