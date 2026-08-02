import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasUseCases").withIndex("by_order").take(50),
});

export const listAll = query({
  args: {},
  handler: async (ctx) =>
    ctx.db.query("saasUseCases").withIndex("by_order").take(50),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasUseCases")),
    industry: v.string(),
    problem: v.string(),
    solution: v.string(),
    outcome: v.string(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasUseCases", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasUseCases") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
