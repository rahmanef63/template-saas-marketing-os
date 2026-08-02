"use client";

import * as React from "react";
import { usePosts } from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { parseImage, isUrlImage } from "@/features/image-picker";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + link}, consumed by the shared ConceptListPage (default grid via
 * ConceptCardView). Adapter-only: wraps existing selectors, no schema/table/
 * state rename → zero data migration. Mirrors the personal-brand-os canon so
 * the public list UI is unified fleet-wide.
 */

/** Cover tokens are URL / css-color / gradient — only resolve real image URLs
 *  into the card cover; css/gradient tokens have no <img> src. */
function coverSrc(cover?: string): string | undefined {
  if (!cover) return undefined;
  const parsed = parseImage(cover);
  return parsed && isUrlImage(parsed) ? parsed.value : undefined;
}

export const blogAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Writing",
    title: "From the team",
    subtitle:
      "Engineering deep-dives, customer stories, and product thinking — written by the people who shipped the feature.",
  },
  searchable: true,
  columns: 3,
  emptyText: "No posts match. Reset the filter or publish a new post in Admin.",
  hrefFor: (c) => `${PUBLIC_BASE}/blog/${c.slug}`,
  useCards: () => {
    const posts = usePosts();
    return React.useMemo<ConceptCard[]>(
      () =>
        posts
          .filter((p) => p.status !== "draft")
          .sort((a, b) => b.publishedAt - a.publishedAt)
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            cover: coverSrc(p.cover),
            date: p.publishedAt,
            tags: p.tags,
          })),
      [posts],
    );
  },
};
