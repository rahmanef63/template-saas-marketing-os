"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { FIELDS, usePricingMatrixController } from "./PricingMatrixEditorView";
import type {
  ColumnDef,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { PricingMatrixRow } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Comparison row",
  labelPlural: "Pricing matrix",
  publicHref: () => `${PUBLIC_BASE}/pricing`,
};

const COLUMNS: ColumnDef<PricingMatrixRow>[] = [
  { key: "category", header: "Category", width: "w-[18%]", badge: "outline" },
  { key: "label", header: "Feature", width: "w-[34%]" },
  { key: "free", header: "Free", width: "w-[16%]", mono: true, hideOnMobile: true },
  { key: "team", header: "Team", width: "w-[16%]", mono: true, hideOnMobile: true },
  { key: "scale", header: "Scale", width: "w-[16%]", mono: true, hideOnMobile: true },
];

export function PricingMatrixView() {
  const controller = usePricingMatrixController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/pricing-matrix/${id}`}
      description="rendered on the public Pricing page comparison table"
    />
  );
}
