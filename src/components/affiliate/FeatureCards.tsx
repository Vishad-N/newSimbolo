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
      <h2 className="mb-6 text-[1.15rem] font-black text-white">Why Become a Simbolo Affiliate?</h2>
      <div className="grid gap-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start gap-4"
            >
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[var(--primary)]/30 bg-[var(--primary-glow)] text-[var(--primary-light)]">
                <Icon className="h-4 w-4" />
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
