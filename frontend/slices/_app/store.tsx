"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PagesProvider,
  type PagesStore,
} from "@/features/_shared/pages/pages-context";
import type { PageEntry } from "@/features/_shared/pages/types";
import {
  LandingProvider,
  type LandingStore,
} from "@/features/_shared/landing/landing-context";
import type { LandingSection } from "@/features/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import { StoreCtx, useStore, type Ctx } from "./store-context";
import { useConvexDispatch, useDemoDispatch } from "./store-dispatch";
import { reducer } from "./reducer";
import { SEED_STATE } from "./seed";
import { loadDemoState, openDemoChannel } from "@/lib/demo-store";
import { IS_DEMO } from "@/lib/stage";
import type {
  Action,
  AnalyticsKpi,
  BlogPost,
  ChangelogEntry,
  Customer,
  FeatureItem,
  FeatureMatrixItem,
  Integration,
  Lead,
  PricingFaqItem,
  PricingMatrixRow,
  PricingTier,
  State,
  Subscription,
  UseCaseItem,
} from "./types";

// Convex-backed store. Replaces the old createTemplateStore/localStorage
// reducer: `state` is assembled from live Convex queries; `dispatch` routes
// each reducer-style action to the matching Convex mutation (see
// store-dispatch.tsx). Consuming slices are UNCHANGED — they still call
// useStore()/useX()/dispatch(action) with the exact same action shapes the
// localStorage reducer accepted.
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh synthetic id -> insert.

const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map(({ _id, _creationTime: _ct, ...r }) => ({ ...r, id: _id })) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  if (IS_DEMO) return <DemoProvider>{children}</DemoProvider>;
  return <ConvexProvider>{children}</ConvexProvider>;
}

// DEMO-only provider: no Convex queries run (the demo store lives entirely in
// localStorage), state syncs across the public<->admin iframes via a
// BroadcastChannel. Mounted only when NEXT_PUBLIC_DEMO=1; tree-shaken/never
// reached in real clones (IS_DEMO is a build-time const false).
function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(() => loadDemoState(SEED_STATE));

  // Apply actions broadcast from the *other* iframe through the same reducer,
  // so a create/edit/delete in the admin frame re-renders the public frame.
  React.useEffect(() => {
    const ch = openDemoChannel();
    if (!ch) return;
    ch.onmessage = (e: MessageEvent<Action>) => setState((s) => reducer(s, e.data));
    return () => ch.close();
  }, []);

  const dispatch = useDemoDispatch(setState);

  const value = React.useMemo<Ctx>(
    // ponytail: ready=true immediately + progress=100 — the demo state is in
    // hand synchronously, no network load phase to report.
    () => ({ state, dispatch, ready: true, progress: 100 }),
    [state, dispatch],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function ConvexProvider({ children }: { children: React.ReactNode }) {
  const pricing = useQuery(api.pricing.list, {});
  const features = useQuery(api.features.list, {});
  const posts = useQuery(api.posts.list, {});
  const changelog = useQuery(api.changelog.list, {});
  const customers = useQuery(api.customers.list, {});
  const subscriptions = useQuery(api.subscriptions.list, {});
  const leads = useQuery(api.leads.list, {});
  const integrations = useQuery(api.integrations.list, {});
  const analytics = useQuery(api.analytics.list, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});
  const featureMatrix = useQuery(api.featureMatrix.list, {});
  const useCases = useQuery(api.useCases.list, {});
  const pricingMatrix = useQuery(api.pricingMatrix.list, {});
  const pricingFaq = useQuery(api.pricingFaq.list, {});

  const queries = [
    pricing, features, posts, changelog, customers, subscriptions,
    leads, integrations, analytics, pageRows, landingRows,
    featureMatrix, useCases, pricingMatrix, pricingFaq,
  ];
  const ready = queries.every((q) => q !== undefined);
  const progress = Math.round((queries.filter((q) => q !== undefined).length / queries.length) * 100);

  const changelogList = withId<ChangelogEntry>(changelog);

  const state = React.useMemo<State>(
    () => ({
      pricing: withId<PricingTier>(pricing),
      features: withId<FeatureItem>(features),
      posts: withId<BlogPost>(posts),
      changelog: changelogList,
      customers: withId<Customer>(customers),
      subscriptions: withId<Subscription>(subscriptions),
      leads: withId<Lead>(leads),
      changelogEntries: changelogList,
      integrations: withId<Integration>(integrations),
      analytics: withId<AnalyticsKpi>(analytics),
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
      featureMatrix: withId<FeatureMatrixItem>(featureMatrix),
      useCases: withId<UseCaseItem>(useCases),
      pricingMatrix: withId<PricingMatrixRow>(pricingMatrix),
      pricingFaq: withId<PricingFaqItem>(pricingFaq),
    }),
    [pricing, features, posts, changelogList, customers, subscriptions, leads, integrations, analytics, pageRows, landingRows, featureMatrix, useCases, pricingMatrix, pricingFaq],
  );

  const dispatch = useConvexDispatch(state);

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function PagesAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<PagesStore>(
    () => ({
      pages: state.pages,
      create: (entry: PageEntry) => dispatch({ type: "PAGE_CREATE", payload: entry }),
      update: (id, patch) => dispatch({ type: "PAGE_UPDATE", payload: { id, patch } }),
      remove: (id: string) => dispatch({ type: "PAGE_DELETE", payload: { id } }),
      reorderBlock: (id, from, to) =>
        dispatch({ type: "PAGE_REORDER_BLOCK", payload: { id, from, to } }),
      upsertSection: (pageId, section) =>
        dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) =>
        dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
    }),
    [state.pages, dispatch],
  );
  return <PagesProvider value={value}>{children}</PagesProvider>;
}

function LandingAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<LandingStore>(
    () => ({
      items: state.landingSections,
      publicBase: PUBLIC_BASE,
      adminBase: ADMIN_BASE,
      create: (section: LandingSection) =>
        dispatch({ type: "LANDING_UPSERT", payload: section }),
      update: (id, patch) => {
        const current = state.landingSections.find((s) => s.id === id);
        if (!current) return;
        dispatch({ type: "LANDING_UPSERT", payload: { ...current, ...patch, id } });
      },
      remove: (id: string) => dispatch({ type: "LANDING_DELETE", payload: { id } }),
    }),
    [state.landingSections, dispatch],
  );
  return <LandingProvider value={value}>{children}</LandingProvider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <PagesAdapter>
        <LandingAdapter>{children}</LandingAdapter>
      </PagesAdapter>
    </Provider>
  );
}

export { useStore };

export const usePricing = () => useStore().state.pricing;
export const useFeatures = () => useStore().state.features;
export const usePosts = () => useStore().state.posts;
export const usePost = (slug: string) =>
  usePosts().find((p) => p.slug === slug) ?? null;
export const useChangelog = () => useStore().state.changelog;
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;
export const useIntegrations = () => useStore().state.integrations;
export const useAnalytics = () => useStore().state.analytics;
export const useFeatureMatrix = () => useStore().state.featureMatrix;
export const useUseCases = () => useStore().state.useCases;
export const usePricingMatrix = () => useStore().state.pricingMatrix;
export const usePricingFaq = () => useStore().state.pricingFaq;

export { fmtDate, rel } from "@/features/_shared/utils";
