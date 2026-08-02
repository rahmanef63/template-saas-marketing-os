"use client";

import * as React from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { IS_DEMO } from "@/lib/stage";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { pagesReducer } from "@/features/_shared/pages/reducer";
import type { LandingSection } from "@/features/_shared/landing/types";
import { reducer } from "./reducer";
import { saveDemoState, broadcastAction, openDemoChannel } from "@/lib/demo-store";
import type { Action, State } from "./types";

// DEMO dispatch: every action runs through the same pure `reducer`, the next
// State is persisted to localStorage, and the action is broadcast so the
// sibling iframe (public<->admin) re-renders live. Mounted only when
// NEXT_PUBLIC_DEMO=1 (see store.tsx DemoProvider); replaces the Convex mutation
// path for the demo. Real clones never call this — they use useConvexDispatch.
export function useDemoDispatch(
  setState: React.Dispatch<React.SetStateAction<State>>,
): (a: Action) => void {
  // One channel per provider instance; closed on unmount.
  const channelRef = React.useRef<BroadcastChannel | null>(null);
  React.useEffect(() => {
    channelRef.current = openDemoChannel();
    return () => channelRef.current?.close();
  }, []);

  return React.useCallback(
    (action: Action) => {
      setState((s) => {
        const next = reducer(s, action);
        saveDemoState(next);
        return next;
      });
      broadcastAction(channelRef.current, action);
    },
    [setState],
  );
}

// Dispatch wiring, split out of store.tsx (move-only): routes each
// reducer-style action to the matching Convex mutation. `id` is passed to
// upsert only when it's a known Convex id (existing row); a fresh synthetic
// id -> insert.

