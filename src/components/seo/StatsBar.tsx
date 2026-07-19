"use client";

import { motion } from "framer-motion";
import { MetricCard } from "@/components/seo/MetricCard";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SeoMetric } from "@/types/seo";

type StatsBarProps = {
  metrics: SeoMetric[];
};

export function StatsBar({ metrics }: StatsBarProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.55 }}>
      <SectionCard className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </SectionCard>
    </motion.section>
  );
}
