"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BillingCycle, SeoPackage } from "@/types/seo";

type SeoPackagesProps = {
  packages: SeoPackage[];
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
};

function formatPackagePrice(item: SeoPackage, billing: BillingCycle) {
  const price = billing === "monthly" ? item.priceMonthly : item.priceYearly;

  if (price === null) {
    return "Custom";
  }

  return new Intl.NumberFormat("en-IN", { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(price);
}

export function SeoPackages({ packages, billing, onBillingChange }: SeoPackagesProps) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[1.45rem] font-black text-white">SEO Packages</h2>
        <div className="grid h-9 w-full max-w-[250px] grid-cols-2 rounded-full border border-white/10 bg-[var(--surface)]/70 p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onBillingChange(option)}
              className={cn("relative rounded-full text-[0.78rem] font-bold capitalize transition", billing === option ? "text-white" : "text-white/70 hover:text-white")}
            >
              {billing === option && <motion.span layoutId="seo-billing-pill" className="absolute inset-0 -z-10 rounded-full bg-[var(--primary)] shadow-[0_0_22px_var(--primary-glow)]" />}
              {option === "yearly" ? "Yearly (Save 20%)" : "Monthly"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((item, index) => {
          const Icon = item.icon;
          const price = formatPackagePrice(item, billing);
          const suffix = item.priceMonthly === null ? "" : billing === "monthly" ? "/month" : "/year";

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.46 }}
              whileHover={{ y: -7 }}
              className={cn(
                "relative flex min-h-[330px] flex-col rounded-[8px] border bg-[color-mix(in_srgb,var(--card)_76%,transparent)] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.24)]",
                item.isPopular ? "border-[var(--primary)] shadow-[0_0_38px_var(--primary-glow)]" : "border-white/10",
              )}
            >
              {item.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-4 py-1 text-[0.72rem] font-black text-white shadow-[0_8px_22px_var(--primary-glow)]">{item.badge}</div>}
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary-glow)] text-[var(--primary-light)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-[1.12rem] font-black leading-tight text-white">{item.name}</h3>
                  <p className="text-[0.74rem] font-semibold text-white/72">{item.audience}</p>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-1">
                <motion.span key={`${item.id}-${billing}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[1.75rem] font-black leading-none text-white">
                  {price}
                </motion.span>
                {suffix && <span className="text-[0.78rem] text-white/72">{suffix}</span>}
              </div>
              <div className="my-4 h-px bg-white/10" />
              <ul className="flex-1 space-y-2.5">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[0.8rem] leading-5 text-white/82">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-light)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={item.buttonLink} className={cn("mt-6 grid h-11 place-items-center rounded-[8px] border text-[0.86rem] font-black transition duration-300", item.isPopular ? "border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]" : "border-[var(--primary)]/60 text-[var(--primary-light)] hover:bg-[var(--primary-glow)]")}>
                {item.buttonText}
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
