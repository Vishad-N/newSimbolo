"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SeoService } from "@/types/seo";

type SeoServiceCardProps = {
  service: SeoService;
  index: number;
};

export function SeoServiceCard({ service, index }: SeoServiceCardProps) {
  const Icon = service.icon;
  const isBottom = index % 2 === 0;

  const cardContent = (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.48 }}
      whileHover={{ y: -7, scale: 1.015 }}
      className="group relative w-full min-h-[165px] overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-[var(--accent)]/3050 z-10"
    >
      <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-[var(--accent-glow)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative grid h-15 w-15 place-items-center rounded-full border border-[var(--accent)]/3050 bg-[var(--accent-glow)] text-[var(--accent)] shadow-[0_0_30px_var(--accent-glow)]">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="relative mt-5 text-[0.98rem] font-extrabold text-white">{service.title}</h3>
      <p className="relative mt-2 text-[0.78rem] leading-5 text-white/74">{service.description}</p>
    </motion.article>
  );

  return (
    <div className="flex flex-col h-full xl:min-h-[380px]">
      {/* Desktop Zigzag Layout (xl and up) */}
      <div className={cn("hidden xl:flex flex-1 flex-col items-center", isBottom ? "justify-end" : "justify-start")}>
        {isBottom && <div className="flex-1" />}
        {cardContent}
        <div className={cn("w-px bg-gradient-to-b from-[var(--accent)]/20 to-[var(--primary)]", isBottom ? "h-6 mt-3" : "flex-1 min-h-[40px] mt-3")} />
      </div>

      {/* Number (Desktop) */}
      <div className="hidden xl:flex justify-center shrink-0 pt-2 pb-1">
        <div className="grid h-8 w-8 place-items-center rounded-full border border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))] text-[0.8rem] font-black text-white shadow-[0_0_15px_var(--accent-glow)]">
          {index + 1}
        </div>
      </div>

      {/* Mobile / Tablet Normal Layout */}
      <div className="flex xl:hidden flex-col h-full">
         {cardContent}
      </div>
    </div>
  );
}
