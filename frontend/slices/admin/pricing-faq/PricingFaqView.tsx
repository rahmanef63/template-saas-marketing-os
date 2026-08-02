"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { FIELDS, usePricingFaqController } from "./PricingFaqEditorView";
import type {
  ColumnDef,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { PricingFaqItem } from "@/features/_app/types";

const META: EntityMeta = {
  label: "FAQ entry",
  labelPlural: "Pricing FAQ",
  publicHref: () => `${PUBLIC_BASE}/pricing`,
};

const COLUMNS: ColumnDef<PricingFaqItem>[] = [
  { key: "q", header: "Question", width: "w-[40%]" },
  { key: "a", header: "Answer", width: "w-[60%]", hideOnMobile: true },
];

export function PricingFaqView() {
  const controller = usePricingFaqController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/pricing-faq/${id}`}
      description="rendered on the public Pricing page FAQ accordion"
    />
  );
}
