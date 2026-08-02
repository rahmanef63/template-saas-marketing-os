import { query } from "./_generated/server";

// Read-only KPI snapshots powering /admin/analytics. No admin CRUD in the
// reducer — these are seeded once and read by the store.
export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("saasAnalytics").take(50),
});

export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("saasAnalytics").take(50),
});
