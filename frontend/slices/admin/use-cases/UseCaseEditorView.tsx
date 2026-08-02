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
import type { UseCaseItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Use case",
  labelPlural: "Use cases",
  publicHref: () => `${PUBLIC_BASE}/features`,
};

export const FIELDS: FieldDef<UseCaseItem>[] = [
  { kind: "text", key: "industry", label: "Industry" },
  { kind: "textarea", key: "problem", label: "Problem", rows: 2 },
  { kind: "textarea", key: "solution", label: "Solution", rows: 2 },
  { kind: "textarea", key: "outcome", label: "Outcome", rows: 2 },
  { kind: "number", key: "order", label: "Order", min: 0 },
];

export function useUseCasesController(): CrudController<UseCaseItem> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.useCases,
      getId: (u) => u.id,
      blank: () => ({
        id: `uc-${Math.random().toString(36).slice(2, 10)}`,
        industry: "New industry",
        problem: "",
        solution: "",
        outcome: "",
        order: state.useCases.length,
      }),
      create: (u) => dispatch({ type: "USE_CASE_UPSERT", payload: u }),
      update: (id, patch) =>
        dispatch({
          type: "USE_CASE_UPSERT",
          payload: { ...state.useCases.find((x) => x.id === id)!, ...patch, id },
        }),
      remove: (id) => dispatch({ type: "USE_CASE_DELETE", payload: { id } }),
    }),
    [state.useCases, dispatch],
  );
}

export function UseCaseEditorView({ id }: { id: string }) {
  const controller = useUseCasesController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/use-cases`}
    />
  );
}
