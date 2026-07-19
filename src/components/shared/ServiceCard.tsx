"use client";
import React from "react";

import { motion } from "framer-motion";

export type ServiceCardData = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  startingPrice: string;
};

type ServiceCardProps = {
  service: ServiceCardData;
  index: number;
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.48 }}
      whileHover={{ y: -7, scale: 1.015 }}
      className="group relative flex flex-col justify-between min-h-[220px] overflow-hidden rounded-[8px] border border-white/10 bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-[var(--primary)]/50"
    >
      <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-[var(--primary-glow)] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div>
        <div className="relative grid h-12 w-12 place-items-center rounded-lg border border-[var(--primary)]/30 bg-[var(--primary-glow)] text-[var(--primary-light)] shadow-[0_0_30px_var(--primary-glow)]">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="relative mt-5 text-[1rem] font-extrabold text-white">{service.title}</h3>
        <p className="relative mt-2 text-[0.8rem] leading-5 text-white/74">{service.description}</p>
      </div>
      <div className="relative mt-5 border-t border-white/10 pt-3">
        <div className="text-[0.7rem] font-semibold text-white/60">Starting at</div>
        <div className="text-[1.15rem] font-black text-white">₹{service.startingPrice}</div>
      </div>
    </motion.article>
  );
}
