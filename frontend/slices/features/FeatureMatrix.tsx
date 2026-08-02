"use client";

import * as React from "react";
import {
  Check,
  Plug,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Stagger } from "@/features/_shared/motion";
import { useFeatureMatrix } from "@/features/_app/store";
import type { FeatureMatrixItem } from "@/features/_app/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Workflow,
  ShieldCheck,
  Plug,
};

const PLAN_TONE: Record<string, "default" | "outline" | "secondary"> = {
  Free:  "outline",
  Team:  "default",
  Scale: "secondary",
};

type Group = {
  id: string;
  label: string;
  blurb: string;
  icon: string;
  items: FeatureMatrixItem[];
};

/** Group ordered matrix rows by their `category`, preserving first-seen order. */
function groupByCategory(rows: FeatureMatrixItem[]): Group[] {
  const groups: Group[] = [];
  const index = new Map<string, Group>();
  for (const r of rows) {
    let g = index.get(r.category);
    if (!g) {
      g = { id: r.category, label: r.category, blurb: r.categoryBlurb, icon: r.categoryIcon, items: [] };
      index.set(r.category, g);
      groups.push(g);
    }
    g.items.push(r);
  }
  return groups;
}

function CategoryBlock({ cat }: { cat: Group }) {
  const Icon = ICON_MAP[cat.icon] ?? Zap;
  return (
    <div className="mt-12 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-violet-500/25 to-indigo-500/25">
            <Icon className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{cat.label}</h2>
            <p className="text-sm text-muted-foreground">{cat.blurb}</p>
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {cat.items.length} features
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Stagger itemClassName="h-full">
        {cat.items.map((it) => (
          <Card
            key={it.id}
            className="h-full border-border/60 bg-card/40 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="flex items-start gap-3 p-4">
              <div className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                <Check className="size-3" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{it.title}</p>
                  {it.plan && (
                    <Badge
                      variant={PLAN_TONE[it.plan] ?? "outline"}
                      className="rounded-full text-[10px]"
                    >
                      {it.plan}+
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{it.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        </Stagger>
      </div>
    </div>
  );
}

/** CK-2C — full feature matrix grouped by category, sourced from the
 *  admin-editable saasFeatureMatrix table. Renders nothing when empty. */
export function FeatureMatrix() {
  const rows = useFeatureMatrix();
  const groups = React.useMemo(() => groupByCategory(rows), [rows]);
  if (groups.length === 0) return null;
  return (
    <section className="border-t border-border/60 bg-muted/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Full matrix
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Everything in the product, sliced by job
          </h2>
          <p className="mt-3 text-muted-foreground">
            Free covers most teams. Team unlocks workflow + SSO. Scale adds residency
            + signed agreements.
          </p>
        </div>
        {groups.map((cat) => (
          <CategoryBlock key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}
