"use client";
import React from "react";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

type FeatureCardsProps = {
  features: Feature[];
};

export function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <SectionCard className="p-6 md:p-8">
      <h2 className="mb-6 text-[1.15rem] font-black text-white text-center md:text-left">Why Become a Simbolo Affiliate?</h2>
      <div className="grid gap-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4"
            >
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[var(--accent)]/30 bg-[var(--accent-glow)] text-[var(--accent)] mx-auto sm:mx-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[0.95rem] font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-white/60">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
