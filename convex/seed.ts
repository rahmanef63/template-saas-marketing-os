import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";
import {
  HERO,
  STATS,
  CLIENTS,
  TESTIMONIALS,
  FAQS,
  PRODUCT_BODY,
  PRODUCT_CTA,
} from "./landingContent";

// Demo seed for SaaS Marketing OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
//
// Data mirrors components/templates/saas-marketing/shared/{seed,pages-seed,
// integrations-seed}.ts (the former localStorage SEED_STATE), converted to
// Convex inserts. Synthetic string ids are dropped for entity tables (Convex
// assigns _id); pages/landing keep their string id inside the blob.
//
// Render-only landing item sections (stats/testimonials/faq/custom) seed their
// example content into `config` from convex/landingContent.ts — the SAME module
// the frontend render falls back to — so a fresh clone gets editable example
// data and there is no convex<->render drift. Table-backed kinds (features/
// pricing/blog/changelog/services) render from their own tables; no config here.
const now = 1_780_000_000_000;
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;

const CONTACT_HREF = "/contact";

const PRICING = [
  { name: "Free",  price: "$0",     period: "forever",    blurb: "Everything you need to ship your first signed doc.", bullets: ["100 signed PDFs / month", "1 team member", "Community support", "REST API + webhooks"], cta: { label: "Start free", href: CONTACT_HREF }, featured: false },
  { name: "Team",  price: "$49",    period: "per month",  blurb: "For startups shipping signed contracts daily.",       bullets: ["10,000 signed PDFs / month", "Up to 10 seats", "Email support", "Audit log + SAML SSO"], cta: { label: "Start 14-day trial", href: CONTACT_HREF }, featured: true },
  { name: "Scale", price: "Custom", period: "annual",     blurb: "Volume + compliance for regulated industries.",       bullets: ["Unlimited signed PDFs", "Unlimited seats", "EU + US data residency", "Dedicated support, SLA"], cta: { label: "Talk to sales", href: CONTACT_HREF }, featured: false },
];

const FEATURES = [
  { title: "One-line signing API", blurb: "POST a doc + signer email — we return a signed PDF.", icon: "Zap" },
  { title: "Audit-ready trail", blurb: "Tamper-evident audit log per document, exportable as JSON or PDF.", icon: "ShieldCheck" },
  { title: "Webhook reliability", blurb: "Retries with exponential backoff, signed payloads, idempotency keys.", icon: "Webhook" },
  { title: "EU + US residency", blurb: "Pin every document to a region. SOC 2 Type II + ISO 27001.", icon: "Globe2" },
  { title: "Team workflows", blurb: "Templates, reusable signer roles, sequenced signing flows.", icon: "Users" },
  { title: "Generous free tier", blurb: "100 signed PDFs / month free, forever. No card required.", icon: "Gift" },
];

