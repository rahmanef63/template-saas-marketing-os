"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type {
  CrudController,
  EntityMeta,
  FieldDef,
} from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { PricingFaqItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "FAQ entry",
  labelPlural: "Pricing FAQ",
  publicHref: () => `${PUBLIC_BASE}/pricing`,
};

export const FIELDS: FieldDef<PricingFaqItem>[] = [
  { kind: "text", key: "q", label: "Question" },
  { kind: "textarea", key: "a", label: "Answer", rows: 4 },
  { kind: "number", key: "order", label: "Order", min: 0 },
];

export function usePricingFaqController(): CrudController<PricingFaqItem> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.pricingFaq,
      getId: (f) => f.id,
      blank: () => ({
        id: `pf-${Math.random().toString(36).slice(2, 10)}`,
        q: "New question?",
        a: "",
        order: state.pricingFaq.length,
      }),
      create: (f) => dispatch({ type: "PRICING_FAQ_UPSERT", payload: f }),
      update: (id, patch) =>
        dispatch({
          type: "PRICING_FAQ_UPSERT",
          payload: { ...state.pricingFaq.find((x) => x.id === id)!, ...patch, id },
        }),
      remove: (id) => dispatch({ type: "PRICING_FAQ_DELETE", payload: { id } }),
    }),
    [state.pricingFaq, dispatch],
  );
}

export function PricingFaqEditorView({ id }: { id: string }) {
  const controller = usePricingFaqController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/pricing-faq`}
    />
  );
}
