import { PUBLIC_BASE } from "./nav-config";
import type {
  BlogPost,
  ChangelogEntry,
  Customer,
  FeatureItem,
  LandingSection,
  Lead,
  PricingTier,
  State,
  Subscription,
} from "./types";

const CONTACT_HREF = `${PUBLIC_BASE}/contact`;

const now = Date.now();
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;

export const SEED_PRICING: PricingTier[] = [
  {
    id: "tier-free",
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Everything you need to ship your first signed doc.",
    bullets: ["100 signed PDFs / month", "1 team member", "Community support", "REST API + webhooks"],
    cta: { label: "Start free", href: CONTACT_HREF },
    featured: false,
  },
  {
    id: "tier-team",
    name: "Team",
    price: "$49",
    period: "per month",
    blurb: "For startups shipping signed contracts daily.",
    bullets: ["10,000 signed PDFs / month", "Up to 10 seats", "Email support", "Audit log + SAML SSO"],
    cta: { label: "Start 14-day trial", href: CONTACT_HREF },
    featured: true,
  },
  {
    id: "tier-scale",
    name: "Scale",
    price: "Custom",
    period: "annual",
    blurb: "Volume + compliance for regulated industries.",
    bullets: ["Unlimited signed PDFs", "Unlimited seats", "EU + US data residency", "Dedicated support, SLA"],
    cta: { label: "Talk to sales", href: CONTACT_HREF },
    featured: false,
  },
];

export const SEED_FEATURES: FeatureItem[] = [
  { id: "f-1", title: "One-line signing API", blurb: "POST a doc + signer email — we return a signed PDF.", icon: "Zap" },
  { id: "f-2", title: "Audit-ready trail", blurb: "Tamper-evident audit log per document, exportable as JSON or PDF.", icon: "ShieldCheck" },
  { id: "f-3", title: "Webhook reliability", blurb: "Retries with exponential backoff, signed payloads, idempotency keys.", icon: "Webhook" },
  { id: "f-4", title: "EU + US residency", blurb: "Pin every document to a region. SOC 2 Type II + ISO 27001.", icon: "Globe2" },
  { id: "f-5", title: "Team workflows", blurb: "Templates, reusable signer roles, sequenced signing flows.", icon: "Users" },
  { id: "f-6", title: "Generous free tier", blurb: "100 signed PDFs / month free, forever. No card required.", icon: "Gift" },
];

