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
import type { PricingMatrixRow } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Comparison row",
  labelPlural: "Pricing matrix",
  publicHref: () => `${PUBLIC_BASE}/pricing`,
};

const VALUE_HINT = 'Use "true" or "false" for a check/dash, or any text (e.g. "10,000").';

export const FIELDS: FieldDef<PricingMatrixRow>[] = [
  {
    kind: "select",
    key: "category",
    label: "Category",
    options: [
      { value: "Limits", label: "Limits" },
      { value: "Workflow", label: "Workflow" },
      { value: "Admin", label: "Admin" },
      { value: "Support", label: "Support" },
    ],
  },
  { kind: "text", key: "label", label: "Feature label" },
  { kind: "text", key: "free", label: "Free", hint: VALUE_HINT },
  { kind: "text", key: "team", label: "Team", hint: VALUE_HINT },
  { kind: "text", key: "scale", label: "Scale", hint: VALUE_HINT },
  { kind: "number", key: "order", label: "Order", min: 0 },
];

export function usePricingMatrixController(): CrudController<PricingMatrixRow> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.pricingMatrix,
      getId: (r) => r.id,
      blank: () => ({
        id: `pm-${Math.random().toString(36).slice(2, 10)}`,
        category: "Limits",
        label: "New comparison row",
        free: "false",
        team: "true",
        scale: "true",
        order: state.pricingMatrix.length,
      }),
      create: (r) => dispatch({ type: "PRICING_MATRIX_UPSERT", payload: r }),
      update: (id, patch) =>
        dispatch({
          type: "PRICING_MATRIX_UPSERT",
          payload: { ...state.pricingMatrix.find((x) => x.id === id)!, ...patch, id },
        }),
      remove: (id) => dispatch({ type: "PRICING_MATRIX_DELETE", payload: { id } }),
    }),
    [state.pricingMatrix, dispatch],
  );
}

export function PricingMatrixEditorView({ id }: { id: string }) {
  const controller = usePricingMatrixController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/pricing-matrix`}
    />
  );
}
