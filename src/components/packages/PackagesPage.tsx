"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { BenefitsSection } from "@/components/packages/BenefitsSection";
import { FAQAccordion } from "@/components/packages/FAQAccordion";
import { PackageHero } from "@/components/packages/PackageHero";
import { PricingCard } from "@/components/packages/PricingCard";
import { benefits, faqs, packages } from "@/mock/packages";
import type { BillingCycle } from "@/types/packages";

export function PackagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const activePackages = useMemo(() => packages.filter((item) => item.isActive).sort((a, b) => a.displayOrder - b.displayOrder), []);
  const orderedFaqs = useMemo(() => [...faqs].sort((a, b) => a.displayOrder - b.displayOrder), []);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
        <PackageHero billing={billing} onBillingChange={setBilling} />
        <div className="px-5 sm:px-8 lg:px-10">
          <section className="mx-auto mt-2 grid max-w-[1235px] gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activePackages.map((item, index) => (
              <PricingCard key={item.id} item={item} billing={billing} index={index} />
            ))}
          </section>

          <div className="mx-auto max-w-[1235px]">
            <BenefitsSection items={benefits} />
            <FAQAccordion items={orderedFaqs} />
          </div>
        </div>
      </main>
    </div>
  );
}
