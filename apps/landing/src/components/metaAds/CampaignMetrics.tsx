"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";

const kpis = [
  { label: "Amount Spent", value: "₹1,25,000", change: "+22.5%" },
  { label: "Purchases", value: "1,248", change: "+31.6%" },
  { label: "ROAS", value: "4.65x", change: "+38.7%" },
];

export function CampaignMetrics() {
  return (
    <SectionCard className="overflow-hidden p-5 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[1rem] font-black text-white">Campaign Performance</h2>
        <button className="flex h-8 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.72rem] font-semibold text-white/78">
          Last 30 Days
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-[8px] border border-white/8 bg-[var(--background)]/34 p-3">
            <div className="text-[0.7rem] text-white/58">{kpi.label}</div>
            <div className="mt-1 text-[1rem] font-black text-white">{kpi.value}</div>
            <div className="mt-1 text-[0.7rem] font-bold text-[var(--secondary)]">↑ {kpi.change}</div>
          </div>
        ))}
      </div>
      <div className="relative mt-5 h-[138px]">
        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[0.68rem] text-white/58">
          <span>8K</span>
          <span>6K</span>
          <span>4K</span>
          <span>2K</span>
          <span>0</span>
        </div>
        <div className="absolute inset-y-2 left-9 right-0">
          <div className="absolute inset-x-0 top-0 h-px bg-white/6" />
          <div className="absolute inset-x-0 top-1/4 h-px bg-white/6" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/6" />
          <div className="absolute inset-x-0 top-3/4 h-px bg-white/6" />
          <motion.div initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.2, ease: "easeOut" }} className="absolute inset-0 text-[var(--accent)]">
            <div className="absolute bottom-0 left-0 h-full w-full bg-linear-to-t from-[var(--accent)]/34 to-transparent [clip-path:polygon(0_88%,6%_72%,13%_68%,19%_42%,25%_48%,31%_35%,38%_39%,44%_20%,50%_36%,56%_33%,62%_39%,69%_31%,76%_14%,83%_27%,90%_34%,96%_16%,100%_2%,100%_100%,0_100%)]" />
            <svg viewBox="0 0 430 130" className="relative h-full w-full overflow-visible">
              <path d="M0 114 C24 92 36 94 52 75 C74 48 92 58 110 41 C130 22 148 52 168 36 C190 17 206 45 230 40 C254 36 268 54 292 44 C318 32 326 4 352 24 C378 46 392 55 410 30 C420 17 425 8 430 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
        <div className="absolute bottom-[-4px] left-9 right-0 flex justify-between text-[0.67rem] text-white/55">
          <span>May 1</span>
          <span>May 8</span>
          <span>May 15</span>
          <span>May 22</span>
          <span>May 29</span>
        </div>
      </div>
    </SectionCard>
  );
}
