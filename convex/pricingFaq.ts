import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasPricingFaq").withIndex("by_order").take(50),
});

export const listAll = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasPricingFaq").withIndex("by_order").take(50),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasPricingFaq")),
    q: v.string(),
    a: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasPricingFaq", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasPricingFaq") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