export const SEED_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "shipping-signed-pdfs-in-an-afternoon",
    title: "Shipping signed PDFs in an afternoon",
    excerpt: "How a two-developer team replaced their DocuSign integration in one sprint.",
    body: "When the Northwind team started, signed contracts meant a tangle of redirect flows, an SDK that fought their bundler, and a webhook handler nobody trusted. They gave themselves one afternoon to see how far a single POST request could get them.\n\nThe first call returned a signed PDF and an audit-trail URL in under a second. No iframe to embed, no redirect dance, no client library to keep in sync with their framework. By lunch they had replaced the send flow; by the end of the day the status webhook was wired into their existing queue.\n\nThe lesson that stuck: most of the integration cost in legacy e-sign tools is accidental complexity. Strip the API down to documents in, signed documents out, and a two-person team can ship in an afternoon what used to take a quarter.",
    author: "Mira K.",
    publishedAt: day(3),
    tags: ["case-study", "api"],
  },
  {
    id: "post-2",
    slug: "audit-trail-best-practices",
    title: "Audit trail best practices for regulated industries",
    excerpt: "Five patterns we learned shipping audit trails for fintech + healthtech customers.",
    body: "Auditors do not want a log file. They want to answer one question without taking your word for it: can anyone prove this record was not altered after the fact? Everything below follows from treating that question as the product.\n\nFirst, hash-chain every entry so each event commits to the one before it — a single tampered row breaks the chain visibly. Second, publish the chain root somewhere you do not control, so integrity does not depend on trusting your own database. Third, capture intent, not just outcome: who initiated, from which IP, under which policy version.\n\nFourth, make export boring. Auditors live in JSON and PDF, so ship both, and ship a verifier they can run themselves. Fifth, retain on a clock the customer sets, not one you assume — seven years for some, ninety days for others, cryptographically shredded on expiry.",
    author: "Theo L.",
    publishedAt: day(11),
    tags: ["compliance", "best-practices"],
  },
  {
    id: "post-3",
    slug: "webhook-reliability-deep-dive",
    title: "Webhook reliability: a deep dive into our retry queue",
    excerpt: "Idempotency keys, dead-letter handling, and why we picked PostgreSQL over Redis.",
    body: "A webhook that fires once and hopes for the best is a data-loss bug waiting for a network blip. Our rule is simple: every event is delivered at least once, and every consumer can safely receive it more than once.\n\nThat starts with idempotency keys on the payload, so a retry is a no-op on the customer's side. Deliveries use exponential backoff with jitter, capped, and anything that exhausts its retries lands in a dead-letter queue an operator can inspect and replay — never a silent drop.\n\nWe run the queue on PostgreSQL rather than Redis because durability beats raw throughput here. SELECT ... FOR UPDATE SKIP LOCKED gives us concurrent workers without a separate broker, transactional enqueue means an event and its side effects commit together, and the whole thing survives a restart without losing in-flight work.",
    author: "Sven A.",
    publishedAt: day(24),
    tags: ["engineering", "infrastructure"],
  },
  {
    id: "post-4",
    slug: "what-we-learned-onboarding-100-startups",
    title: "What we learned onboarding 100 startups",
    excerpt: "Common signing flow mistakes — and the four-step onboarding that fixes them.",
    body: "After onboarding a hundred startups, the failure modes rhyme. Teams over-model the signing flow before they have a single signer, hard-code a happy path that ignores declines and expirations, skip webhooks until something silently breaks, and discover templates only after pasting the same document five times.\n\nSo we collapsed onboarding into four steps. Send one real document to yourself and watch the signed PDF come back. Wire the status webhook before building any UI, so state is never guessed. Turn your most-used document into a template with named signer roles. Only then add sequencing, reminders, and conditional routing.\n\nThe pattern underneath: ship the smallest thing that produces a legally binding signature, then let real usage tell you which workflow features you actually need. Most teams need far fewer than they expect.",
    author: "Mira K.",
    publishedAt: day(48),
    tags: ["product", "onboarding"],
  },
  {
    id: "post-5",
    slug: "scaling-to-1m-signed-pdfs",
    title: "Scaling to 1M signed PDFs a month",
    excerpt: "PG partitioning, worker pools, and why we ditched serverless for the render queue.",
    body: "A million signed PDFs a month is roughly twenty-three a minute at the average, and several hundred a minute at peak. The architecture that got us there is less clever than it is deliberate about where work happens.\n\nDocuments and audit events live in time-partitioned PostgreSQL tables, so hot writes stay in the current partition and historical reads never touch it. Rendering runs on a pool of long-lived workers pulling from the same durable queue that powers webhooks — warm font caches and reusable PDF engines matter when you sign thousands of times an hour.\n\nWe started on serverless for the render path and moved off it. Cold starts blew the p95, per-invocation font loading was pure waste, and concurrency limits turned bursts into backlogs. A boring pool of provisioned workers gave us a predictable <400ms p95 and a bill that scales with documents, not invocations.",
    author: "Sven A.",
    publishedAt: day(67),
    tags: ["engineering", "scaling"],
  },
  {
    id: "post-6",
    slug: "soc-2-type-ii-without-burning-out",
    title: "Shipping SOC 2 Type II without burning out the team",
    excerpt: "A pragmatic 90-day plan: scope, evidence collection, and where to spend money.",
    body: "SOC 2 Type II rewards consistency over heroics, which is exactly why teams burn out chasing it: they treat a year-long evidence period like a one-week sprint. A calmer ninety-day plan front-loads the decisions, not the panic.\n\nWeeks one to three are scope. Name the systems in bounds, write the controls in plain language, and ruthlessly cut anything the product does not actually do — an honest narrow scope beats an aspirational wide one. Weeks four to eight are automation: pipe access reviews, change management, and monitoring into evidence that collects itself, so nobody is screenshotting dashboards the night before.\n\nThe rest is letting the period run. Spend money on the auditor and on evidence automation; do not spend it on a tool that promises to make compliance disappear. The team that ships SOC 2 without burning out is the one that made it a background process instead of a fire drill.",
    author: "Theo L.",
    publishedAt: day(91),
    tags: ["compliance", "operations"],
  },
];

export const SEED_CHANGELOG: ChangelogEntry[] = [
  { id: "v-1-7-0", version: "v1.7.0", date: day(2),  kind: "feature", title: "Sequenced signing flows",          body: "Define a strict signing order with optional reminders per signer." },
  { id: "v-1-6-3", version: "v1.6.3", date: day(8),  kind: "fix",     title: "Fix Safari font fallback in signed PDF", body: "Embedded fonts now render correctly when the source PDF is exported from Safari." },
  { id: "v-1-6-0", version: "v1.6.0", date: day(20), kind: "feature", title: "EU data residency (Frankfurt)",    body: "Pin documents to eu-central-1. Available on Team + Scale plans." },
  { id: "v-1-5-2", version: "v1.5.2", date: day(33), kind: "chore",   title: "Webhook payload v2",                body: "Adds canonical JSON, signed via HMAC-SHA256. v1 supported through 2026-09." },
  { id: "v-1-5-0", version: "v1.5.0", date: day(48), kind: "feature", title: "Reusable signer roles",             body: "Define 'CFO', 'Legal', etc. and reuse across templates." },
];

