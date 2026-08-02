"use client";

import { HeroBlock, CtaBand } from "@/features/_shared";
import { LandingSectionShell } from "@/features/_shared/landing/LandingSectionShell";
import { HeroLayers } from "@/features/_shared/landing/HeroLayers";
import { parseConfigBadge } from "@/features/_shared/landing/parse-config";
import {
  CustomSection, FaqSection, NewsletterSection, StatsSection, TestimonialsSection,
  parseConfigObject, cfgString,
} from "@/features/_shared/landing/sections";
import { FeatureGridSection, type FeatureItem as SliceFeatureItem } from "@/features/feature-grid";
import { PricingSection, type PricingTier as SliceTier } from "@/features/pricing-page";
import { BlogListSection, type BlogPost as SliceBlogPost } from "@/features/blog-section";
import { ChangelogFeedSection, type ChangelogEntry as SliceChangelogEntry } from "@/features/changelog-feed";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  BlogPost, ChangelogEntry, FeatureItem, Integration, LandingSection, PricingTier,
} from "@/features/_app/types";
import {
  IntegrationsShowcase, SAAS_CLIENTS, SAAS_FAQS, SAAS_PRODUCT_BODY, SAAS_STATS, SAAS_TESTIMONIALS,
} from "./LandingExtras";

interface Deps {
  features: FeatureItem[];
  pricing: PricingTier[];
  posts: BlogPost[];
  changelog: ChangelogEntry[];
  integrations: Integration[];
  onSubscribe?: (email: string) => Promise<{ ok: boolean; notice?: string }>;
}

const SHARED_CLS = "border-b border-border/60 !py-12 sm:!py-16";

/** Maps each enabled landingSection.kind to a real renderer — rr canonical
 *  slices where a store exists (features/pricing/blog/changelog), the shared
 *  landing-sections library for the rest. Admin title/subtitle/config thread
 *  through every kind. */
export function renderLanding(section: LandingSection, deps: Deps) {
  switch (section.kind) {
    case "hero": {
      const cfg = parseConfigObject(section.config);
      return (
        <LandingSectionShell section={section}>
          <div className="relative isolate overflow-hidden">
            {/* Background band — admin layers, or /hero.webp fallback (full
                opacity = real colors). */}
            <HeroLayers placement="background" layers={section.layers} fallbackImg={section.bgImageUrl || "/hero.webp"} />
            {/* Readability scrim + brand glow — opt-in via `shade` so the
                image shows in full real color by default. */}
            {section.shade && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
                <div className="motion-blob absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl" />
                <div
                  className="motion-blob absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
                  style={{ animationDelay: "-8s", animationDuration: "22s" }}
                />
              </div>
            )}
            <HeroBlock
              align={cfgString(cfg, "align") === "center" ? "center" : "left"}
              badge={parseConfigBadge(section.config) ?? DEFAULT_SITE_CONFIG.tagline}
              title={section.title}
              subtitle={section.subtitle ?? DEFAULT_SITE_CONFIG.description}
              primaryCta={{
                label: cfgString(cfg, "ctaPrimaryLabel") ?? DEFAULT_SITE_CONFIG.ctaPrimary.label,
                href: cfgString(cfg, "ctaPrimaryHref") ?? DEFAULT_SITE_CONFIG.ctaPrimary.href,
              }}
              secondaryCta={{
                label: cfgString(cfg, "ctaSecondaryLabel") ?? "See features",
                href: cfgString(cfg, "ctaSecondaryHref") ?? `${PUBLIC_BASE}/features`,
              }}
              image={section.imageUrl ? { url: section.imageUrl, ratio: section.imageRatio } : undefined}
            />
            {/* Foreground layers — above content, click-through. */}
            <HeroLayers placement="foreground" layers={section.layers} />
          </div>
        </LandingSectionShell>
      );
    }

    case "features": {
      const items = deps.features.slice(0, 6).map(
        (f): SliceFeatureItem => ({ id: f.id, title: f.title, body: f.blurb, icon: f.icon }),
      );
      return (
        <LandingSectionShell section={section}>
          <FeatureGridSection
            eyebrow="What you get"
            title={section.title}
            subtitle={section.subtitle}
            items={items}
            columns={3}
            layout="cards"
            className={SHARED_CLS}
          />
        </LandingSectionShell>
      );
    }

    case "stats":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/10">
          <StatsSection section={section} stats={SAAS_STATS} clients={SAAS_CLIENTS} locale="en-US" />
        </LandingSectionShell>
      );

    case "portfolio":
    case "custom":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <CustomSection section={section} body={SAAS_PRODUCT_BODY} />
        </LandingSectionShell>
      );

    case "services":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60 bg-muted/10">
          <IntegrationsShowcase section={section} integrations={deps.integrations} />
        </LandingSectionShell>
      );

    case "testimonials":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <TestimonialsSection section={section} items={SAAS_TESTIMONIALS} eyebrow="Customer voices" />
        </LandingSectionShell>
      );

    case "pricing":
      return (
        <LandingSectionShell section={section}>
          <PricingSection
            eyebrow="Pricing"
            title={section.title}
            subtitle={section.subtitle}
            tiers={deps.pricing as SliceTier[]}
            className={`${SHARED_CLS} bg-muted/30`}
          />
        </LandingSectionShell>
      );

    case "faq":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <FaqSection
            section={section}
            items={SAAS_FAQS}
            ctaPrefix="Still have questions?"
            ctaLabel="Talk to us"
            ctaHref="/contact"
          />
        </LandingSectionShell>
      );

    case "blog": {
      const items = deps.posts.slice(0, 3).map(
        (p): SliceBlogPost => ({
          id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt,
          publishedAt: p.publishedAt, tags: p.tags,
        }),
      );
      return (
        <LandingSectionShell section={section}>
          <BlogListSection
            eyebrow="Latest writing"
            title={section.title}
            subtitle={section.subtitle}
            posts={items}
            hrefFor={(p) => `${PUBLIC_BASE}/blog/${p.slug}`}
            columns={3}
            layout="cards"
            limit={3}
            className={SHARED_CLS}
          />
        </LandingSectionShell>
      );
    }

    case "changelog": {
      const entries = deps.changelog.slice(0, 4).map(
        (e): SliceChangelogEntry => ({
          ...e, kind: e.kind === "chore" ? "chore" : e.kind === "fix" ? "fix" : "feature",
        }),
      );
      return (
        <LandingSectionShell section={section}>
          <ChangelogFeedSection
            eyebrow="What's new"
            title={section.title}
            subtitle={section.subtitle}
            entries={entries}
            layout="list"
            limit={4}
            className={SHARED_CLS}
          />
        </LandingSectionShell>
      );
    }

    case "cta":
      return (
        <LandingSectionShell section={section}>
          <CtaBand
            title={section.title}
            subtitle={section.subtitle ?? "Spin up a workspace in 60 seconds."}
            cta={DEFAULT_SITE_CONFIG.ctaPrimary}
            secondaryCta={{ label: "Talk to sales", href: `${PUBLIC_BASE}/contact` }}
          />
        </LandingSectionShell>
      );

    case "newsletter":
      return (
        <LandingSectionShell section={section} defaultClassName="border-b border-border/60">
          <NewsletterSection
            section={section}
            placeholder="you@company.com"
            buttonLabel="Subscribe"
            successText="Thanks — you're on the list!"
            onSubscribe={deps.onSubscribe}
          />
        </LandingSectionShell>
      );

    default:
      return null;
  }
}
