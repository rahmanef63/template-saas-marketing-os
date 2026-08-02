// SINGLE SOURCE of SaaS Marketing OS's landing example content.
//
// Imported by BOTH:
//  - convex/seed.ts → seeds each render-only item section's `config` into
//    landingSections, so a fresh clone gets EDITABLE example data in the admin
//    landing editor (not just code-only render fallbacks).
//  - frontend/slices/home/LandingExtras.tsx → the render fallback (used before
//    the seed runs, and whenever a section carries no config override).
//
// MUST stay framework-pure: no convex/server, no convex/values, no React/lucide
// imports — only literals + plain types — so the Convex bundler AND the Next
// client can both import it. Hrefs are root-relative (publicBase = "" for the
// standalone repo). Item sections backed by their own Convex table (features /
// pricing / blog / changelog / integrations) are NOT here — they render from
// their tables; only render-only-const sections live in this module.
//
// Edit content HERE once; the seed and the render both follow. No drift.

export type LcStat = { value: number; prefix?: string; suffix?: string; label: string };
export type LcTestimonial = { quote: string; author: string; role?: string; rating?: number };
export type LcFaq = { q: string; a: string };

export const HERO = {
  title: "Sign anything, anywhere.",
  subtitle: "End-to-end secure document signing for distributed teams.",
  badge: "Developer-first PDF signing API",
};

export const STATS: LcStat[] = [
  { value: 4200, suffix: "+", label: "Active teams" },
  { value: 99, suffix: ".99%", label: "Render uptime" },
  { value: 12, suffix: "/day", label: "Production deploys" },
  { value: 72, label: "Developer NPS" },
];

// Wordmark strip under the stats band — the same names the customer / lead
// seeds use, so the social proof reads consistently across the site.
export const CLIENTS: string[] = [
  "Northwind",
  "Kestrel",
  "SwiftPay",
  "OrbitLabs",
  "BlueMoon",
  "Harbor",
  "Vega Health",
  "Flint",
];

export const TESTIMONIALS: LcTestimonial[] = [
  {
    quote:
      "We replaced our DocuSign stack in a single afternoon. The audit log alone paid for the year.",
    author: "Rae H.",
    role: "Head of Engineering, Northwind",
  },
  {
    quote:
      "Per-document EU residency without an SDK rewrite. Procurement loved it as much as our SREs.",
    author: "Ivo M.",
    role: "VP Eng, Kestrel",
  },
  {
    quote:
      "Predictable pricing means we stopped budgeting around per-seat creep every renewal cycle.",
    author: "Annika R.",
    role: "Ops Lead, SwiftPay",
  },
  {
    quote:
      "Webhook retries Just Work. We deleted ~400 lines of custom queue code on the migration.",
    author: "Sven A.",
    role: "Staff SWE, Vega Health",
  },
];

export const FAQS: LcFaq[] = [
  {
    q: "How does the 14-day trial work?",
    a: "Every Team plan starts with a full-featured 14-day trial — no card required. You keep everything you signed during the trial, and if you don't upgrade you land softly on the Free plan.",
  },
  {
    q: "What does Lumen cost once we grow?",
    a: "Free covers 100 signed PDFs a month forever. Team is $49/month flat for 10k documents and 10 seats — no per-envelope pricing, no per-seat creep. Scale is a custom annual contract.",
  },
  {
    q: "Is Lumen SOC 2 compliant?",
    a: "Yes — SOC 2 Type II and ISO 27001, audited Q1 2026. Every document gets a tamper-evident, hash-chained audit log, and you can pin storage to the EU or US per document.",
  },
  {
    q: "How hard is it to migrate from DocuSign or Dropbox Sign?",
    a: "Most teams migrate in under a week. The REST API maps one-to-one for the common flows, we import your existing templates, and webhooks are drop-in with signed payloads and retries.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancelling stops future charges immediately and you keep access through the period you paid for. Your documents and audit logs stay exportable even on the Free plan.",
  },
];

// "custom"/"product" section narrative — the body paragraphs the CustomSection
// renders. CTA label/href live in the section config alongside this body.
export const PRODUCT_BODY: string[] = [
  "Lumen is one POST request: send a PDF and a signer email, get back a legally binding signed document with a tamper-evident audit trail. No iframe widgets, no redirect dance, no SDK lock-in.",
  "Under the hood a dedicated render queue signs at <400ms p95, webhooks retry with exponential backoff and idempotency keys, and every byte can be pinned to EU or US storage.",
];

export const PRODUCT_CTA = { ctaLabel: "Explore the API", ctaHref: "/features" };
