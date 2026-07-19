"use client";

import Link from "next/link";
import { Crown, Gem, Rocket, Send } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureItem } from "@/components/packages/FeatureItem";
import type { BillingCycle, MarketingPackage, PackageTheme } from "@/types/packages";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  item: MarketingPackage;
  billing: BillingCycle;
  index: number;
};

const iconMap = {
  send: Send,
  rocket: Rocket,
  crown: Crown,
  gem: Gem,
};

const themeClasses: Record<PackageTheme, { icon: string; halo: string; button: string; border: string; text: string }> = {
  teal: {
    icon: "border-[#0DE2BC]/30 bg-[#0DE2BC]/15 text-[#15E7C4] shadow-[0_0_30px_rgba(13,226,188,0.24)]",
    halo: "from-[#0DE2BC]/16",
    button: "border-[#B9FF00]/70 text-[#D9FF6A] hover:bg-[#B9FF00] hover:text-[#071005]",
    border: "border-white/10",
    text: "text-[#B9FF00]",
  },
  blue: {
    icon: "border-[#178DF3]/35 bg-[#178DF3]/18 text-[#24A8FF] shadow-[0_0_30px_rgba(23,141,243,0.26)]",
    halo: "from-[#B9FF00]/18",
    button: "bg-[#B9FF00] text-[#071005] shadow-[0_0_34px_rgba(185,255,0,0.36)] hover:scale-[1.02] hover:bg-[#D2FF37]",
    border: "border-[#B9FF00]/75 shadow-[0_0_40px_rgba(185,255,0,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]",
    text: "text-[#B9FF00]",
  },
  purple: {
    icon: "border-[#A855F7]/35 bg-[#7E22CE]/22 text-[#C75CFF] shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    halo: "from-[#A855F7]/12",
    button: "border-[#B9FF00]/70 text-[#D9FF6A] hover:bg-[#B9FF00] hover:text-[#071005]",
    border: "border-white/10",
    text: "text-[#B9FF00]",
  },
  orange: {
    icon: "border-[#F97316]/35 bg-[#F97316]/18 text-[#FF8737] shadow-[0_0_30px_rgba(249,115,22,0.24)]",
    halo: "from-[#F97316]/12",
    button: "border-[#F97316]/75 text-[#FF9A4A] hover:bg-[#F97316] hover:text-[#071005]",
    border: "border-white/10",
    text: "text-[#B9FF00]",
  },
};

function formatPrice(item: MarketingPackage, billing: BillingCycle) {
  const amount = billing === "monthly" ? item.priceMonthly : item.priceYearly;

  if (amount === null) {
    return "Custom";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: item.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingCard({ item, billing, index }: PricingCardProps) {
  const Icon = iconMap[item.icon];
  const theme = themeClasses[item.themeColor];
  const price = formatPrice(item, billing);
  const billingLabel = item.priceMonthly === null ? "" : billing === "monthly" ? "/month" : "/year";

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 + index * 0.08, duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -8, scale: item.isPopular ? 1.025 : 1.015 }}
      className={cn(
        "relative flex min-h-[500px] flex-col overflow-hidden rounded-[12px] border bg-[#07101B]/78 p-5 shadow-[0_20px_56px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        theme.border,
        item.isPopular && "lg:-mt-0 lg:scale-[1.01]",
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-radial-[circle_at_22%_8%] to-transparent opacity-80", theme.halo)} />
      {item.isPopular && item.badge && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-[4px] bg-[#B9FF00] px-4 py-1 text-[0.66rem] font-extrabold uppercase text-[#071005] shadow-[0_8px_22px_rgba(185,255,0,0.22)]">
          {item.badge}
        </div>
      )}

      <div className="relative z-10 flex items-start gap-4 pt-5">
        <div className={cn("grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border", theme.icon)}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[1.35rem] font-extrabold leading-tight text-white">{item.name}</h2>
          <p className="mt-1 max-w-[170px] text-[0.86rem] leading-[1.35] text-white/82">{item.description}</p>
        </div>
      </div>

      <div className="relative z-10 mt-7">
        <div className="flex items-end gap-1.5">
          <motion.span
            key={`${item.id}-${billing}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-[2.05rem] font-black leading-none tracking-[-0.02em]", theme.text)}
          >
            {price}
          </motion.span>
          {billingLabel && <span className="pb-1 text-[0.88rem] text-white/75">{billingLabel}</span>}
        </div>
      </div>

      <div className="relative z-10 my-4 h-px bg-white/10" />
      <p className="relative z-10 mb-5 text-[0.92rem] leading-[1.55] text-white/80">{item.shortDescription}</p>

      <ul className="relative z-10 flex-1 space-y-2.5">
        {item.features.map((feature) => (
          <FeatureItem key={feature} label={feature} />
        ))}
      </ul>

      <Link
        href={item.buttonLink}
        className={cn(
          "relative z-10 mt-8 grid h-11 place-items-center rounded-[9px] border text-[0.9rem] font-extrabold transition duration-300",
          theme.button,
        )}
      >
        {item.buttonText}
      </Link>
    </motion.article>
  );
}
