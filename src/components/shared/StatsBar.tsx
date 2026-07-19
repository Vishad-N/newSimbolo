"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SharedStat } from "@/types/shared";

type StatsBarProps = {
  stats: SharedStat[];
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <SectionCard className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.42 }}
            className="flex items-center gap-4 border-white/10 px-5 py-4 xl:border-r last:xl:border-r-0"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--primary)]/35 bg-[var(--primary-glow)] text-[var(--primary-light)]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[0.88rem] font-black text-white">{stat.title}</h3>
              <p className="mt-1 text-[0.72rem] leading-4 text-white/64">{stat.description}</p>
            </div>
          </motion.div>
        );
      })}
    </SectionCard>
  );
}
