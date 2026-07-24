"use client";

import { Headphones, RefreshCcw, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { BenefitItem } from "@/types/packages";
import { cn } from "@/lib/utils";

type BenefitsSectionProps = {
  items: BenefitItem[];
};

const iconMap = {
  shield: ShieldCheck,
  headphones: Headphones,
  refresh: RefreshCcw,
};

export function BenefitsSection({ items }: BenefitsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-4 grid overflow-hidden rounded-[10px] border border-white/10 bg-[var(--card)]/78 shadow-[0_18px_42px_rgba(0,0,0,0.24)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, index) => {
        const Icon = iconMap[item.icon];

        return (
          <div key={item.id} className={cn("flex items-center gap-4 px-8 py-5", index > 0 && "border-t border-white/10 md:border-l md:border-t-0")}>
            <div
              className={cn(
                "grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full border",
                item.themeColor === "lime"
                  ? "border-[var(--primary)]/25 bg-[var(--primary)]/13 text-[var(--primary)] shadow-[0_0_28px_rgba(185,255,0,0.14)]"
                  : "border-[#0DE2BC]/25 bg-[#0DE2BC]/13 text-[#12EAC6] shadow-[0_0_28px_rgba(13,226,188,0.14)]",
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-[0.92rem] font-extrabold text-[var(--primary)]">{item.title}</h3>
              <p className="mt-1 max-w-[230px] text-[0.88rem] leading-[1.35] text-white/78">{item.description}</p>
            </div>
          </div>
        );
      })}
    </motion.section>
  );
}
