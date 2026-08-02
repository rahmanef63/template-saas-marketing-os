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
import type { FeatureMatrixItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Feature row",
  labelPlural: "Feature matrix",
  publicHref: () => `${PUBLIC_BASE}/features`,
};

export const FIELDS: FieldDef<FeatureMatrixItem>[] = [
  { kind: "text", key: "category", label: "Category", hint: "Rows with the same category group together." },
  { kind: "text", key: "categoryIcon", label: "Category icon", hint: "Lucide name: Zap, Workflow, ShieldCheck, Plug.", mono: true },
  { kind: "text", key: "categoryBlurb", label: "Category blurb" },
  { kind: "text", key: "title", label: "Title" },
  { kind: "textarea", key: "body", label: "Body", rows: 2 },
  { kind: "text", key: "plan", label: "Available from", hint: "Free / Team / Scale — or leave blank." },
  { kind: "number", key: "order", label: "Order", min: 0 },
];

export function useFeatureMatrixController(): CrudController<FeatureMatrixItem> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.featureMatrix,
      getId: (f) => f.id,
      blank: () => ({
        id: `fm-${Math.random().toString(36).slice(2, 10)}`,
        category: "Core API",
        categoryIcon: "Zap",
        categoryBlurb: "",
        title: "New feature row",
        body: "",
        plan: "Free",
        order: state.featureMatrix.length,
      }),
      create: (f) => dispatch({ type: "FEATURE_MATRIX_UPSERT", payload: f }),
      update: (id, patch) =>
        dispatch({
          type: "FEATURE_MATRIX_UPSERT",
          payload: { ...state.featureMatrix.find((x) => x.id === id)!, ...patch, id },
        }),
      remove: (id) => dispatch({ type: "FEATURE_MATRIX_DELETE", payload: { id } }),
    }),
    [state.featureMatrix, dispatch],
  );
}

export function FeatureMatrixEditorView({ id }: { id: string }) {
  const controller = useFeatureMatrixController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/feature-matrix`}
    />
  );
}
