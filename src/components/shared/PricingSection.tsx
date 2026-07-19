"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/seo/SectionCard";
import { cn } from "@/lib/utils";
import type { BillingCycle, SharedPackage } from "@/types/shared";

type PricingSectionProps = {
  title?: string;
  packages: SharedPackage[];
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
};

function formatPrice(item: SharedPackage, billing: BillingCycle) {
  const price = billing === "monthly" ? item.priceMonthly : item.priceYearly;

  if (price === null) {
    return "Custom";
  }

  return new Intl.NumberFormat("en-IN", { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(price);
}

export function PricingSection({ title = "Packages", packages, billing, onBillingChange }: PricingSectionProps) {
  return (
    <SectionCard className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[1.12rem] font-black text-white">{title}</h2>
        <div className="grid h-9 w-full max-w-[250px] grid-cols-2 rounded-full border border-white/10 bg-[var(--background)]/55 p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((option) => (
            <button key={option} type="button" onClick={() => onBillingChange(option)} className={cn("relative rounded-full text-[0.74rem] font-bold capitalize transition", billing === option ? "text-white" : "text-white/68")}>
              {billing === option && <motion.span layoutId="shared-billing" className="absolute inset-0 -z-10 rounded-full bg-[var(--primary)] shadow-[0_0_20px_var(--primary-glow)]" />}
              {option === "yearly" ? "Yearly (Save 20%)" : "Monthly"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {packages.map((item, index) => {
          const price = formatPrice(item, billing);
          const suffix = billing === "monthly" ? "/month" : "/year";

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ y: -6 }}
              className={cn("relative flex min-h-[395px] flex-col rounded-[8px] border bg-[var(--background)]/34 p-4", item.isPopular ? "border-[var(--primary)] shadow-[0_0_30px_var(--primary-glow)]" : "border-white/10")}
            >
              {item.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-[0.68rem] font-black text-white">{item.badge}</div>}
              <h3 className="text-[1.25rem] font-black text-white">{item.name}</h3>
              <p className="mt-1 text-[0.72rem] font-semibold text-white/70">{item.audience}</p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-[1.75rem] font-black leading-none text-white">{price}</span>
                <span className="text-[0.76rem] text-white/70">{suffix}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {item.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[0.74rem] leading-5 text-white/78">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary-light)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={item.buttonLink} className={cn("mt-5 grid h-10 place-items-center rounded-[8px] border text-[0.82rem] font-black transition", item.isPopular ? "border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]" : "border-[var(--primary)]/55 text-[var(--primary-light)] hover:bg-[var(--primary-glow)]")}>
                {item.buttonText}
              </Link>
            </motion.article>
          );
        })}
      </div>
    </SectionCard>
  );
}
