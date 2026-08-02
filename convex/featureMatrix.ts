import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasFeatureMatrix").withIndex("by_order").take(200),
});

export const listAll = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasFeatureMatrix").withIndex("by_order").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasFeatureMatrix")),
    category: v.string(),
    categoryIcon: v.string(),
    categoryBlurb: v.string(),
    title: v.string(),
    body: v.string(),
    plan: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasFeatureMatrix", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasFeatureMatrix") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
