export type PricingTier = {
  id: string;
  name: string;
  price: string;
  period: string;
  blurb: string;
  bullets: string[];
  cta: { label: string; href: string };
  featured: boolean;
  /** Icon token from the icon-picker slice (emoji / lucide / phosphor). */
  icon?: string;
};

export type FeatureItem = {
  id: string;
  title: string;
  blurb: string;
  icon: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  publishedAt: number;
  tags: string[];
  /** Cover image token from the image-picker slice (URL / css color / gradient). */
  cover?: string;
  /** admin-only: workflow status. Optional for backward compat. */
  status?: "draft" | "scheduled" | "published";
};

export type ChangelogEntry = {
  id: string;
  version: string;
  date: number;
  kind: "feature" | "fix" | "chore";
  title: string;
  body: string;
};

export type CustomerStatus = "trial" | "active" | "churned";
export type Customer = {
  id: string;
  email: string;
  name: string;
  plan: "free" | "team" | "scale";
  status: CustomerStatus;
  startedAt: number;
};

export type SubStatus = "active" | "trialing" | "past_due" | "canceled";
export type Subscription = {
  id: string;
  customerId: string;
  customerEmail: string;
  plan: "team" | "scale";
  mrrCents: number;
  status: SubStatus;
  renewsAt: number;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type Lead = {
  id: string;
  email: string;
  name: string;
  source: "website" | "referral" | "ad" | "event";
  status: LeadStatus;
  ts: number;
  /** Optional free-text from the public /contact form. */
  message?: string;
};

/** CK-2B — third-party integration registry shown on /admin/integrations. */
export type IntegrationStatus = "connected" | "disconnected" | "error";
export type IntegrationProvider =
  | "slack"
  | "linear"
  | "hubspot"
  | "resend"
  | "stripe"
  | "github"
  | "intercom"
  | "segment";
export type Integration = {
  id: string;
  provider: IntegrationProvider;
  label: string;
  status: IntegrationStatus;
  webhookUrl: string;
  scopes: string[];
  /** ms epoch — last successful sync */
  lastSyncAt: number;
  /** masked secret hint, e.g. "sk_live_…3Az9" */
  secretHint: string;
  /** Logo token from the image-picker slice (URL / css color / gradient). */
  logo?: string;
  notes?: string;
};

/** CK-2B — SaaS KPI snapshot powering /admin/analytics. Stored as a tiny
 *  fixed seed (4 weeks of weekly samples) so the view renders deterministic
 *  ASCII charts without a real warehouse. */
export type AnalyticsKpi = {
  /** week label, e.g. "W-04" (oldest) … "W-01" (current) */
  week: string;
  mrrCents: number;
  newCustomers: number;
  churnedCustomers: number;
  trials: number;
  trialsConverted: number;
};

/** CK-2C — one row of the public /features lower-fold matrix. Grouped by
 *  `category` in the renderer; `plan` gates the availability badge. */
export type FeatureMatrixItem = {
  id: string;
  category: string;
  categoryIcon: string;
  categoryBlurb: string;
  title: string;
  body: string;
  plan?: string;
  order: number;
};

/** CK-2C — use-case callout on the public /features page. */
export type UseCaseItem = {
  id: string;
  industry: string;
  problem: string;
  solution: string;
  outcome: string;
  order: number;
};

/** CK-2C — one plan-comparison row on the public /pricing page.
 *  free/team/scale are strings; "true"/"false" render as check/dash. */
export type PricingMatrixRow = {
  id: string;
  category: string;
  label: string;
  free: string;
  team: string;
  scale: string;
  order: number;
};

/** CK-2C — one FAQ entry on the public /pricing page. */
export type PricingFaqItem = {
  id: string;
  q: string;
  a: string;
  order: number;
};

export type State = {
  pricing: PricingTier[];
  features: FeatureItem[];
  posts: BlogPost[];
  changelog: ChangelogEntry[];
  customers: Customer[];
  subscriptions: Subscription[];
  leads: Lead[];
  /** alias for changelog from the admin nav perspective */
  changelogEntries: ChangelogEntry[];
  /** O-wave: public pages CRUD slice. */
  pages: import("@/features/_shared/pages/types").PageEntry[];
  /** AB-wave: home-page section composition. Ordered + toggleable. */
  landingSections: import("@/features/_shared/landing/types").LandingSection[];
  /** CK-2B — third-party integrations registry. */
  integrations: Integration[];
  /** CK-2B — last 4 weekly KPI samples for analytics view. */
  analytics: AnalyticsKpi[];
  /** CK-2C — admin-editable /features lower-fold matrix rows. */
  featureMatrix: FeatureMatrixItem[];
  /** CK-2C — admin-editable /features use-case callouts. */
  useCases: UseCaseItem[];
  /** CK-2C — admin-editable /pricing comparison rows. */
  pricingMatrix: PricingMatrixRow[];
  /** CK-2C — admin-editable /pricing FAQ entries. */
  pricingFaq: PricingFaqItem[];
};

export type LandingSection = import("@/features/_shared/landing/types").LandingSection;
export type LandingSectionKind = import("@/features/_shared/landing/types").LandingSectionKind;

export type PostsAction =
  | { type: "POST_CREATE"; payload: BlogPost }
  | { type: "POST_UPDATE"; payload: { id: string; patch: Partial<Omit<BlogPost, "id">> } }
  | { type: "POST_DELETE"; payload: { id: string } };

export type CustomerAction =
  | { type: "CUSTOMER_UPSERT"; payload: Customer }
  | { type: "CUSTOMER_DELETE"; payload: { id: string } };

export type SubscriptionAction =
  | { type: "SUBSCRIPTION_UPSERT"; payload: Subscription }
  | { type: "SUBSCRIPTION_DELETE"; payload: { id: string } };

export type LeadAction =
  | { type: "LEAD_UPSERT"; payload: Lead }
  | { type: "LEAD_DELETE"; payload: { id: string } };

export type ChangelogAction =
  | { type: "CHANGELOG_UPSERT"; payload: ChangelogEntry }
  | { type: "CHANGELOG_DELETE"; payload: { id: string } };

export type PricingAction =
  | { type: "PRICING_UPSERT"; payload: PricingTier }
  | { type: "PRICING_DELETE"; payload: { id: string } };

export type FeatureAction =
  | { type: "FEATURE_UPSERT"; payload: FeatureItem }
  | { type: "FEATURE_DELETE"; payload: { id: string } };

export type IntegrationAction =
  | { type: "INTEGRATION_UPSERT"; payload: Integration }
  | { type: "INTEGRATION_DELETE"; payload: { id: string } };

export type FeatureMatrixAction =
  | { type: "FEATURE_MATRIX_UPSERT"; payload: FeatureMatrixItem }
  | { type: "FEATURE_MATRIX_DELETE"; payload: { id: string } };

export type UseCaseAction =
  | { type: "USE_CASE_UPSERT"; payload: UseCaseItem }
  | { type: "USE_CASE_DELETE"; payload: { id: string } };

export type PricingMatrixAction =
  | { type: "PRICING_MATRIX_UPSERT"; payload: PricingMatrixRow }
  | { type: "PRICING_MATRIX_DELETE"; payload: { id: string } };

export type PricingFaqAction =
  | { type: "PRICING_FAQ_UPSERT"; payload: PricingFaqItem }
  | { type: "PRICING_FAQ_DELETE"; payload: { id: string } };

export type LandingAction = import("@/features/_shared/landing/types").LandingAction;

export type Action =
  | { type: "hydrate"; state: State }
  | { type: "reset" }
  | PostsAction
  | CustomerAction
  | SubscriptionAction
  | LeadAction
  | ChangelogAction
  | PricingAction
  | FeatureAction
  | IntegrationAction
  | FeatureMatrixAction
  | UseCaseAction
  | PricingMatrixAction
  | PricingFaqAction
  | LandingAction
  | import("@/features/_shared/pages/types").PagesAction;
