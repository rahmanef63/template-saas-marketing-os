import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasPricingMatrix").withIndex("by_order").take(100),
});

export const listAll = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasPricingMatrix").withIndex("by_order").take(100),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasPricingMatrix")),
    category: v.string(),
    label: v.string(),
    free: v.string(),
    team: v.string(),
    scale: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasPricingMatrix", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasPricingMatrix") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
