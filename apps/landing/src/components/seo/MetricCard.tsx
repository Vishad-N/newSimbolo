"use client";

import { motion } from "framer-motion";
import type { SeoMetric } from "@/types/seo";

type MetricCardProps = {
  metric: SeoMetric;
  index: number;
};

export function MetricCard({ metric, index }: MetricCardProps) {
  const Icon = metric.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.07, duration: 0.45 }}
      className="flex min-w-0 flex-1 items-center justify-center gap-4 border-white/10 px-5 py-4 sm:justify-start lg:border-r last:lg:border-r-0"
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_26px_var(--accent-glow)]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[1.2rem] font-black leading-none text-white">{metric.value}</div>
        <div className="mt-1 text-[0.82rem] leading-tight text-white/75">{metric.label}</div>
      </div>
    </motion.div>
  );
}