const POSTS = [
  {
    slug: "shipping-signed-pdfs-in-an-afternoon",
    title: "Shipping signed PDFs in an afternoon",
    excerpt: "How a two-developer team replaced their DocuSign integration in one sprint.",
    body: "When the Northwind team started, signed contracts meant a tangle of redirect flows, an SDK that fought their bundler, and a webhook handler nobody trusted. They gave themselves one afternoon to see how far a single POST request could get them.\n\nThe first call returned a signed PDF and an audit-trail URL in under a second. No iframe to embed, no redirect dance, no client library to keep in sync with their framework. By lunch they had replaced the send flow; by the end of the day the status webhook was wired into their existing queue.\n\nThe lesson that stuck: most of the integration cost in legacy e-sign tools is accidental complexity. Strip the API down to documents in, signed documents out, and a two-person team can ship in an afternoon what used to take a quarter.",
    author: "Mira K.",
    publishedAt: day(3),
    tags: ["case-study", "api"],
    status: "draft" as const,
  },
  {
    slug: "audit-trail-best-practices",
    title: "Audit trail best practices for regulated industries",
    excerpt: "Five patterns we learned shipping audit trails for fintech + healthtech customers.",
    body: "Auditors do not want a log file. They want to answer one question without taking your word for it: can anyone prove this record was not altered after the fact? Everything below follows from treating that question as the product.\n\nFirst, hash-chain every entry so each event commits to the one before it — a single tampered row breaks the chain visibly. Second, publish the chain root somewhere you do not control, so integrity does not depend on trusting your own database. Third, capture intent, not just outcome: who initiated, from which IP, under which policy version.\n\nFourth, make export boring. Auditors live in JSON and PDF, so ship both, and ship a verifier they can run themselves. Fifth, retain on a clock the customer sets, not one you assume — seven years for some, ninety days for others, cryptographically shredded on expiry.",
    author: "Theo L.",
    publishedAt: day(11),
    tags: ["compliance", "best-practices"],
    status: "published" as const,
    cover: "https://picsum.photos/seed/saas-audit-trail/800/600",
  },
  {
    slug: "webhook-reliability-deep-dive",
    title: "Webhook reliability: a deep dive into our retry queue",
    excerpt: "Idempotency keys, dead-letter handling, and why we picked PostgreSQL over Redis.",
    body: "A webhook that fires once and hopes for the best is a data-loss bug waiting for a network blip. Our rule is simple: every event is delivered at least once, and every consumer can safely receive it more than once.\n\nThat starts with idempotency keys on the payload, so a retry is a no-op on the customer's side. Deliveries use exponential backoff with jitter, capped, and anything that exhausts its retries lands in a dead-letter queue an operator can inspect and replay — never a silent drop.\n\nWe run the queue on PostgreSQL rather than Redis because durability beats raw throughput here. SELECT ... FOR UPDATE SKIP LOCKED gives us concurrent workers without a separate broker, transactional enqueue means an event and its side effects commit together, and the whole thing survives a restart without losing in-flight work.",
    author: "Sven A.",
    publishedAt: day(24),
    tags: ["engineering", "infrastructure"],
    status: "published" as const,
    cover: "https://picsum.photos/seed/saas-webhook-retry/800/600",
  },
  {
    slug: "what-we-learned-onboarding-100-startups",
    title: "What we learned onboarding 100 startups",
    excerpt: "Common signing flow mistakes — and the four-step onboarding that fixes them.",
    body: "After onboarding a hundred startups, the failure modes rhyme. Teams over-model the signing flow before they have a single signer, hard-code a happy path that ignores declines and expirations, skip webhooks until something silently breaks, and discover templates only after pasting the same document five times.\n\nSo we collapsed onboarding into four steps. Send one real document to yourself and watch the signed PDF come back. Wire the status webhook before building any UI, so state is never guessed. Turn your most-used document into a template with named signer roles. Only then add sequencing, reminders, and conditional routing.\n\nThe pattern underneath: ship the smallest thing that produces a legally binding signature, then let real usage tell you which workflow features you actually need. Most teams need far fewer than they expect.",
    author: "Mira K.",
    publishedAt: day(48),
    tags: ["product", "onboarding"],
    status: "published" as const,
    cover: "https://picsum.photos/seed/saas-onboarding-100/800/600",
  },
  {
    slug: "scaling-to-1m-signed-pdfs",
    title: "Scaling to 1M signed PDFs a month",
    excerpt: "PG partitioning, worker pools, and why we ditched serverless for the render queue.",
    body: "A million signed PDFs a month is roughly twenty-three a minute at the average, and several hundred a minute at peak. The architecture that got us there is less clever than it is deliberate about where work happens.\n\nDocuments and audit events live in time-partitioned PostgreSQL tables, so hot writes stay in the current partition and historical reads never touch it. Rendering runs on a pool of long-lived workers pulling from the same durable queue that powers webhooks — warm font caches and reusable PDF engines matter when you sign thousands of times an hour.\n\nWe started on serverless for the render path and moved off it. Cold starts blew the p95, per-invocation font loading was pure waste, and concurrency limits turned bursts into backlogs. A boring pool of provisioned workers gave us a predictable <400ms p95 and a bill that scales with documents, not invocations.",
    author: "Sven A.",
    publishedAt: day(67),
    tags: ["engineering", "scaling"],
    status: "published" as const,
  },
  {
    slug: "soc-2-type-ii-without-burning-out",
    title: "Shipping SOC 2 Type II without burning out the team",
    excerpt: "A pragmatic 90-day plan: scope, evidence collection, and where to spend money.",
    body: "SOC 2 Type II rewards consistency over heroics, which is exactly why teams burn out chasing it: they treat a year-long evidence period like a one-week sprint. A calmer ninety-day plan front-loads the decisions, not the panic.\n\nWeeks one to three are scope. Name the systems in bounds, write the controls in plain language, and ruthlessly cut anything the product does not actually do — an honest narrow scope beats an aspirational wide one. Weeks four to eight are automation: pipe access reviews, change management, and monitoring into evidence that collects itself, so nobody is screenshotting dashboards the night before.\n\nThe rest is letting the period run. Spend money on the auditor and on evidence automation; do not spend it on a tool that promises to make compliance disappear. The team that ships SOC 2 without burning out is the one that made it a background process instead of a fire drill.",
    author: "Theo L.",
    publishedAt: day(91),
    tags: ["compliance", "operations"],
    status: "published" as const,
  },
];

