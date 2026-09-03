"use client";

import { useMemo, useState } from "react";
import { BenefitsSection } from "@/components/packages/BenefitsSection";
import { FAQAccordion } from "@/components/packages/FAQAccordion";
import { PackageHero } from "@/components/packages/PackageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ExpandedPackageModal } from "@/components/packages/ExpandedPackageModal";
import { benefits, faqs } from "@/mock/packages";
import { usePackages } from "@/hooks/usePackages";
import type { BillingCycle, MarketingPackage } from "@/types/packages";

interface PackagesPageProps {
  liveFaqs?: { id: string; question: string; answer: string }[];
}

export function PackagesPage({ liveFaqs }: PackagesPageProps) {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { packages, loading } = usePackages();

  const [selectedPackage, setSelectedPackage] = useState<MarketingPackage | null>(null);
  const [activeService, setActiveService] = useState<string>("all");

  const publishedPackages = useMemo(() =>
    packages.filter((item) => item.status === "published").sort((a, b) => a.displayOrder - b.displayOrder),
  [packages]);

  // Package `subtitle` is set from the linked service's name (see
  // mapBackendPackage), so it doubles as the service filter key here without
  // needing a separate field — only services that actually have a published
  // package show up as a filter tag.
  const serviceOptions = useMemo(
    () => Array.from(new Set(publishedPackages.map((item) => item.subtitle))).sort((a, b) => a.localeCompare(b)),
    [publishedPackages],
  );

  const activePackages = useMemo(
    () => (activeService === "all" ? publishedPackages : publishedPackages.filter((item) => item.subtitle === activeService)),
    [publishedPackages, activeService],
  );

  // The CMS-fetched FAQs are already ordered by the backend's own sortOrder,
  // so only the static mock fallback needs the client-side displayOrder sort.
  const orderedFaqs = useMemo(
    () =>
      liveFaqs && liveFaqs.length > 0
        ? liveFaqs.map((item, index) => ({ ...item, displayOrder: index }))
        : [...faqs].sort((a, b) => a.displayOrder - b.displayOrder),
    [liveFaqs],
  );

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[var(--background)]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent"></div></div>;
  }

  return (
    <div style={{ "--primary": "#B9FF00", "--primary-hover": "#D2FF37", "--primary-active": "#a3e600", "--primary-glow": "rgba(185,255,0,0.28)", "--primary-border": "rgba(185,255,0,0.45)" } as React.CSSProperties}>
      <PackageHero billing={billing} onBillingChange={setBilling} />
      
      <div className="px-5 sm:px-8 lg:px-10 pb-20">

        {/* Service Filter Tags */}
        {serviceOptions.length > 1 && (
          <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveService("all")}
              className={`font-heading rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
                activeService === "all"
                  ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              All
            </button>
            {serviceOptions.map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={`font-heading rounded-full px-4 py-1.5 text-[0.85rem] font-medium transition-colors ${
                  activeService === service
                    ? "bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Package Grid */}
        <section className="mx-auto mt-8 grid max-w-[1400px] gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activePackages.map((item, index) => {
            const price = billing === "yearly" && item.priceYearly ? Math.round(item.priceYearly / 12) : (item.priceMonthly || "Custom");
            return (
              <ServiceCard
                key={item.id}
                title={item.name}
                image={item.illustration}
                bullets={item.compactHighlights}
                price={price}
                rating={item.rating}
                accent={item.themeColor as any}
                delay={index * 0.05}
                onClick={() => setSelectedPackage(item)}
                showCta={true}
                ctaText="Explore"
              />
            );
          })}
        </section>

        {/* Expanded Package Modal Overlay */}
        <ExpandedPackageModal 
          pkg={selectedPackage} 
          isOpen={!!selectedPackage} 
          onClose={() => setSelectedPackage(null)} 
          defaultBilling={billing}
        />

        <div className="mx-auto max-w-[1400px]">
          
          <div className="mt-32 max-w-[1235px] mx-auto">
            <BenefitsSection items={benefits} />
            <FAQAccordion items={orderedFaqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
