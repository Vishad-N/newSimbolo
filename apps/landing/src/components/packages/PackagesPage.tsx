"use client";

import { useMemo, useState } from "react";
import { BenefitsSection } from "@/components/packages/BenefitsSection";
import { FAQAccordion } from "@/components/packages/FAQAccordion";
import { PackageHero } from "@/components/packages/PackageHero";
import { CompactPackageCard } from "@/components/packages/CompactPackageCard";
import { ExpandedPackageModal } from "@/components/packages/ExpandedPackageModal";
import { PackageComparisonTable } from "@/components/packages/PackageComparisonTable";
import { benefits, faqs } from "@/mock/packages";
import { usePackages } from "@/hooks/usePackages";
import type { BillingCycle, MarketingPackage } from "@/types/packages";

export function PackagesPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { packages, loading } = usePackages();
  
  const [selectedPackage, setSelectedPackage] = useState<MarketingPackage | null>(null);

  const activePackages = useMemo(() => 
    packages.filter((item) => item.status === "published").sort((a, b) => a.displayOrder - b.displayOrder), 
  [packages]);

  const orderedFaqs = useMemo(() => [...faqs].sort((a, b) => a.displayOrder - b.displayOrder), []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[var(--background)]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent"></div></div>;
  }

  return (
    <div style={{ "--primary": "#B9FF00", "--primary-hover": "#D2FF37", "--primary-active": "#a3e600", "--primary-glow": "rgba(185,255,0,0.28)", "--primary-border": "rgba(185,255,0,0.45)" } as React.CSSProperties}>
      <PackageHero billing={billing} onBillingChange={setBilling} />
      
      <div className="px-5 sm:px-8 lg:px-10 pb-20">
        
        {/* Interactive Package Grid */}
        <section className="mx-auto mt-16 grid max-w-[1400px] gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activePackages.map((item, index) => (
            <CompactPackageCard 
              key={item.id} 
              pkg={item} 
              billing={billing} 
              index={index} 
              onClick={setSelectedPackage}
            />
          ))}
        </section>

        {/* Expanded Package Modal Overlay */}
        <ExpandedPackageModal 
          pkg={selectedPackage} 
          isOpen={!!selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
          defaultBilling={billing}
        />

        <div className="mx-auto max-w-[1400px]">
          <PackageComparisonTable packages={activePackages} />
          
          <div className="mt-32 max-w-[1235px] mx-auto">
            <BenefitsSection items={benefits} />
            <FAQAccordion items={orderedFaqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
