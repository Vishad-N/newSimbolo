"use client";

import { Check, Target } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import type { SeoApproachStep } from "@/types/seo";

type SeoApproachProps = {
  steps: SeoApproachStep[];
};

export function SeoApproach({ steps }: SeoApproachProps) {
  return (
    <SectionCard className="h-full overflow-hidden p-5">
      <h2 className="text-[1.25rem] font-black text-white">Our SEO Approach</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_190px] lg:grid-cols-1 xl:grid-cols-[1fr_190px]">
        <div className="relative space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + index * 0.08, duration: 0.42 }}
              className="relative flex gap-4"
            >
              {index !== steps.length - 1 && (
                <div className="absolute bottom-[-16px] left-4 top-8 w-px bg-[var(--primary)]/45" />
              )}
              <div className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--background)] shadow-[0_0_20px_var(--accent-glow)]">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[0.92rem] font-extrabold text-white">{step.title}</h3>
                <p className="mt-0.5 text-[0.75rem] leading-4 text-white/72">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="relative mx-auto grid h-[190px] w-[190px] place-items-center">
          <div className="absolute inset-0 rounded-full border border-[var(--secondary)]/25 bg-[var(--secondary)]/5 shadow-[0_0_42px_rgba(45,212,191,0.18)]" />
          <div className="absolute h-[140px] w-[140px] rounded-full border-[18px] border-[var(--secondary)]/45" />
          <div className="absolute h-[86px] w-[86px] rounded-full border-[17px] border-[var(--accent)]/65" />
          <Target className="relative h-[95px] w-[95px] text-[var(--accent)] drop-shadow-[0_0_18px_var(--accent-glow)]" />
        </motion.div>
      </div>
    </SectionCard>
  );
}
