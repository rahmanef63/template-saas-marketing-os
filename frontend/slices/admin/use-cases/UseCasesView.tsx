"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { FIELDS, useUseCasesController } from "./UseCaseEditorView";
import type {
  ColumnDef,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { UseCaseItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Use case",
  labelPlural: "Use cases",
  publicHref: () => `${PUBLIC_BASE}/features`,
};

const COLUMNS: ColumnDef<UseCaseItem>[] = [
  { key: "industry", header: "Industry", width: "w-[24%]" },
  { key: "problem", header: "Problem", width: "w-[38%]", hideOnMobile: true },
  { key: "outcome", header: "Outcome", width: "w-[38%]", hideOnMobile: true },
];

export function UseCasesView() {
  const controller = useUseCasesController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/use-cases/${id}`}
      description="rendered on the public Features page"
    />
  );
}
