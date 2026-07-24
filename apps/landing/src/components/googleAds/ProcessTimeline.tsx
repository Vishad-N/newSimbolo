"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { GoogleAdsProcessStep } from "@/types/googleAds";

type ProcessTimelineProps = {
  steps: GoogleAdsProcessStep[];
};

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <SectionCard className="p-4">
      <h2 className="text-[1.08rem] font-black text-white">Our Google Ads Process</h2>
      <div className="relative mt-7 grid gap-6 md:grid-cols-5">
        <div className="absolute left-8 right-8 top-6 hidden h-px bg-[var(--primary)]/50 md:block" />
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.42 }} className="relative text-center">
              <div className="mx-auto grid h-13 w-13 place-items-center rounded-full border border-[var(--accent)]/55 bg-[var(--card)] text-[var(--accent)] shadow-[0_0_22px_var(--accent-glow)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[0.78rem] font-black text-white">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[135px] text-[0.66rem] leading-4 text-white/62">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
