"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { FIELDS, useFeatureMatrixController } from "./FeatureMatrixEditorView";
import type {
  ColumnDef,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { FeatureMatrixItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Feature row",
  labelPlural: "Feature matrix",
  publicHref: () => `${PUBLIC_BASE}/features`,
};

const COLUMNS: ColumnDef<FeatureMatrixItem>[] = [
  { key: "category", header: "Category", width: "w-[20%]", badge: "outline" },
  { key: "title", header: "Title", width: "w-[26%]" },
  { key: "body", header: "Body", width: "w-[38%]", hideOnMobile: true },
  { key: "plan", header: "Plan", width: "w-[10%]", badge: "secondary" },
];

export function FeatureMatrixView() {
  const controller = useFeatureMatrixController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/feature-matrix/${id}`}
      description="rendered on the public Features page lower fold"
    />
  );
}
