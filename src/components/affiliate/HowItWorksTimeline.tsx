"use client";
import React from "react";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
};

type HowItWorksTimelineProps = {
  steps: Step[];
};

export function HowItWorksTimeline({ steps }: HowItWorksTimelineProps) {
  return (
    <SectionCard className="p-6 md:p-8">
      <h2 className="mb-8 text-[1.15rem] font-black text-white">How Our Affiliate Program Works</h2>
      <div className="relative">
        <div className="absolute left-0 top-8 h-[1px] w-full border-t border-dashed border-white/20 hidden md:block" />
        <div className="grid gap-8 md:grid-cols-5 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-[var(--primary)] bg-[#0d1400] text-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]">
                  <Icon className="h-6 w-6" />
                  <div className="absolute -bottom-3 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--primary)] bg-black text-[0.7rem] font-black text-white">
                    {step.id}
                  </div>
                </div>
                <h3 className="mt-8 text-[0.95rem] font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[0.75rem] leading-snug text-white/60">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
