import type { Database } from "@/integrations/supabase/types";

export type ArticleRow = Database["public"]["Tables"] extends { articles: { Row: infer R } }
  ? R
  : ArticleFallback;

// Fallback type used until Supabase types regenerate.
type ArticleFallback = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  status: "draft" | "scheduled" | "published" | string;
  author_id: string | null;
  author_name: string | null;
  author_bio: string | null;
  author_linkedin: string | null;
  author_twitter: string | null;
  primary_topic: string | null;
  related_article_ids: string[];
  seo_metadata: SeoMetadata;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EntityCategory = "region" | "theme" | "audience";

export interface EntityTag {
  category: EntityCategory;
  value: string;
}

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  entityTags?: EntityTag[];
  jsonLd?: Record<string, unknown>;
}

export const ENTITY_OPTIONS: Record<EntityCategory, string[]> = {
  region: [
    "Paris 7e",
    "Paris 8e",
    "Paris 16e",
    "Neuilly-sur-Seine",
    "Versailles",
    "Saint-Germain-en-Laye",
    "Lyon",
    "Bordeaux",
    "Nice",
  ],
  theme: [
    "Art de vivre",
    "Gastronomie",
    "Sécurité",
    "Culture",
    "Bien-être",
    "Voyage",
    "Patrimoine",
  ],
  audience: ["60+", "Veufs / Veuves", "Retraités actifs", "Cadres supérieurs"],
};

export const PUBLISHER_NAME = "Mon Kalimera";
export const PUBLISHER_URL = "https://monkalimera.fr";

/** Limits enforced on SEO inputs (Google standards). */
export const SEO_LIMITS = {
  metaTitle: 60,
  metaDescription: 155,
  slug: 60,
} as const;

/** Slugify a string into a short, URL-safe identifier. */
export function slugify(input: string, max = SEO_LIMITS.slug): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);
}

interface BuildJsonLdInput {
  title: string;
  excerpt?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  author: {
    name?: string | null;
    bio?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  };
  primaryTopic?: string | null;
  entityTags?: EntityTag[];
  publishedAt?: string | null;
  updatedAt?: string | null;
}

/** Generate a BlogPosting JSON-LD payload (schema.org). */
export function buildBlogPostingJsonLd(input: BuildJsonLdInput): Record<string, unknown> {
  const url = `${PUBLISHER_URL}/editorial/${input.slug}`;
  const sameAs = [input.author.linkedin, input.author.twitter].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.excerpt ?? undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: input.coverImageUrl
      ? { "@type": "ImageObject", url: input.coverImageUrl, caption: input.coverImageAlt ?? undefined }
      : undefined,
    author: input.author.name
      ? {
          "@type": "Person",
          name: input.author.name,
          description: input.author.bio ?? undefined,
          sameAs: sameAs.length ? sameAs : undefined,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    datePublished: input.publishedAt ?? undefined,
    dateModified: input.updatedAt ?? undefined,
    about: input.primaryTopic ?? undefined,
    keywords: input.entityTags?.map((t) => t.value).join(", ") || undefined,
  };
}
