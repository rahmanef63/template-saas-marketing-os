"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { blogAdapter } from "@/features/_app/concepts";

/**
 * Public blog index. Thinned onto the shared ConceptListPage default grid
 * (visual unification across the fleet) — the bespoke featured-hero + sidebar
 * layout is intentionally replaced by the uniform card grid. Data is unchanged:
 * blogAdapter wraps the existing usePosts() selector. Same export name + path so
 * app/(public)/blog/page.tsx imports it unchanged.
 */
export function BlogPage() {
  return <ConceptListPage adapter={blogAdapter} />;
}
