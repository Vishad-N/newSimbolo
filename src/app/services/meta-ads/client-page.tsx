"use client";

import { useState } from "react";
import { MetaAdsHero } from "@/components/metaAds/MetaAdsHero";
import { LeadForm } from "@/components/shared/LeadForm";
import { PricingSection } from "@/components/shared/PricingSection";
import { ResultsSection } from "@/components/shared/ResultsSection";
import { ServiceList } from "@/components/shared/ServiceList";
import { StatsBar } from "@/components/shared/StatsBar";
import { TestimonialSection } from "@/components/shared/TestimonialSection";
import { FAQSection } from "@/components/shared/FAQSection";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { metaAdsBenefits, metaAdsResults, metaAdsServices, metaAdsStats } from "@/mock/metaAds";
import { metaAdsFaqs } from "@/mock/metaAdsFaq";
import { metaAdsPackages } from "@/mock/metaAdsPackages";
import { metaAdsTestimonials } from "@/mock/metaAdsTestimonials";
import type { BillingCycle } from "@/types/shared";

export function MetaAdsClientPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      <main className="relative lg:pl-[250px]">
        <Navbar />
        <div className="px-4 pb-8 pt-4 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1320px] space-y-4">
            <MetaAdsHero benefits={metaAdsBenefits} />
            <StatsBar stats={metaAdsStats} />
            <div className="grid gap-4 xl:grid-cols-[0.66fr_1.92fr_0.78fr]">
              <ServiceList services={metaAdsServices} title="What We Do" />
              <PricingSection packages={metaAdsPackages} billing={billing} onBillingChange={setBilling} title="Meta Ads Packages" />
              <div className="space-y-4">
                <LeadForm title="Get Your Free Meta Ads Audit" />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <ResultsSection results={metaAdsResults} />
              <TestimonialSection testimonials={metaAdsTestimonials} />
            </div>
            <FAQSection faqs={metaAdsFaqs} title="Meta Ads FAQs" />
          </div>
        </div>
      </main>
    </div>
  );
}