const CHANGELOG = [
  { version: "v1.7.0", date: day(2),  kind: "feature" as const, title: "Sequenced signing flows",            body: "Define a strict signing order with optional reminders per signer." },
  { version: "v1.6.3", date: day(8),  kind: "fix" as const,     title: "Fix Safari font fallback in signed PDF", body: "Embedded fonts now render correctly when the source PDF is exported from Safari." },
  { version: "v1.6.0", date: day(20), kind: "feature" as const, title: "EU data residency (Frankfurt)",      body: "Pin documents to eu-central-1. Available on Team + Scale plans." },
  { version: "v1.5.2", date: day(33), kind: "chore" as const,   title: "Webhook payload v2",                  body: "Adds canonical JSON, signed via HMAC-SHA256. v1 supported through 2026-09." },
  { version: "v1.5.0", date: day(48), kind: "feature" as const, title: "Reusable signer roles",               body: "Define 'CFO', 'Legal', etc. and reuse across templates." },
];

const CUSTOMERS = [
  { email: "rae@northwind.co",     name: "Rae H.",    plan: "team" as const,  status: "active" as const,  startedAt: day(62) },
  { email: "ivo@kestrel.app",      name: "Ivo M.",    plan: "scale" as const, status: "active" as const,  startedAt: day(128) },
  { email: "ann@swiftpay.io",      name: "Annika R.", plan: "team" as const,  status: "trial" as const,   startedAt: day(4) },
  { email: "dev@orbitlabs.dev",    name: "Devi P.",   plan: "free" as const,  status: "active" as const,  startedAt: day(21) },
  { email: "luca@bluemoon.studio", name: "Luca B.",   plan: "team" as const,  status: "churned" as const, startedAt: day(190) },
];

const SUBSCRIPTIONS = [
  { customerId: "cus-1", customerEmail: "rae@northwind.co",     plan: "team" as const,  mrrCents: 4900,  status: "active" as const,   renewsAt: day(-18) },
  { customerId: "cus-2", customerEmail: "ivo@kestrel.app",      plan: "scale" as const, mrrCents: 49000, status: "active" as const,   renewsAt: day(-9) },
  { customerId: "cus-3", customerEmail: "ann@swiftpay.io",      plan: "team" as const,  mrrCents: 4900,  status: "trialing" as const, renewsAt: day(-10) },
  { customerId: "cus-5", customerEmail: "luca@bluemoon.studio", plan: "team" as const,  mrrCents: 4900,  status: "canceled" as const, renewsAt: day(15) },
];

const LEADS = [
  { email: "founder@nimbus.dev", name: "Sam O.",  source: "website" as const,  status: "new" as const,       ts: day(1) },
  { email: "ops@flint.studio",   name: "Theo G.", source: "referral" as const, status: "contacted" as const, ts: day(3) },
  { email: "cto@vega.health",    name: "Yara F.", source: "ad" as const,       status: "qualified" as const, ts: day(6) },
  { email: "pm@harbor.app",      name: "Indi C.", source: "event" as const,    status: "won" as const,       ts: day(14) },
];

const INTEGRATIONS = [
  { provider: "slack" as const,    label: "Slack — #revenue",            status: "connected" as const,    webhookUrl: "https://hooks.slack.com/services/T0***/B0***/***", scopes: ["chat:write", "channels:read", "incoming-webhook"], lastSyncAt: day(0), secretHint: "xoxb-***-***-Q9Ax", notes: "Auto-posts MRR + new-customer events to #revenue." },
  { provider: "linear" as const,   label: "Linear — Engineering",        status: "connected" as const,    webhookUrl: "https://api.linear.app/graphql", scopes: ["read", "write", "issues:create"], lastSyncAt: day(1), secretHint: "lin_api_***h8Kq", notes: "Mirrors customer bug reports into the Eng triage queue." },
  { provider: "hubspot" as const,  label: "HubSpot CRM",                 status: "connected" as const,    webhookUrl: "https://api.hubapi.com/webhooks/v3/", scopes: ["contacts", "crm.objects.deals.read", "tickets"], lastSyncAt: day(0), secretHint: "pat-na1-***-***-Tm3v", notes: "Two-way contact sync, deal stage updates flow back to admin." },
  { provider: "resend" as const,   label: "Resend — transactional",      status: "connected" as const,    webhookUrl: "https://api.resend.com/webhooks/email", scopes: ["emails:send", "domains:read"], lastSyncAt: day(0), secretHint: "re_***_Vp8M2nKx", notes: "Sender domain: mail.example.com (DKIM + SPF verified)." },
  { provider: "stripe" as const,   label: "Stripe — billing",            status: "connected" as const,    webhookUrl: "https://api.example.com/webhooks/stripe", scopes: ["read_write", "customer", "subscription", "invoice"], lastSyncAt: day(0), secretHint: "sk_live_***_3Az9", notes: "Webhook events: customer.subscription.*, invoice.paid." },
  { provider: "github" as const,   label: "GitHub — saas-marketing-os",  status: "connected" as const,    webhookUrl: "https://api.github.com/repos/acme/saas-marketing-os/hooks", scopes: ["repo", "read:org", "workflow"], lastSyncAt: day(2), secretHint: "ghp_***Pq4z", notes: "Deploy status -> Slack + changelog drafts on tagged release." },
  { provider: "intercom" as const, label: "Intercom Messenger",          status: "error" as const,        webhookUrl: "https://api.intercom.io/webhooks", scopes: ["read_users", "write_users", "read_conversations"], lastSyncAt: day(7), secretHint: "dG9rXzAxK***Yh2", notes: "OAuth refresh expired 2026-05-17 — re-auth required." },
  { provider: "segment" as const,  label: "Segment — events bus",        status: "disconnected" as const, webhookUrl: "", scopes: [], lastSyncAt: day(45), secretHint: "", notes: "Replaced by self-hosted analytics in v1.6.0." },
];

