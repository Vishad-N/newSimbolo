"use client";

import { Check, X } from "lucide-react";
import { SectionCard } from "@/components/seo/SectionCard";

type ComparisonPoint = {
  id: string;
  feature: string;
  simbolo: string;
  typical: string;
};

type EcommerceComparisonProps = {
  points: ComparisonPoint[];
};

export function EcommerceComparison({ points }: EcommerceComparisonProps) {
  return (
    <SectionCard className="p-1 sm:p-2">
      <div className="overflow-hidden rounded-[8px] bg-[var(--surface)]">
        <div className="mb-4 flex flex-col items-center p-6 pb-2 text-center">
          <h2 className="text-[1.35rem] font-black text-white">Why Businesses Choose Simbolo</h2>
          <p className="mt-2 text-[0.9rem] text-white/70">
            We don't just build websites. We engineer high-performance sales machines.
          </p>
        </div>

        <div className="overflow-x-auto p-4 sm:p-6">
          <table className="w-full min-w-[600px] border-collapse text-left text-[0.88rem]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 font-bold text-white/60 w-1/3">Key Areas</th>
                <th className="p-4 font-bold text-[var(--accent)] w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/10">
                      <Check className="h-4 w-4 text-[var(--accent)]" />
                    </span>
                    The Simbolo Approach
                  </div>
                </th>
                <th className="p-4 font-bold text-white/50 w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                      <X className="h-4 w-4 text-white/40" />
                    </span>
                    Typical Agency
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {points.map((point) => (
                <tr key={point.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{point.feature}</td>
                  <td className="p-4 text-white/90 font-medium">{point.simbolo}</td>
                  <td className="p-4 text-white/50">{point.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
