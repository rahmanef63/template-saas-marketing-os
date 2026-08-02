"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import {
  useChangelog,
  useFeatures,
  useIntegrations,
  useLandingSections,
  usePosts,
  usePricing,
} from "@/features/_app/store";
import { renderLanding } from "./LandingRenderer";

/**
 * Composes the public home from admin-editable `landingSections`.
 * Order + visibility + per-section copy/config are owned by
 * /admin/landing; BroadcastChannel sync makes edits appear here without
 * a reload.
 *
 * Pre-CK-3 this file spliced hard-coded always-on bands (logo marquee,
 * KPI strip, testimonial carousel, pricing teaser, changelog teaser,
 * closing CTA) around the admin sections — duplicating the pricing/cta
 * kinds and leaving stats/testimonials outside dashboard control. Those
 * bands now live as real section kinds (see LandingRenderer +
 * LandingExtras), so this is a pure section renderer like the canon.
 */
export function HomePage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const sections = useLandingSections();
  const features = useFeatures();
  const pricing = usePricing();
  const posts = usePosts();
  const changelog = useChangelog();
  const integrations = useIntegrations();

  const subscribe = useMutation(api.subscribers.subscribe);
  const onSubscribe = React.useCallback(
    async (email: string) => {
      await subscribe({ email, source: "landing" });
      return { ok: true as const };
    },
    [subscribe],
  );

  const ordered = React.useMemo(
    () => [...sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order),
    [sections],
  );

  if (!mounted) return null;

  // Fresh/unseeded site: no landing sections yet -> guide instead of a blank page.
  if (ordered.length === 0) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <div>
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
            <Sparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Situs sedang disiapkan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Belum ada konten. Kalau kamu pemiliknya, masuk ke dashboard dan klik
            "Isi konten contoh" untuk mulai.
          </p>
          <Button asChild className="mt-6">
            <Link href="/admin">Masuk admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {ordered.map((s) => (
        <React.Fragment key={s.id}>
          {renderLanding(s, { features, pricing, posts, changelog, integrations, onSubscribe })}
        </React.Fragment>
      ))}
    </>
  );
}
