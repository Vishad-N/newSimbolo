"use client";

import { motion } from "framer-motion";
import type { SeoService } from "@/types/seo";

type SeoServiceCardProps = {
  service: SeoService;
  index: number;
};

export function SeoServiceCard({ service, index }: SeoServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.48 }}
      whileHover={{ y: -7, scale: 1.015 }}
      className="group relative min-h-[165px] overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-[var(--primary)]/50"
    >
      <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-[var(--primary-glow)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative grid h-15 w-15 place-items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary-glow)] text-[var(--primary-light)] shadow-[0_0_30px_var(--primary-glow)]">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="relative mt-5 text-[0.98rem] font-extrabold text-white">{service.title}</h3>
      <p className="relative mt-2 text-[0.78rem] leading-5 text-white/74">{service.description}</p>
    </motion.article>
  );
}
