"use client";

import { motion } from "framer-motion";
import type { SharedStat } from "@/types/shared";

type StatsBarProps = {
  stats: SharedStat[];
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="py-2 xl:py-4">
      <div className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-5 xl:gap-0">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isLast = index === stats.length - 1;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.42 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connecting Line (Desktop) */}
              {!isLast && (
                <div className="hidden xl:block absolute top-6 -translate-y-1/2 left-[50%] w-full border-t-2 border-dashed border-white/15 z-0" />
              )}
              
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--accent)]/35 bg-[var(--background)] text-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-[#ffffff]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5">
                <h3 className="text-[0.92rem] font-semibold text-white">{stat.title}</h3>
                <p className="mt-1.5 text-[0.76rem] leading-4 text-white/64 px-2">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
