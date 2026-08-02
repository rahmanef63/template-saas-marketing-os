import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";

const PLAN = v.union(v.literal("free"), v.literal("team"), v.literal("scale"));
const STATUS = v.union(v.literal("trial"), v.literal("active"), v.literal("churned"));

export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    return ctx.db.query("saasCustomers").take(500);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    return ctx.db.query("saasCustomers").take(500);
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasCustomers")),
    email: v.string(),
    name: v.string(),
    plan: PLAN,
    status: STATUS,
    startedAt: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasCustomers", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasCustomers") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