const ANALYTICS = [
  { week: "W-04", mrrCents:  98_400, newCustomers:  7, churnedCustomers: 2, trials: 14, trialsConverted: 4 },
  { week: "W-03", mrrCents: 112_700, newCustomers:  9, churnedCustomers: 1, trials: 18, trialsConverted: 6 },
  { week: "W-02", mrrCents: 128_900, newCustomers: 11, churnedCustomers: 3, trials: 22, trialsConverted: 8 },
  { week: "W-01", mrrCents: 148_200, newCustomers: 13, churnedCustomers: 2, trials: 27, trialsConverted: 11 },
];

// Keep in sync with components/templates/saas-marketing/shared/seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: HERO.title, subtitle: HERO.subtitle, enabled: true, config: JSON.stringify({ badge: HERO.badge }), layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }, { id: "hero-overlay", type: "color", placement: "background", opacity: 30, enabled: true, color: "var(--primary)" }] },
  { id: "ls-stats", order: 15, kind: "stats", title: "Trusted in production", subtitle: "Live numbers from across the Lumen platform.", enabled: true, config: JSON.stringify({ stats: STATS, clients: CLIENTS }) },
  { id: "ls-features", order: 20, kind: "features", title: "Why teams switch", subtitle: "Six reasons our customers replaced legacy e-sign tools.", enabled: true },
  { id: "ls-product", order: 25, kind: "custom", title: "One POST request to a signed PDF", subtitle: "What actually happens when you call the API.", enabled: true, config: JSON.stringify({ body: PRODUCT_BODY, ...PRODUCT_CTA }) },
  { id: "ls-integrations", order: 30, kind: "services", title: "Works with your stack", subtitle: "Billing, comms, CRM, and CI — connected in a click, synced by webhooks.", enabled: true },
  { id: "ls-testimonials", order: 35, kind: "testimonials", title: "What teams say after switching", subtitle: "Quotes from the engineering and ops leads who migrated.", enabled: true, config: JSON.stringify({ items: TESTIMONIALS }) },
  { id: "ls-pricing", order: 40, kind: "pricing", title: "Pricing", subtitle: "Start free, upgrade when you outgrow it.", enabled: true },
  { id: "ls-faq", order: 45, kind: "faq", title: "Questions, answered", subtitle: "Trials, pricing, security, migration — what every team asks first.", enabled: true, config: JSON.stringify({ items: FAQS }) },
  { id: "ls-changelog", order: 50, kind: "changelog", title: "What's new", subtitle: "Shipped this month.", enabled: true },
  { id: "ls-blog", order: 55, kind: "blog", title: "From the blog", subtitle: "Engineering deep dives, compliance playbooks, and migration stories.", enabled: true },
  { id: "ls-cta", order: 60, kind: "cta", title: "Ready to ship?", subtitle: "Spin up a workspace in 60 seconds.", enabled: true },
  { id: "ls-newsletter", order: 65, kind: "newsletter", title: "Ship notes, monthly", subtitle: "One email a month: release highlights and API changes. No spam.", enabled: true },
];

const PUBLIC_BASE = "";

