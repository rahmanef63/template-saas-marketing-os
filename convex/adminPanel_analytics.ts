import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin-panel "Analytics" block — READ-ONLY. Mirrors convex/settings.ts auth
// guard (getAuthUserId -> throw if not signed in). No mutations: analytics is
// read-only by nature. KPIs are computed from THIS template's REAL tables
// (saasSubscriptions, saasCustomers, saasLeads, subscribers) via _creationTime.
// series / sources / topPages / funnel are illustrative — there is no
// event-tracking infra in this template, so those keep the demo's shape but are
// anchored on real counts where cheap. See the // ponytail: comments below.

const DAY_MS = 86_400_000;
const WINDOW_DAYS = 30;

// Donut palette + funnel/page labels — kept here so the query returns the same
// shape the bindings expect. Counts that we CAN derive cheaply use real data.
const SOURCE_PALETTE = [
  { id: "website", label: "Website", color: "#a78bfa" },
  { id: "referral", label: "Referral", color: "#34d399" },
  { id: "ad", label: "Paid ads", color: "#fbbf24" },
  { id: "event", label: "Events", color: "#60a5fa" },
  { id: "direct", label: "Direct", color: "#f87171" },
] as const;

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");

    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * DAY_MS;
    const prevStart = now - 2 * WINDOW_DAYS * DAY_MS;

    // Pull every row's _creationTime from this template's real content tables.
    // These tables are small (admin-managed content), so a full collect is fine.
    const [subscriptions, customers, leads, subscribers, posts] = await Promise.all([
      ctx.db.query("saasSubscriptions").collect(),
      ctx.db.query("saasCustomers").collect(),
      ctx.db.query("saasLeads").collect(),
      ctx.db.query("subscribers").collect(),
      ctx.db.query("saasPosts").collect(),
    ]);

    // REAL MRR proxy: sum mrrCents over active/trialing subscriptions.
    const activeMrrCents = subscriptions
      .filter((s) => s.status === "active" || s.status === "trialing")
      .reduce((sum, s) => sum + (s.mrrCents ?? 0), 0);
    const mrrLabel = `$${Math.round(activeMrrCents / 100).toLocaleString()}`;

    // --- KPI cards (REAL counts, deltas vs the previous 30-day window) ---
    const inWindow = <T extends { _creationTime: number }>(rows: T[], from: number, to: number) =>
      rows.filter((r) => r._creationTime >= from && r._creationTime < to).length;

    const custCurr = inWindow(customers, windowStart, now);
    const custPrev = inWindow(customers, prevStart, windowStart);
    const leadsCurr = inWindow(leads, windowStart, now);
    const leadsPrev = inWindow(leads, prevStart, windowStart);
    const subsCurr = inWindow(subscribers, windowStart, now);
    const subsPrev = inWindow(subscribers, prevStart, windowStart);

    const kpis = [
      {
        id: "mrr",
        label: "MRR",
        value: mrrLabel,
        deltaPct: 0, // ponytail: MRR is a running total, no per-period history to diff
        hint: "active + trialing subscriptions",
      },
      {
        id: "customers",
        label: "Customers",
        value: customers.length.toLocaleString(),
        deltaPct: Number(pct(custCurr, custPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "leads",
        label: "Leads",
        value: leads.length.toLocaleString(),
        deltaPct: Number(pct(leadsCurr, leadsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
      {
        id: "subscribers",
        label: "Subscribers",
        value: subscribers.length.toLocaleString(),
        deltaPct: Number(pct(subsCurr, subsPrev).toFixed(1)),
        hint: "vs previous 30 days",
      },
    ];

    // --- 30-day series (REAL): per-day new content + new sessions proxy ---
    // views = customers+leads+subscribers+posts created that day (a real
    // activity signal), sessions = leads+subscribers+customers that day.
    const dayKey = (t: number) => new Date(t).toISOString().slice(0, 10);
    const viewsByDay = new Map<string, number>();
    const sessByDay = new Map<string, number>();
    const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
    for (const r of [...customers, ...leads, ...subscribers, ...posts]) {
      if (r._creationTime < windowStart) continue;
      bump(viewsByDay, dayKey(r._creationTime));
    }
    for (const r of [...leads, ...subscribers, ...customers]) {
      if (r._creationTime < windowStart) continue;
      bump(sessByDay, dayKey(r._creationTime));
    }
    const series = Array.from({ length: WINDOW_DAYS }, (_, i) => {
      const d = dayKey(windowStart + (i + 1) * DAY_MS);
      return { date: d, views: viewsByDay.get(d) ?? 0, sessions: sessByDay.get(d) ?? 0 };
    });

    // --- Traffic sources (REAL labels mapped from lead `source`) ---
    // We DO have a `source` enum on saasLeads, so the donut is real: bucket each
    // into the known palette ids (fallback -> "direct").
    const knownIds = new Set<string>(SOURCE_PALETTE.map((s) => s.id));
    const visitsById = new Map<string, number>();
    for (const r of leads) {
      const key = knownIds.has(r.source) ? r.source : "direct";
      visitsById.set(key, (visitsById.get(key) ?? 0) + 1);
    }
    const sources = SOURCE_PALETTE.map((s) => ({
      id: s.id,
      label: s.label,
      color: s.color,
      visits: visitsById.get(s.id) ?? 0,
    }));

    // --- Top pages ---
    // ponytail: illustrative — no event-tracking infra to measure page views.
    // Anchored on REAL blog posts; views are derived deterministically from
    // recency rank so the table isn't empty.
    const topPages = [...posts]
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, 6)
      .map((p, i) => ({
        path: `/blog/${p.slug}`,
        title: p.title,
        views: 1200 - i * 140,
        avgDurationSec: 90,
        bounceRate: 0.35,
      }));

    // --- Conversion funnel ---
    // ponytail: illustrative — no event-tracking infra to measure scroll/CTA
    // steps. Anchored on REAL endpoints: top = a visit proxy, bottom = real
    // leads count; the two middle steps are interpolated drop-offs.
    const submits = leads.length;
    const visits = Math.max(submits * 4, customers.length * 6, 1);
    const funnel = [
      { id: "visit", label: "Landing visit", count: visits },
      { id: "scroll", label: "Scrolled past hero", count: Math.round(visits * 0.71) },
      { id: "cta-view", label: "Saw primary CTA", count: Math.round(visits * 0.41) },
      { id: "cta-click", label: "Clicked CTA", count: Math.round(Math.max(submits * 3, visits * 0.11)) },
      { id: "form-submit", label: "Form submit", count: submits },
    ];

    return { kpis, series, sources, topPages, funnel };
  },
});