export const SEED_CUSTOMERS: Customer[] = [
  { id: "cus-1", email: "rae@northwind.co",    name: "Rae H.",     plan: "team",  status: "active",  startedAt: day(62) },
  { id: "cus-2", email: "ivo@kestrel.app",     name: "Ivo M.",     plan: "scale", status: "active",  startedAt: day(128) },
  { id: "cus-3", email: "ann@swiftpay.io",     name: "Annika R.",  plan: "team",  status: "trial",   startedAt: day(4) },
  { id: "cus-4", email: "dev@orbitlabs.dev",   name: "Devi P.",    plan: "free",  status: "active",  startedAt: day(21) },
  { id: "cus-5", email: "luca@bluemoon.studio", name: "Luca B.",   plan: "team",  status: "churned", startedAt: day(190) },
];

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub-1", customerId: "cus-1", customerEmail: "rae@northwind.co", plan: "team",  mrrCents: 4900,  status: "active",   renewsAt: day(-18) },
  { id: "sub-2", customerId: "cus-2", customerEmail: "ivo@kestrel.app",  plan: "scale", mrrCents: 49000, status: "active",   renewsAt: day(-9) },
  { id: "sub-3", customerId: "cus-3", customerEmail: "ann@swiftpay.io",  plan: "team",  mrrCents: 4900,  status: "trialing", renewsAt: day(-10) },
  { id: "sub-4", customerId: "cus-5", customerEmail: "luca@bluemoon.studio", plan: "team", mrrCents: 4900, status: "canceled", renewsAt: day(15) },
];

export const SEED_LEADS: Lead[] = [
  { id: "lead-1", email: "founder@nimbus.dev",  name: "Sam O.",    source: "website",  status: "new",       ts: day(1) },
  { id: "lead-2", email: "ops@flint.studio",    name: "Theo G.",   source: "referral", status: "contacted", ts: day(3) },
  { id: "lead-3", email: "cto@vega.health",     name: "Yara F.",   source: "ad",       status: "qualified", ts: day(6) },
  { id: "lead-4", email: "pm@harbor.app",       name: "Indi C.",   source: "event",    status: "won",       ts: day(14) },
];

const ADMIN_POSTS: BlogPost[] = SEED_POSTS.map((p, i) => ({
  ...p,
  status: i === 0 ? "draft" : "published",
}));

import { SEED_PAGES } from "./pages-seed";
import { SEED_ANALYTICS, SEED_INTEGRATIONS } from "./integrations-seed";

/** Full SaaS lineup — every kind renders for real (see LandingRenderer).
 *  Order/visibility/copy/config are admin-editable at /admin/landing. */
export const SEED_LANDING_SECTIONS: LandingSection[] = [
  { id: "ls-hero", order: 10, kind: "hero", title: "Sign anything, anywhere.", subtitle: "End-to-end secure document signing for distributed teams.", enabled: true, config: '{"badge":"Developer-first PDF signing API"}', layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }] },
  { id: "ls-stats", order: 15, kind: "stats", title: "Trusted in production", subtitle: "Live numbers from across the Lumen platform.", enabled: true },
  { id: "ls-features", order: 20, kind: "features", title: "Why teams switch", subtitle: "Six reasons our customers replaced legacy e-sign tools.", enabled: true },
  { id: "ls-product", order: 25, kind: "custom", title: "One POST request to a signed PDF", subtitle: "What actually happens when you call the API.", enabled: true, config: `{"ctaLabel":"Explore the API","ctaHref":"${PUBLIC_BASE}/features"}` },
  { id: "ls-integrations", order: 30, kind: "services", title: "Works with your stack", subtitle: "Billing, comms, CRM, and CI — connected in a click, synced by webhooks.", enabled: true },
  { id: "ls-testimonials", order: 35, kind: "testimonials", title: "What teams say after switching", subtitle: "Quotes from the engineering and ops leads who migrated.", enabled: true },
  { id: "ls-pricing", order: 40, kind: "pricing", title: "Pricing", subtitle: "Start free, upgrade when you outgrow it.", enabled: true },
  { id: "ls-faq", order: 45, kind: "faq", title: "Questions, answered", subtitle: "Trials, pricing, security, migration — what every team asks first.", enabled: true },
  { id: "ls-changelog", order: 50, kind: "changelog", title: "What's new", subtitle: "Shipped this month.", enabled: true },
  { id: "ls-blog", order: 55, kind: "blog", title: "From the blog", subtitle: "Engineering deep dives, compliance playbooks, and migration stories.", enabled: true },
  { id: "ls-cta", order: 60, kind: "cta", title: "Ready to ship?", subtitle: "Spin up a workspace in 60 seconds.", enabled: true },
  { id: "ls-newsletter", order: 65, kind: "newsletter", title: "Ship notes, monthly", subtitle: "One email a month: release highlights and API changes. No spam.", enabled: true },
];

export const SEED_STATE: State = {
  pricing: SEED_PRICING,
  features: SEED_FEATURES,
  posts: ADMIN_POSTS,
  changelog: SEED_CHANGELOG,
  customers: SEED_CUSTOMERS,
  subscriptions: SEED_SUBSCRIPTIONS,
  leads: SEED_LEADS,
  changelogEntries: SEED_CHANGELOG,
  pages: SEED_PAGES,
  landingSections: SEED_LANDING_SECTIONS,
  integrations: SEED_INTEGRATIONS,
  analytics: SEED_ANALYTICS,
  featureMatrix: [],
  useCases: [],
  pricingMatrix: [],
  pricingFaq: [],
};
