"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { usePricingMatrix } from "@/features/_app/store";
import type { PricingMatrixRow } from "@/features/_app/types";

/** Render a cell: "true"/"false" → check/dash, anything else → literal text. */
function cell(v: string) {
  if (v === "true") return <Check className="mx-auto size-4 text-emerald-400" />;
  if (v === "false") return <Minus className="mx-auto size-4 text-muted-foreground/40" />;
  return <span className="text-xs tabular-nums">{v}</span>;
}

/** CK-2C — full plan comparison matrix, sourced from the admin-editable
 *  saasPricingMatrix table. Groups rows by category in first-seen order. */
export function PricingMatrix() {
  const rows = usePricingMatrix();
  const groups = React.useMemo(() => {
    const order: string[] = [];
    const byCat = new Map<string, PricingMatrixRow[]>();
    for (const r of rows) {
      if (!byCat.has(r.category)) {
        byCat.set(r.category, []);
        order.push(r.category);
      }
      byCat.get(r.category)!.push(r);
    }
    return order.map((c) => ({ category: c, rows: byCat.get(c)! }));
  }, [rows]);

  if (groups.length === 0) return null;

  return (
    <section className="border-t border-border/60 bg-muted/10">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Compare plans
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Everything that is and isn&rsquo;t included
          </h2>
        </div>
        <div className="mt-10 overflow-x-auto rounded-xl border border-border/60 bg-card/40">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-border/60 bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Feature
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider">
                  Free
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  Team
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider">
                  Scale
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <React.Fragment key={`grp-${g.category}`}>
                  <tr className="bg-muted/20">
                    <td colSpan={4} className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.category}
                    </td>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.id} className="border-t border-border/40">
                      <td className="px-4 py-2.5 text-sm">{r.label}</td>
                      <td className="px-4 py-2.5 text-center">{cell(r.free)}</td>
                      <td className="px-4 py-2.5 text-center font-medium">{cell(r.team)}</td>
                      <td className="px-4 py-2.5 text-center">{cell(r.scale)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