const PAGES = [
  { id: "sys-home",      slug: "",          title: "Home",      description: "Marketing landing — hero, features, social proof, pricing.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true, isLanding: true },
  { id: "sys-features",  slug: "features",  title: "Features",  description: "Long-form feature breakdown.",                                blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-pricing",   slug: "pricing",   title: "Pricing",   description: "Three tiers + FAQ.",                                          blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-blog",      slug: "blog",      title: "Blog",      description: "Latest posts grid.",                                         blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-changelog", slug: "changelog", title: "Changelog", description: "Release timeline.",                                          blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-about",     slug: "about",     title: "About",     description: "Team, mission, hiring.",                                      blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-contact",   slug: "contact",   title: "Contact",   description: "Email, schedule a call, social.",                            blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  {
    id: "custom-case-studies", slug: "case-studies", title: "Case studies", description: "Customer wins, sortable by industry.",
    blocks: [
      { kind: "hero", headline: "How teams ship contracts 10× faster", sub: "Real customers, measurable results." },
      { kind: "stats", heading: "By the numbers", items: [
        { value: "2.5M", label: "contracts signed" }, { value: "180+", label: "active customers" },
        { value: "<3 min", label: "average turnaround" }, { value: "99.99%", label: "API uptime" },
      ] },
      { kind: "feature-list", heading: "Featured stories", items: [
        { title: "Northwind", body: "Cut legal turnaround from 5 days to 4 hours." },
        { title: "SwiftPay", body: "Replaced 3 tools, saved $48K/year." },
        { title: "Vega Health", body: "Onboarded enterprise contracts in week 1." },
      ] },
      { kind: "cta", headline: "Ready to ship faster?", cta: { label: "Talk to sales", href: `${PUBLIC_BASE}/contact` } },
    ],
    status: "published", createdAt: day(30), updatedAt: day(2), systemPage: false,
  },
  {
    id: "custom-security", slug: "security", title: "Security & compliance", description: "SOC 2 Type II, GDPR, residency.",
    blocks: [
      { kind: "hero", headline: "Built for regulated industries", sub: "SOC 2 Type II · GDPR · CCPA · HIPAA-ready" },
      { kind: "faq", heading: "Common questions", items: [
        { q: "Where is data stored?", a: "EU + US data residency options. Choose at signup." },
        { q: "Do you support SSO?", a: "SAML 2.0 + OIDC on Team and Scale plans." },
        { q: "What's the audit story?", a: "Immutable audit log retained for 7 years; export via API." },
      ] },
      { kind: "logo-cloud", heading: "Trusted by regulated teams", logos: [
        { label: "SwiftPay" }, { label: "Vega Health" }, { label: "Harbor" }, { label: "Kestrel" },
      ] },
    ],
    status: "draft", createdAt: day(7), updatedAt: day(1), systemPage: false,
  },
];

// CK-2C — public /features lower-fold matrix (was features-data.ts
// FEATURE_CATEGORIES, flattened to one row per item with category metadata
// repeated). Grouped by `category` in the public renderer.
const FEATURE_MATRIX = [
  { category: "Core API", categoryIcon: "Zap", categoryBlurb: "The bits you depend on every request.", title: "One-line signing", body: "POST a doc + signer, receive signed PDF.", plan: "Free", order: 0 },
  { category: "Core API", categoryIcon: "Zap", categoryBlurb: "The bits you depend on every request.", title: "Templates", body: "Reusable docs with named signer roles + variables.", plan: "Free", order: 1 },
  { category: "Core API", categoryIcon: "Zap", categoryBlurb: "The bits you depend on every request.", title: "Sequenced flows", body: "Strict signing order with optional reminders.", plan: "Team", order: 2 },
  { category: "Core API", categoryIcon: "Zap", categoryBlurb: "The bits you depend on every request.", title: "Embedded signing", body: "Drop-in iframe with white-label styling.", plan: "Team", order: 3 },
  { category: "Workflow", categoryIcon: "Workflow", categoryBlurb: "Tools for moving docs through humans.", title: "Reminders + nudges", body: "Auto follow-up emails at days 3, 7, 14.", plan: "Free", order: 4 },
  { category: "Workflow", categoryIcon: "Workflow", categoryBlurb: "Tools for moving docs through humans.", title: "Conditional routing", body: "Skip signers based on field values.", plan: "Team", order: 5 },
  { category: "Workflow", categoryIcon: "Workflow", categoryBlurb: "Tools for moving docs through humans.", title: "Bulk send", body: "CSV up to 50k recipients; rate-limited per signer.", plan: "Team", order: 6 },
  { category: "Workflow", categoryIcon: "Workflow", categoryBlurb: "Tools for moving docs through humans.", title: "Custom branding", body: "Logo, favicon, theme — applied across emails + viewer.", plan: "Team", order: 7 },
  { category: "Admin & compliance", categoryIcon: "ShieldCheck", categoryBlurb: "Defaults that keep auditors and SREs calm.", title: "Audit log", body: "Tamper-evident, exportable as JSON + PDF.", plan: "Free", order: 8 },
  { category: "Admin & compliance", categoryIcon: "ShieldCheck", categoryBlurb: "Defaults that keep auditors and SREs calm.", title: "SAML SSO", body: "Okta, Azure AD, Google Workspace.", plan: "Team", order: 9 },
  { category: "Admin & compliance", categoryIcon: "ShieldCheck", categoryBlurb: "Defaults that keep auditors and SREs calm.", title: "Data residency", body: "Pin docs to eu-central-1 or us-east-1.", plan: "Team", order: 10 },
  { category: "Admin & compliance", categoryIcon: "ShieldCheck", categoryBlurb: "Defaults that keep auditors and SREs calm.", title: "Custom retention", body: "Per-doc TTL + cryptographic shred-on-expire.", plan: "Scale", order: 11 },
  { category: "Admin & compliance", categoryIcon: "ShieldCheck", categoryBlurb: "Defaults that keep auditors and SREs calm.", title: "BAA + DPA", body: "Signed agreements for healthcare + EU customers.", plan: "Scale", order: 12 },
  { category: "Integrations", categoryIcon: "Plug", categoryBlurb: "Plug into the tools your team already runs.", title: "Webhook reliability", body: "Idempotent payloads, exp backoff, DLQ.", plan: "Free", order: 13 },
  { category: "Integrations", categoryIcon: "Plug", categoryBlurb: "Plug into the tools your team already runs.", title: "Slack notifications", body: "Per-channel routing by document tag.", plan: "Free", order: 14 },
  { category: "Integrations", categoryIcon: "Plug", categoryBlurb: "Plug into the tools your team already runs.", title: "Salesforce + HubSpot", body: "Two-way contact + opportunity sync.", plan: "Team", order: 15 },
  { category: "Integrations", categoryIcon: "Plug", categoryBlurb: "Plug into the tools your team already runs.", title: "Zapier + Make", body: "30+ triggers covering every signing event.", plan: "Team", order: 16 },
];

const USE_CASES = [
  { industry: "Fintech onboarding", problem: "30+ documents per new corporate account, mailed to legal teams.", solution: "Sequenced flows + reusable templates trigger from your KYC pipeline.", outcome: "Median time-to-account dropped from 6 days to 11 hours.", order: 0 },
  { industry: "Healthcare consent", problem: "HIPAA + state-specific consent forms with strict retention windows.", solution: "EU + US residency, custom retention, BAA in place.", outcome: "Zero compliance findings in the most recent OCR audit cycle.", order: 1 },
  { industry: "B2B sales contracts", problem: "Sales ops chasing signatures across 4 tools + spreadsheets.", solution: "HubSpot sync writes deal stage on every event; Slack alerts close-the-loop.", outcome: "Forecast accuracy improved by 22%, close cycle by 5 days.", order: 2 },
];

const PRICING_MATRIX = [
  { label: "Signed PDFs / month", category: "Limits", free: "100", team: "10,000", scale: "Unlimited", order: 0 },
  { label: "Team seats", category: "Limits", free: "1", team: "10", scale: "Unlimited", order: 1 },
  { label: "Templates", category: "Limits", free: "5", team: "Unlimited", scale: "Unlimited", order: 2 },
  { label: "API rate limit (rps)", category: "Limits", free: "5", team: "60", scale: "Custom", order: 3 },
  { label: "Sequenced flows", category: "Workflow", free: "false", team: "true", scale: "true", order: 4 },
  { label: "Conditional routing", category: "Workflow", free: "false", team: "true", scale: "true", order: 5 },
  { label: "Bulk send (CSV)", category: "Workflow", free: "false", team: "Up to 5k", scale: "Up to 50k", order: 6 },
  { label: "Custom branding", category: "Workflow", free: "false", team: "true", scale: "true", order: 7 },
  { label: "Audit log", category: "Admin", free: "true", team: "true", scale: "true", order: 8 },
  { label: "SAML SSO", category: "Admin", free: "false", team: "true", scale: "true", order: 9 },
  { label: "Data residency (EU/US)", category: "Admin", free: "false", team: "true", scale: "true", order: 10 },
  { label: "Custom retention + shred", category: "Admin", free: "false", team: "false", scale: "true", order: 11 },
  { label: "BAA + DPA", category: "Admin", free: "false", team: "false", scale: "true", order: 12 },
  { label: "Community support", category: "Support", free: "true", team: "true", scale: "true", order: 13 },
  { label: "Email support", category: "Support", free: "false", team: "24h SLA", scale: "1h SLA", order: 14 },
  { label: "Dedicated CSM", category: "Support", free: "false", team: "false", scale: "true", order: 15 },
];

const PRICING_FAQ = [
  { q: "Is there really a free forever tier?", a: "Yes — 100 signed PDFs per month, 1 seat, REST API + webhooks. No card required. We support it because most teams that grow stay with us; the free plan pays for itself by way of conversion.", order: 0 },
  { q: "What happens if I exceed my monthly quota?", a: "We never silently rate-limit. You'll get an email at 80% and 100% of quota. Free + Team plans queue overflow for the next cycle; Scale is metered and billed at the contracted overage rate.", order: 1 },
  { q: "Can I switch plans mid-cycle?", a: "Upgrades are immediate and pro-rated. Downgrades take effect at the next renewal. Cancellations stop charges instantly but you keep access through the paid period.", order: 2 },
  { q: "Do you sign a BAA / DPA / on-prem agreement?", a: "BAA + DPA are standard on Scale. On-prem deployments (helm chart, air-gapped) are available on annual contracts — talk to sales.", order: 3 },
  { q: "Is the audit log truly tamper-evident?", a: "Each entry is hash-chained and the chain root is published daily to a public Merkle ledger. We give you the verifier CLI so your auditors can independently confirm integrity.", order: 4 },
  { q: "Can I get a discount for startups / non-profits?", a: "Yes — 50% off Team for YC + Techstars + a-ha companies in their first year. 100% off Free + Team for registered 501(c)(3) non-profits. Email founders@ to claim.", order: 5 },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: { db: { insert: (t: string, d: unknown) => Promise<unknown> } }) {
  for (const p of PRICING) await ctx.db.insert("saasPricing", p);
  for (const f of FEATURES) await ctx.db.insert("saasFeatures", f);
  for (const p of POSTS) await ctx.db.insert("saasPosts", p);
  for (const c of CHANGELOG) await ctx.db.insert("saasChangelog", c);
  for (const c of CUSTOMERS) await ctx.db.insert("saasCustomers", c);
  for (const s of SUBSCRIPTIONS) await ctx.db.insert("saasSubscriptions", s);
  for (const l of LEADS) await ctx.db.insert("saasLeads", l);
  for (const i of INTEGRATIONS) await ctx.db.insert("saasIntegrations", i);
  for (const a of ANALYTICS) await ctx.db.insert("saasAnalytics", a);
  for (const f of FEATURE_MATRIX) await ctx.db.insert("saasFeatureMatrix", f);
  for (const u of USE_CASES) await ctx.db.insert("saasUseCases", u);
  for (const p of PRICING_MATRIX) await ctx.db.insert("saasPricingMatrix", p);
  for (const f of PRICING_FAQ) await ctx.db.insert("saasPricingFaq", f);
  for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
  for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });
  return {
    pricing: PRICING.length,
    features: FEATURES.length,
    posts: POSTS.length,
    changelog: CHANGELOG.length,
    customers: CUSTOMERS.length,
    subscriptions: SUBSCRIPTIONS.length,
    leads: LEADS.length,
    integrations: INTEGRATIONS.length,
    analytics: ANALYTICS.length,
    featureMatrix: FEATURE_MATRIX.length,
    useCases: USE_CASES.length,
    pricingMatrix: PRICING_MATRIX.length,
    pricingFaq: PRICING_FAQ.length,
    landing: LANDING.length,
    pages: PAGES.length,
  };
}

