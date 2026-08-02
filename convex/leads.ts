import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { optionalUser, requireUser } from "./_shared/auth";
import { limitPublicWrite } from "./_shared/rateLimit";

const SOURCE = v.union(
  v.literal("website"),
  v.literal("referral"),
  v.literal("ad"),
  v.literal("event"),
);
const STATUS = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("won"),
  v.literal("lost"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    return ctx.db.query("saasLeads").order("desc").take(500);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await optionalUser(ctx))) return [];
    return ctx.db.query("saasLeads").order("desc").take(500);
  },
});

// UNGATED public visitor write — the /contact form posts here. Mirrors the
// subscribe/comments pattern: anyone can create a lead, no auth required.
// Admin reclassifies status/source from the Leads admin view afterwards.
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { name, email, message }) => {
    // Bound untrusted public input before insert (no behavior change for
    // legitimate submissions; only clamps abusive lengths).
    const cleanEmail = email.slice(0, 320);
    if (!cleanEmail.includes("@")) throw new ConvexError("Email tidak valid.");
    await limitPublicWrite(ctx, "lead", cleanEmail);
    const cleanMessage = message?.slice(0, 5000);
    return ctx.db.insert("saasLeads", {
      name: name.slice(0, 200),
      email: cleanEmail,
      source: "website",
      status: "new",
      ts: Date.now(),
      ...(cleanMessage ? { message: cleanMessage } : {}),
    });
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("saasLeads")),
    email: v.string(),
    name: v.string(),
    source: SOURCE,
    status: STATUS,
    ts: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("saasLeads", data);
  },
});

export const remove = mutation({
  args: { id: v.id("saasLeads") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
