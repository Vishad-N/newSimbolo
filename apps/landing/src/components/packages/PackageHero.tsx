"use client";

import Image from "next/image";
import { BarChart3, Boxes, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { BillingCycle } from "@/types/packages";
import { PricingToggle } from "@/components/packages/PricingToggle";

type PackageHeroProps = {
  billing: BillingCycle;
  onBillingChange: (value: BillingCycle) => void;
};

export function PackageHero({ billing, onBillingChange }: PackageHeroProps) {
  return (
    <section className="relative min-h-[260px] overflow-hidden px-5 pt-4 text-center sm:px-8 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10 mx-auto max-w-[760px]">
        <div className="mx-auto inline-flex h-8 items-center gap-2 rounded-full border border-white/12 bg-[#0B1120] px-4 text-[0.76rem] font-extrabold uppercase text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Boxes className="h-4 w-4" />
          Packages & Pricing
        </div>

        <h1 className="mx-auto mt-4 max-w-[720px] text-balance text-[2.1rem] font-heading font-bold tracking-tight text-[var(--text-primary)] sm:text-[3rem] lg:text-[3.35rem]">
          Choose the perfect package
          <span className="mt-3 block mx-auto w-fit rounded-[20px] bg-[#0B1120] px-6 py-1.5 text-[var(--primary)] shadow-[0_0_30px_rgba(185,255,0,0.2)]">to grow your business</span>
        </h1>
        <p className="mt-4 text-[1rem] font-medium text-white/88">Transparent pricing. No hidden fees. Cancel anytime.</p>
        <PricingToggle value={billing} onChange={onBillingChange} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute left-6 top-10 hidden h-[210px] w-[260px] xl:block"
      >
        <div className="absolute left-8 top-16 grid h-[62px] w-[78px] place-items-center rounded-[10px] border border-[var(--primary)]/18 bg-[var(--card)]/78 shadow-[0_16px_42px_rgba(0,0,0,0.22)]">
          <div className="h-8 w-16 rounded-full border-[8px] border-[var(--primary)]/60" />
        </div>
        <Sparkles className="absolute left-2 top-6 h-6 w-6 text-[var(--primary)]" />
        <Sparkles className="absolute right-8 top-32 h-5 w-5 text-[var(--primary)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute right-6 top-2 hidden h-[210px] w-[330px] xl:block"
      >
        <div className="mascot-float absolute left-12 top-4 h-[154px] w-[154px]">
          <Image src="/assets/logo1.png" alt="The Simbolo mascot" fill sizes="154px" className="object-contain drop-shadow-[0_0_28px_rgba(45,212,191,0.45)]" priority />
        </div>
        <div className="absolute right-3 top-40 grid h-[62px] w-[78px] place-items-center rounded-[10px] border border-[#0DE2BC]/18 bg-[var(--card)]/78 shadow-[0_16px_42px_rgba(0,0,0,0.22)]">
          <div className="h-9 w-9 rounded-full border-[9px] border-[#24A8FF] border-b-[#EF4444] border-r-[#7C3AED]" />
        </div>
        <div className="absolute right-8 top-[46px] h-[86px] w-[96px] rounded-[9px] border border-[#0DE2BC]/22 bg-[var(--card)]/72 p-4 text-[#0DE2BC] shadow-[0_16px_42px_rgba(0,0,0,0.24)]">
          <BarChart3 className="h-12 w-12" />
        </div>
        <Sparkles className="absolute left-4 top-26 h-7 w-7 text-[#0DE2BC]" />
        <Sparkles className="absolute right-0 top-14 h-4 w-4 text-[#0DE2BC]" />
      </motion.div>
    </section>
  );
}