const CONTENT_TABLES = [
  "saasPricing",
  "saasFeatures",
  "saasPosts",
  "saasChangelog",
  "saasCustomers",
  "saasSubscriptions",
  "saasLeads",
  "saasIntegrations",
  "saasAnalytics",
  "saasFeatureMatrix",
  "saasUseCases",
  "saasPricingMatrix",
  "saasPricingFaq",
  "landingSections",
  "pages",
] as const;

// Power/CLI seed: wipes content tables first, then inserts. Destructive — only
// for terminal use where you explicitly want a reset.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    for (const t of CONTENT_TABLES) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    return insertAll(ctx as never);
  },
});

// Content tables wiped/refilled by the demo seed — every CONTENT_TABLES entry
// EXCEPT landingSections, whose admin-edited copy we preserve (refilled
// additively below). pages are content here, so they get the full wipe+reinsert.
const DEMO_WIPE_TABLES = CONTENT_TABLES.filter((t) => t !== "landingSections");

// Demo/CLI seed (NO auth, internal — run via `npx convex run seed:seedDemo`).
// For SHOWCASE/demo deployments only. Refills the content tables for a full
// demo WITHOUT wiping admin-edited landing copy (landingSections are synced
// additively). Touches only CONTENT tables — never auth/user tables.
// Idempotent. No hero imageUrl: this vertical has no public/hero.webp.
export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const t of DEMO_WIPE_TABLES) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    for (const p of PRICING) await ctx.db.insert("saasPricing", p);
    for (const f of FEATURES) await ctx.db.insert("saasFeatures", f);
    for (const p of POSTS) await ctx.db.insert("saasPosts", p);
    for (const c of CHANGELOG) await ctx.db.insert("saasChangelog", c);
    for (const c of CUSTOMERS) await ctx.db.insert("saasCustomers", c);
    for (const s of SUBSCRIPTIONS) await ctx.db.insert("saasSubscriptions", s);
    for (const l of LEADS) await ctx.db.insert("saasLeads", l);
    for (const i of INTEGRATIONS) await ctx.db.insert("saasIntegrations", i);
    for (const a of ANALYTICS) await ctx.db.insert("saasAnalytics", a);
    for (const f of FEATURE_MATRIX) await ctx.db.insert("saasFeatureMatrix", f);
    for (const u of USE_CASES) await ctx.db.insert("saasUseCases", u);
    for (const p of PRICING_MATRIX) await ctx.db.insert("saasPricingMatrix", p);
    for (const f of PRICING_FAQ) await ctx.db.insert("saasPricingFaq", f);
    for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });

    // landingSections: additive — insert only missing sectionIds so admin-edited
    // copy on existing rows survives the demo reseed.
    let landingInserted = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        landingInserted++;
      }
    }

    return {
      pricing: PRICING.length,
      features: FEATURES.length,
      posts: POSTS.length,
      changelog: CHANGELOG.length,
      customers: CUSTOMERS.length,
      subscriptions: SUBSCRIPTIONS.length,
      leads: LEADS.length,
      integrations: INTEGRATIONS.length,
      analytics: ANALYTICS.length,
      featureMatrix: FEATURE_MATRIX.length,
      useCases: USE_CASES.length,
      pricingMatrix: PRICING_MATRIX.length,
      pricingFaq: PRICING_FAQ.length,
      pages: PAGES.length,
      landingInserted,
    };
  },
});

