"use client";

import { Check, Minus } from "lucide-react";
import type { MarketingPackage } from "@/types/packages";

type PackageComparisonTableProps = {
  packages: MarketingPackage[];
};

export function PackageComparisonTable({ packages }: PackageComparisonTableProps) {
  if (!packages || packages.length === 0) return null;

  // Extract all unique features across all packages to build the rows
  const allFeatures = Array.from(new Set(packages.flatMap(p => p.features)));

  return (
    <div className="mt-24">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-[2rem] font-black text-white sm:text-[2.5rem]">Compare Packages</h2>
        <p className="mt-3 text-[1rem] text-white/60">Detailed breakdown of what's included in every tier.</p>
      </div>

      <div className="relative overflow-x-auto rounded-[16px] border border-white/10 bg-[var(--surface)] shadow-2xl custom-scrollbar">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="sticky left-0 z-10 w-1/4 bg-[var(--surface)] p-6 align-bottom border-r border-white/5">
                <span className="font-heading text-[1.1rem] font-bold text-white">Features</span>
              </th>
              {packages.map((pkg) => (
                <th key={pkg.id} className="p-6 text-center">
                  <div className="mb-2 font-heading text-[1.2rem] font-bold text-white">{pkg.name}</div>
                  <div className="text-[0.8rem] font-medium text-[var(--accent)]">{pkg.subtitle}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {allFeatures.map((feature, idx) => (
              <tr key={idx} className="transition-colors hover:bg-white/[0.02]">
                <td className="sticky left-0 z-10 bg-[var(--surface)] p-5 text-[0.9rem] font-medium text-white/80 border-r border-white/5">
                  {feature.replace("Everything in ", "Includes ")}
                </td>
                {packages.map((pkg) => {
                  // Simplified comparison: normally you'd want structured feature data (boolean vs string)
                  // But we are working with an array of strings. If the exact string is there, it's checked.
                  // For "Everything in X" logic, we just do a simplistic check if the feature is in the package's array.
                  const hasFeature = pkg.features.includes(feature) || 
                    // Fallback logic if it's a tiered "Everything in X" system:
                    (pkg.displayOrder > 1 && packages.find(p => p.features.includes(feature))?.displayOrder! < pkg.displayOrder);

                  return (
                    <td key={`${pkg.id}-${idx}`} className="p-5 text-center">
                      {hasFeature ? (
                        <Check className="mx-auto h-5 w-5 text-[var(--accent)]" />
                      ) : (
                        <Minus className="mx-auto h-5 w-5 text-white/20" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
