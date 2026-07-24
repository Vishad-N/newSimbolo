"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SharedResult } from "@/types/shared";

type ResultsSectionProps = {
  title?: string;
  results: SharedResult[];
};

export function ResultsSection({ title = "Results That Matter", results }: ResultsSectionProps) {
  return (
    <SectionCard className="p-4 h-full">
      <h2 className="text-[1.08rem] font-semibold text-white">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {results.map((result, index) => {
          const Icon = result.icon;

          return (
            <motion.div key={result.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08, duration: 0.38 }} className="text-center">
              <div className="mx-auto grid h-13 w-13 place-items-center rounded-full bg-[var(--accent-glow)] text-[var(--accent)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-heading text-[1.45rem] font-bold leading-none text-white">{result.value}</div>
              <p className="mx-auto mt-2 max-w-[90px] text-[0.72rem] leading-4 text-white/68">{result.label}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
