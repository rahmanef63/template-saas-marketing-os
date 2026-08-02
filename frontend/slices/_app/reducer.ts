import { pagesReducer } from "@/features/_shared/pages/reducer";
import { landingReducer } from "@/features/_shared/landing/reducer";
import type { Action, State } from "./types";
import { SEED_STATE } from "./seed";

/** Root reducer for the saas-marketing template store. Delegates each
 *  domain's actions to its own slice reducer (pages, landing) and handles
 *  the rest inline. Extracted from store.tsx to keep that file under the
 *  200 LOC cap. */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      // Shallow-merge so any field added in a newer schema gets its
      // default when hydrating from an older localStorage payload.
      return { ...SEED_STATE, ...action.state };
    case "reset":
      return SEED_STATE;
    case "PAGE_CREATE":
    case "PAGE_UPDATE":
    case "PAGE_DELETE":
    case "PAGE_REORDER_BLOCK":
    case "PAGE_SECTION_UPSERT":
    case "PAGE_SECTION_DELETE": {
      const next = pagesReducer({ pages: state.pages }, action);
      return { ...state, pages: next.pages };
    }
    case "POST_CREATE":
      return { ...state, posts: [action.payload, ...state.posts] };
    case "POST_UPDATE":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.patch } : p,
        ),
      };
    case "POST_DELETE":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.payload.id) };
    case "CUSTOMER_UPSERT": {
      const idx = state.customers.findIndex((c) => c.id === action.payload.id);
      const customers =
        idx >= 0
          ? state.customers.map((c) => (c.id === action.payload.id ? action.payload : c))
          : [action.payload, ...state.customers];
      return { ...state, customers };
    }
    case "CUSTOMER_DELETE":
      return { ...state, customers: state.customers.filter((c) => c.id !== action.payload.id) };
    case "SUBSCRIPTION_UPSERT": {
      const idx = state.subscriptions.findIndex((s) => s.id === action.payload.id);
      const subscriptions =
        idx >= 0
          ? state.subscriptions.map((s) => (s.id === action.payload.id ? action.payload : s))
          : [action.payload, ...state.subscriptions];
      return { ...state, subscriptions };
    }
    case "SUBSCRIPTION_DELETE":
      return {
        ...state,
        subscriptions: state.subscriptions.filter((s) => s.id !== action.payload.id),
      };
    case "LEAD_UPSERT": {
      const idx = state.leads.findIndex((l) => l.id === action.payload.id);
      const leads =
        idx >= 0
          ? state.leads.map((l) => (l.id === action.payload.id ? action.payload : l))
          : [action.payload, ...state.leads];
      return { ...state, leads };
    }
    case "LEAD_DELETE":
      return { ...state, leads: state.leads.filter((l) => l.id !== action.payload.id) };
    case "CHANGELOG_UPSERT": {
      const idx = state.changelog.findIndex((e) => e.id === action.payload.id);
      const changelog =
        idx >= 0
          ? state.changelog.map((e) => (e.id === action.payload.id ? action.payload : e))
          : [action.payload, ...state.changelog];
      return { ...state, changelog, changelogEntries: changelog };
    }
    case "CHANGELOG_DELETE": {
      const changelog = state.changelog.filter((e) => e.id !== action.payload.id);
      return { ...state, changelog, changelogEntries: changelog };
    }
    case "PRICING_UPSERT": {
      const idx = state.pricing.findIndex((t) => t.id === action.payload.id);
      const pricing =
        idx >= 0
          ? state.pricing.map((t) => (t.id === action.payload.id ? action.payload : t))
          : [...state.pricing, action.payload];
      return { ...state, pricing };
    }
    case "PRICING_DELETE":
      return { ...state, pricing: state.pricing.filter((t) => t.id !== action.payload.id) };
    case "FEATURE_UPSERT": {
      const idx = state.features.findIndex((f) => f.id === action.payload.id);
      const features =
        idx >= 0
          ? state.features.map((f) => (f.id === action.payload.id ? action.payload : f))
          : [...state.features, action.payload];
      return { ...state, features };
    }
    case "FEATURE_DELETE":
      return { ...state, features: state.features.filter((f) => f.id !== action.payload.id) };
    case "INTEGRATION_UPSERT": {
      const idx = state.integrations.findIndex((i) => i.id === action.payload.id);
      const integrations =
        idx >= 0
          ? state.integrations.map((i) => (i.id === action.payload.id ? action.payload : i))
          : [...state.integrations, action.payload];
      return { ...state, integrations };
    }
    case "INTEGRATION_DELETE":
      return {
        ...state,
        integrations: state.integrations.filter((i) => i.id !== action.payload.id),
      };
    case "FEATURE_MATRIX_UPSERT": {
      const idx = state.featureMatrix.findIndex((m) => m.id === action.payload.id);
      const featureMatrix =
        idx >= 0
          ? state.featureMatrix.map((m) => (m.id === action.payload.id ? action.payload : m))
          : [...state.featureMatrix, action.payload];
      return { ...state, featureMatrix };
    }
    case "FEATURE_MATRIX_DELETE":
      return {
        ...state,
        featureMatrix: state.featureMatrix.filter((m) => m.id !== action.payload.id),
      };
    case "USE_CASE_UPSERT": {
      const idx = state.useCases.findIndex((u) => u.id === action.payload.id);
      const useCases =
        idx >= 0
          ? state.useCases.map((u) => (u.id === action.payload.id ? action.payload : u))
          : [...state.useCases, action.payload];
      return { ...state, useCases };
    }
    case "USE_CASE_DELETE":
      return { ...state, useCases: state.useCases.filter((u) => u.id !== action.payload.id) };
    case "PRICING_MATRIX_UPSERT": {
      const idx = state.pricingMatrix.findIndex((r) => r.id === action.payload.id);
      const pricingMatrix =
        idx >= 0
          ? state.pricingMatrix.map((r) => (r.id === action.payload.id ? action.payload : r))
          : [...state.pricingMatrix, action.payload];
      return { ...state, pricingMatrix };
    }
    case "PRICING_MATRIX_DELETE":
      return {
        ...state,
        pricingMatrix: state.pricingMatrix.filter((r) => r.id !== action.payload.id),
      };
    case "PRICING_FAQ_UPSERT": {
      const idx = state.pricingFaq.findIndex((f) => f.id === action.payload.id);
      const pricingFaq =
        idx >= 0
          ? state.pricingFaq.map((f) => (f.id === action.payload.id ? action.payload : f))
          : [...state.pricingFaq, action.payload];
      return { ...state, pricingFaq };
    }
    case "PRICING_FAQ_DELETE":
      return { ...state, pricingFaq: state.pricingFaq.filter((f) => f.id !== action.payload.id) };
    case "LANDING_UPSERT":
    case "LANDING_DELETE": {
      const next = landingReducer({ landingSections: state.landingSections }, action);
      return { ...state, landingSections: next.landingSections };
    }

    default:
      return state;
  }
}
