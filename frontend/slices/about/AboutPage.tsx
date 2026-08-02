"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Stagger } from "@/features/_shared/motion";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";

export function AboutPage() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const DEFAULT_HEADLINE = `${c.productName} — built by a small distributed team`;
  const DEFAULT_INTRO =
    "We started it because every signing API we tried felt heavier than the problem they solved.";
  const headline = settings?.aboutHeadline || DEFAULT_HEADLINE;
  const intro = settings?.seoDescription || DEFAULT_INTRO;
  const photo = settings?.aboutImageUrl;
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={headline}
            className="mb-6 h-40 w-40 rounded-2xl border border-border/60 object-cover"
          />
        )}
        <SectionHead
          eyebrow="About"
          title={headline}
          subtitle={intro}
        />
        <div className="mt-12 space-y-6 text-base text-muted-foreground">
          <Stagger>
            <p>
              {c.productName} is built and maintained by a remote team across Jakarta, Berlin, and Toronto.
              We ship every week and answer support emails ourselves.
            </p>
            <p>
              We focus on three things: a small focused API surface, audit-ready defaults, and predictable
              pricing. We will never charge per-seat on the Free tier.
            </p>
            <p>
              Have a question, a bug report, or a wild integration idea? Email{" "}
              <a href={`mailto:${c.email}`} className="text-foreground underline-offset-4 hover:underline">
                {c.email}
              </a>
              .
            </p>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
