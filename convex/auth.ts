import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

// Zero-config admin onboarding:
// - Fresh clone (no admin yet, no ADMIN_SIGNUP_KEY set): the FIRST signup claims
//   ownership with no secret. After that, signups are closed automatically.
// - If the owner sets ADMIN_SIGNUP_KEY (Convex env): every signup must pass the
//   matching key — works both as a first-owner lock and as an invite token for
//   adding more admins later.
// Existing admins can always sign in regardless.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const required = process.env.ADMIN_SIGNUP_KEY;
        if (params.flow === "signUp" && required && params.signupKey !== required) {
          throw new ConvexError("Setup key salah.");
        }
        const email = params.email as string;
        const name = (params.name as string | undefined) || email;
        return { email, name };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Existing user signing in / linking → allow untouched.
      if (args.existingUserId) return args.existingUserId;

      const email = args.profile.email as string | undefined;
      // Dedupe by email so re-signup doesn't create a twin.
      if (email) {
        // authTables.users ships a built-in "email" index (the auth package
        // itself queries it). Use it instead of a full-table scan (.filter) so
        // dedupe stays O(log n) as users grow. The index name isn't surfaced in
        // the generated DataModel type via the authTables spread at this auth
        // version, so the index arg is cast — runtime is correct.
        const existing = await ctx.db
          .query("users")
          .withIndex("email" as never, (q: any) => q.eq("email", email))
          .first();
        if (existing) return existing._id;
      }

      // New account: allow if no owner exists yet (first claim) OR a signup key
      // is configured (already validated in profile = invited admin).
      const firstUser = await ctx.db.query("users").first();
      const keyConfigured = !!process.env.ADMIN_SIGNUP_KEY;
      if (firstUser && !keyConfigured) {
        throw new ConvexError("Pendaftaran admin sudah ditutup.");
      }

      return ctx.db.insert("users", {
        email,
        name: (args.profile.name as string | undefined) ?? email,
      });
    },
  },
});
