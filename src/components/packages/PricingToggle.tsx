"use client";

import { motion } from "framer-motion";
import type { BillingCycle } from "@/types/packages";
import { cn } from "@/lib/utils";

type PricingToggleProps = {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
};

const options: Array<{ value: BillingCycle; label: string }> = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly (Save 20%)" },
];

export function PricingToggle({ value, onChange }: PricingToggleProps) {
  return (
    <div className="mx-auto mt-7 grid h-11 w-full max-w-[330px] grid-cols-2 rounded-full border border-white/10 bg-[#080D18]/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_28px_rgba(0,0,0,0.22)]">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative isolate h-full rounded-full text-[0.9rem] font-semibold transition duration-300",
              selected ? "text-[#071005]" : "text-white/85 hover:text-white",
            )}
          >
            {selected && (
              <motion.span
                layoutId="pricing-toggle-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[#B9FF00] shadow-[0_0_24px_rgba(185,255,0,0.38)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
