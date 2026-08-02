<div align="center">

# SaaS Marketing OS

**A 100% headless SaaS marketing site + growth-ops dashboard you fully own.**
Clone it to your own Vercel + Convex, sign in, and run everything — landing pages,
pricing, blog, changelog, leads, customers, subscriptions, analytics — from one
admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-saas-marketing-os)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-cloud-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://saas-marketing-os-omega.vercel.app)

</div>

---

## What is this?

A **clone-to-own** marketing OS for a SaaS product. Deploy it to **your** infrastructure
and you get a full public marketing site whose content lives in **your** Convex database —
managed entirely from the admin panel. The frontend is stateless, so updates never touch
your data.

- 🌐 **For visitors** — a fast, SEO-ready marketing site (home, features, pricing, blog, changelog, contact, custom landing pages).
- 📈 **For you** — a growth dashboard for leads, customers, subscriptions, MRR analytics, and content, with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Headless marketing CMS on Convex** — pricing plans + comparison matrix, feature cards
  + feature matrix, use cases, pricing FAQ, blog posts, changelog, landing sections, and a
  block/page builder. Realtime, edited from `/admin`.
- **Growth ops dashboard** — leads (with public `/contact` capture), customers, subscriptions,
  newsletter subscribers, and weekly **MRR / churn / trial-conversion analytics** with charts.
- **Zero-touch setup** — deploy → open `/admin` → claim owner → run the **onboarding wizard**
  to set branding + seed sample content. No env editing, no terminal. Auth keys auto-provision at build.
- **Branding from the dashboard** — site name, tagline, logo, favicon, brand colour, plus
  light/dark theme and **tweakcn theme presets**. Stored in Convex, applied at runtime.
- **One-button image picker** — gallery · upload · paste-URL · curated Unsplash (via `/api/unsplash`).
- **Secure admin** — keyless first-owner claim, then signup gates behind `ADMIN_SIGNUP_KEY`;
  optional auto-admin from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- **Real roles & audit log** — owner / admin / editor / viewer mapped over `@convex-dev/auth`,
  with an append-only admin **audit-event stream**.
- **Integrations, webhooks & API keys** — admin panels to register webhook endpoints (with
  delivery history), manage API keys, and track integration status (Slack, Stripe, HubSpot, …).
- **AI assistant FAB** — a public chat widget wired to Claude via `@ai-sdk/anthropic`. Key-guarded:
  with no `ANTHROPIC_API_KEY` it degrades gracefully instead of breaking the build.
- **`/setup` health page** — a plain-language checklist of what's done and what's left,
  each step linking to its fix. No log-reading.
- **In-app updates** — admin sees current vs latest version (`version.json` + `lib/headless-core/`)
  and rebuilds in one click via a Vercel deploy hook.
- **Backup & restore** — export / re-import all your content as JSON, no terminal.
- **Demo / clone stages** — a "Deploy your own" ribbon shows on the demo only (`NEXT_PUBLIC_DEMO`).
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-saas-marketing-os)** → connect GitHub → add the **Convex** integration → Deploy.
2. Open `https://your-site.vercel.app/admin` → register the first account (it becomes **owner**).
3. Run the **onboarding wizard** to set your branding and seed sample content. Done.

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npm run convex:codegen            # convex dev --once → generates convex/_generated
npm run dev                       # http://localhost:3000
```

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel ones;
set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | ✅ | Convex deployment URL (`.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build — needs capabilities `deploy` + `env:view` + `env:write` (or full access) |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** by `scripts/setup-auth.mjs` (or `npx @convex-dev/auth`) |
| `ADMIN_SIGNUP_KEY` | Convex | – | invite key gating extra admin signups |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Convex | – | auto-create the owner on first load |
| `VERCEL_DEPLOY_HOOK_URL` | Convex | – | enables the admin "Rebuild now" / in-app update button |
| `ANTHROPIC_API_KEY` | Convex | – | enables the AI assistant FAB (degrades gracefully if unset) |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" ribbon |

> `vercel.json` runs `npm run build:auto`, which invokes `convex deploy` automatically when
> `CONVEX_DEPLOY_KEY` is present — the Vercel **Build Command stays default**, no manual change needed.

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui · Recharts |
| Backend / DB | Convex (Cloud / self-hosted compatible) — realtime |
| Auth | `@convex-dev/auth` (Password; optional GitHub/Google OAuth) |
| Theme | next-themes + tweakcn theme presets |
| AI | `ai` SDK + `@ai-sdk/anthropic` (Claude) |
| Images | `image-picker` slice (gallery · upload · link · Unsplash) |

## 🗂️ Project structure

```
app/
  (public)/        marketing site — home, features, pricing, blog, changelog,
                   about, contact, dynamic [...slug] + blocks pages
  dashboard/admin/ admin dashboard (gated): leads, customers, subscriptions,
                   analytics, posts, changelog, pricing(+matrix/faq), features
                   (+matrix), use-cases, landing, pages, integrations, settings,
                   admin-panel, database
  admin/ login/    redirect → /dashboard/admin
  setup/           /setup health page
  api/unsplash/    Unsplash proxy for the image picker
components/
  onboarding/      onboarding wizard host
  admin/           backup-card · update-card
  setup/           setup-health · setup-banner
  ai-chat-fab.tsx · demo-ribbon.tsx · admin-gate.tsx · site-loader.tsx · public-chrome.tsx
convex/
  schema.ts        auth + marketing content + admin + siteSettings
  settings.ts seed.ts setup.ts backup.ts update.ts files.ts http.ts
  posts.ts pricing.ts leads.ts customers.ts subscriptions.ts analytics.ts …
  adminPanel_*.ts  users/roles · webhooks · audit log · ai config · settings
  features/        comments · notion slices
frontend/slices/   image-picker · notion-shell (portable UI slices)
lib/headless-core/ version manifest + settings core
scripts/           setup-auth.mjs (build-time JWT keys) · smoke-test.mjs
version.json       single source of version truth for the update channel
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] One-click **"Update available"** in admin
- [x] One-click **backup / restore**
- [x] Roles (owner / admin / editor / viewer) + admin audit log
- [x] **`/setup`** health page + clone **smoke-test**
- [x] Onboarding wizard with tweakcn theme presets
- [ ] Wire integrations/webhooks to real outbound deliveries
- [ ] Per-action RBAC enforcement on admin mutations
- [ ] Optional Resend "forgot password" flow

## 📄 License

MIT © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>