// Additive landing sync for already-seeded deployments: inserts LANDING
// entries whose sectionId is missing and aligns `order` to the canonical
// lineup. Never touches admin-edited copy/enabled/config on existing rows.
export const syncLanding = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let inserted = 0;
    let reordered = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        inserted++;
      } else if ((existing.data as { order?: number }).order !== s.order) {
        await ctx.db.patch(existing._id, {
          data: { ...(existing.data as Record<string, unknown>), order: s.order },
        });
        reordered++;
      }
    }
    return { inserted, reordered };
  },
});

// Additive image backfill for already-seeded deployments: patches the `cover`
// on blog posts whose row is missing one, matched by unique slug. Never
// overwrites an admin-set cover. Safe to re-run (second run patches 0).
export const syncPostsImages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let patched = 0;
    for (const p of POSTS) {
      if (!p.cover) continue;
      const existing = await ctx.db
        .query("saasPosts")
        .withIndex("by_slug", (q) => q.eq("slug", p.slug))
        .first();
      if (existing && !existing.cover) {
        await ctx.db.patch(existing._id, { cover: p.cover });
        patched++;
      }
    }
    return { patched };
  },
});

// In-app one-click seed for non-technical owners. Safe: requires an authenticated
// admin AND only runs on an empty site, so it can never wipe real content.
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const hasPosts = await ctx.db.query("saasPosts").first();
    const hasLanding = await ctx.db.query("landingSections").first();
    if (hasPosts || hasLanding) {
      return { seeded: false, reason: "already-has-content" as const };
    }
    const counts = await insertAll(ctx as never);
    return { seeded: true, ...counts };
  },
});

// One-off, idempotent: strip the legacy sandbox-preview prefix
// "/templates/saas-marketing-os" from any seeded href (pricing CTAs, page
// block CTAs, landing config). Standalone repo serves at root, so the
// prefix points at 404s. Safe to re-run (second run patches 0).
export const fixStaleHrefs = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    const STALE = "/templates/saas-marketing-os";
    const scan = (v: unknown): unknown => {
      if (typeof v === "string") return v.startsWith(STALE) ? v.slice(STALE.length) || "/" : v;
      if (Array.isArray(v)) return v.map(scan);
      if (v && typeof v === "object")
        return Object.fromEntries(
          Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, scan(x)]),
        );
      return v;
    };
    let patched = 0;
    for (const table of ["saasPricing", "pages", "landingSections"] as const) {
      for (const row of await ctx.db.query(table as never).take(500)) {
        const { _id, _creationTime, ...rest } = row as Record<string, unknown> & { _id: never };
        const next = scan(rest);
        if (JSON.stringify(next) !== JSON.stringify(rest)) {
          await ctx.db.replace(_id, next as never);
          patched++;
        }
      }
    }
    return { patched };
  },
});
