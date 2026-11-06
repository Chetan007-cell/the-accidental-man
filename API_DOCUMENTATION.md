# The Accidental Man — Complete Beginner-Friendly API Guide & Reference

Welcome! This guide explains everything you need to know about publishing and managing articles on **The Accidental Man** using the REST API.

With this API, **you never need to write code or touch database files to publish an article**. You simply send a request (from Postman, cURL, Zapier, Python, or Make), and the platform automatically creates your article, hosts your images, formats magazine sections, links the article to the 9 Pillars, and updates the entire website instantly.

---

## Table of Contents
1. [Quick Start in 60 Seconds](#1-quick-start-in-60-seconds)
2. [Authentication (Your API Key)](#2-authentication-your-api-key)
3. [The Ultimate cURL Command (Every Field Included)](#3-the-ultimate-curl-command-every-field-included)
4. [Field-by-Field Dictionary](#4-field-by-field-dictionary)
5. [How Images Work (3 Easy Ways)](#5-how-images-work-3-easy-ways)
6. [How Markdown & Sections Work](#6-how-markdown--sections-work)
7. [The 9 Pillars & How Tagging Works](#7-the-9-pillars--how-tagging-works)
8. [What Happens on the Website When You Post](#8-what-happens-on-the-website-when-you-post)
9. [Full Endpoints Reference (Create, Read, Update, Delete, Upload)](#9-full-endpoints-reference)
10. [Code Snippets in Python & JavaScript](#10-code-snippets-in-python--javascript)
11. [Troubleshooting & Common Errors](#11-troubleshooting--common-errors)

---

## 1. Quick Start in 60 Seconds

Want to publish an article right away? Just copy this command, replace `YOUR_API_KEY` with your secret key, paste it into your terminal, and press Enter:

```bash
curl -X POST https://theaccidentalman.com/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer Chetan@007" \
  -d '{
    "title": "Mastering The Internal Dialogue",
    "tags": ["Mind", "Focus"],
    "body": "Most men battle self-doubt in silence.\n\n## The Inner Critic\nSilence the noise and cultivate calm focus."
  }'
```

**That’s it!** The article is now live on the website, formatted, categorized, and linked.

---

## 2. Authentication (Your API Key)

To prevent unauthorized people from posting to your journal, mutation requests (`POST`, `PUT`, `DELETE`, `/api/upload`) require your administrative API key.

Your key is stored in your `.env.local` file under `ADMIN_API_KEY` (default in development: `Chetan@007`).

You can pass the key in **either of two ways**:

### Option 1: Bearer Token (Standard)
```http
Authorization: Bearer Chetan@007
```

### Option 2: Custom Header
```http
x-api-key: Chetan@007
```

> [!TIP]
> Public reading endpoints like `GET /api/posts` and `GET /api/posts/:slug` do **not** require any API key.

---

## 3. The Ultimate cURL Command (Every Field Included)

Here is the complete cURL command showing **every single field** supported by the API.

```bash
curl -X POST https://theaccidentalman.com/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer Chetan@007" \
  -d '{
    "title": "The Daily Architecture of Discipline",
    "slug": "the-daily-architecture-of-discipline",
    "category": "MIND / FOCUS",
    "tags": ["Mind", "Self-Awareness", "Focus"],
    "excerpt": "Why character isn\u0027t an accident, but the quiet daily discipline of choosing who you want to become.",
    "author": "The Accidental Man",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200",
    "imageAlt": "A thoughtful man sitting at a wooden desk with a notebook in morning light",
    "body": "Discipline is not self-punishment; it is self-respect.\n\nWhen you keep a promise you made to yourself, your sense of self-worth solidifies. You no longer depend on whether someone noticed you.\n\n## Morning Standard\nNever start the day in emergency mode. When you immediately open your notifications, you hand your attention to everyone else.\n\nStep outside, take in natural daylight, and set one honest intention before checking the feed.\n\n## The Quiet Repetition\nCharacter is built through the small, uncelebrated decisions that seem ordinary until they form a pattern.\n\nStrength looks like staying calm when provoked, walking away from a meaningless argument, or asking for help before a challenge spirals.\n\n## The Real Measure\nThere is no final finish line called \"being finished.\" We keep learning, stumbling, and rebuilding.",
    "readingTimeMinutes": 5,
    "publishedAt": "2026-11-06T06:00:00.000Z",
    "status": "published",
    "broadcast": false
  }'
```

### Response You Will Receive (`201 Created`):
```json
{
  "ok": true,
  "message": "Blog post created successfully: The Daily Architecture of Discipline",
  "id": "e4f81234-bc56-789a-0123-456789abcdef",
  "url": "https://theaccidentalman.com/journal/the-daily-architecture-of-discipline",
  "post": {
    "slug": "the-daily-architecture-of-discipline",
    "category": "MIND / FOCUS",
    "tags": ["Mind", "Self-Awareness", "Focus"],
    "title": "The Daily Architecture of Discipline",
    "excerpt": "Why character isn't an accident, but the quiet daily discipline of choosing who you want to become.",
    "author": "The Accidental Man",
    "date": "6 NOVEMBER 2026",
    "publishedAt": "2026-11-06T06:00:00.000Z",
    "readingTimeMinutes": 5,
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200",
    "imageAlt": "A thoughtful man sitting at a wooden desk with a notebook in morning light",
    "introduction": [
      "Discipline is not self-punishment; it is self-respect.",
      "When you keep a promise you made to yourself, your sense of self-worth solidifies. You no longer depend on whether someone noticed you."
    ],
    "sections": [
      {
        "heading": "Morning Standard",
        "paragraphs": [
          "Never start the day in emergency mode. When you immediately open your notifications, you hand your attention to everyone else.",
          "Step outside, take in natural daylight, and set one honest intention before checking the feed."
        ]
      },
      {
        "heading": "The Quiet Repetition",
        "paragraphs": [
          "Character is built through the small, uncelebrated decisions that seem ordinary until they form a pattern.",
          "Strength looks like staying calm when provoked, walking away from a meaningless argument, or asking for help before a challenge spirals."
        ]
      },
      {
        "heading": "The Real Measure",
        "paragraphs": [
          "There is no final finish line called \"being finished.\" We keep learning, stumbling, and rebuilding."
        ]
      }
    ]
  },
  "broadcast": null
}
```

---

## 4. Field-by-Field Dictionary

Here is what every single property does, whether it is required, and what happens if you leave it out:

| Field | Type | Required? | Default / Fallback | What It Does |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `string` | **YES** | None | The headline of the essay. Example: `"The Solitary Walk"`. |
| `slug` | `string` | No | Auto-generated from `title` | The URL path: `theaccidentalman.com/journal/<slug>`. If omitted, `"The Solitary Walk"` becomes `"the-solitary-walk"`. |
| `tags` | `string[] \| string` | No | `["Foundations"]` | Pillar tags for filtering (e.g. `["Mind", "Focus"]` or `"Mind, Focus"`). Automatically syncs with `category`. |
| `category` | `string \| string[]` | No | Derived from `tags` | The uppercase editorial eyebrow (e.g. `"MIND / FOCUS"`). If omitted, automatically built from `tags`. |
| `excerpt` | `string` | No | First paragraph of `body` | The 1-2 sentence subtitle shown on the feed cards, social previews, and Google search. |
| `dek` | `string` | No | Same as `excerpt` | Editorial alias for `excerpt`. |
| `body` | `string` | No | `""` | The full article text written in Markdown. Use `## Section Title` for headings. |
| `content` | `string` | No | Same as `body` | Alias for `body`. |
| `image` | `string \| File` | No | `"/images/home-hero.png"` | The hero banner image. Can be an external URL (`https://...`), a local file path (`/images/...`), a Base64 data URL (`data:image/...`), or a direct uploaded File. |
| `heroImageUrl` | `string` | No | Same as `image` | Alias for `image`. |
| `imageBase64` | `string` | No | None | Explicit base64 image data string (`data:image/jpeg;base64,...` or raw base64). |
| `imageAlt` | `string` | No | Defaults to `title` | Accessibility description for screen readers and Google Image search. |
| `author` | `string` | No | `"The Accidental Man"` | The byline author name displayed on the article. |
| `readingTimeMinutes` | `number` | No | Auto-calculated | Estimated reading time. If omitted, the API counts words and divides by 200 wpm. |
| `publishedAt` | `string` | No | Current timestamp (`now()`) | Publication ISO timestamp. Determines chronological sorting (`newest first`). |
| `status` | `"published" \| "draft"` | No | `"published"` | `"published"` shows the article live on the site. `"draft"` keeps it hidden from the public feed. |
| `broadcast` | `boolean` | No | `false` | If set to `true`, sends an email dispatch with this article to all confirmed newsletter subscribers. |

---

## 5. How Images Work (3 Easy Ways)

You can provide images in whichever way is easiest for your workflow:

### Option A: Direct File Upload (Multipart Form Data)
If you have an image file on your computer (`.jpg`, `.png`, `.webp`, `.avif`), upload it in the same request using `-F`:

```bash
curl -X POST https://theaccidentalman.com/api/posts \
  -H "Authorization: Bearer Chetan@007" \
  -F "title=The Stoic Morning" \
  -F "tags=Mind, Routine" \
  -F "image=@/Users/you/Pictures/morning.jpg" \
  -F "body=## Quiet Hours\nWaking early creates mental space."
```
> The API automatically saves the file to `/public/uploads/` on the server and links it to the article!

### Option B: Base64 Data URL (Inside Regular JSON)
If you are generating images programmatically or using an automation tool (Make, Zapier, Python):

```json
{
  "title": "Cold Water and Deep Sleep",
  "tags": ["Body", "Vitality"],
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "body": "Rest is not laziness. It is the biological foundation of recovery."
}
```
> The API decodes the base64, saves it as a clean `.png` or `.jpg` file in `/uploads/`, and attaches the clean URL to the post.

### Option C: External HTTPS URL (Unsplash, Pexels, CDN)
If your image is hosted on Unsplash or your own image host:

```json
{
  "title": "The Timeless Wardrobe",
  "tags": ["Style"],
  "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200",
  "body": "## Fit First\nGood dressing begins with understanding proportions."
}
```
> Next.js Image Optimization and Content Security Policy are already configured to serve and optimize external images from any HTTPS origin!

---

## 6. How Markdown & Sections Work

You don't need to format complicated JSON arrays for sections. Just write natural Markdown paragraphs and separate sections with `## Heading`:

```markdown
This is the opening paragraph of the introduction.
This is the second paragraph of the introduction.

## The Boy We Were
This is the first paragraph under the "The Boy We Were" heading.
This is the second paragraph under that section.

## You Become What You Repeatedly Do
This paragraph belongs to the second section.
```

### What the API does automatically:
- Everything before the first `## Heading` becomes the **introduction**.
- Every `## Heading` becomes an elegant magazine-style section with a title and paragraph blocks.
- Bold (`**text**`), italics (`*text*`), and blockquotes are preserved.

---

## 7. The 9 Pillars & How Tagging Works

The Accidental Man organizes content across **Nine Foundational Pillars**. When you add a tag matching any of these pillars, the article automatically links to that pillar's dedicated page:

| Pillar Number | Pillar Name | Valid Tags / Keywords | Dedicated URL |
| :---: | :--- | :--- | :--- |
| **01** | **Mind** | `"Mind"`, `"Self-Awareness"`, `"Focus"` | `/pillars/mind` |
| **02** | **Emotions** | `"Emotions"`, `"Resilience"`, `"Literacy"` | `/pillars/emotions` |
| **03** | **Body** | `"Body"`, `"Health"`, `"Movement"`, `"Vitality"` | `/pillars/body` |
| **04** | **Spirit & Purpose** | `"Spirit"`, `"Purpose"`, `"Philosophy"` | `/pillars/spirit-purpose` |
| **05** | **Grooming** | `"Grooming"`, `"Skin"`, `"Hygiene"` | `/pillars/grooming` |
| **06** | **Style** | `"Style"`, `"Wardrobe"`, `"Tailoring"` | `/pillars/style` |
| **07** | **Career & Money** | `"Career"`, `"Money"`, `"Craft"`, `"Finance"` | `/pillars/career-money` |
| **08** | **Relationships** | `"Relationships"`, `"Friendship"`, `"Family"` | `/pillars/relationships` |
| **09** | **Life** | `"Life"`, `"Habits"`, `"Home"`, `"Time"` | `/pillars/life` |

> [!NOTE]
> You can also tag `"Foundations"` for core manifesto essays.

---

## 8. What Happens on the Website When You Post

The second your API call returns `201 Created`, the entire site updates itself dynamically:

1. **Homepage Top 2 Dispatches:** The `"Fresh from the journal"` section pulls the 2 most recent articles and puts your new essay front-and-center.
2. **Journal Feed (`/journal`):** The total essay count increments (e.g. `ALL ESSAYS (4)`). The matching pillar pill (e.g. `MIND (2)`) updates its count. If you published to a new pillar like `Style`, a new `STYLE (1)` button appears automatically.
3. **The 9 Pillars Directory (`/pillars`):** The pillar card updates from *"Expanding Soon"* to *"1 Essay Active"*, and its button changes to *"View All Style Essays (1) →"*.
4. **Pillar Single Page (`/pillars/:slug`):** The new article appears in the tagged grid. The other 8 pillars update their live essay counters.
5. **Instant Cache Revalidation:** Next.js purges the server cache for `/`, `/journal`, `/pillars`, and `/sitemap.xml`.

---

## 9. Full Endpoints Reference

### 9.1 Create Article
- **Endpoint:** `POST /api/posts` *(or alias `POST /api/articles`)*
- **Auth Required:** Yes (`Authorization: Bearer <KEY>`)
- **Body:** JSON or Multipart Form Data

### 9.2 List All Articles
- **Endpoint:** `GET /api/posts` *(or alias `GET /api/articles`)*
- **Auth Required:** No
- **Query Params:**
  - `limit` (default: 50): Number of posts to return.
  - `offset` (default: 0): Pagination offset.

```bash
curl -X GET "https://theaccidentalman.com/api/posts?limit=10&offset=0"
```

### 9.3 Get Single Article
- **Endpoint:** `GET /api/posts/:slug`
- **Auth Required:** No

```bash
curl -X GET "https://theaccidentalman.com/api/posts/a-man-isnt-born-hes-built"
```

### 9.4 Update Article
- **Endpoint:** `PUT /api/posts/:slug`
- **Auth Required:** Yes

```bash
curl -X PUT "https://theaccidentalman.com/api/posts/mastering-the-internal-dialogue" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer Chetan@007" \
  -d '{
    "title": "Mastering The Internal Dialogue (Updated Title)",
    "body": "Updated content goes here..."
  }'
```

### 9.5 Delete Article
- **Endpoint:** `DELETE /api/posts/:slug`
- **Auth Required:** Yes

```bash
curl -X DELETE "https://theaccidentalman.com/api/posts/mastering-the-internal-dialogue" \
  -H "Authorization: Bearer Chetan@007"
```

### 9.6 Standalone Image Upload
- **Endpoint:** `POST /api/upload`
- **Auth Required:** Yes
- **Body:** Multipart `file` or JSON with `image` (base64)

```bash
curl -X POST "https://theaccidentalman.com/api/upload" \
  -H "Authorization: Bearer Chetan@007" \
  -F "file=@my-photo.jpg"
```

---

## 10. Code Snippets in Python & JavaScript

### Python Example
```python
import requests

API_URL = "https://theaccidentalman.com/api/posts"
API_KEY = "Chetan@007"

payload = {
    "title": "The Architecture of Quiet Confidence",
    "tags": ["Mind", "Self-Awareness"],
    "excerpt": "Real confidence does not demand attention; it has nothing to prove.",
    "body": """Real confidence is rarely loud.
    
## The Loudest in the Room
Insecurity often performs as volume. Genuine capability is quiet.

## Building Substance
Focus on the standard of your work when nobody is looking."""
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(API_URL, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.json())
```

### JavaScript / Node.js Fetch Example
```javascript
const response = await fetch("https://theaccidentalman.com/api/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer Chetan@007",
  },
  body: JSON.stringify({
    title: "Movement as Medicine",
    tags: ["Body", "Health"],
    excerpt: "Physical vitality is the foundation for clear thinking.",
    body: "## Daily Motion\nYou do not need extremes. You need consistency.",
  }),
});

const data = await response.json();
console.log("Published article URL:", data.url);
```

---

## 11. Troubleshooting & Common Errors

| Error Code | Meaning | Common Cause & How to Fix |
| :--- | :--- | :--- |
| **`401 Unauthorized`** | Missing or invalid key | Ensure your request includes `Authorization: Bearer <YOUR_KEY>` or `x-api-key: <YOUR_KEY>`, matching `ADMIN_API_KEY` in `.env.local`. |
| **`400 Bad Request: title is required`** | Missing title | The `"title"` field is the only mandatory field. Ensure you included a non-empty string for `"title"`. |
| **`400 Bad Request: Invalid JSON`** | JSON syntax error | Check for trailing commas or unescaped quotes in your JSON body. |
| **`404 Not Found`** | Unknown article slug | Occurs on `GET /api/posts/:slug`, `PUT`, or `DELETE` when the slug does not exist in the database. |
| **Image not loading** | Invalid image format | If using Base64, ensure the string begins with `data:image/<png|jpeg|webp>;base64,`. |
