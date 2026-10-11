import type { Story } from "./content";

export const SITE_URL = process.env.APP_URL ?? "https://theaccidentalman.com";

/**
 * Site-wide Organization JSON-LD Schema
 */
export function getOrganizationSchema(baseUrl = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "The Accidental Man",
    alternateName: "TheAccidentalMan",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/logo-mark.png`,
      caption: "The Accidental Man Logo",
    },
    email: "hello@theaccidentalman.com",
    description:
      "A factory for the modern man — to become, maintain, and evolve across mind, body, character, and everyday life. A man isn't born. He's built.",
    sameAs: [
      "https://www.linkedin.com/company/theaccidentalman/",
      "https://www.instagram.com/theaccidentalman/",
      "https://www.youtube.com/@theaccidentalman",
      "https://pin.it/ixKK7ireQ",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: "hello@theaccidentalman.com",
    },
  };
}

/**
 * Site-wide WebSite JSON-LD Schema
 */
export function getWebsiteSchema(baseUrl = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "The Accidental Man",
    url: baseUrl,
    description:
      "A factory for the modern man — to become, maintain, and evolve across mind, body, character, and everyday life. A man isn't born. He's built.",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en-US",
  };
}

/**
 * Article / BlogPosting JSON-LD Schema for individual journal essays
 */
export function getArticleSchema(story: Story, baseUrl = SITE_URL) {
  const articleUrl = `${baseUrl}/journal/${story.slug}`;
  const imageUrl = story.articleImage.startsWith("http")
    ? story.articleImage
    : `${baseUrl}${story.articleImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: story.title,
    description: story.excerpt,
    image: [imageUrl],
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    author: {
      "@type": "Person",
      name: story.author,
      url: `${baseUrl}/#about`,
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    articleSection: story.category,
    timeRequired: `PT${story.readingTimeMinutes}M`,
    inLanguage: "en-US",
  };
}

/**
 * BreadcrumbList JSON-LD Schema
 */
export function getBreadcrumbListSchema(
  items: { name: string; item: string }[],
  baseUrl = SITE_URL,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : `${baseUrl}${it.item}`,
    })),
  };
}

/**
 * CollectionPage JSON-LD Schema for Journal index
 */
export function getJournalCollectionSchema(
  storiesList: Story[],
  baseUrl = SITE_URL,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/journal#collection`,
    name: "The Journal — Notes on Becoming",
    description:
      "Flagship essays, field notes, and practical guidance on building and caring for a fuller life.",
    url: `${baseUrl}/journal`,
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: storiesList.map((story, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/journal/${story.slug}`,
        name: story.title,
      })),
    },
  };
}

/**
 * FAQPage JSON-LD Schema for Home page to maximize AI-answerability (SearchGPT, Perplexity, Google AI)
 */
export function getHomePageFaqSchema(baseUrl = SITE_URL) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is The Accidental Man?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Accidental Man is a publication and platform for the modern man built around the conviction that 'A man isn't born. He's built.' It provides practical, grounded philosophy across mind, body, character, and daily life.",
        },
      },
      {
        "@type": "Question",
        name: "What are the three core tenets of The Accidental Man?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The three tenets are: 01 Become (starting where you are without shame and unlearning inherited noise), 02 Maintain (daily architecture, grounded routines, physical vitality, and showing up for commitments), and 03 Evolve (expanding capacity over time, deepening craft, and defining a life you respect).",
        },
      },
      {
        "@type": "Question",
        name: "What are the nine pillars covered by The Accidental Man?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The nine pillars are: Mind, Emotions, Body, Spirit & Purpose, Grooming, Style, Career & Money, Relationships, and Life.",
        },
      },
    ],
  };
}
