"use client";

import { Check, Star, ArrowRight } from "lucide-react";
import type { MarketingPackage, BillingCycle } from "@/types/packages";

type CompactPackageCardProps = {
  pkg: MarketingPackage;
  billing: BillingCycle;
  onClick: (pkg: MarketingPackage) => void;
  index: number;
};

export function CompactPackageCard({ pkg, billing, onClick, index }: CompactPackageCardProps) {
  const isYearly = billing === "yearly";
  const currentPrice = isYearly ? pkg.priceYearly : pkg.priceMonthly;
  
  // Convert price to string for display, accounting for 'Custom' if null
  const displayPrice = currentPrice 
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(currentPrice) 
    : "Custom";
    
  const displayPeriod = currentPrice ? (isYearly ? "/ Year" : "/ Month") : "";

  return (
    <div
      onClick={() => onClick(pkg)}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
        pkg.featured 
          ? "border-[var(--accent)]/50 shadow-[0_0_30px_var(--accent-glow)] hover:border-[var(--accent)]" 
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* Badges */}
      <div className="mb-4 flex items-center justify-between">
        {pkg.badge ? (
          <span className="font-heading rounded-full bg-[var(--accent)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-black">
            {pkg.badge}
          </span>
        ) : (
          <span className="h-6"></span> // Placeholder to keep heights consistent
        )}
        
        {pkg.rating > 0 && (
          <div className="flex items-center gap-1 text-[0.75rem] font-bold text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" />
            {pkg.rating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="mb-6">
        <h3 className="font-heading text-[1.5rem] font-black leading-tight text-white transition-colors group-hover:text-[var(--accent)]">
          {pkg.name}
        </h3>
        <p className="mt-1.5 text-[0.8rem] text-white/50">{pkg.subtitle}</p>
      </div>

      {/* Price */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/40 mb-1">Starting from</div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-[1.8rem] font-black text-white leading-none">{displayPrice}</span>
          <span className="text-[0.8rem] font-medium text-white/50">{displayPeriod}</span>
        </div>
      </div>

      {/* Compact Highlights */}
      <div className="flex-1">
        <ul className="flex flex-col gap-3">
          {pkg.compactHighlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[0.85rem] text-white/70">
              <Check className="h-4 w-4 shrink-0 text-[var(--accent)] mt-0.5" />
              <span className="leading-snug">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* View Details Action */}
      <div className="mt-8 pt-4">
        <div className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-white/5 py-3 text-[0.85rem] font-bold text-white transition-all group-hover:bg-[var(--accent)] group-hover:text-black">
          Click to View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
      
      {/* Subtle Glow Effect on Hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[16px] border-2 border-transparent transition-colors group-hover:border-[var(--accent)]/10" />
    </div>
  );
}
