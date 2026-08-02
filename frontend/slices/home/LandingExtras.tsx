"use client";

import * as React from "react";
import { Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Stagger } from "@/features/_shared/motion";
import type {
  FaqItem,
  StatItem,
  TestimonialItem,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import type { Integration, IntegrationProvider } from "@/features/_app/types";
import {
  STATS,
  CLIENTS,
  TESTIMONIALS,
  FAQS,
  PRODUCT_BODY,
} from "@/convex/landingContent";

/** SaaS default landing content lives in convex/landingContent.ts — the SINGLE
 *  source the seed also reads (it writes the same content into Convex config).
 *  These re-exports are the render fallback before the seed runs (and whenever
 *  a section carries no config override); edit the content in that module, not
 *  here. Every value stays overridable per-section via the admin landing
 *  editor's config JSON (see _shared/landing/sections/config.ts for keys). */

export const SAAS_STATS: StatItem[] = STATS;
export const SAAS_CLIENTS: string[] = CLIENTS;
export const SAAS_TESTIMONIALS: TestimonialItem[] = TESTIMONIALS;
export const SAAS_FAQS: FaqItem[] = FAQS;
export const SAAS_PRODUCT_BODY: string[] = PRODUCT_BODY;

const PROVIDER_NAMES: Record<IntegrationProvider, string> = {
  slack: "Slack",
  linear: "Linear",
  hubspot: "HubSpot",
  resend: "Resend",
  stripe: "Stripe",
  github: "GitHub",
  intercom: "Intercom",
  segment: "Segment",
};

/** "services" landing kind — the integrations registry as a marketing
 *  grid. Backed by real store data (admin CRUD via /admin/integrations),
 *  showing only public-safe fields: provider name + OAuth scopes. */
export function IntegrationsShowcase({
  section,
  integrations,
}: {
  section: LandingSection;
  integrations: Integration[];
}) {
  if (integrations.length === 0) return null;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead eyebrow="Integrations" title={section.title} subtitle={section.subtitle} />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stagger itemClassName="h-full">
          {integrations.map((i) => (
            <Card
              key={i.id}
              className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-foreground/5">
                    <Plug className="size-4 text-foreground/70" />
                  </span>
                  <p className="text-sm font-semibold">
                    {PROVIDER_NAMES[i.provider] ?? i.provider}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {i.scopes.slice(0, 3).map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="rounded-full font-mono text-[10px] text-muted-foreground"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