export function useConvexDispatch(state: State): (a: Action) => void {
  const mPricingUpsert = useMutation(api.pricing.upsert);
  const mPricingRemove = useMutation(api.pricing.remove);
  const mFeatureUpsert = useMutation(api.features.upsert);
  const mFeatureRemove = useMutation(api.features.remove);
  const mPostUpsert = useMutation(api.posts.upsert);
  const mPostRemove = useMutation(api.posts.remove);
  const mChangelogUpsert = useMutation(api.changelog.upsert);
  const mChangelogRemove = useMutation(api.changelog.remove);
  const mCustomerUpsert = useMutation(api.customers.upsert);
  const mCustomerRemove = useMutation(api.customers.remove);
  const mSubUpsert = useMutation(api.subscriptions.upsert);
  const mSubRemove = useMutation(api.subscriptions.remove);
  const mLeadUpsert = useMutation(api.leads.upsert);
  const mLeadRemove = useMutation(api.leads.remove);
  const mIntegrationUpsert = useMutation(api.integrations.upsert);
  const mIntegrationRemove = useMutation(api.integrations.remove);
  const mPageUpsert = useMutation(api.pages.upsert);
  const mPageRemove = useMutation(api.pages.remove);
  const mLandingUpsert = useMutation(api.landing.upsert);
  const mLandingRemove = useMutation(api.landing.remove);
  const mFeatureMatrixUpsert = useMutation(api.featureMatrix.upsert);
  const mFeatureMatrixRemove = useMutation(api.featureMatrix.remove);
  const mUseCaseUpsert = useMutation(api.useCases.upsert);
  const mUseCaseRemove = useMutation(api.useCases.remove);
  const mPricingMatrixUpsert = useMutation(api.pricingMatrix.upsert);
  const mPricingMatrixRemove = useMutation(api.pricingMatrix.remove);
  const mPricingFaqUpsert = useMutation(api.pricingFaq.upsert);
  const mPricingFaqRemove = useMutation(api.pricingFaq.remove);

  const knownIds = React.useMemo(
    () => ({
      pricing: new Set(state.pricing.map((p) => p.id)),
      features: new Set(state.features.map((f) => f.id)),
      posts: new Set(state.posts.map((p) => p.id)),
      changelog: new Set(state.changelog.map((c) => c.id)),
      customers: new Set(state.customers.map((c) => c.id)),
      subscriptions: new Set(state.subscriptions.map((s) => s.id)),
      leads: new Set(state.leads.map((l) => l.id)),
      integrations: new Set(state.integrations.map((i) => i.id)),
      featureMatrix: new Set(state.featureMatrix.map((i) => i.id)),
      useCases: new Set(state.useCases.map((i) => i.id)),
      pricingMatrix: new Set(state.pricingMatrix.map((i) => i.id)),
      pricingFaq: new Set(state.pricingFaq.map((i) => i.id)),
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
      // Demo isolation: public-demo visitors share one Convex DB, so block
      // ALL business writes (reads/useQuery stay live on seeded content).
      // Pure no-op when NEXT_PUBLIC_DEMO !== "1" — real clones + owner keep CRUD.
      if (IS_DEMO) {
        toast.info("Mode demo — clone template untuk menyimpan perubahan");
        return;
      }
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      switch (action.type) {
        case "PRICING_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.pricing.has(id)
            ? mPricingUpsert({ id: id as Id<"saasPricing">, ...d })
            : mPricingUpsert(d)
          ).catch(fail);
          break;
        }
        case "PRICING_DELETE":
          void mPricingRemove({ id: action.payload.id as Id<"saasPricing"> }).catch(fail);
          break;

        case "FEATURE_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.features.has(id)
            ? mFeatureUpsert({ id: id as Id<"saasFeatures">, ...d })
            : mFeatureUpsert(d)
          ).catch(fail);
          break;
        }
        case "FEATURE_DELETE":
          void mFeatureRemove({ id: action.payload.id as Id<"saasFeatures"> }).catch(fail);
          break;

        case "POST_CREATE": {
          const { id, ...d } = action.payload;
          void mPostUpsert(d).catch(fail);
          break;
        }
        case "POST_UPDATE": {
          const { id, patch } = action.payload;
          const current = state.posts.find((p) => p.id === id);
          if (!current) break;
          const { id: _id, ...merged } = { ...current, ...patch };
          void mPostUpsert({ id: id as Id<"saasPosts">, ...merged }).catch(fail);
          break;
        }
        case "POST_DELETE":
          void mPostRemove({ id: action.payload.id as Id<"saasPosts"> }).catch(fail);
          break;

        case "CHANGELOG_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.changelog.has(id)
            ? mChangelogUpsert({ id: id as Id<"saasChangelog">, ...d })
            : mChangelogUpsert(d)
          ).catch(fail);
          break;
        }
        case "CHANGELOG_DELETE":
          void mChangelogRemove({ id: action.payload.id as Id<"saasChangelog"> }).catch(fail);
          break;

        case "CUSTOMER_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.customers.has(id)
            ? mCustomerUpsert({ id: id as Id<"saasCustomers">, ...d })
            : mCustomerUpsert(d)
          ).catch(fail);
          break;
        }
        case "CUSTOMER_DELETE":
          void mCustomerRemove({ id: action.payload.id as Id<"saasCustomers"> }).catch(fail);
          break;

        case "SUBSCRIPTION_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.subscriptions.has(id)
            ? mSubUpsert({ id: id as Id<"saasSubscriptions">, ...d })
            : mSubUpsert(d)
          ).catch(fail);
          break;
        }
        case "SUBSCRIPTION_DELETE":
          void mSubRemove({ id: action.payload.id as Id<"saasSubscriptions"> }).catch(fail);
          break;

        case "LEAD_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.leads.has(id)
            ? mLeadUpsert({ id: id as Id<"saasLeads">, ...d })
            : mLeadUpsert(d)
          ).catch(fail);
          break;
        }
        case "LEAD_DELETE":
          void mLeadRemove({ id: action.payload.id as Id<"saasLeads"> }).catch(fail);
          break;

        case "INTEGRATION_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.integrations.has(id)
            ? mIntegrationUpsert({ id: id as Id<"saasIntegrations">, ...d })
            : mIntegrationUpsert(d)
          ).catch(fail);
          break;
        }
        case "INTEGRATION_DELETE":
          void mIntegrationRemove({ id: action.payload.id as Id<"saasIntegrations"> }).catch(fail);
          break;

        case "PAGE_DELETE":
          void mPageRemove({ entryId: action.payload.id }).catch(fail);
          break;
        case "PAGE_CREATE":
        case "PAGE_UPDATE":
        case "PAGE_REORDER_BLOCK":
        case "PAGE_SECTION_UPSERT":
        case "PAGE_SECTION_DELETE": {
          const next = pagesReducer({ pages: state.pages }, action);
          const pid =
            (action.payload as { id?: string; pageId?: string }).id ??
            (action.payload as { pageId?: string }).pageId;
          const entry = next.pages.find((p) => p.id === pid);
          if (entry) void mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
          break;
        }

        case "FEATURE_MATRIX_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.featureMatrix.has(id)
            ? mFeatureMatrixUpsert({ id: id as Id<"saasFeatureMatrix">, ...d })
            : mFeatureMatrixUpsert(d)
          ).catch(fail);
          break;
        }
        case "FEATURE_MATRIX_DELETE":
          void mFeatureMatrixRemove({ id: action.payload.id as Id<"saasFeatureMatrix"> }).catch(fail);
          break;

        case "USE_CASE_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.useCases.has(id)
            ? mUseCaseUpsert({ id: id as Id<"saasUseCases">, ...d })
            : mUseCaseUpsert(d)
          ).catch(fail);
          break;
        }
        case "USE_CASE_DELETE":
          void mUseCaseRemove({ id: action.payload.id as Id<"saasUseCases"> }).catch(fail);
          break;

        case "PRICING_MATRIX_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.pricingMatrix.has(id)
            ? mPricingMatrixUpsert({ id: id as Id<"saasPricingMatrix">, ...d })
            : mPricingMatrixUpsert(d)
          ).catch(fail);
          break;
        }
        case "PRICING_MATRIX_DELETE":
          void mPricingMatrixRemove({ id: action.payload.id as Id<"saasPricingMatrix"> }).catch(fail);
          break;

        case "PRICING_FAQ_UPSERT": {
          const { id, ...d } = action.payload;
          void (knownIds.pricingFaq.has(id)
            ? mPricingFaqUpsert({ id: id as Id<"saasPricingFaq">, ...d })
            : mPricingFaqUpsert(d)
          ).catch(fail);
          break;
        }
        case "PRICING_FAQ_DELETE":
          void mPricingFaqRemove({ id: action.payload.id as Id<"saasPricingFaq"> }).catch(fail);
          break;

        case "LANDING_UPSERT": {
          const s = action.payload as LandingSection;
          void mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
          break;
        }
        case "LANDING_DELETE":
          void mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
          break;

        case "hydrate":
        case "reset":
          // Convex is the source of truth — no-op.
          break;
      }
    },
    [knownIds, state.posts, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
